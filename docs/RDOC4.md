# Pipeline CI/CD para Despliegue de Frontend a S3 + CloudFront

Este archivo documenta el pipeline CI/CD configurado para desplegar el frontend de la aplicación a AWS S3 y CloudFront, utilizando GitHub Actions.

---

## ¿Qué hace este pipeline?

* Compila el proyecto React.
* Sincroniza los archivos generados con un bucket S3.
* Invalida la caché de CloudFront para reflejar los cambios más recientes.

---

## ¿Cuándo se ejecuta?

El pipeline se ejecuta automáticamente cada vez que se hace un `push` a la rama `main`:

```yaml
on:
  push:
    branches:
      - main
```

---

## Pasos del Pipeline

### Checkout del Repositorio

Obtiene el código fuente del repositorio:

```yaml
- name: Checkout repo
  uses: actions/checkout@v3
```

---

### Configuración de Node.js

Instala Node.js versión 18 para construir el proyecto:

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v3
  with:
    node-version: 18
```

---

### Instalación de Dependencias

Instala las dependencias necesarias del proyecto:

```yaml
- name: Install dependencies
  run: npm install
```

---

### Build del Proyecto

Compila el proyecto React, utilizando variables de entorno necesarias:

```yaml
- name: Build project
  run: npm run build
  env:
    REACT_APP_BACKEND_URL: ${{ secrets.REACT_APP_BACKEND_URL }}
    REACT_APP_AUTH0_DOMAIN: ${{ secrets.REACT_APP_AUTH0_DOMAIN }}
    REACT_APP_AUTH0_CLIENT_ID: ${{ secrets.REACT_APP_AUTH0_CLIENT_ID }}
    REACT_APP_AUTH0_AUDIENCE: ${{ secrets.REACT_APP_AUTH0_AUDIENCE }}
```

---

### Sincronización con S3

Sube los archivos de la carpeta `build/` al bucket de S3:

```yaml
- name: Sync build to S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --delete
  env:
    AWS_S3_BUCKET: ${{ secrets.AWS_BUCKET_NAME }}
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_REGION: "us-east-2"
    SOURCE_DIR: "build"
```

---

### Invalidar la Caché de CloudFront

Ejecuta una invalidación para limpiar la caché de CloudFront:

```yaml
- name: Invalidate CloudFront cache
  run: |
    aws cloudfront create-invalidation \
      --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
      --paths "/*"
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_REGION: "us-east-2"
```

---

## Seguridad

Las credenciales y configuraciones sensibles se almacenan como **GitHub Secrets** para proteger la información confidencial:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_BUCKET_NAME`
* `CLOUDFRONT_DISTRIBUTION_ID`
* `REACT_APP_BACKEND_URL`
* `REACT_APP_AUTH0_DOMAIN`
* `REACT_APP_AUTH0_CLIENT_ID`
* `REACT_APP_AUTH0_AUDIENCE`

---
