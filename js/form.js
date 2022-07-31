eventListener();

function eventListener() {
  document
    .querySelector("#formulario")
    .addEventListener("submit", validarRegistro);
}

function validarRegistro(e) {
  e.preventDefault();

  let usuario = document.querySelector("#usuario").value,
    password = document.querySelector("#password").value,
    tipo = document.querySelector("#tipo").value;

  if (usuario === "" && password === "") {
    swal({
      type: "error",
      title: "opsss",
      text: "Ambos campos son obligarios",
    });
  } else if (usuario === "") {
    swal({
      type: "error",
      title: "opsss",
      text: "El usuario es obligario",
    });
  } else if (password === "") {
    swal({
      type: "error",
      title: "opsss",
      text: "La contraseña es obligario",
    });
  } else {
    // Ambos Campos Correctos, mandar a AJAX
    // Datos que se enviar al servidor
    let datos = new FormData();
    datos.append("usuario", usuario);
    datos.append("password", password);
    datos.append("accion", tipo);

    // Crear el llamado a AJAX
    const xhr = new XMLHttpRequest();

    // Abrir la conexion
    xhr.open("POST", "inc/models/model-admin.php", true);

    // Retorno de datos
    xhr.onload = function () {
      if (this.status === 200) {
        const respuesta = JSON.parse(xhr.responseText);

        // Si la Respuesta es Correcta
        if (respuesta.respuesta === "correcto") {
          // Si es un Nuevo usuario
          if (respuesta.tipo === "crear") {
            // Notificacion
            swal({
              type: "success",
              title: `El usuario ${respuesta.usuario}`,
              text: "Se ha resgitrado Correctamente",
            });
          }
        } else {
            // Notificacion
            swal({
                type: "error",
                title: `Error`,
                text: "Ocurrio un error inesperado",
              });
        }
      }
    };

    // Enviar la Peticion
    xhr.send(datos);
  }
}
