        const ctxUsuarios = document.getElementById('chartUsuarios').getContext('2d');
        const chartUsuarios = new Chart(ctxUsuarios, {
            type: 'pie',
            data: {
                labels: [], 
                datasets: [{
                    label: 'Número de Usuarios',
                    data: [], 
                    backgroundColor: [
                        'rgba(169, 223, 191)',
                        'rgba(169, 204, 227 )',
                        'rgba(240, 178, 122)'
                      ],
                      borderColor: [
                        'rgba(39, 174, 96)',
                        'rgba(84, 153, 199)', 
                        'rgba(220, 118, 51)'  
                      ],
                      
                    borderWidth: 2
                }]
            },
            options: {

            }
        });

       
        fetch('http://127.0.0.1:3000/getAll'
            ,{
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(response => response.json())
            .then(datos => mostrarUsuarios(datos))
            .catch(error => console.log('Error:', error));

        function mostrarUsuarios(data) {
            const conteoPorRol = {};

            data.forEach(usuario => {
                if (conteoPorRol[usuario.tipo_usuario]) {
                    conteoPorRol[usuario.tipo_usuario]++;
                } else {
                    conteoPorRol[usuario.tipo_usuario] = 1;
                }
            });

            chartUsuarios.data.labels = Object.keys(conteoPorRol);
            chartUsuarios.data.datasets[0].data = Object.values(conteoPorRol);
            chartUsuarios.update();
        }





        const ctxHuevos = document.getElementById('chartHuevos').getContext('2d');
        const chartHuevos = new Chart(ctxHuevos, {
            type: 'line',
            data: {
                labels: [], 
                datasets: [{
                    label: 'Huevos recolectados',
                    data: [], 
                    backgroundColor: 'rgba( 255, 213, 79 )',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        fetch('http://127.0.0.1:3000/estadisticas_huevos',{
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(datos => mostrarHuevos(datos))
            .catch(error => console.log('Error:', error));


function mostrarHuevos(data) {
    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    chartHuevos.data.labels = data.map(item => formatearFecha(item.fecha));
    chartHuevos.data.datasets[0].data = data.map(item => item.total_huevos);
    chartHuevos.update();
}




// Crear el gráfico de aves inicialmente vacío
const ctxAves = document.getElementById('chartAves').getContext('2d');
const chartAves = new Chart(ctxAves, {
    type: 'bar',
    data: {
        labels: [], // Etiquetas para los galpones
        datasets: [{
            label: 'Número de Aves por Galpón',
            data: [], // Datos del número de aves por galpón
            backgroundColor: 'rgba(171, 235, 198 , 0.5)',
            borderColor: 'rgba(39, 174, 96)',
            borderWidth: 2
        }]
    },
    options: {
        
        scales: {
            y: {
                beginAtZero: true
            }
        }
    
    }
});

// Fetch los datos de la API para aves
fetch('http://127.0.0.1:3000/estadisticas_aves',
    {headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
    }}
)
    .then(response => response.json())
    .then(datos => mostrarAves(datos))
    .catch(error => console.log('Error:', error));

// Función para procesar y mostrar los datos de aves en el gráfico
function mostrarAves(data) {
    // Actualizar el gráfico con los datos procesados
    chartAves.data.labels = data.map(item => `Galpón ${item.id_galpon}`);
    chartAves.data.datasets[0].data = data.map(item => item.total_aves);
    chartAves.update();
}



// Crear el gráfico de lotes y aves inicialmente vacío
const ctxLotesAves = document.getElementById('chartLote').getContext('2d');
const chartLotesAves = new Chart(ctxLotesAves, {
    type: 'doughnut',
    data: {
        labels: [], // Etiquetas para los galpones
        datasets: [
            
            {
                label: 'Número de Lotes',
                data: [], // Datos del número de lotes por galpón
                backgroundColor: 'rgba(245, 183, 177)',
                borderColor: 'rgba(192, 57, 43)',
                borderWidth: 2
            },
            {
                label: 'Número de Aves',
                data: [], // Datos del número total de aves por galpón
                backgroundColor: 'rgba(248, 196, 113,0.5)',
                borderColor: 'rgba(220, 118, 51)',
                borderWidth: 2
            }
        ]
    },
    options: {
        // indexAxis: 'y',

        // scales: {
        //     y: {
        //         beginAtZero: true
        //     }
        // }
    }
});

// Fetch los datos de la API para lotes
fetch('http://127.0.0.1:3000/estadisticas_lotes',{
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
    }
})
    .then(response => response.json())
    .then(datos => mostrarLotesAves(datos))
    .catch(error => console.log('Error:', error));

// Función para procesar y mostrar los datos de lotes y aves en el gráfico
function mostrarLotesAves(data) {
    // Actualizar el gráfico con los datos procesados
    chartLotesAves.data.labels = data.map(item => `Galpón ${item.id_galpon}`);
    chartLotesAves.data.datasets[0].data = data.map(item => item.numero_lotes);
    chartLotesAves.data.datasets[1].data = data.map(item => item.total_aves);
    chartLotesAves.update();
}


// Crear el gráfico de tareas pendientes por usuario inicialmente vacío
const ctxTareas = document.getElementById('chartTareas').getContext('2d');
const chartTareas = new Chart(ctxTareas, {
    type: 'bar',
    data: {
        labels: [], // Etiquetas para los usuarios
        datasets: [{
            label: 'Número de Tareas Pendientes',
            data: [], // Datos del número de tareas pendientes por usuario
            backgroundColor: 'rgba(232, 218, 239 ,0.5)',
            borderColor: 'rgba(108, 52, 131 )',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Fetch los datos de la API para tareas
fetch('http://127.0.0.1:3000/estadisticas_tareas',{
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
    }
})
    .then(response => response.json())
    .then(datos => mostrarTareas(datos))
    .catch(error => console.log('Error:', error));

// Función para procesar y mostrar los datos de tareas en el gráfico
function mostrarTareas(data) {
    // Actualizar el gráfico con los datos procesados
    chartTareas.data.labels = data.tareas_pendientes.map(item => item.nombres);
    chartTareas.data.datasets[0].data = data.tareas_pendientes.map(item => item.tareas_pendientes);
    chartTareas.update();
}


// Crear el gráfico de clima inicialmente vacío
// const ctxClima = document.getElementById('chartClima').getContext('2d');
// const chartClima = new Chart(ctxClima, {
//     type: 'scatter',
//     data: {
//         labels: [], // Etiquetas para los galpones
//         datasets: [
//             {
//                 label: 'Promedio de Temperatura',
//                 data: [], // Datos del promedio de temperatura por galpón
//                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 borderWidth: 1
//             },
//             {
//                 label: 'Promedio de Humedad',
//                 data: [], // Datos del promedio de humedad por galpón
//                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }
//         ]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

// // Fetch los datos de la API para clima
// fetch('http://127.0.0.1:3000/estadisticas_clima')
//     .then(response => response.json())
//     .then(datos => mostrarClima(datos))
//     .catch(error => console.log('Error:', error));

// // Función para procesar y mostrar los datos de clima en el gráfico
// function mostrarClima(data) {
//     // Actualizar el gráfico con los datos procesados
//     chartClima.data.labels = data.promedio_clima.map(item => `Galpón ${item.id_galpon}`);
//     chartClima.data.datasets[0].data = data.promedio_clima.map(item => item.promedio_temperatura);
//     chartClima.data.datasets[1].data = data.promedio_clima.map(item => item.promedio_humedad);
//     chartClima.update();
// }

// Crear el gráfico de diagnósticos inicialmente vacío
const ctxDiagnosticos = document.getElementById('chartDiagnosticos').getContext('2d');
const chartDiagnosticos = new Chart(ctxDiagnosticos, {
    type: 'bar',
    data: {
        labels: [], // Etiquetas para los diagnósticos
        datasets: [{
            label: 'Diagnosticos Frecuentes',
            data: [], // Datos de la frecuencia de diagnósticos
            backgroundColor: 'rgba(239, 83, 80 , 0.5)',
            borderColor: 'rgba(239, 83, 80)',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Fetch los datos de la API para diagnósticos
fetch('http://127.0.0.1:3000/diagnosticos_vt',
    {headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
    }}
)
    .then(response => response.json())
    .then(datos => mostrarDiagnosticos(datos))
    .catch(error => console.log('Error:', error));

// Función para procesar y mostrar los datos de diagnósticos en el gráfico
function mostrarDiagnosticos(data) {
    // Actualizar el gráfico con los datos procesados
    chartDiagnosticos.data.labels = data.map(item => item.diagnostico);
    chartDiagnosticos.data.datasets[0].data = data.map(item => item.frecuencia);
    chartDiagnosticos.update();
}
