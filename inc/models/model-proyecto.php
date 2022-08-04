<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    

    if ($_POST['accion'] == 'crear') {

        // Validar las entradas
    $proyecto = $_POST['proyecto'];
    $accion = $_POST['accion'];
        
        // Importar la conexion
        include('../functions/connection.php');

        try {
            //Realizar Consulat en la Base de Datos
            $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
            $stmt->bind_param("s", $proyecto);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion,
                    'nombre_proyecto' => $proyecto,
                    'mensaje' => 'Se creo exitosamente'
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
