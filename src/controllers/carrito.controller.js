import Producto from "../../modelos/producto.modelo";
let libro = Producto;

class CarritoController {

    agregarItem(req, res){
        var carrito = req.session.carrito;
        var external = req.params.external;
    };

};

export default CarritoController;