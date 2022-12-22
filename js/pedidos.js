import getEnvios from '../src/controllers/envios.controllers.js'

console.log(getEnvios);


function factura(e) {
    e.preventDefault();
}

const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
    myInput.focus()
})