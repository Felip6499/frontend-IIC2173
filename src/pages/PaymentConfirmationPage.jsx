import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmPayment } from "../utils/api";
import { useAuth0 } from "@auth0/auth0-react";

function PaymentConfirmationPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Procesando tu pago, por favor espera..."
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const processPaymentConfirmation = async () => {
      const query = new URLSearchParams(location.search);
      const tokenWs = query.get("token_ws");
      const tbkToken = query.get("TBK_TOKEN");

      if (tokenWs) {
        if (isAuthenticated) {
          try {
            const apiToken = await getAccessTokenSilently();
            const result = await confirmPayment(tokenWs, apiToken);

            if (result.success) {
              setStatus("success");
              setMessage(
                "✅ ¡Pago confirmado! Tu compra ha sido procesada correctamente."
              );
            } else {
              setStatus("error");
              setMessage(
                `El pago falló: ${result.message || "Error desconocido"}`
              );
            }
          } catch (error) {
            setStatus("error");
            setMessage(
              "Hubo un error al confirmar tu pago con nuestro servidor."
            );
            console.error("Error en confirmPayment:", error);
          } finally {
            setTimeout(() => navigate("/wallet"), 4000);
          }
        }
      } else if (tbkToken) {
        setStatus("warning");
        setMessage(
          "Has cancelado la transacción. Si necesitas ayuda, contáctanos."
        );
        setTimeout(() => navigate("/wallet"), 60000);
      } else {
        setStatus("error");
        setMessage("Ocurrió un error al procesar tu pago o la sesión expiró.");
        setTimeout(() => navigate("/wallet"), 60000);
      }
    };

    if (!isLoading) {
      processPaymentConfirmation();
    }
  }, [
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    navigate,
    location.search,
  ]);

  // Estilos por estado
  const getStatusStyles = () => {
    switch (status) {
      case "loading":
        return { color: "var(--text-muted)" };
      case "success":
        return { color: "var(--accent-yellow)" };
      case "error":
        return { color: "salmon" };
      case "warning":
        return { color: "orange" };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "var(--border)",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <h1 style={{ marginBottom: "1rem", fontSize: "2rem" }}>
        Confirmación de Pago
      </h1>

      {status === "loading" && (
        <div style={{ margin: "2rem 0" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid var(--accent-yellow)",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      )}

      <p style={{ fontSize: "1.2rem", ...getStatusStyles() }}>{message}</p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default PaymentConfirmationPage;
