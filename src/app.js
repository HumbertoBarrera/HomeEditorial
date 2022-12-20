import express, { response } from 'express';
import path from 'path';
import session from 'express-session';
import fs from 'fs'
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

app.use(express.static(path.join(__dirname, 'styles')));
// app.use(express.static(path.join(__dirname, 'shared')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'js')));
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


// Vistas
// Menú principal
app.get('/homeasd', function (req, response) {
	// Render login template
	if (req.session.loggedIn) {
		const $ = cheerio.load(fs.readFileSync(__dirname + '/shared/nav.html'))
		const perfil = $('<a class="login" href="/micuenta">Mi perfil</a>')
		$('.login').replaceWith(perfil)
		response.sendFile(path.join(__dirname + '/index.html'));
	} else {
		response.sendFile(path.join(__dirname + '/index.html'));
	}
});

// Iniciar Sesion
app.get('/iniciar_sesion2', function (req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/login.html'));
});

app.get('/salir', function (req, response) {
	// Render login template
	req.session.destroy();
	response.redirect('/');
});

// Mi cuenta
app.get('/micuentsda', function (req, response) {
	// Render login template
	if (req.session.loggedIn) {
		const $ = cheerio.load(fs.readFileSync(__dirname + '/contents/cuenta.html'))
		$('.contenido h1').replaceWith(`<h1>${req.session.user}</h1>`)
		$('.contenido p:contains("John Doe")').replaceWith(`<p>${req.session.user}</p>`)
		$('.contenido p:contains("jondoe@email.com")').replaceWith(`<p>${req.session.email}</p>`)
		$('.contenido.dir p').replaceWith(`<p>${req.session.direccion}</p>`)
		if (req.session.instrucciones_direccion != null) {
			$('#insEntrega p').replaceWith(`<p>${req.session.instrucciones_direccion}</p>`)
		} else {
			$('#insEntrega p').replaceWith(`<p></p>`)
		}
		$('#nombreTarjeta p').replaceWith(`<p>${req.session.nombreTarjeta}</p>`)
		$('#numTarjeta p').replaceWith(`<p>${req.session.tarjeta}</p>`)
		$('#venc').replaceWith(`<p>${req.session.fechaVenTarjeta}</p>`)
		// console.log(req.session.fechaVen)
		response.send($.html());
	} else {
		response.sendFile(path.join(__dirname + '/contents/login.html'));
	}
});

// Carrito
app.get('/micarrito', function (req, response) {
	if (req.session.loggedIn) {
		const $ = cheerio.load(fs.readFileSync(__dirname + '/contents/micarrito.html'))
		$("#carritoBod").html('')
		console.log(req.session.carrito)
		for (let i = 0; i <= req.session.carrito; i++) {
			var e = $(`<tr> +
				< th scope = "row" >  
				<div class="multi">
					<img class="cover" src="${req.session.pedidoNom[i]}.jpg" alt=""> +
				<p class="titulo">${req.session.pedidoNom[i]}</p>  +
				</div>
					</th >
					<td><p class="precio">${req.session.pedidoPre[i]}</p></td>
					<td class="cant">
						<div class="multi">
							<button class="qButton">-</button>
							<input type="number" value="${req.session.pedidoCant[i]}">
							<button class="qButton">+</button>
						</div>
					</td>
					<td><button class="brl-butt"><img src="/trash.svg" alt=""></button></td>`)
			$("#carritoBod").append(e)
		response.send($.html())
		}
	} else {
		response.sendFile(path.join(__dirname + '/contents/micarrito.html'));
	}
});

// Pedidos
app.get('/mispedidos', function (req, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/contents/pedidos.html'));
});

// Catálogo
app.get('/catalogo', function (req, response) {
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


// Pruebas para renderizar las vistas de otra forma

app.set('view engine', 'ejs')
app.set('views', [__dirname + '/views', __dirname + '/views/contents'])
// app.set('contents', __dirname + '/views/contents')

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
		res.render('login', {userLogged: req.session.loggedIn, user: req.session.user})
	}
});

app.use((req, res, next) => {
	res.status(404).json({
		message: 'API Not found'
	})
})

export default app;