import { Router } from 'express';
import { check } from 'express-validator';
import { googleSignIn, login, refreshToken } from '../controllers/auth.js';
import { validarErrores } from '../middlewares/validarErrores.js';
import { validarJWT } from '../middlewares/validarJwt.js';

const router = Router();

router.post('/login',[
    check('email', 'No es un correo válido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(), //no especificamos que sea minimo 6letras para no dar pistas
    validarErrores
] , login);

router.post('/google',[
    check('id_token', 'ID token es necesario').not().isEmpty(),
    validarErrores
] , googleSignIn);

router.get('/', validarJWT, refreshToken );

export default router;