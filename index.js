const express = require('express')

// crear una app de express
const app = express();

// ruta para el home
app.use('/', (req, res) => {
    res.send('Hello Word'); 
});

app.listen(3000);