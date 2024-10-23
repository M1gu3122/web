const token = localStorage.getItem("token")
function parseJwt(token) {
  const base64Url = token.split('.')[1]; // Obtener la parte del payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazos para el formato base64
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload); // Convertir a objeto JSON
}
const userInfo = parseJwt(token);
console.log(userInfo); // Aquí estará la información del usuario (id, rol, etc.)
let info =document.getElementById("info")
info.innerHTML=`Bienvenid@ : ${userInfo.usuario}`
var idUsuarioSeleccionado = null;
var formReporte = document.getElementById("form-reportes")
document.getElementById('logoutButton').addEventListener('click', function () {
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
});

const agregarReporte = (event) => {
    event.preventDefault();
    const id_usuario = idUsuarioSeleccionado;
    const fecha_registro = document.getElementById('fecha-registro').value.trim();
    const id_lote = document.getElementById('id-lote').value.trim();
    const estado_general = document.getElementById('estado-general').value.trim();
    const diagnostico = document.getElementById('diagnostico').value.trim();
    const tratamiento_prescrito = document.getElementById('t-prescrito').value.trim();
    const dosis = document.getElementById('dosis').value.trim();
    const frecuencia = document.getElementById('frecuencia-tratamiento').value.trim();
    const fecha_inicio_tratamiento = document.getElementById('fecha-inicio-tratamiento').value.trim();
    const fecha_fin_tratamiento = document.getElementById('fecha-fin-tratamiento').value.trim();
    // Verificar que los campos estén completos
    if (!id_usuario || !fecha_registro || !id_lote || !estado_general || !diagnostico || !tratamiento_prescrito || !dosis || !frecuencia || !fecha_inicio_tratamiento || !fecha_fin_tratamiento) {
        alert('Debe completar todos los campos');
        return;
    }

    // Verificar que el ID del usuario sea válido
    if (isNaN(id_usuario) || id_usuario < 0) {
        alert('El ID del usuario es inválido');
        return;
    }

    // Verificar que las fechas sean válidas
    const fechaInicio = new Date(fecha_inicio_tratamiento);
    const fechaFin = new Date(fecha_fin_tratamiento);
    if (isNaN(fechaInicio) || isNaN(fechaFin) || fechaInicio > fechaFin) {
        alert('Las fechas de inicio y fin de tratamiento son inválidas');
        return;
    }

    axios({
        method: 'POST',
        url: 'http://localhost:3000/crear_reporte',
        data: {
            id_usuario: idUsuarioSeleccionado,
            fecha_registro: fecha_registro,
            id_lote: id_lote,
            estado_general: estado_general,
            diagnostico: diagnostico,
            tratamiento_prescrito: tratamiento_prescrito,
            dosis: dosis,
            frecuencia_tratamiento: frecuencia,
            fecha_inicio_tratamiento: fecha_inicio_tratamiento,
            fecha_fin_tratamiento: fecha_fin_tratamiento
        },
    }).then(function (response) {
        alert("Registro exitoso");
        formReporte.reset()
        cargarReportes();
    }).catch(err => console.log('Error: ', err))
}
const cargarReportes = () => {
    // const tabla = document.getElementById("tabla-reportes");
    // const tbodyt = document.querySelector('#tabla-reportes tbody'); // Seleccionar el tbody de la tabla
    let fechaRegistro;

    axios({
        method: 'GET',
        url: 'http://localhost:3000/obtener_reportes',
    }).then(function (response) {
        // }
        const tabla = $('#tabla-reportes').DataTable(); // Acceder a la tabla DataTable
        tabla.clear(); // Limpiar las filas actuales de DataTables
        
        response.data.forEach(item => {
            // Formatear la fecha en "YYYY-MM-DD"
            const fechaRegistro = new Date(item.fecha_registro).toISOString().split('T')[0]; 

            tabla.row.add([
                item.id_reporte, // primer elemento
                item.id_lote,    // segundo elemento
                fechaRegistro,    // fecha formateada
                item.nombre,      // tercer elemento
                `<a class="bi bi-pencil-square btn btn-warning mx-5" data-bs-toggle="modal" data-bs-target="#editModal" onClick="editReportes(this)"></a>`
            ]).draw(); // Agregar la fila y actualizar la tabla
        });

    }).catch(err => console.log('Error: ', err));
}
const editReportes = (button) => {
    const row = button.parentNode.parentNode;
    const id = row.cells[0].innerText;
    const nombre = row.cells[3].innerText;

    // Llamada a Axios para obtener el reporte
    axios.get(`http://127.0.0.1:3000/get_report/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            const report = response.data;

            // Asignar los valores del reporte a los campos del formulario
            document.getElementById('edit-id-reporte').value = report.id_reporte;
            // document.getElementById('edit-id-usuario').value = report.id_usuario;
            document.getElementById('edit-buscar').value = nombre;
            document.getElementById('edit-fecha-registro').value = report.fecha_registro;
            document.getElementById('edit-id-lote').value = report.id_lote;
            document.getElementById('edit-estado-general').value = report.estado_general;
            document.getElementById('edit-diagnostico').value = report.diagnostico;
            document.getElementById('edit-t-prescrito').value = report.tratamiento_prescrito;
            document.getElementById('edit-dosis').value = report.dosis;
            document.getElementById('edit-frecuencia-tratamiento').value = report.frecuencia_tratamiento;
            document.getElementById('edit-fecha-inicio-tratamiento').value = report.fecha_inicio_tratamiento;
            document.getElementById('edit-fecha-fin-tratamiento').value = report.fecha_fin_tratamiento;

            console.log(report);

            // Cargar reportes después de obtener los datos
            cargarReportes();
        })
        .catch(err => {
            console.log('Error: ', err);
            alert('Ocurrió un error al obtener los datos del reporte');
        });
}

const guardarCambiosReportes = () => {
    const id_reporte = document.getElementById('edit-id-reporte').value;
    const id_usuario = idUsuarioSeleccionado;
    const fecha_registro = document.getElementById('edit-fecha-registro').value;
    const id_lote = document.getElementById('edit-id-lote').value;
    const estado_general = document.getElementById('edit-estado-general').value;
    const diagnostico = document.getElementById('edit-diagnostico').value;
    const tratamiento_prescrito = document.getElementById('edit-t-prescrito').value;
    const dosis = document.getElementById('edit-dosis').value;
    const frecuencia_tratamiento = document.getElementById('edit-frecuencia-tratamiento').value;
    const fecha_inicio_tratamiento = document.getElementById('edit-fecha-inicio-tratamiento').value;
    const fecha_fin_tratamiento = document.getElementById('edit-fecha-fin-tratamiento').value;
    axios({
        method: 'PUT',
        url: `http://127.0.0.1:3000/actualizar_reporte/${id_reporte}`,
        data: {
            id_usuario: id_usuario,
            fecha_registro: fecha_registro,
            id_lote: id_lote,
            estado_general: estado_general,
            diagnostico: diagnostico,
            tratamiento_prescrito: tratamiento_prescrito,
            dosis: dosis,
            frecuencia_tratamiento: frecuencia_tratamiento,
            fecha_inicio_tratamiento: fecha_inicio_tratamiento,
            fecha_fin_tratamiento: fecha_fin_tratamiento
        },
        // headers: {
        //     'Content-Type': 'application/json',
        //     // 'Authorization': `Bearer ${token}`
        //   }
    })
        .then(function (response) {
            alert("Reporte actualizado correctamente");
            cargarReportes()
        })
        .catch(err => console.log('Error: ', err));
}
const inputBuscar = document.getElementById('buscar');
const btnBuscar = document.getElementById('btn-buscar');
const inputEditBuscar = document.getElementById('edit-buscar');
const btnEditBuscar = document.getElementById('btn-edit-buscar');
const divBuscar=document.getElementById("div-buscar");
const divEditBuscar=document.getElementById("editDivBuscar");
const inputB = (div_id) => {
    div_id.classList.add("collapse")
  }
  
inputBuscar.addEventListener("click", () => inputB(divBuscar));
inputEditBuscar.addEventListener("click", () => inputB(divEditBuscar));


btnEditBuscar.addEventListener('click', async () => {
    const busqueda = inputEditBuscar.value.trim();

    try {
        const response = await axios.get(`/buscar_usuario_VT/${busqueda}`);
        const userData = response.data;

        if (userData.informacion === 'Usuario no encontrado') {
            alert('Usuario no encontrado');
        } else {
            console.log(userData);

            // Display the search results in the table
            const tablaBuscar = document.getElementById('tabla-edit-buscar');
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
            divEditBuscar.classList.remove("collapse")
        }
    } catch (error) {
        console.error(error);
        alert('Error al buscar usuario');
    }
});
btnBuscar.addEventListener('click', async () => {
    const busqueda = inputBuscar.value.trim();

    try {
        const response = await axios.get(`/buscar_usuario_VT/${busqueda}`);
        const userData = response.data;

        if (userData.informacion === 'Usuario no encontrado') {
            alert('Usuario no encontrado');
        } else {
            console.log(userData);

            // Display the search results in the table
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
            // tablaBuscar.classList.remove("fade")
            divBuscar.classList.remove("collapse")
        }
    } catch (error) {
        console.error(error);
        alert('Error al buscar usuario');
    }
});

const Seleccionar = (elemento) => {
    const fila = elemento.parentNode.parentNode;
    const idUsuario = fila.cells[0].textContent;
    idUsuarioSeleccionado = idUsuario;

    console.log('ID de usuario seleccionado:', idUsuarioSeleccionado);
    divBuscar.classList.add("collapse")
}
const editSeleccionar = (elemento) => {
    const fila = elemento.parentNode.parentNode;
    const idUsuario = fila.cells[0].textContent;


    // document.getElementById('edit-id-usuario').value = idUsuario;
    idUsuarioSeleccionado = idUsuario;
    console.log('ID de usuario seleccionado:', idUsuarioSeleccionado);
    // tablaEditBuscar.classList.add("collapse")
    divEditBuscar.classList.add("collapse")

}
document.addEventListener('DOMContentLoaded', function () {
    cargarReportes();
});


formReporte.addEventListener("submit", agregarReporte)
let dataTables = {};  // Para almacenar las instancias de DataTables por cada tabla
let dataTableIsInitialized = {};
// Configuracion
const dataTableOptions = {
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] },
        { orderable: false, targets: [5, 6] },
        { searchable: false, targets: [1] }
    ],
    pageLength: 10,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};
const initDataTable = (selector, options) => {
    if (dataTableIsInitialized[selector]) {
        dataTables[selector].destroy();
    }

    dataTables[selector] = $(selector).DataTable(options);
    dataTableIsInitialized[selector] = true;
};
const dataTableOptionsReportes = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4] },
        { orderable: false, targets: [4] },
        { searchable: false, targets: [1] }
    ]
};