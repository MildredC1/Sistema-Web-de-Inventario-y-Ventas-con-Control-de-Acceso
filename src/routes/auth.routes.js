import {Router} from 'express';

import * as auth from "../controllers/auth.controller.js"

import { redirectAuth } from '../middlewares/auth.js';

const router = Router()

// Rutas relacionadas con 'Login'
router.get('/login', redirectAuth, auth.showLogin)
router.post('/login', auth.login)

export default router
