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



app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
