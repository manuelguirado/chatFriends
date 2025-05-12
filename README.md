# Proyecto ChatFriends

```markdown
# Estructura del Proyecto

Este proyecto está dividido en dos partes principales: **backend** y **frontend**. A continuación, se detalla la estructura de cada uno:

## Backend

```plaintext
backend/
├── src/
│   ├── app.ts                # Main application configuration
│   ├── server.ts             # Server entry point
│   ├── database/             # Database connection and configuration
│   │   └── connection.ts
│   ├── sockets/              # Socket.IO logic for real-time communication
│   │   └── index.ts
│   ├── routes/               # API route definitions
│   │   ├── index.ts          # Main file to combine routes
│   │   └── user.routes.ts    # User-specific routes
│   ├── controllers/          # Route logic handlers
│   │   ├── user.controller.ts
│   │   └── message.controller.ts
│   ├── middlewares/          # Custom middlewares
│   │   └── auth.middleware.ts
│   ├── models/               # Data models (Mongoose/Sequelize)
│   │   └── user.model.ts
│   ├── utils/                # Helper functions and utilities
│   │   └── logger.ts
│   └── config/               # Application configuration
│       ├── env.ts            # Environment variables
│       └── socket.config.ts  # Socket.IO configuration
├── tests/                    # Unit and integration tests
│   ├── app.test.ts
│   └── user.test.ts
├── package.json              # Backend dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Backend documentation
```

```markdown
### Scripts de Inicialización

Para facilitar el desarrollo y la ejecución del proyecto, se han añadido scripts en los archivos `package.json` tanto del backend como del frontend. A continuación, se describen los scripts más relevantes:

#### Backend

```json
"scripts": {
    "start": "node dist/server.js",          // Inicia el servidor en producción
    "dev": "ts-node-dev src/server.ts",     // Inicia el servidor en modo desarrollo
    "build": "tsc",                         // Compila el código TypeScript a JavaScript
    "test": "jest"                          // Ejecuta las pruebas unitarias
}
```

#### Frontend

```json
"scripts": {
    "start": "live-server",                 // Inicia un servidor local para desarrollo
    "build": "webpack --mode production",   // Genera una versión optimizada del frontend
    "lint": "eslint . --ext .js,.ts"        // Analiza el código en busca de errores
}
```

### Configuración de Entorno

El proyecto utiliza variables de entorno para configurar aspectos clave como la conexión a la base de datos y las claves de API. Asegúrate de crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```plaintext
# Variables de entorno para el backend
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database

# Variables de entorno para el frontend
API_URL=http://localhost:3000/api
```

Recuerda no incluir el archivo `.env` en el control de versiones. Añade una entrada en el archivo `.gitignore` para evitar que se suba al repositorio.

### Pruebas

El proyecto incluye pruebas unitarias y de integración para garantizar la calidad del código. Las pruebas se encuentran en la carpeta `tests` del backend y se ejecutan con el comando:

```bash
npm run test
```

Asegúrate de que las pruebas pasen antes de realizar un despliegue en producción.

### Despliegue

Para desplegar el proyecto en un entorno de producción, sigue estos pasos:

1. Compila el código del backend y del frontend:

     ```bash
     cd backend && npm run build
     cd ../frontend && npm run build
     ```

2. Configura un servidor web (por ejemplo, Nginx o Apache) para servir los archivos del frontend y redirigir las solicitudes API al backend.

3. Asegúrate de configurar correctamente las variables de entorno en el servidor de producción.

4. Inicia el servidor del backend:

     ```bash
     npm start
     ```

Con estos pasos, el proyecto estará listo para ser utilizado en un entorno de producción.

```
## Frontend

```plaintext
frontend/
├── app/                      # Next.js app directory
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Home page
│   ├── api/                  # API routes
│   ├── chat/                 # Chat feature pages
│   ├── login/                # Login page
│   └── register/             # Registration page
├── components/               # Reusable UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility libraries
├── public/                   # Static assets
├── styles/                   # Additional styles
├── components.json           # Component configuration
├── next.config.mjs           # Next.js configuration
├── package.json              # Frontend dependencies
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

