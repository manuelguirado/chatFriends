# 🚀 ChatFriends

Una aplicación de chat en tiempo real moderna y elegante construida con **Next.js 15**, **TypeScript** y **MongoDB**.

## ✨ Características

- 🔐 **Autenticación segura** con Google OAuth (NextAuth.js)
- 👥 **Sistema completo de amigos** - Añadir y gestionar contactos
- 💬 **Chat dinámico** - Conversaciones individualizadas por contacto
- 🟢 **Estados online** - Ver quién está conectado
- 🎨 **UI moderna** - Diseño responsive con Tailwind CSS + shadcn/ui
- ⚡ **Rutas dinámicas** - `/chat/[email]` para navegación fluida
- 📱 **Responsive design** - Optimizado para móvil y desktop

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Autenticación**: NextAuth.js
- **Despliegue**: Vercel

### Backend & Base de Datos
- **Base de datos**: MongoDB Atlas
- **ODM**: Mongoose
- **APIs**: Next.js API Routes
- **Real-time**: Socket.io (V3.0 - Coming soon)

## 🚀 Demo en Vivo

**🔗 [https://chat-friends-alpha.vercel.app](https://chat-friends-alpha.vercel.app)**

## 📁 Estructura del Proyecto

```plaintext
chatFriends/
├── frontend/                 # Aplicación Next.js
│   ├── app/                  # App Router (Next.js 13+)
│   │   ├── api/              # API Routes
│   │   │   ├── addFriends/   # Gestión de amigos
│   │   │   ├── auth/         # NextAuth configuration
│   │   │   ├── dashboard/    # Dashboard data
│   │   │   ├── login/        # Login endpoint
│   │   │   ├── register/     # Registration endpoint
│   │   │   └── user/         # User management
│   │   ├── chat/[email]/     # Rutas dinámicas de chat
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── login/            # Página de login
│   │   └── register/         # Página de registro
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/               # Componentes de shadcn/ui
│   │   └── theme-provider.tsx
│   ├── lib/                  # Utilidades y configuración
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── db/               # Database models y servicios
│   │   │   ├── models/       # Mongoose models
│   │   │   ├── services/     # Database services
│   │   │   └── factory/      # User factory patterns
│   │   └── utils/            # Helper functions
│   ├── hooks/                # Custom React hooks
│   └── public/               # Archivos estáticos
├── backend/                  # Backend Node.js (V3.0)
│   ├── index.ts              # Socket.io server
│   ├── models/               # Mongoose models
│   └── utils/                # Backend utilities
└── README.md
```

## 🔧 Configuración Local

### Prerequisitos

- Node.js 18+
- npm o pnpm
- Cuenta de MongoDB Atlas
- Cuenta de Google Cloud (para OAuth)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/chatFriends.git
cd chatFriends
```

### 2. Instalar dependencias

```bash
cd frontend
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la carpeta `frontend/`:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🗃️ Base de Datos

### Modelos principales

- **BaseUser**: Usuario base con discriminator pattern
- **OAuthUser**: Usuario con autenticación OAuth  
- **Campos principales**: `username`, `email`, `friends[]`, `isOnline`

### Relaciones

- **Amigos**: Relación bidireccional entre usuarios
- **Mensajes**: Preparado para V3.0 con Socket.io

### Estructura de datos

```typescript
interface IBaseUser {
  username: string;
  email: string;
  password?: string;
  friends: ObjectId[];
  isOnline: boolean;
  timestamps: true;
}

interface IOAuthUser extends IBaseUser {
  oauthId: string;
  oauthProvider: string;
  profilePicture?: string;
}
```

## 🎮 Uso de la Aplicación

### 1. **Registro/Login**
- Accede con tu cuenta de Google
- El sistema creará automáticamente tu perfil

### 2. **Dashboard**
- Ve todos tus amigos conectados
- Navega a chats individuales
- Estados online en tiempo real

### 3. **Añadir Amigos**
- Busca por email
- Sistema bidireccional automático
- Confirmación instantánea

### 4. **Chat Individual**
- Navegación por URL dinámica: `/chat/email@example.com`
- UI responsive y moderna
- Preparado para mensajería en tiempo real (V3.0)

## 🔄 Roadmap

### ✅ V1.0 - Autenticación
- [x] Sistema de login/registro
- [x] OAuth con Google
- [x] Gestión de sesiones

### ✅ V2.0 - Sistema de Amigos (Actual)
- [x] Dashboard funcional
- [x] Añadir/gestionar amigos
- [x] Rutas dinámicas de chat
- [x] Estados online
- [x] UI moderna con Tailwind

### 🚧 V3.0 - Mensajería en Tiempo Real
- [ ] Socket.io integración
- [ ] Mensajes persistentes
- [ ] Notificaciones push
- [ ] Indicadores de lectura

### 🔮 V4.0 - Características Avanzadas
- [ ] Archivos y multimedia
- [ ] Grupos de chat
- [ ] Búsqueda de mensajes
- [ ] Temas personalizables

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Manuel Dev** - [LinkedIn](https://linkedin.com/in/tu-perfil) - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el increíble framework
- [Tailwind CSS](https://tailwindcss.com/) por los estilos utility-first
- [shadcn/ui](https://ui.shadcn.com/) por los componentes hermosos
- [NextAuth.js](https://next-auth.js.org/) por la autenticación segura
- [MongoDB](https://www.mongodb.com/) por la base de datos flexible
- [Vercel](https://vercel.com/) por el hosting y deployment

---

⭐ **¡Dale una estrella al proyecto si te ha gustado!**
