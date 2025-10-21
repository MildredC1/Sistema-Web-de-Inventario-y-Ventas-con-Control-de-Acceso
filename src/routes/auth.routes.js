import {Router} from 'express';

import * as auth from "../controllers/auth.controller.js"

import { redirectAuth } from '../middlewares/auth.js';

const router = Router()

// Rutas relacionadas con 'Login'
router.get('/login', redirectAuth, auth.mostrarLogin)
router.post('/login', auth.login)
router.get("/logout", auth.logout)

export default router
