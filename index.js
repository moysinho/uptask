const express = require('express');
const routes = require('./routes');
const path = require('path');

// crear una app de express
const app = express();

// donde cargar los archivos estaticos
app.use(express.static('public'))

// Habilitar tempate engine PUG
app.set('view engine', 'pug');

// Añadir carpetas de las vistas
app.set('use', path.join(__dirname, './views'))

// rutas
app.use('/', routes());

// Escuchar puerto
app.listen(3000);