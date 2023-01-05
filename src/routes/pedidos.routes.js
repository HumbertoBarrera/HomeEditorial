import {Router} from 'express';
import { createPedido, createPedido_VO, getPedidosByID } from '../controllers/pedidos.controller.js';
import { getPedidos, getPedido } from '../controllers/pedidos.controller.js';

const router = Router()

router.get('/pedidos', getPedidos)

router.get('/pedidos/:idCliente', getPedidosByID)

router.get('/pedidos/:id', getPedido)

router.post('/pedidos:idCliente', createPedido)

router.post('/pedidoVO', createPedido_VO)

export default router