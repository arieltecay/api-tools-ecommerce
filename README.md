# Tools Store API

Ariel Tecay
Backend robusto construido con Node.js, Express y MongoDB, totalmente tipado en TypeScript. Maneja la lógica de negocio, autenticación, gestión de inventario, procesamiento de pagos y notificaciones.

## 🚀 Tecnologías
- **Node.js & Express**: Servidor web.
- **TypeScript**: Tipado estricto.
- **MongoDB & Mongoose**: Base de datos NoSQL.
- **JWT**: Autenticación segura.
- **Cloudinary**: Gestión de imágenes.
- **Nodemailer**: Correos transaccionales.
- **ExcelJS/CSV-Parse**: Carga masiva de productos.

## 🛠️ Variables de Entorno Necesarias (Vercel)
Crea un archivo `.env` o agrégalas en el panel de Vercel:

```env
PORT=4000
NODE_ENV=production
MONGODB_URI=tu_uri_de_mongodb_atlas
JWT_ACCESS_SECRET=una_clave_aleatoria_muy_larga
JWT_REFRESH_SECRET=otra_clave_aleatoria_muy_larga

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email (SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu_usuario
SMTP_PASS=tu_password

# Frontend URLs (CORS)
ADMIN_URL=https://tu-admin.vercel.app
SHOP_URL=https://tu-shop.vercel.app
```

## 📦 Instalación y Desarrollo
1. `npm install`
2. `npm run dev`
