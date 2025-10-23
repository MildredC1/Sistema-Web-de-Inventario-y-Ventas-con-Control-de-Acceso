import {Router} from 'express';
import { upload,registroUsuario } from '../controllers/registro.controller.js';


import * as auth from "../controllers/auth.controller.js"
import { redireccionAuth } from '../middlewares/auth.js';

const router = Router()

// Rutas relacionadas con 'Login'
router.get('/login', redireccionAuth, auth.mostrarLogin)
router.post('/login', auth.login)

// Rutas relacionadas con 'Cierre de sesión'
router.get("/logout", auth.logout)

router.get('/registro', redireccionAuth,auth.mostrarRegistro); // Mostrar formulario de registro
router.post('/registro', upload.single('foto'),registroUsuario); // Procesar registro con imagen

export default router
