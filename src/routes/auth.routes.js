import {Router} from 'express'
import { upload,registroUsuario } from '../controllers/auth.controller.js'


import * as auth from "../controllers/auth.controller.js"
import usuariosController from '../controllers/usuarios.controller.js'
import { requiereAuth, redireccionAuth } from '../middlewares/auth.js'

const router = Router()

// Rutas relacionadas con 'Login'
router.get('/login', redireccionAuth, auth.mostrarLogin)
router.post('/login', auth.login)

// Rutas relacionadas con 'Cierre de sesión'
router.get("/logout", auth.logout)

// Rutas relacionadas con 'Registro'
router.get('/registro', redireccionAuth,auth.mostrarRegistro) // Mostrar formulario de registro
router.post('/registro', auth.upload.single('foto'),auth.registroUsuario) // Procesar registro con imagen

// Rutas relacionadas con 'usuarios'
router.get("/usuarios", requiereAuth, usuariosController.listar) // GET para mostrar usuarios al admin
router.post("/usuarios", requiereAuth, usuariosController.procesar) // Post para procesar cambios en usuarios

export default router
