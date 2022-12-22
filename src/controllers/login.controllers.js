import {pool} from "../db.js";
import User from '../../modelos/usuario.modelo.js'
import Direccion  from "../../modelos/direccion.modelo.js";
import MetodoPago from "../../modelos/metodopago.modelo.js";
import session from "express-session";

export const getLogin = async (req, res) => {

    const {email, pass} = req.body
    try{
        const [row] = await pool.query('SELECT * FROM cliente WHERE correoElec = ? and password= ?' ,
                                        [email, pass])
        const [row_direccion] = await pool.query("SELECT idDireccion, CONCAT(calle, ' #', numeroExt, ', Colonia ', colonia, ' C.P. ', codigoPostal, ', ', ciudad, ', ', estado) as 'Direccion', comentarios as 'Instrucciones' FROM direccion WHERE idCliente = ?",
                                                    row[0]['idCliente'])
        const [row_metodopago] = await pool.query('SELECT * FROM metodopago WHERE idCliente = ?', row[0]['idCliente'])
        if (row.length <= 0) return res.status(404).json({
            message: 'No se encontró el cliente '
        })
        else{
            req.session.loggedIn = true
            req.session.precioTotal = 0;
            const user = new User(row[0]['idCliente'], row[0]['nombre'], row[0]['correoElec'], row[0]['password']);
            req.session.user = user;
            if (row_direccion.length > 0){
                var direcciones = [];
                for (let i = 0;  i < row_direccion.length; i++){
                    const direccion = new Direccion(row_direccion[i]['idDireccion'], row_direccion[i]['Direccion'], row_direccion[i]['Instrucciones']);
                    direcciones.push(direccion);
                }
                req.session.direcciones = direcciones;
            }else{
                req.session.direcciones = [];
            }
            if (row_metodopago.length > 0){
                var metodospago = [];
                for (let i = 0; i < row_metodopago.length; i++){
                    const metodopago = new MetodoPago(row_metodopago[i]['idMetodoPago'], row_metodopago[i]['numTarjeta'], row_metodopago[i]['nombre'], row_metodopago[i]['fechaVen'], row_metodopago[i]['cvv']);
                    metodospago.push(metodopago);
                }
                req.session.metodospago = metodospago;
            }else{
                req.session.metodospago = [];
            }
            res.redirect('/');
        }
    }catch (error){
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}