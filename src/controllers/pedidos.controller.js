import {pool} from "../db.js"
import session from "express-session";
import { exit } from "process";

const carrito = [
    {   
        idProducto: 3,
        precioUni: 250,
        cantidad: 5,
        monto: 0,
        ivaProd: 0
    },
    {
        idProducto: 2,
        precioUni: 200,
        cantidad: 1,
        monto: 0,
        ivaProd: 0
    }
]

export const getPedidos = async (req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM pedido');
        if (rows.length <= 0) return res.status(404).json({
            message: 'No se encontró ningún pedido'
        })
        else {
            for (let i = 0; i <= rows.length; i++) {
                req.session.ped
            }
        }
        res.json(rows)
    }catch (error){
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}

export const getPedidosByID = async (req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM pedido WHERE idCliente = ?', [req.params.idCliente])
        if (rows.length <= 0) return res.status(404).json({
            message: 'No se encontró ningún pedido'
        })
        else {
            for (let i = 0; i <= rows.length; i++) {
                req.session.ped
            }
        }
        res.json(rows)
    }catch (error){
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}

export const getPedido = async (req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM pedido WHERE idPedido = ?', req.params.id)
        if (rows.length <= 0) return res.status(404).json({
            message: 'No se encontró ningún pedido'
        })
        res.json(rows)
    }catch (error){
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}

export const createPedido = async (req, res) => {
    try{
        // console.log(req.body.Carrito);
        var montoTotal = 0;
        var ivaTotal = 0;
        const IVA = 16;
        const idCliente = req.params.idCliente;
        const [row_pedido] = await pool.query('INSERT INTO pedido (idCliente) VALUES (?)', [idCliente]);
        // for(var key in req.body){
        //     var value = req.body[key]
        //     value['monto'] = value['precioUni'] * value['cantidad'];
        //     value['ivaProd'] = value['monto'] * (16/100);
        // }
        for (var key in req.body.Carrito){
            var orden = req.body.Carrito[key];
            const {id, precio, cantidad, precio_total} = orden;
            var ivaProd = precio * (IVA/100);
            const [row_orden] = await pool.query('INSERT INTO orden (idPedido, idProducto, precioUni, cantidad, monto, iva) VALUES (?, ?, ?, ?, ?, ?)',
                                [row_pedido.insertId, id, precio, cantidad, precio_total, ivaProd]);
            // montoTotal += precio_total;
            ivaTotal += ivaProd;
        }
        var date = new Date();
        montoTotal = parseFloat(req.body.Total) - parseFloat(ivaTotal);
        var total_ = req.body.Total;
        const [row_pedido_final] = await pool.query('UPDATE pedido SET subtotal = ?, iva = ?, total = ?, fecha = ? WHERE idPedido = ?',
                                                    [montoTotal, ivaTotal, total_, date, row_pedido.insertId]);
        res.send({
            Pedido: row_pedido.insertId,
            message: 'Pedido realizado con éxito.'
        });
    }catch (error){
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}

export const createPedido_VO = async (req, res) => {
    try{
        var ivaProd = 0;
        var ivaTotal = 0;
        //const {idCliente} = req.body;
        const [row_pedido] = await pool.query('INSERT INTO pedido (idCliente) VALUES (3)');
        //insertar productos en orden
        const {NoOrd,MontoTotal,NoArt,CantidadProd, NoProd, NomProd, DescProd, NoSerieProd, PrecioProd} = req.body;
        const [row_producto] = await pool.query('SELECT idProducto FROM producto WHERE nombre = ?', [NomProd]);
        var idProd = row_producto[0]['idProducto'];
        ivaProd = PrecioProd * (16/100);
        const [row_orden] = await pool.query('INSERT INTO orden (idPedido, idProducto, precioUni, cantidad, monto, iva) VALUES (?, ?, ?, ?, ?, ?)',
                                [row_pedido.insertId, idProd, PrecioProd, CantidadProd, MontoTotal, ivaProd]);
        ivaTotal += ivaProd;
        //actualizar pedidos con fecha y total
        var date = new Date();
        var total = MontoTotal + ivaTotal;
        const [row_pedido_final] = await pool.query('UPDATE pedido SET subtotal = ?, iva = ?, total = ?, fecha = ? WHERE idPedido = ?',
                                                    [MontoTotal, ivaTotal, total, date, row_pedido.insertId]);
        res.send({
            Pedido: row_pedido.insertId,
            message: 'Pedido realizado con éxito.'
        });
    }catch (error){
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}