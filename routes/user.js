import { Router } from 'express';
import {check} from 'express-validator';

import { userDelete, userGet, userPatch, userPost, userPut } from '../controllers/user.js';

import { existsEmail, existsUserById, isValidRole } from '../helpers/db-validators.js';

import { validarErrores } from '../middlewares/validarErrores.js';
import { validarJWT } from '../middlewares/validarJwt.js';
import { hasRole, isAdminRole } from '../middlewares/validarRoles.js';

const router = Router();

router.get('/', userGet); // Se pasa la función userGet por referencia que recibe la req y resp, no se ejecuta aqui userGet()

router.put('/:id', [
    check('id','No es un mongo ID válido').isMongoId(),
    check('id').custom(existsUserById),
    check('role').custom(isValidRole),
    validarErrores
] ,userPut);

// Cuando se especifica un param entre la ruta y el controller es un middleware
// El check registra los errores pero nos los lanza, los capturamos dentro del controller
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mínimo de 6 letras ').isLength({min: 6}),
    check('email', 'No es un correo válido').isEmail(),
    check('email').custom(existsEmail),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    // middleware custom para un campo
    check('role').custom(isValidRole),//el parametro se pasa de forma implicita pero tambien podriamos poner (role)=> isValidRole(role)
    validarErrores // middleware custom global
], userPost);

router.patch('/', userPatch);

router.delete('/:id',
    validarJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id','No es un mongo ID válido').isMongoId(),
    check('id').custom(existsUserById),
    validarErrores
, userDelete);


export default router;