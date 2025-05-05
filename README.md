estructura :
chatFriends
├── backend
│   ├── src
│   │   ├── app.ts                # Configuración principal de la aplicación
│   │   ├── server.ts             # Punto de entrada del servidor
│   │   ├── database              # Conexión y configuración de la base de datos
│   │   │   └── connection.ts
│   │   ├── sockets               # Lógica de WebSocket con Socket.IO
│   │   │   └── index.ts
│   │   ├── routes                # Definición de rutas
│   │   │   ├── index.ts          # Archivo principal para combinar rutas
│   │   │   └── user.routes.ts    # Ejemplo de rutas para usuarios
│   │   ├── controllers           # Controladores para manejar la lógica de las rutas
│   │   │   ├── user.controller.ts
│   │   │   └── message.controller.ts
│   │   ├── middlewares           # Middlewares personalizados
│   │   │   └── auth.middleware.ts
│   │   ├── models                # Modelos de datos (si usas ORM como Sequelize o Mongoose)
│   │   │   └── user.model.ts
│   │   ├── utils                 # Utilidades y funciones auxiliares
│   │   │   └── logger.ts
│   │   └── config                # Configuración de la aplicación
│   │       ├── env.ts            # Variables de entorno
│   │       └── socket.config.ts  # Configuración específica de Socket.IO
│   ├── tests                     # Pruebas unitarias y de integración
│   │   ├── app.test.ts
│   │   └── user.test.ts
│   ├── package.json              # Dependencias del backend
│   ├── tsconfig.json             # Configuración de TypeScript
│   └── README.md                 # Documentación del backend
├── frontend
│   ├── index.html                # Página principal del frontend
│   ├── styles                    # Archivos CSS
│   │   └── style.css
│   ├── scripts                   # Archivos JavaScript
│   │   ├── app.js                # Lógica principal del frontend
│   │   └── socket.js             # Configuración de Socket.IO en el cliente
│   ├── assets                    # Recursos estáticos
│   │   ├── images                # Carpeta para imágenes
│   │   │   ├── logo.png
│   │   │   └── example.jpg
│   │   └── fonts                 # (Opcional) Fuentes personalizadas
│   └── README.md                 # Documentación del frontend
├── README.md                     # Documentación general del proyecto