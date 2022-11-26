import { Router } from 'express';
import { search } from '../controllers/search.js';

const router = Router();

router.get('/:coleccion/:termino', search);

export default router;