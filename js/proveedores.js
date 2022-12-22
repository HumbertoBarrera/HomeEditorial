function getTotal() {
    var cant = parseInt(document.getElementById("importe").value);
    var precio = parseInt(document.getElementById("cantidad").value);
    
    console.log(typeof cant);
    console.log(typeof precio);
    console.log(cant + precio);
    
    if (!isNaN(cant) && !isNaN(precio)) {
        document.getElementById("total").value = cant * precio;
    }
}