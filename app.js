import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT 
const HOST = process.env.HOST 

app.use((req, res, next) => {
    console.log(`Logger - Solicitud recibida: ${req.method} ${req.url}`)
    next()
})

// importaciones para vistas
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// importacion cookieParser
import cookieParser from 'cookie-parser';

// importaciones para rutas
import authRoutes from './src/routes/auth.routes.js'
import productosRoutes from './src/routes/productos.routes.js'
import ventasRoutes from './src/routes/ventas.routes.js'

// motor de vistas
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// middleware cookieParser
app.use(cookieParser(process.env.APP_SECRET))

// rutas 
app.use(authRoutes);
app.use(productosRoutes);
app.use(ventasRoutes);

// Mensaje Error 404 
app.use((req, res) => {
  res.status(404).render('mensaje', { 
    titulo: '404 - No encontrado', 
    mensaje: `La ruta ${req.originalUrl} no existe.`,
    redireccionar: false,
    linkMensaje: "",
    link: ""  
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
