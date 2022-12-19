import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routers.js';
import metodopagoRoutes from './routes/metodopago.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import enviosRoutes from './routes/envios.router.js';
import ordenRoutes from './routes/orden.routes.js';
import pingRoute from './routes/ping.routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

app.use(express.json());
app.use(express.urlencoded({extended: false}))

// APIs
app.use(pingRoute);
app.use('/api', clientesRoutes);
app.use('/api', metodopagoRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', ventasRoutes);
app.use('/api', enviosRoutes);
app.use('/api', ordenRoutes);

// Vistas
// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }));
// app.use(express.json());

app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'shared')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'contents')));

// Menú principal
app.get('/', function(req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/index.html'));
});

// Iniciar Sesion
app.get('/iniciar_sesion', function(req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/login.html'));
});

// Mi cuenta
app.get('/micuenta', function(req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/cuenta.html'));
});

// Carrito
app.get('/micarrito', function(req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/micarrito.html'));
});

// Pedidos
app.get('/mispedidos', function (req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/pedidos.html'));
});

// Catálogo
app.get('/catalogo', function(req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/catalogo.html'));
});

// Catálogo
app.get('/mispagos', function (req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/mispagos.html'));
});

app.get('/ventas', function (req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/ventas.html'));
});

app.use((req, res, next) => {
    res.status(404).json({
        message: 'API Not found'
    })
})

export default app;