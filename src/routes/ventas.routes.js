import { Router } from "express";
import { createVenta, getVenta } from "../controllers/ventas.controller.js";


const router = Router()

router.get('/ventas', getVenta)

router.post('/ventas', createVenta)

export default router