import express, { response } from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import fs from 'fs'
import {pool} from './db.js'
import { fileURLToPath } from 'url';
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routers.js';
import metodopagoRoutes from './routes/metodopago.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import enviosRoutes from './routes/envios.router.js';
import ordenRoutes from './routes/orden.routes.js';
import pingRoute from './routes/ping.routes.js';
import carritoRoute from './routes/carrito.routes.js';
import { exit } from 'process';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

app.use(cors());

app.use(express.static(path.join(__dirname, 'styles')));
// app.use(express.static(path.join(__dirname, 'shared')));
app.use(express.static(path.join(__dirname, 'views/img')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'views/contents/portadas')));
// app.use(express.static(path.join(__dirname, 'contents')));

// Sesion
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs
app.use(pingRoute);
app.use('/api', clientesRoutes);
app.use('/api', metodopagoRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', ventasRoutes);
app.use('/api', enviosRoutes);
app.use('/api', ordenRoutes);
app.use(carritoRoute);

// Vistas
// Cambio x

// Cerrar sesión
app.get('/salir', function (req, response) {
	// Render login template
	req.session.destroy();
	response.redirect('/');
});

app.set('view engine', 'ejs')
app.set('views', [__dirname + '/views', __dirname + '/views/contents'])

// Menú principal
app.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.render('index', {userLogged: req.session.loggedIn, user: req.session.user});
	}else{
		res.render('index', {userLogged: req.session.loggedIn, user: req.session.user});
	}
})

// Inicio de sesión
app.get('/iniciar_sesion', (req, res) => {
	res.render('login', {userLogged: req.session.loggedIn, user: req.session.user})
});

// Mi perfil/cuenta
app.get('/micuenta', (req, res) => {
	if (req.session.loggedIn) {
		res.render('cuenta', {userLogged: req.session.loggedIn, user: req.session.user, direcciones: req.session.direcciones, metodospago: req.session.metodospago})
	}else{
		// res.render('login', {userLogged: req.session.loggedIn, user: req.session.user})
		res.redirect('/iniciar_sesion')
	}
});

// Mis pedidos
app.get('/mispedidos', (req, res) => {
	if (req.session.loggedIn) {
		pool.execute('SELECT * FROM pedido LEFT JOIN envio ON pedido.idPedido = envio.idPedido  WHERE pedido.idCliente = ?', [req.session.user.id]).then(([data, fields]) => {
			console.log(data);
			res.render('pedidos', { userLogged: req.session.loggedIn, user: req.session.user, envios: req.session.envios , pedido: data });
		})
	} else {
		// res.render('login', { userLogged: req.session.loggedIn, user: req.session.user })
		res.redirect('/iniciar_sesion')
	}
});

//administracion
app.get('/admin', (req, res) => {
	if (req.session.loggedIn) {
		res.render('ventas', { userLogged: req.session.loggedIn, user: req.session.user, envios: req.session.envios })
	} else {
		res.render('login', { userLogged: req.session.loggedIn, user: req.session.user })
	}
});

// Catálogo
app.get('/catalogo', (req, res) => {
	if (req.session.carrito == undefined){
		req.session.carrito = [];
	}
	pool.execute('SELECT * FROM producto').then(([data, fields]) => {
		res.render('catalogo', {userLogged: req.session.loggedIn, user: req.session.user, productos: data});
	})
});

// Carrito
app.get('/micarrito', (req, res) => {
	if (req.session.carrito == undefined){
		req.session.carrito = []
	}
	res.render('micarrito', {userLogged: req.session.loggedIn, user: req.session.user, carrito: req.session.carrito, precioTotal: req.session.precioTotal})
});

// Pedidos
/*
app.get('/mispedidos', (req, res) => {
	res.render('pedidos', {userLogged: req.session.loggedIn, user: req.session.user})
});
*/

// Pago
app.get('/pago', (req, res) => {
	res.render('mispagos', { userLogged: req.session.loggedIn, user: req.session.user, carrito: req.session.carrito, precioTotal: req.session.precioTotal, direcciones: req.session.direcciones, metodospago: req.session.metodospago, direccionActiva: req.session.direccionActiva, metodopagoActivo: req.session.metodopagoActivo})
});

app.use((req, res, next) => {
	res.status(404).json({
		message: 'API Not found'
	})
})

export default app;