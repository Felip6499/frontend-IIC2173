# Integración de WebpayPlus con Transbank SDK, Koa, Sequelize y MQTT

Esta guía documenta la integración de **WebpayPlus** (Transbank) frontend.

---

## Instalación

### Backend

Instala las dependencias necesarias:

```bash
npm install transbank-sdk
```

---

## Backend: Flujo de Pago

### Configuración de WebpayPlus

```javascript
const { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk");

const tx = new WebpayPlus.Transaction(new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  Environment.Integration
));
```

### Crear una Transacción (`/webpay/pay`)

1. **Autenticación JWT**: Se requiere token Auth0.

2. **Validar usuario y stock**:

   * Consulta si el usuario existe.
   * Verifica disponibilidad de stock.

3. **Generar transacción**:

   * `request_id`: UUID.
   * `buyOrder`: `orden_compra_{timestamp}`.
   * `sessionId`: `request_id`.
   * `amount`: Precio \* cantidad.
   * `returnUrl`: `${FRONTEND_URL}/payment/confirm`.

4. **Crear transacción en Webpay**:

```javascript
const webpayResponse = await tx.create(buyOrder, sessionId, amount, returnUrl);
```

5. **Publicar en MQTT**:

```javascript
publishWithFibonacciRetry(MQTT_REQUESTS_TOPIC, JSON.stringify(payload), 1);
```

6. **Responder al frontend**:

```json
{
  "token": "TOKEN_WEBPAY",
  "url": "https://webpay3g.transbank.cl/webpayserver/initTransaction"
}
```

---

### Confirmar una Transacción (`/webpay/confirm`)

1. Recibir `token_ws` del frontend.
2. Confirmar transacción con Webpay:

```javascript
const commitResponse = await tx.commit(token_ws);
```

3. Procesar respuesta:

   * Si `status` es `AUTHORIZED` y `response_code` es `0`: actualizar stock, marcar compra como `ACCEPTED`, publicar en MQTT.
   * Si `FAILED`: marcar compra como `REJECTED`.
   * Otro: marcar compra como `CANCELLED`.

4. Publicar estado en `MQTT_VALIDATION`.

5. Responder al frontend con el estado final.

---

## Frontend: Flujo de Pago

### Iniciar Pago (`/webpay/pay`)

1. Llamar a la API para iniciar la compra:

```javascript
const response = await initiatePayment(symbol, quantity, token);
```

2. Crear formulario oculto para redireccionar a Webpay:

```javascript
const form = document.createElement("form");
form.method = "POST";
form.action = response.url;
form.innerHTML = `<input type="hidden" name="token_ws" value="${response.token}" />`;
document.body.appendChild(form);
form.submit();
```

---

### Confirmar Pago (`/payment/confirm`)

1. Webpay redirige al frontend con `token_ws`.
2. El frontend confirma el pago:

```javascript
const result = await confirmPayment(token_ws, token);
```

3. Mostrar resultado (éxito, rechazo, anulación) y redirigir a `/wallet`.

---
