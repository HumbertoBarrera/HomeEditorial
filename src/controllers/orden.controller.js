import { pool } from "../db.js"

export const getOrden = async (req, res) => {
    try {
        const [rows] = await pool.query('select orden.idPedido as "ID", producto.nombre as "Nombre", producto.precio as "Precio", orden.cantidad as "Cantidad"  ' +
            'from orden ' +
            'inner join pedido on pedido.idPedido = orden.idPedido ' +
            'inner join producto on orden.idProducto = producto.idProducto' +
            'where pedido.idPedido = ?', 1)
        console.log(rows[0])
        if (rows.length <= 0) return res.status(404).json({
            message: 'No se encontró ninguna orden'
        })
        else {
            req.session.carrito = rows[0]
            for (let i = 0; i <= rows.length; i++) {
                req.session.pedido_Id[i] = rows[i]["ID"]
                req.session.pedidoNom[i] = rows[i]["Nombre"]
                req.session.pedidoPre[i] = rows[i]["Precio"]
                req.session.pedidoCant[i] = rows[i]["Cantidad"]
            }
        }

        res.redirect('/');
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}

export const getAllOrdenes = async (req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM orden')
        if (rows.length <= 0) return res.status(404).json({
            message: 'No se encontró ninguna orden'
        })
        res.json(rows)
    }catch (error){
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}