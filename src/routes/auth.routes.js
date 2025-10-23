import {Router} from 'express';

import * as auth from "../controllers/auth.controller.js"
import { redireccionAuth } from '../middlewares/auth.js';

const router = Router()

// Rutas relacionadas con 'Login'
router.get('/login', redireccionAuth, auth.mostrarLogin)
router.post('/login', auth.login)

// Rutas relacionadas con 'Cierre de sesión'
router.get("/logout", auth.logout)

export default router
