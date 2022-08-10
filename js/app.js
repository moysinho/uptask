eventListeners();
// Lista de proyectos
const listaProyectos = document.querySelector("ul#proyectos");

function eventListeners() {
  // Document Ready
  document.addEventListener('DOMContentLoaded', function(){
    actualizarProgreso();
  });

  // Boton para crear proyecto
  document
    .querySelector(".crear-proyecto a")
    .addEventListener("click", nuevoProyecto);

  // Boton para crear Tareas
  document
    .querySelector(".nueva-tarea")
    .addEventListener("click", agregarTarea);

  // Botones para las acciones de las tareas
  document
    .querySelector(".listado-pendientes")
    .addEventListener("click", accionesTareas);
}

function nuevoProyecto(e) {
  e.preventDefault();

  // Crea un <input> para el nuevo proyecto
  let nuevoProyecto = document.createElement("li");
  nuevoProyecto.innerHTML = `<input type='text' id='nuevo-proyecto'>`;
  listaProyectos.appendChild(nuevoProyecto);

  // Seleccionar el id con el nuevo proyecto
  let inputNuevoProyecto = document.querySelector("#nuevo-proyecto");

  // al presionar enter crear nuevo proyecto
  inputNuevoProyecto.addEventListener("keypress", function (e) {
    let tecla = e.which || e.keyCode;

    if (tecla === 13) {
      guardarProyectoDB(inputNuevoProyecto.value);
      listaProyectos.removeChild(nuevoProyecto);
    }
  });
}

function guardarProyectoDB(nombreProyecto) {
  // Crear Llamado a AJAX
  const xhr = new XMLHttpRequest();

  // Enviar Datos por Formdata
  let datos = new FormData();
  datos.append("proyecto", nombreProyecto);
  datos.append("accion", "crear");

  // Abrir la Conexion
  xhr.open("POST", "inc/models/model-proyecto.php", true);

  // en la carga
  xhr.onload = function () {
    if (this.status === 200) {
      // Obtener datos de la espuesta
      const respuesta = JSON.parse(xhr.responseText);
      const proyecto = respuesta.nombre_proyecto,
        id_proyecto = respuesta.id_insertado,
        tipo = respuesta.tipo,
        resultado = respuesta.respuesta;

      // Comprobar la inserccion
      if (resultado === "correcto") {
        // Fue exitoso
        if (tipo === "crear") {
          // se creo un nuevo proyecto

          // Inyectar HTML
          let nuevoProyecto = document.createElement("li");
          nuevoProyecto.innerHTML = `
            <a href='index.php?id_proyecto=${id_proyecto}' id="proyecto:${id_proyecto}">
              ${proyecto} 
            </a>
          `;
          listaProyectos.appendChild(nuevoProyecto);

          // Notificacion
          swal({
            type: "success",
            title: `El Proyecto: ${proyecto}`,
            text: `${respuesta.mensaje} 👍`,
          }).then((resultado) => {
            if (resultado.value) {
              // Redireccionar a la nueva url
              window.location.href = `index.php?id_proyecto=${id_proyecto}`;
            }
          });
        } else {
          // Se actualizo o se elimino
        }
      } else {
        // no fue exitoso
        // Notificacion
        swal({
          type: "error",
          title: `Error`,
          text: `${respuesta.error}`,
        });
      }
    }
  };

  // Enviar el Request
  xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
  e.preventDefault();
  let nombreTarea = document.querySelector(".nombre-tarea").value;

  // Validar que el campo tenga algo escrito
  if (nombreTarea === "") {
    swal({
      type: "error",
      title: `Error`,
      text: `El campo Tarea no puede ir vacio`,
    });
  } else {
    // El campo tiene algo escrito, insertar en PHP

    // crear llamado a AJAX
    const xhr = new XMLHttpRequest();

    // Crear FORMDATA
    let datos = new FormData();
    datos.append("tarea", nombreTarea);
    datos.append("accion", "crear");
    datos.append("id_proyecto", document.querySelector("#id_proyecto").value);

    // Abrir la conexion
    xhr.open("POST", "inc/models/model-tareas.php", true);

    // Ejecutar y respuesta
    xhr.onload = function () {
      if (this.status === 200) {
        // Todo Correcto
        const respuesta = JSON.parse(xhr.responseText);
        const tarea = respuesta.nombre_tarea,
          id_tarea = respuesta.id_insertado,
          tipo = respuesta.tipo,
          resultado = respuesta.mensaje;
        if (respuesta.respuesta === "correcto") {
          // Se agrego correctamente
          if (tipo === "crear") {
            // lanzar la alerta
            // Notificacion
            swal({
              type: "success",
              title: `La Tarea: ${tarea}`,
              text: `${resultado} 👍`,
            });

            // seleccionar el parrafo con lalista vacia
            const parrafoListaVacia = document.querySelectorAll(".lista-vacia");
            if (parrafoListaVacia.length > 0) {
              document.querySelector(".lista-vacia").remove();
            }

            // construit Template
            const nuevaTarea = document.createElement("li");

            // asignamos el id
            nuevaTarea.id = `tarea:${id_tarea}`;

            // agregar la clase
            nuevaTarea.classList.add("tarea");

            // construir en el HTML
            nuevaTarea.innerHTML = `
              <p>${tarea}</p>
              <div class="acciones">
                <i class="far fa-check-circle"></i>
                <i class="fas fa-trash"></i>
              </div>
            `;

            // agregarlo al HTML
            const listado = document.querySelector(".listado-pendientes ul");
            listado.appendChild(nuevaTarea);

            // limpiar Formulario
            document.querySelector(".agregar-tarea").reset();

            actualizarProgreso();
          }
        } else {
          // Hubo un error
          swal({
            type: "error",
            title: `Error`,
            text: `${resultado}`,
          });
        }
        
      }
    };

    // Enviar la consulta
    xhr.send(datos);
  }
}

// Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
  e.preventDefault();
  if (e.target.classList.contains("fa-check-circle")) {
    if (e.target.classList.contains("completo")) {
      e.target.classList.remove("completo");
      cambiarEstadoTarea(e.target, 0);
    } else {
      e.target.classList.add("completo");
      cambiarEstadoTarea(e.target, 1);
    }
  } else if (e.target.classList.contains("fa-trash")) {
    swal({
      title: "Estas Seguro?",
      text: "La Tarea se eliminara de la BD!",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Borrar!",
    }).then((result) => {
      if (result.value) {
        const tareaEliminar = e.target.parentElement.parentElement;
        // Borrar de la BD
        eliminarTareaBD(tareaEliminar);

        // Borrar del HTML
        tareaEliminar.remove();
        swal("Borrado!", "La tarea se borro exitosamente", "success");
      }
    });
  }
}

// Completa o descompleta la tarea
function cambiarEstadoTarea(tarea, estado) {
  const idTarea = tarea.parentElement.parentElement.id.split(":");
  // crear llamado ajax
  const xhr = new XMLHttpRequest();

  // Informacion
  let datos = new FormData();
  datos.append("id", idTarea[1]);
  datos.append("accion", "actualizar");
  datos.append("estado", estado);

  // abrir la conexion
  xhr.open("POST", "inc/models/model-tareas.php", true);

  // onload
  xhr.onload = function () {
    if (this.status === 200) {
      const respuesta = JSON.parse(xhr.responseText);
      if (respuesta.respuesta === "correcto") {
        actualizarProgreso();
      }
    }
  };

  // enviar la peticion
  xhr.send(datos);
}

// Eliminar tareas de la BD
function eliminarTareaBD(tarea) {
  const idTarea = tarea.id.split(":");
  // crear llamado ajax
  const xhr = new XMLHttpRequest();

  // Informacion
  let datos = new FormData();
  datos.append("id", idTarea[1]);
  datos.append("accion", "eliminar");

  // abrir la conexion
  xhr.open("POST", "inc/models/model-tareas.php", true);

  // onload
  xhr.onload = function () {
    if (this.status === 200) {
      const respuesta = JSON.parse(xhr.responseText);
      if (respuesta.respuesta === "correcto") {
        // Comprobar que haya tareas restantes
        const listaTareasRestantes = document.querySelectorAll("li.tarea");
        if (listaTareasRestantes.length === 0) {
          document.querySelector(".listado-pendientes").innerHTML =
            "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
        }
        actualizarProgreso();
      }
    }
  };

  // enviar la peticion
  xhr.send(datos);
}


// Actualizar el progreso del proyecto
function actualizarProgreso() {
  // Obtener todas las tareas
  const tareas = document.querySelectorAll('li.tarea')
  
  // Obtener las tareas completadas
  const tareasCompletadas = document.querySelectorAll('i.completo')

  // Determinar el avance
  const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

  // asignar el avance a la barra
  const porcentaje = document.querySelector('#porcentaje');
  porcentaje.style.width = `${avance}%`;

  if (avance === 100) {
    swal({
      type: "success",
      title: `Proyecto Terminado`,
      text: `Ya no tienes tareas pendiente 👍`,
    })
  }
  
}