import {Router} from 'express';
import CuentaControllers from '../controllers/cuenta.controllers';

const router = Router();
const cuentaControllers = new CuentaControllers();

// Agregar Direccion
router.post('/agregarDireccion', cuentaControllers.insertDir);


export default router;