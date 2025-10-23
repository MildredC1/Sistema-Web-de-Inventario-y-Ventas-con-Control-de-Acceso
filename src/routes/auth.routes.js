import {Router} from 'express';
import { upload,registroUsuario } from '../controllers/registro.controller.js';


import * as auth from "../controllers/auth.controller.js"
import productosController from "../controllers/productos.controller.js"
import ventasController from '../controllers/ventas.controller.js';

import { requiereAuth, redireccionAuth } from '../middlewares/auth.js';

const router = Router()

// Rutas relacionadas con 'Login'
router.get('/login', redireccionAuth, auth.mostrarLogin)
router.post('/login', auth.login)

// Rutas relacionadas con 'Cierre de sesión'
router.get("/logout", auth.logout)

// Rutas relacionadas con 'Productos'
router.get("/productos", requiereAuth, productosController.listar) // Mostrar formulario y listado Productos
router.post("/productos", requiereAuth, productosController.procesar) // Procesar registro Productos

// Rutas relacionadas con 'Ventas'
router.get("/ventas", requiereAuth, ventasController.mostrar)   // Mostrar formulario y listado Ventas
router.post("/ventas", requiereAuth, ventasController.registrar) // Procesar registro Ventas

router.get('/registro', redireccionAuth,auth.mostrarRegistro); // Mostrar formulario de registro
router.post('/registro', upload.single('foto'),registroUsuario); // Procesar registro con imagen

export default router
