eventListeners();
// Lista de proyectos
const listaProyectos = document.querySelector("ul#proyectos");

function eventListeners() {
  // Boton para crear proyecto
  document
    .querySelector(".crear-proyecto a")
    .addEventListener("click", nuevoProyecto);
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
            <a href='index.php?id_respuesta=${id_proyecto}' id="${id_proyecto}">
              ${proyecto} 
            </a>
          `;
          listaProyectos.appendChild(nuevoProyecto);

          // Notificacion
          swal({
            type: "success",
            title: `El Proyecto: ${proyecto}`,
            text: `${respuesta.mensaje} 👍`,
          })
          .then (resultado => {
            if (resultado.value) {
              // Redireccionar a la nueva url
              window.location.href = `index.php?id_respuesta=${id_proyecto}`;    
            }
          })


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
