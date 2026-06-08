# Administrador de Pacientes Veterinarios - Backend

🌐 Aplicación Web: https://mern-administrador-veterinaria.netlify.app

💻 Repositorio Frontend: https://github.com/Star-Lord7/apv_frontend_deploy

## Descripción

API REST desarrollada con Node.js, Express y MongoDB para la gestión de pacientes veterinarios. Permite el registro y autenticación de veterinarios, recuperación y cambio de contraseña, así como la administración completa de pacientes asociados a cada usuario.

## Características

- Registro de veterinarios.
- Inicio de sesión mediante autenticación JWT.
- Confirmación de cuenta por correo electrónico.
- Recuperación y restablecimiento de contraseña.
- Actualización de perfil.
- Gestión de pacientes veterinarios.
- Operaciones CRUD para pacientes.
- Protección de rutas mediante middleware de autenticación.
- Arquitectura modular y escalable.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Nodemailer
- dotenv
- bcrypt

## Arquitectura del Proyecto

El proyecto está organizado siguiendo una arquitectura por responsabilidades:

```text
src/
│
├── config/
├── controllers/
├── helpers/
├── middleware/
├── models/
├── routes/
└── index.js
```

### Descripción de Carpetas

- **config/**: Configuración de conexión a MongoDB y variables globales.
- **controllers/**: Lógica de negocio de cada endpoint.
- **helpers/**: Funciones auxiliares reutilizables.
- **middleware/**: Validación de autenticación y autorización.
- **models/**: Modelos de MongoDB utilizando Mongoose.
- **routes/**: Definición de rutas de la API.

## Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```env
MONGO_URI=tu_cadena_de_conexion

JWT_SECRET=tu_clave_secreta

FRONTEND_URL=http://localhost:5173

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

## Instalación

```bash
git clone https://github.com/Star-Lord7/apv_backend_deploy

npm install

npm run dev
```

## Endpoints Principales

### Autenticación

- POST /api/veterinarios
- POST /api/veterinarios/login
- GET /api/veterinarios/confirmar/:token
- POST /api/veterinarios/olvide-password
- GET /api/veterinarios/olvide-password/:token
- POST /api/veterinarios/olvide-password/:token

### Pacientes

- GET /api/pacientes
- POST /api/pacientes
- GET /api/pacientes/:id
- PUT /api/pacientes/:id
- DELETE /api/pacientes/:id

## Seguridad

- Contraseñas almacenadas utilizando hash con bcrypt.
- Autenticación basada en JWT.
- Protección de rutas privadas mediante middleware.
- Configuración CORS para controlar el acceso desde el frontend.

## Autor

Desarrollado como proyecto Full Stack para la gestión de pacientes veterinarios.
