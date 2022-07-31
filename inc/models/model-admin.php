<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Validar las entradas
    $accion = $_POST['accion'];
    $usuario = filter_var($_POST['usuario'], FILTER_SANITIZE_STRING);
    $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);

    if ($_POST['accion'] == 'crear') {
        // Codigo para crear los Administradores 

        // Hashear Password
        $opciones = array(
            'const' => 12
        );

        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

        // Importar la conexion
        include('../functions/connection.php');

        try {
            //Realizar Consulat en la Base de Datos
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
            $stmt->bind_param("ss", $usuario, $hash_password);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'usuario' => $usuario,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array(
                    'respuesta' => 'error',
                );
            }
            $stmt->close();
            $conn->close();
        } catch (\Throwable $th) {
            // En caso de Error, tomar la exepcion
            $respuesta = array(
                'error' => $th->getMessage()
            );
        }

        echo json_encode($respuesta);
    }
}

/* if ($_POST['accion'] == 'crear') {
    // Codigo para loguear los Administradores 
    require_once('../functions/bd.php');

    // Validar las entradas
    $usuario = filter_var($_POST['usuario'], FILTER_SANITIZE_STRING);
    $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);


    try {
        $stmt = $conn->prepare("INSERT INTO usuarios(usuario, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $usuario, $password);
        $stmt->execute();
        if ($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'datos' => array(
                    'usuario' => $usuario,
                    'password' => $password,
                    'telefono' => $telefono,
                    'id_insertado' => $stmt->insert_id
                )
            );
        }
        $stmt->close();
        $conn->close();
    } catch (\Throwable $th) {
        $respuesta = array(
            'error' => $th->getMessage()
        );
    }

    echo json_encode($respuesta);
} */
