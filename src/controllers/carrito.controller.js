import {pool} from "../db.js"
import Producto from "../../modelos/producto.modelo.js";
import { exit } from "process";
let libro = Producto;

class CarritoController {

    agregarItem(req, res){
        var carrito = req.session.carrito;
        var external = req.params.external;
        pool.execute('SELECT * FROM producto WHERE idProducto = ?', [external]).then(function(libro){
            if (libro) {
                var pos = CarritoController.verificar(carrito, external);
                // exit()
                if(pos == -1){
                    var datos = {
                        id: libro[0][0].idProducto,
                        external: external,
                        nombre: libro[0][0].nombre,
                        cantidad: 1,
                        precio: libro[0][0].precio,
                        precio_total: libro[0][0].precio
                    }
                    req.session.precioTotal += datos.precio_total;
                    carrito.push(datos);
                }else{
                    var dato = carrito[pos];
                    dato.cantidad += 1;
                    dato.precio_total = dato.cantidad * dato.precio;
                    carrito[pos] = dato;
                    req.session.precioTotal += dato.precio;
                }
            }
            req.session.carrito = carrito;
            res.status(200).json(req.session.carrito)
        });

    };

    quitarItem(req, res) {
        var carrito = req.session.carrito;
        var external = req.params.external;
        var pos = CarritoController.verificar(carrito, external);
        var dato = carrito[pos];
        if (dato.cantidad > 1){
            dato.cantidad -= 1;
            dato.precio_total = dato.cantidad * dato.precio;
            carrito[pos] = dato;
            req.session.carrito = carrito;
            req.session.precioTotal -= dato.precio;
            res.status(200).json(req.session.carrito);
        }else{
            req.session.precioTotal -= dato.precio;
            var aux = [];
            for (var i = 0; i < carrito.length; i++){
                var items = carrito[i];
                if (items.external != external){
                    aux.push(items);
                }
            }
        }
        req.session.carrito = aux;
        res.status(200).json(req.session.carrito);
    }

    eliminarItem(req, res) {
        var carrito = req.session.carrito;
        var external = req.params.external;
        var pos = CarritoController.verificar(carrito, external);
        var dato = carrito[pos];
        req.session.precioTotal -= dato.precio_total;
        var aux = [];
        for (var i = 0; i < carrito.length; i++){
            var items = carrito[i];
            if (items.external != external){
                aux.push(items);
            }
        }
        req.session.carrito = aux;
        res.status(200).json(req.session.carrito);
    }

    mostrarCarrito(req, res){
        res.status(200).json(req.session.carrito);
    }

    static verificar(lista, external){
        var pos = -1;
        for (var i = 0; i < lista.length; i++){
            if(lista[i].external == external){
                pos = i;
                break;
            }
        }
        return pos;
    }

};

export default CarritoController;