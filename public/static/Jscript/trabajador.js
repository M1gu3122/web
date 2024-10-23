const token = localStorage.getItem("token")
function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Obtener la parte del payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazos para el formato base64
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // Convertir a objeto JSON
}
let info = document.getElementById("info")
var id_tarea;
var form_huevos = document.getElementById("form-huevos");
var userInfo = parseJwt(token);
info.innerHTML = `Bienvenid@ : ${userInfo.usuario}`
console.log(userInfo); // Aquí estará la información del usuario (id, rol, etc.)
// Tareas Trabajador
const cargarTareas = () => {
    const id_usuario = userInfo.id;
    console.log(id_usuario)
    axios.get(`http://localhost:3000/obtener_tareas_usuario/${id_usuario}`, {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {
            const tabla = $('#taskTable').DataTable(); // Acceder a la tabla DataTable

            tabla.clear(); // Limpiar las filas actuales de DataTables

            response.data.forEach(tarea => {
                tabla.row.add([
                    tarea.id_tareas,
                    tarea.descripcion,
                    tarea.fecha_asignacion,
                    tarea.estado,
                    `<a class=" btn btn-warning mx-5 bi bi-pencil-square" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editEstado(this)" ></a>`
                ]).draw(false);  // Añadir la fila y redibujar
            });

        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}
const editEstado = (button) => {
    const row = button.parentNode.parentNode;
    id_tarea = row.cells[0].innerText;
    const estado = row.cells[3].innerText;
    document.querySelector('#edit-estado').value = estado;

};
const guardarEstado = () => {
    const estado = document.getElementById('edit-estado').value;

    axios({
        method: 'PUT',
        url: `http://127.0.0.1:3000/editar_estado/${id_tarea}`,
        data: {

            estado: estado,

        },
        // headers: {
        //     'Content-Type': 'application/json',
        //     // 'Authorization': `Bearer ${token}`
        //   }
    })
        .then(function (response) {
            alert(response.data.informacion);

            cargarTareas()
        })
        .catch(err => console.log('Error: ', err));
}
// Lotes
const cargarLotes = () => {
    // const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/getLotes', {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {
            const tabla = $('#tabla-lote').DataTable(); // Acceder a la tabla DataTable
            tabla.clear(); // Limpiar las filas actuales de DataTables

            response.data.forEach(lotes => {
                tabla.row.add([
                    lotes.id_lote,
                    lotes.num_aves,
                    lotes.fecha_ingreso,
                    lotes.id_galpon,
                    `<a class=" btn btn-warning mx-5 bi bi-pencil-square" data-bs-toggle="modal" data-bs-target="#modalEditLote" onclick="editLote(this)"></a>`
                ]).draw(false);  // Añadir la fila y redibujar
            });

        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}
const editLote = (button) => {
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
const guardarLote = () => {

    const id_lote = document.getElementById('edit-id_lote').value;
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
            alert(response.data.informacion);

            cargarLotes();
        })
        .catch(err => console.log('Error: ', err));
}
// Huevos
const registroHuevos = (event) => {
    event.preventDefault();
    const cantidad = document.getElementById('cantidad_huevos').value.trim();
    const fecha = document.getElementById('fecha_ingreso').value.trim();
    const idLote = document.getElementById('id_galpon').value.trim();
    if (!cantidad) {
        alert('Debe ingresar una cantidad de huevos');
        return;
    }
    if (isNaN(cantidad) || cantidad < 0) {

        alert("solo se admiten números positivos");

        return;
    }
    if (!fecha_ingreso) {
        alert('Debe ingresar una fecha de ingreso');
        return;
    }
    if (!idLote) {
        alert('Debe seleccionar un lote');
        return;
    }
    if (isNaN(idLote) || idLote < 0) {
        alert("solo se admiten números positivos");


        return;
    }


    axios({
        method: 'POST',
        url: 'http://localhost:3000/add_huevo',
        data: {
            cantidad: cantidad,
            fecha: fecha,
            id_lote: idLote
        },
    }
    ).then(function (response) {
        alert("Registro exitoso ")
        cargarHuevos()
        form_huevos.reset();
    }).catch(err => console.log('Error: ', err))
}
const cargarHuevos = () => {
    // const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/getHuevos', {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {
            const tabla = $('#tabla-huevos').DataTable(); // Acceder a la tabla DataTable
            tabla.clear(); // Limpiar las filas actuales de DataTables

            response.data.forEach(huevos => {
                tabla.row.add([
                    huevos.id_recoleccion,
                    huevos.cantidad,
                    huevos.fecha,
                    huevos.id_lote,
                ]).draw(false);  // Añadir la fila y redibujar
            });


            initDataTable("#tabla-huevos", dataTableOptionsHuevos)

        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}
// const editHuevos = (button) => {
//     const row = button.parentNode.parentNode;
//     const id_galpon = row.cells[0].innerText;
//     const capacidad = row.cells[1].innerText;
//     const num_aves = row.cells[2].innerText;

//     document.getElementById('edit-idgalpon').value = id_galpon;
//     document.getElementById('edit-capacidad').value = capacidad;
//     document.getElementById('edit-num_aves').value = num_aves;

// }
// const guardarHuevos = () => {

//     const id_galpon = document.getElementById('edit-idgalpon').value;
//     const capacidad = document.getElementById('edit-capacidad').value;
//     const num_aves = document.getElementById('edit-num_aves').value;

//     axios({
//         method: 'PUT',
//         url: `http://127.0.0.1:3000/editar_galpon/${id_galpon}`,
//         data: {

//             capacidad: capacidad,
//             aves: num_aves

//         },
//         // headers: {
//         //     'Content-Type': 'application/json',
//         //     // 'Authorization': `Bearer ${token}`
//         //   }
//     })
//         .then(function (response) {
//             alert(response.data.informacion);

//             cargarGalpones()
//         })
//         .catch(err => console.log('Error: ', err));
// }
// Galpones
const cargarGalpones = () => {
    // const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/getGalpones', {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {

            const tabla = $('#tabla-galpones').DataTable(); // Acceder a la tabla DataTable
            tabla.clear(); // Limpiar las filas actuales de DataTables

            response.data.forEach(galpon => {
                tabla.row.add([
                    galpon.id_galpon,
                    galpon.capacidad,
                    galpon.aves,
                `<a class=" btn btn-warning mx-5 bi bi-pencil-square" data-bs-toggle="modal" data-bs-target="#modalEditGalpon" onclick="editGalpon(this)"></a>`
                ]).draw(false);  // Añadir la fila y redibujar
            });

        })
        .catch(function (error) {
            console.error('Error al cargar galpones:', error);
            alert('Ocurrió un error al cargar los galpones');
        });
}
const editGalpon = (button) => {
    const row = button.parentNode.parentNode;
    const id_galpon = row.cells[0].innerText;
    const capacidad = row.cells[1].innerText;
    const num_aves = row.cells[2].innerText;

    document.getElementById('edit-idgalpon').value = id_galpon;
    document.getElementById('edit-capacidad').value = capacidad;
    document.getElementById('edit-num_aves').value = num_aves;

}
const guardarGalpon = () => {

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
            alert(response.data.informacion);

            cargarGalpones()
        })
        .catch(err => console.log('Error: ', err));
}

document.addEventListener('DOMContentLoaded', function () {
    cargarTareas();
    cargarLotes();
    cargarHuevos();
    cargarGalpones();
});

form_huevos.addEventListener("submit", registroHuevos);

// Datatables
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
// Opciones personalizadas para cada tabla
const dataTableOptionsLotes = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4] },
        { orderable: false, targets: [4] },
        { searchable: false, targets: [1] }
    ]
};

const dataTableOptionsTareas = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4] },
        { orderable: false, targets: [4] },
        { searchable: false, targets: [1] }
    ]
};

const dataTableOptionsGalpones = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3] },
        { orderable: false, targets: [3] },
        { searchable: false, targets: [1] }
    ]
};

const dataTableOptionsHuevos = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3] },
        { orderable: false, targets: [3] },
        { searchable: false, targets: [1] }
    ]
};

const initDataTable = (selector, options) => {
    if (dataTableIsInitialized[selector]) {
        dataTables[selector].destroy();
    }

    dataTables[selector] = $(selector).DataTable(options);
    dataTableIsInitialized[selector] = true;
};

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