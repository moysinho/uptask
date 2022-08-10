<?php
include './inc/functions/session.php';
include './inc/functions/functions.php';
include './inc/template/header.php';

?>

<?php include './inc/template/navbar.php';

// Obtener el id de la URL
if (isset($_GET['id_proyecto'])) {
    $id_proyecto = $_GET['id_proyecto'];
}

?>

<div class="contenedor">

    <?php include './inc/template/sidebar.php'; ?>

    <main class="contenido-principal">

        <?php
        if (isset($id_proyecto)) {
            $proyecto = obtenerNombreProyecto($id_proyecto);
            if (isset($proyecto)) : ?>
                <h1> Proyecto actual:

                    <?php foreach ($proyecto as $nombre) : ?>
                        <span><?php echo $nombre['nombre'] ?></span>
                    <?php endforeach; ?>
                </h1>

                <form action="#" class="agregar-tarea">
                    <div class="campo">
                        <label for="tarea">Tarea:</label>
                        <input type="text" placeholder="Nombre Tarea" class="nombre-tarea">
                    </div>
                    <div class="campo enviar">
                        <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto; ?>">
                        <input type="submit" class="boton nueva-tarea" value="Agregar">
                    </div>
                </form>
            <?php endif; ?>
        <?php } else {
            // Si no hay un proyecto seleccionado
            echo "<h1>Selecciona un proyecto</h1>";
        } ?>


        <h2>Listado de tareas:</h2>
        <div class="listado-pendientes">
            <ul>

                <?php
                if (isset($id_proyecto)) {
                    // Obtiene las tareas del proyecto actual
                    $tareas = obtenerTareasProyecto($id_proyecto);
                    if ($tareas->num_rows > 0) {
                        // Si hay tareas
                        foreach ($tareas as $tarea) : ?>
                            <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                                <p><?php echo $tarea['nombre']; ?></p>
                                <div class="acciones">
                                    <i class="far fa-check-circle <?php echo ($tarea['estado'] === '1' ? 'completo' : '') ?>"></i>
                                    <i class="fas fa-trash"></i>
                                </div>
                            </li>
                        <?php endforeach; ?>
                <?php }
                } else {
                    // no hay tareas
                    echo "<p>No hay tareas en este proyecto</p>";
                }
                ?>

            </ul>
        </div>
    </main>
</div>
<!--.contenedor-->

<?php include './inc/template/footer.php'; ?>