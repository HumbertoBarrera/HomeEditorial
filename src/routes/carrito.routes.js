import {Router} from 'express';
import CarritoController from '../controllers/carrito.controller.js';

const router = Router();
const carritoController = new CarritoController();

// Agregar item
router.get('/agregar:external', carritoController.agregarItem);

// Quitar item
router.get('/quitar:external', carritoController.quitarItem);

// Eliminar item
router.get('/eliminar:external', carritoController.eliminarItem);

// Mostrar carrito
router.get('/listarcarrito', carritoController.mostrarCarrito);

export default router;