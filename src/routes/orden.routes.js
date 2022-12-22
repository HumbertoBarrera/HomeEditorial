import {Router} from 'express';
import { getOrden, getAllOrdenes } from '../controllers/orden.controller.js';

const router = Router ();

router.get('/orden/id', getOrden)

router.get('/orden', getAllOrdenes)

export default router