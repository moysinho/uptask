<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if ($_POST['accion'] == 'crear') {

        // Validar las entradas        
        $accion = $_POST['accion'];
        $id_proyecto = (int) $_POST['id_proyecto'];
        $tarea = $_POST['tarea'];

        // Importar la conexion
        include('../functions/connection.php');

        try {
            //Realizar Consulat en la Base de Datos
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
            $stmt->bind_param("si", $tarea, $id_proyecto);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion,
                    'nombre_tarea' => $tarea,
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

    if ($_POST['accion'] == 'actualizar') {

        $id_tarea = (int) $_POST['id'];
        $estado = $_POST['estado'];

        // Importar la conexion
        include('../functions/connection.php');

        try {
            //Realizar Consulat en la Base de Datos
            $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ?");
            $stmt->bind_param("ii", $estado, $id_tarea);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
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

    if ($_POST['accion'] == 'eliminar') {

        $id_tarea = (int) $_POST['id'];

        // Importar la conexion
        include('../functions/connection.php');

        try {
            //Realizar Consulat en la Base de Datos
            $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
            $stmt->bind_param("i", $id_tarea);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
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
