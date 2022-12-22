import {Router} from 'express';
import CarritoController from '../controllers/carrito.controller.js';

const router = Router();
const carritoController = new CarritoController();

// Agregar item
router.get('/agregar:external', carritoController.agregarItem);

// Quitar item
router.get('/qitar:external', carritoController.quitarItem);

// Mostrar carrito
router.get('/listarcarrito', carritoController.mostrarCarrito);

export default router;