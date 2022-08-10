<?php

// Obtiene la pagina actual que se ejecutra
function obtenerPaginaActual()
{
    $archivo = basename($_SERVER['PHP_SELF']);
    $pagina =str_replace(".php", "", $archivo);
    return $pagina;
}

// Obtener todos los Proyectos
function obtenerProyectos() {
    include 'connection.php';
    try {
        return $conn->query('SELECT id, nombre FROM proyectos');
    } catch (\Throwable $th) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

// Obtener el nombre del proyecto
function obtenerNombreProyecto($id = null) {
    include 'connection.php';
    try {
        return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
    } catch (\Throwable $th) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

// Obtener las clases del proyecto 
function obtenerTareasProyecto($id = null) {
    include 'connection.php';
    try {
        return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
    } catch (\Throwable $th) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}