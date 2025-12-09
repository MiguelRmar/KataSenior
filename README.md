# KATA Senior - Solución de Verificación de Identidad

Este repositorio contiene una solución completa (Full Stack) para un proceso de verificación de identidad, integrando detección de prueba de vida (Liveness) y validación de documentos de identidad, orquestado bajo una arquitectura limpia y monitoreado con Elastic Stack.

## 🚀 Tecnologías

### Backend (`/back-end`)
*   **Framework**: [NestJS](https://nestjs.com/)
*   **Lenguaje**: TypeScript
*   **Arquitectura**: Hexagonal (Dominio, Aplicación, Infraestructura)
*   **Documentación API**: Swagger
*   **Integraciones**:
    *   AWS Rekognition (Liveness, Comparación de Rostros, OCR)
    *   Elastic APM (Trazabilidad)

### Frontend (`/front-end `)
*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Lenguaje**: TypeScript
*   **UI/UX**: CSS Modules, Diseño Responsivo
*   **Integraciones**:
    *   AWS Amplify UI (Liveness Detector)
    *   Elastic APM RUM (Monitoreo de Usuario Real)

### Infraestructura (Docker)
*   **Elasticsearch**: Base de datos de logs y trazas.
*   **Kibana**: Visualización y dashboards.
*   **APM Server**: Servidor para recibir trazas de backend y frontend.
*   **Docker Compose**: Orquestación de servicios.

## ✨ Funcionalidades

1.  **Detección de Prueba de Vida (Liveness)**: Verifica que el usuario sea una persona real mediante un video corto (integración nativa con AWS).
2.  **Captura de Documentos**: Interfaz para capturar anverso y reverso del documento de identidad.
3.  **Validación de Identidad**: Compara la foto del documento con la prueba de vida (Face Match).
4.  **Extracción de Datos (OCR)**: Extrae texto del documento para validación.
5.  **Trazabilidad End-to-End**: Monitoreo completo desde el clic en el frontend hasta el servicio en el backend usando Elastic APM.

## 🛠️ Prerrequisitos

*   [Docker](https://www.docker.com/) y Docker Compose.
*   [Node.js](https://nodejs.org/) v18+ (para desarrollo local).
*   Cuenta de AWS configurada (Credenciales en `.env` del backend).

## ⚙️ Instalación y Ejecución

Existen dos formas de ejecutar el proyecto:

### Opción 1: Full Docker (Recomendada para Demo/Pruebas)

Ejecuta todo el sistema (Backend, Frontend, Elastic Stack) en contenedores.

```bash
# En la raíz del proyecto
docker-compose up -d --build
```

*   **Frontend**: [http://localhost:5173](http://localhost:5173)
*   **Backend**: [http://localhost:3000](http://localhost:3000)
*   **Kibana**: [http://localhost:5601](http://localhost:5601)
*   **Swagger API Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Opción 2: Desarrollo Local (Híbrido)

Ejecuta Elastic Stack en Docker para soporte, y las aplicaciones localmente para desarrollo.

1.  **Iniciar Infraestructura**:
    ```bash
    # Inicia solo Elasticsearch, Kibana y APM
    docker-compose up -d elasticsearch kibana apm-server
    ```

2.  **Iniciar Backend**:
    ```bash
    cd back-end
    npm install
    npm run start:dev
    ```

3.  **Iniciar Frontend**:
    ```bash
    # Nota el espacio al final del nombre de la carpeta (si aplica)
    cd "front-end "
    npm install
    npm run dev
    ```

## 🔍 Trazabilidad (Observability)

Para ver las trazas de ejecución y el rendimiento:

1.  Accede a **Kibana**: [http://localhost:5601](http://localhost:5601)
2.  Ve al menú ☰ -> **Observability** -> **APM**.
3.  Selecciona un servicio:
    *   `kata-senior-frontend`
    *   `kata-senior-backend`
4.  Explora el mapa de servicios, transacciones y errores.

## 📝 Documentación API

La API REST está documentada con Swagger.
*   **URL Local**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
