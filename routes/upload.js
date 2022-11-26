import { Router } from 'express';
import { check } from 'express-validator';
import { showImg, updateImg, uploadFile } from '../controllers/upload.js';
import { validarErrores } from '../middlewares/validarErrores.js';
import { allowedCollections } from '../helpers/db-validators.js'
import { validateFile } from '../middlewares/validarArchivo.js';


const router = Router();

router.post('/' , validateFile, uploadFile);

router.put('/:coleccion/:id',[
    validateFile,
    check('id','No es un mongo ID válido').isMongoId(),
    check('coleccion').custom( c => allowedCollections(c,['users','products'])),
    validarErrores
], updateImg);

router.get('/:coleccion/:id',[
    check('id','No es un mongo ID válido').isMongoId(),
    check('coleccion').custom( c => allowedCollections(c,['users','products'])),
    validarErrores
], showImg);


export default router;