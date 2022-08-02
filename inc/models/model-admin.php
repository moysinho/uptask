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
                    'tipo' => $accion,
                    'mensaje' => 'Se ha resgitrado Correctamente'
                );
            } else {
                $respuesta = array(
                    'respuesta' => 'error inesperado',
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

if ($_POST['accion'] == 'login') {
    // Codigo para loguear los Administradores 
    include('../functions/connection.php');

    try {
        // Seleccionar Administrador de la BD
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        // loguear el usuario
        $stmt->bind_result($nombre_usuario, $id_usuario, $password_usuario);
        $stmt->fetch();
        if ($nombre_usuario) {
            // el usuario existe, verificar el password
            if (password_verify($password, $password_usuario)) {
                // Iniciar la sesion
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                // Login Correcto
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'usuario' => $nombre_usuario,
                    'tipo' => $accion,
                    'mensaje' => 'Inicio de session exitoso'
                );
            } else {
                // login Incorrecto, enviar error
                $respuesta = array(
                    'error' => 'La contraseña es incorrecta'
                );
            }
        } else {
            $respuesta = array(
                'respuesta' => 'error',
                'error' => 'El usuario no existe'
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
}
