<?php
// Credenciales de la base de datos

/* define('DB_USUARIO', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_NAME', 'uptask'); */

$conn = new mysqli('localhost', 'root', '', 'uptask');

/* if ($conn->ping() != 1) {
    echo $conn->connect_error;
} */
