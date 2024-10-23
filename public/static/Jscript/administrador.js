let idUsuarioSeleccionado = null;
// let dataTableIsInitialized = false;
const token = localStorage.getItem("token")
// Decodificacion de token
const parseJwt = (token) => {
  const base64Url = token.split('.')[1]; // Obtener la parte del payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazos para el formato base64
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload); // Convertir a objeto JSON
}
const userInfo = parseJwt(token);
console.log(userInfo)
let info = document.getElementById("info")
info.innerHTML = `Bienvenid@ : ${userInfo.usuario}`

// tablas
let infoForm = {};
var tablaUsuarios = document.getElementById("tablacontacs");
let tablaTareas = document.getElementById("taskTable");
let tablaLote = document.getElementById("tabla-lote");
let tablaGalpon = document.getElementById("tabla-galpones");


// formularios
var formAdd = document.getElementById("formAdd");
var formTareas = document.getElementById("form-tareas");
var formLote = document.getElementById("form-lot");
var formGalpon = document.getElementById("form-addgalpon");
var formEditTareas = document.getElementById("edit-form-tareas");
const modalInfo = new bootstrap.Modal(document.getElementById('ModalInfo'));

const mostrarInfoUser = () => {
  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/buscar_usuario',
  })
    .then(function (response) {
      console.log(response.data)
      // document.getElementById('num_usuarios').innerHTML = `${response.data[0].total} Usuarios Registrados`;
    })
    .catch(err => console.log('Error: ', err));
  modalInfo.show()

}
const ocultarInfoUser = () => {
  modalInfo.hide()


}
info.addEventListener("mouseover", mostrarInfoUser)
info.addEventListener("mouseout", ocultarInfoUser)
// Usuarios
const agregarUsuarios = (event) => {
  event.preventDefault();
  const id_usuario = document.getElementById('id-usuario').value.trim();
  const nombre = document.getElementById('nom').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const edad = document.getElementById('edad').value.trim();
  const sexoElement = document.querySelector('input[name="txtsexo"]:checked');
  const sexo = sexoElement ? sexoElement.value : null;
  const usuario = document.getElementById('usuario').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  const rol = document.getElementById('rol').value.trim();
  if (id_usuario === "" || nombre === "" || apellido === "" || edad === "" || sexo === "" || usuario === "" || contraseña === "" || rol === "") {
    alert("Por favor, complete todos los campos");
    return;
  }
  // devuelve true si no es un numero y false si lo es 
  if (isNaN(edad)) {
    alert("La edad debe ser un número");
    return;
  } else {
    if (edad < 0) {
      alert("Debes ingresar un numero positivo")
      return
    }
  }
  // devuelve true si es un numero y false si no lo es 

  if (isNaN(id_usuario)) {
    alert("La CC deben ser números");
    return;
  } else {
    if (id_usuario < 0) {
      alert("Debes ingresar un numero positivo")
      return
    }
  }

  if (nombre.length < 3 || apellido.length < 3) {
    alert("El nombre y apellido deben tener al menos 3 caracteres");
    return;
  }

  if (usuario.length < 6 || contraseña.length < 8) {
    alert("El usuario y contraseña deben tener al menos 6 y 8 caracteres, respectivamente");
    console.log(usuario, contraseña)
    return;
  }
  for (var i = 0; i < nombre.length; i++) {
    if (!isNaN(nombre.charAt(i))) {
      alert("El nombre debe contener solo letras");
      return;
    }
  }
  for (var i = 0; i < apellido.length; i++) {
    if (!isNaN(apellido.charAt(i))) {
      alert("El apellido debe contener solo letras");
      return;
    }
  }

  // Validar que el usuario no contenga números
  for (var i = 0; i < usuario.length; i++) {
    if (!isNaN(usuario.charAt(i))) {
      alert("El usuario debe contener solo letras");
      return;
    }
  }
  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/add_contact',
    data: {
      id_usuario: id_usuario,
      nombres: nombre,
      apellidos: apellido,
      edad: edad,
      sexo: sexo,
      usuario: usuario,
      contraseña: contraseña,
      id_rol: rol
    },
  }).then(function (response) {
    alert("Usuario Agregado ")
    formAdd.reset()
    cargarUsuarios()
  }).catch(err => console.log('Error: ', err))

}
const cargarUsuarios = () => {


  const tbody = document.querySelector('#tablacontacs tbody'); // Seleccionar el tbody de la tabla

  /////////////////////// Cantidad de usuarios /////////////////////////////////
  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/getcount',
  })
    .then(function (response) {
      console.log(response.data)
      document.getElementById('num_usuarios').innerHTML = `${response.data[0].total} Usuarios Registrados`;
    })
    .catch(err => console.log('Error: ', err));

  ////////////////////////////////////////////////////////////////////////

  //////////////////////// CONSULTA TODOS LOS USUARIOS ///////////////////////////////
  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/getAll',
  })
    .then(function (response) {
      console.log(response.data)
      
      const tabla = $('#tablacontacs').DataTable(); // Acceder a la tabla DataTable
      tabla.clear(); // Limpiar las filas actuales de DataTables

      response.data.forEach(user => {
        tabla.row.add([
          user.id_usuario,
          user.nombres,
          user.apellidos,
          user.usuario,
          user.contraseña,
          user.tipo_usuario,
          `<a class="bi bi-pencil-square btn btn-warning mx-5" data-bs-toggle="modal" data-bs-target="#modalEditarUsuario" onclick="editarUsuarios(this)"></a>`
        ]).draw(false);  // Añadir la fila y redibujar
      });

    })
    .catch(err => console.log('Error: ', err));
};
const editarUsuarios = (button) => {
  const row = button.parentNode.parentNode;
  const id = row.cells[0].innerText;

  axios.get(`http://127.0.0.1:3000/get_user/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => {
      const user = response.data;
      document.getElementById('edit-id-usuario').value = user.id_usuario;
      document.getElementById('edit-nombre-usuario').value = user.nombres;
      document.getElementById('edit-apellido-usuario').value = user.apellidos;
      document.getElementById('edit-edad-usuario').value = user.edad;

      // Seleccionar el radio button de sexo según el valor recuperado
      if (user.sexo === "M") {
        document.getElementById('edit-masculino').checked = true;
      } else if (user.sexo === "F") {
        document.getElementById('edit-femenino').checked = true;
      } else {
        document.getElementById('edit-masculino').checked = false;
        document.getElementById('edit-femenino').checked = false;


      }

      document.getElementById('edit-usuario-username').value = user.usuario;
      document.getElementById('edit-usuario-contraseña').value = user.contraseña;
      document.getElementById('edit-usuario-rol').value = user.id_rol;

      console.log(user);

      // Mostrar el modal de edición (si aplica)
      // const modal = new bootstrap.Modal(document.getElementById('modalEdit'));
      // modal.show();
    })
    .catch(err => {
      console.log('Error: ', err);
      alert('Ocurrió un error al obtener los datos del usuario');
    });
}
const guardarCambiosUsuarios = () => {
  const id = document.getElementById('edit-id-usuario').value.trim();
  const nombre = document.getElementById('edit-nombre-usuario').value.trim();
  const apellido = document.getElementById('edit-apellido-usuario').value.trim();
  const edad = document.getElementById('edit-edad-usuario').value.trim();
  const sexo = document.querySelector('input[name="edit-sexo-usuario"]:checked').value;
  const usuario = document.getElementById('edit-usuario-username').value.trim();
  const contraseña = document.getElementById('edit-usuario-contraseña').value.trim();
  const rol = document.getElementById('edit-usuario-rol').value.trim();
  const data = {
    id_usuario: id,
    nombre: nombre,
    apellido: apellido,
    edad: edad,
    sexo: sexo,
    usuario: usuario,
    contraseña: contraseña,
    id_rol: rol
  };
  console.log(data)
  if (nombre === "" || apellido === "" || edad === "" || sexo === "" || usuario === "" || contraseña === "" || rol === "") {
    alert("Por favor, complete todos los campos");
    return;
  }
  // devuelve true si no es un numero y false si lo es 
  if (isNaN(edad)) {
    alert("La edad debe contener solo números");
    return;
  } else {
    if (edad < 0) {
      alert("Debes ingresar un numero positivo")
      return
    }
  }
  // devuelve true si es un numero y false si no lo es 


  if (nombre.length < 3 || apellido.length < 3) {
    alert("El nombre y apellido deben tener al menos 3 caracteres");
    return;
  }

  if (usuario.length < 6 || contraseña.length < 8) {
    alert("El usuario y contraseña deben tener al menos 6 y 8 caracteres, respectivamente");
    console.log(usuario, contraseña)
    return;
  }
  for (var i = 0; i < nombre.length; i++) {
    if (!isNaN(nombre.charAt(i))) {
      alert("El nombre debe contener solo letras");
      return;
    }
  }
  for (var i = 0; i < apellido.length; i++) {
    if (!isNaN(apellido.charAt(i))) {
      alert("El apellido debe contener solo letras");
      return;
    }
  }

  // Validar que el usuario no contenga números
  for (var i = 0; i < usuario.length; i++) {
    if (!isNaN(usuario.charAt(i))) {
      alert("El usuario debe contener solo letras");
      return;
    }
  }

  axios.put(`http://127.0.0.1:3000/update/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    }
  })
    .then(function (response) {
      cargarUsuarios();
      alert(response.data.informacion);


    })
    .catch(err => console.log('Error: ', err));
}
// Tareas
const cargarTareas = () => {

  const tbodyt = document.querySelector('#taskTable tbody'); // Seleccionar el tbody de la tabla

  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/get_all_tasks',

  }).then(function (response) {
    //     tbodyt.innerHTML = "";

    //     // console.log(response)
    //     for (let i = 0; i < response.data.length; i++) {

    //       let nuevaFila = tbodyt.insertRow(tablaTareas.lenght);


    //       cell0 = nuevaFila.insertCell(0);
    //       cell0.innerHTML = response.data[i].id_tarea; /// primer elemento

    //       cell1 = nuevaFila.insertCell(1);
    //       cell1.innerHTML = response.data[i].descripcion; /// segundo elemento

    //       cell2 = nuevaFila.insertCell(2);
    //       cell2.innerHTML = response.data[i].fecha_asignacion;  /// tercer elemento

    //       cell3 = nuevaFila.insertCell(3);
    //       cell3.innerHTML = response.data[i].estado;  /// tercer elemento

    //       cell4 = nuevaFila.insertCell(4);
    //       cell4.innerHTML = response.data[i].nombres;  /// tercer elemento

    //       cell8 = nuevaFila.insertCell(5);
    //       cell8.innerHTML = `<a class="bi bi-pencil-square btn btn-warning mx-5" data-bs-toggle="modal" data-bs-target="#modalEditTarea" onClick="editarTareas(this)"></a>
    // `;

    //     }
    //     initDataTable("#taskTable", dataTableOptionsTareas);

    const tabla = $('#taskTable').DataTable(); // Acceder a la tabla DataTable
    tabla.clear(); // Limpiar las filas actuales de DataTables

    response.data.forEach(tarea => {
      tabla.row.add([
        tarea.id_tarea,
        tarea.descripcion,
        tarea.fecha_asignacion,
        tarea.estado,
        tarea.nombres,
        `<a class="bi bi-pencil-square btn btn-warning mx-5" data-bs-toggle="modal" data-bs-target="#modalEditTarea" onClick="editarTareas(this)"></a>`
      ]).draw(false);  // Añadir la fila y redibujar
    });


  }).catch(err => console.log('Error: ', err))
}
var id_tareasGlobal;
const editarTareas = (button) => {
  // Obtener la fila correspondiente al botón clicado
  const row = button.parentNode.parentNode;
  let fila_id_tareas = row.cells[0].innerText; // Capturar el ID de la tarea
  let usuario = row.cells[4].innerText; // Capturar el nombre del usuario

  // Hacer la solicitud GET para obtener los detalles de la tarea
  axios.get(`http://127.0.0.1:3000/get_user_tasks/${fila_id_tareas}`, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // Si usas autenticación con tokens
    }
  })
    .then(response => {
      // Asumiendo que `response.data` es una lista, tomamos el primer elemento
      const report = response.data[0];

      if (report) {
        // Asignar los valores obtenidos a los campos de un formulario de edición
        document.getElementById('id-tarea').value = report.id_tareas;  // Usar 'id_tareas' según la estructura de tu tabla
        let select = document.getElementById('edit-estado').value;
        select = report.estado;
        document.getElementById('edit-descripcion').value = report.descripcion;
        document.getElementById('edit-fecha_asignacion').value = report.fecha_asignacion;
        document.getElementById('edit-buscar').value = usuario;
        idUsuarioSeleccionado = report.id_usuario

        // Mostrar información en la consola para verificar
        console.log(`id_tareas: ${report.id_tareas}, descripcion: ${report.descripcion}, fecha de asignacion: ${report.fecha_asignacion}, estado: ${report.estado}, id_usuario: ${report.id_usuario}`);
      } else {
        alert('No se encontró la tarea.');
      }
    })
    .catch(err => {
      console.log('Error: ', err);
      alert('Ocurrió un error al obtener los datos del reporte');
    });
};

const guardarCambiosTareas = () => {
  const id = document.getElementById('id-tarea').value;
  const descripcion = document.getElementById('edit-descripcion').value;
  const fecha_asignacion = document.getElementById('edit-fecha_asignacion').value;
  const estado = document.getElementById('edit-estado').value;
  const id_usuario = idUsuarioSeleccionado;
  console.log(id, descripcion, fecha_asignacion, estado, id_usuario)
  if (descripcion === "") {
    alert("Por favor, ingrese una descripción");
    return;
  }

  if (fecha_asignacion === "") {
    alert("Por favor, ingrese una fecha de asignación");
    return;
  }

  if (estado === "") {
    alert("Por favor, seleccione un estado");
    return;
  }

  if (!id_usuario) {
    alert("Por favor, seleccione un usuario");
    return;
  }
  axios({
    method: 'PUT',
    url: `http://127.0.0.1:3000/editar_tarea/${id}`,
    data: {
      descripcion: descripcion,
      fecha_asignacion: fecha_asignacion,
      estado: estado,
      id_usuario: id_usuario
    },

    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    }
  })
    .then(function (response) {
      alert(response.data.informacion);

      cargarTareas();
    })
    .catch(err => console.log('Error: ', err));

}

const agregarTareas = (event) => {
  event.preventDefault();
  const descripcion = document.getElementById('descripcion').value.trim();
  const fecha_asignacion = document.getElementById('fecha_asignacion').value.trim();
  const estado = document.getElementById('estado').value;
  let id_usuario = idUsuarioSeleccionado;

  console.log(descripcion);
  console.log(fecha_asignacion);
  console.log(estado);
  console.log(id_usuario);

  if (descripcion === "") {
    alert("Por favor, ingrese una descripción");
    return;
  }

  if (fecha_asignacion === "") {
    alert("Por favor, ingrese una fecha de asignación");
    return;
  }

  if (estado === "") {
    alert("Por favor, seleccione un estado");
    return;
  }

  if (!id_usuario) {
    alert("Por favor, seleccione un usuario");
    return;
  }

  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/agregar_tarea',
    data: {
      descripcion: descripcion,
      fecha_asignacion: fecha_asignacion,
      estado: estado,
      id_usuario: id_usuario
    },
  }
  ).then(function (response) {
    alert("Tarea Agregada ")
    cargarTareas()
    formTareas.reset();
  }).catch(err => console.log('Error: ', err))
}
//Mi Granja
// Lotes
const cargarLote = () => {
  const tbody = document.querySelector('#tabla-lote tbody'); // Seleccionar el tbody de la tabla

  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/getLotes',

  }).then(function (response) {

    const tabla = $('#tabla-lote').DataTable(); // Acceder a la tabla DataTable
    tabla.clear(); // Limpiar las filas actuales de DataTables

    response.data.forEach(lotes => {
      tabla.row.add([
        lotes.id_lote,
        lotes.num_aves,
        lotes.fecha_ingreso,
        lotes.id_galpon,
        `<a class="bi bi-pencil-square btn btn-warning mx-5 " data-bs-toggle="modal" data-bs-target="#modalEditLote"  onClick="editarLote(this)"></a>`
      ]).draw(false);  // Añadir la fila y redibujar
    });



  }).catch(err => console.log('Error: ', err))
}
const agregarLote = (event) => {
  event.preventDefault();
  const id_galpon = document.getElementById('id_galpon').value.trim();
  const fecha_ingreso = document.getElementById('fecha_ingreso').value.trim();
  const num_aves_lote = document.getElementById('num_aves_lote').value.trim();

  // Validaciones
  if (!num_aves_lote) {
    alert('Debe ingresar un número de aves');
    return;
  }
  if (isNaN(num_aves_lote) || num_aves_lote < 0) {
    alert("El número de aves debe contener solo números positivos");
    return;
  }
  if (!fecha_ingreso) {
    alert('Debe ingresar una fecha de ingreso');
    return;
  }
  if (!id_galpon) {
    alert('Debe seleccionar un galpón');
    return;
  }
  if (isNaN(id_galpon) || id_galpon < 0) {
    alert("El galpón debe contener solo números positivos");
    return;
  }


  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/add_lote',
    data: {
      id_galpon: id_galpon,
      fecha_ingreso: fecha_ingreso,
      num_aves: num_aves_lote
    },
  }
  ).then(function (response) {
    alert("Lote Agregado ")
    formLote.reset();
  }).catch(err => console.log('Error: ', err))
}
const editarLote = (button) => {
  const row = button.parentNode.parentNode;
  const id_lote = row.cells[0].innerText;
  const num_aves_lote = row.cells[1].innerText;
  const fecha_ingreso = row.cells[2].innerText;
  const id_galpon = row.cells[3].innerText;

  document.getElementById('edit-id_lote').value = id_lote;
  document.getElementById('edit-num_aves_lote').value = num_aves_lote;
  document.getElementById('edit-fecha_ingreso').value = fecha_ingreso;
  document.getElementById('edit-id_galpon').value = id_galpon;

}
const guardarCambiosLote = () => {
  const id_lote = document.getElementById("edit-id_lote").value;
  const num_aves_lote = document.getElementById('edit-num_aves_lote').value;
  const fecha_ingreso = document.getElementById('edit-fecha_ingreso').value;
  const id_galpon = document.getElementById('edit-id_galpon').value;
  if (!num_aves_lote) {
    alert('Debe ingresar un número de aves');
    return;
  }
  if (isNaN(num_aves_lote) || num_aves_lote < 0) {
    alert("El número de aves debe contener solo números positivos");
    return;
  }
  if (!fecha_ingreso) {
    alert('Debe ingresar una fecha de ingreso');
    return;
  }
  if (!id_galpon) {
    alert('Debe seleccionar un galpón');
    return;
  }
  if (isNaN(id_galpon) || id_galpon < 0) {
    alert("El galpón debe contener solo números positivos");
    return;
  }
  axios({
    method: 'PUT',
    url: `http://127.0.0.1:3000/editar_lote/${id_lote}`,
    data: {
      num_aves: num_aves_lote,
      fecha_ingreso: fecha_ingreso,
      id_galpon: id_galpon
    },
    // headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}`
    //   }
  })
    .then(function (response) {
      alert("Lote actualizado correctamente");
      cargarLote();
    })
    .catch(err => console.log('Error: ', err));
}

// Galpones
const agregarGalpon = (event) => {
  event.preventDefault();
  const capacidad = document.getElementById('capacidadgal').value;
  const numAves = document.getElementById('numaves').value;
  if (!capacidad) {
    alert('Debe ingresar la capacida del galpon');
    return;
  }
  if (isNaN(capacidad) || capacidad < 0) {
    alert("Este campo debe contener solo números positivos");
    return;
  }
  if (!numAves) {
    alert('Debe ingresar el numero de aves del galpón');
    return;
  }
  if (isNaN(numAves) || numAves < 0) {
    alert("Este campo debe contener solo números positivos");
    return;
  }

  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/add_galpon',
    data: {
      capacidad: capacidad,
      aves: numAves
    },
  }
  ).then(function (response) {
    alert("Galpon Agregado ")
    formGalpon.reset();
  }).catch(err => console.log('Error: ', err))
}
const cargarGalpones = () => {
  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/getGalpones',

  }).then(function (response) {

    const tabla = $('#tabla-galpones').DataTable(); // Acceder a la tabla DataTable
    tabla.clear(); // Limpiar las filas actuales de DataTables

    response.data.forEach(galpon => {
      tabla.row.add([
        galpon.id_galpon,
        galpon.capacidad,
        galpon.aves,
        `<a class="bi bi-pencil-square btn btn-warning mx-5 " data-bs-toggle="modal" data-bs-target="#modalEditGalpon"  onClick="editarGalpon(this)"></a>`
      ]).draw(false);  // Añadir la fila y redibujar
    });
  }).catch(err => console.log('Error: ', err))
}
const editarGalpon = (button) => {
  const row = button.parentNode.parentNode;
  const id_galpon = row.cells[0].innerText;
  const capacidad = row.cells[1].innerText;
  const num_aves = row.cells[2].innerText;

  document.getElementById('edit-idgalpon').value = id_galpon;
  document.getElementById('edit-capacidad').value = capacidad;
  document.getElementById('edit-num_aves').value = num_aves;

}
const guardarCambiosGalpon = () => {
  const id_galpon = document.getElementById('edit-idgalpon').value;
  const capacidad = document.getElementById('edit-capacidad').value;
  const num_aves = document.getElementById('edit-num_aves').value;
  if (!capacidad) {
    alert('Debe ingresar la capacida del galpon');
    return;
  }
  if (isNaN(capacidad) || capacidad < 0) {
    alert("solo se admiten números positivos");
    return;
  }
  if (!num_aves) {
    alert('Debe ingresar el numero de aves del galpón');
    return;
  }
  if (isNaN(num_aves) || num_aves < 0) {
    alert("solo se admiten números positivos");
    return;
  }
  axios({
    method: 'PUT',
    url: `http://127.0.0.1:3000/editar_galpon/${id_galpon}`,
    data: {
      capacidad: capacidad,
      aves: num_aves
    },
    // headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}`
    //   }
  })
    .then(function (response) {
      alert("Galpon actualizado correctamente");
      cargarGalpones();
    })
    .catch(err => console.log('Error: ', err));
}
const buscarUsuarioEdit = async () => {

  const busqueda = inputEditBuscar.value.trim();

  try {
    const response = await axios.get(`/buscar_usuario/${busqueda}`);
    const userData = response.data;

    if (userData.informacion === 'Usuario no encontrado') {
      alert('Usuario no encontrado');
    } else {
      console.log(userData);

      // Display the search results in the table
      const tablaBuscar = document.getElementById('div-edit-buscar');
      const tbody = tablaBuscar.querySelector('tbody');
      tbody.innerHTML = '';

      userData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id_usuario}</td>
          <td>${user.nombres}</td>
          <td>${user.apellidos}</td>                
          <td><a onclick="editSeleccionar(this)" class="btn btn-success">Seleccionar</a> </td>
        `;
        tbody.appendChild(row);
      });
      initDataTable("#tabla-edit-buscar", dataTableOptionsTablaEditBuscar);

      tablaBuscar.classList.remove("collapse")
    }
  } catch (error) {
    console.error(error);
    alert('Error al buscar usuario');
  }
}

const buscarUsuario = async () => {

  const busqueda = inputBuscar.value.trim();

  try {
    const response = await axios.get(`/buscar_usuario/${busqueda}`);
    const userData = response.data;

    if (userData.informacion === 'Usuario no encontrado') {
      alert('Usuario no encontrado');
    } else {
      console.log(userData);

      // Display the search results in the table
      let tablaBuscardiv = document.getElementById("cont-tabla");

      const tablaBuscar = document.getElementById('tabla-buscar');
      const tbody = tablaBuscar.querySelector('tbody');
      tbody.innerHTML = '';

      userData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${user.id_usuario}</td>
          <td>${user.nombres}</td>
          <td>${user.apellidos}</td>                
          <td><a onclick="Seleccionar(this)" class="btn btn-success">Seleccionar</a> </td>
        `;
        tbody.appendChild(row);
      });
      initDataTable("#tabla-buscar", dataTableOptionsTablaBuscar);

      tablaBuscardiv.classList.remove("collapse")
    }
  } catch (error) {
    console.error(error);
    alert('Error al buscar usuario');
  }
}

const Seleccionar = (elemento) => {
  const fila = elemento.parentNode.parentNode;
  const idUsuario = fila.cells[0].textContent;
  idUsuarioSeleccionado = idUsuario;

  console.log('ID de usuario seleccionado:', idUsuarioSeleccionado);
  tablaBuscar.classList.add("collapse")
}
const editSeleccionar = (elemento) => {
  const fila = elemento.parentNode.parentNode;
  const idUsuario = fila.cells[0].textContent;


  idUsuarioSeleccionado = idUsuario;
  console.log('ID de usuario seleccionado:', idUsuarioSeleccionado);
  edittablaBuscar.classList.add("collapse")
}
const logout = () => {
  fetch('/logout', {
    method: 'POST',
    credentials: 'include' // Include cookies in the request
  })
    .then(response => response.json())
    .then(data => {
      console.log('Logged out successfully!');
      window.location.href = '/login';
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
}
function actualizarDataTable(tabla) {
  tabla.DataTable().draw();
}
document.addEventListener('DOMContentLoaded', function () {
  cargarUsuarios();
  cargarTareas();
  cargarLote()
  cargarGalpones();
});

const inputBuscar = document.getElementById('buscar');
const edit_input_Buscar = document.getElementById('edit-buscar');
const inputB = (div_id) => {
  div_id.classList.add("collapse")
}
let tablaBuscar = document.getElementById("cont-tabla");
let edittablaBuscar = document.getElementById("div-edit-buscar");
inputBuscar.addEventListener("click", () => inputB(tablaBuscar));
edit_input_Buscar.addEventListener("click", () => inputB(edittablaBuscar));
const btnBuscar = document.getElementById('btn-buscar');
const inputEditBuscar = document.getElementById('edit-buscar');
const btnEditBuscar = document.getElementById('btn-edit-buscar');
btnBuscar.addEventListener('click', buscarUsuario)
btnEditBuscar.addEventListener('click', buscarUsuarioEdit)
document.getElementById('salir').addEventListener('click', logout);
formAdd.addEventListener("submit", agregarUsuarios);
formTareas.addEventListener("submit", agregarTareas);
formLote.addEventListener("submit", agregarLote);
formGalpon.addEventListener("submit", agregarGalpon);
// DataTables options
let dataTables = {};  // Para almacenar las instancias de DataTables por cada tabla
let dataTableIsInitialized = {};
const dataTableOptions = {
  lengthMenu: [10, 15, 20, 100, 200, 500],
  pageLength: 10,
  destroy: true,
  language: {
    lengthMenu: "Mostrar _MENU_ registros por página",
    zeroRecords: "Ningún usuario encontrado",
    info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
    infoEmpty: "Ningún usuario encontrado",
    infoFiltered: "(filtrados desde _MAX_ registros totales)",
    loadingRecords: "Cargando...",
    paginate: {
      first: "Primero",
      last: "Último",
      next: "Siguiente",
      previous: "Anterior"
    }
  },
  searching: false, // Remove search functionality
  ordering: false // Make columns non-orderable
};

const dataTableOptionsUsuarios = {
  ...dataTableOptions,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] }
  ]
};

const dataTableOptionsTareas = {
  ...dataTableOptions,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3, 4] }
  ]
};

const dataTableOptionsLote = {
  ...dataTableOptions,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3] }
  ]
};

const dataTableOptionsGalpones = {
  ...dataTableOptions,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2] }
  ]
};
const initDataTable = (selector, options) => {
  if (dataTableIsInitialized[selector]) {
    dataTables[selector].destroy();
  }

  dataTables[selector] = $(selector).DataTable(options);
  dataTableIsInitialized[selector] = true;
};
const dataTableOptionsTablaBuscar = {
  ...dataTableOptions,
  searching: false,
  ordering: false,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3] }
  ]
};
const dataTableOptionsTablaEditBuscar = {
  ...dataTableOptions,
  searching: false,
  ordering: false,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3] }
  ]
};

