import { Router } from 'express';
import {check} from 'express-validator';

import { existsCategoryById, existsProductById } from '../helpers/db-validators.js';

import { isAdminRole } from '../middlewares/validarRoles.js';

import { validarErrores } from '../middlewares/validarErrores.js';
import { validarJWT } from '../middlewares/validarJwt.js';
import { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } from '../controllers/product.js';

const router = Router();

// obtener todos los productos - publico
router.get('/', obtenerProductos);

// obtener un producto - publico
router.get('/:id', [
    check('id','No es un mongo ID válido').isMongoId(),
    check('id').custom(existsProductById),
    validarErrores
], obtenerProducto);

// crear producto - privado - solo con token valido 
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category','No es un mongo ID válido').isMongoId(),
    check('category').custom(existsCategoryById),
    validarErrores
] , crearProducto);

// actualizar producto - privado - solo con token valido 
router.put('/:id',[
    validarJWT,
    check('id','No es un mongo ID válido').isMongoId(),
    check('id').custom(existsProductById),
    check('category').optional().custom(existsCategoryById),
    validarErrores
], actualizarProducto);

// borrar un product - Admin
router.delete('/:id',[
    validarJWT,
    isAdminRole,
    check('id','No es un mongo ID válido').isMongoId(),
    check('id').custom(existsProductById),
    validarErrores
], borrarProducto);

export default router;
