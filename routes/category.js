import { Router } from 'express';
import {check} from 'express-validator';
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from '../controllers/category.js';
import { existsCategoryById } from '../helpers/db-validators.js';

import { isAdminRole } from '../middlewares/validarRoles.js';

import { validarErrores } from '../middlewares/validarErrores.js';
import { validarJWT } from '../middlewares/validarJwt.js';

const router = Router();

// obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// obtener una categoria - publico
router.get('/:id', [
    check('id','No es un mongo ID válido').isMongoId(),
    check('id').custom(existsCategoryById),
    validarErrores
], obtenerCategoria);

// crear categoria - privado - solo con token valido 
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarErrores
] , crearCategoria);

// actualizar categoria - privado - solo con token valido 
router.put('/:id',[
    validarJWT,
    check('id','No es un mongo ID válido').isMongoId(),
    check('id').custom(existsCategoryById),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarErrores
], actualizarCategoria);

// borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    isAdminRole,
    check('id','No es un mongo ID válido').isMongoId(),
    check('id').custom(existsCategoryById),
    validarErrores
], borrarCategoria);

export default router;
