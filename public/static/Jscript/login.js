const formAdmin = document.getElementById("form-login-admin");
const formTb = document.getElementById("form-login-trabajador");
const formVt = document.getElementById("form-login-veterinario");
const button =  document.getElementById("Button")
// const mensaje =()=>{
//     console.log("hola estas moviendo el mouse ")
// }
// button.addEventListener("mousemove",mensaje)
const loginAdmin = (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuarioAdmin').value.trim();
    const contraseña = document.getElementById('contraseñaAdmin').value.trim();
    if (usuario === "" || contraseña === "") {
        alert("Por favor, complete todos los campos");
        return;
    }

    if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario,
            contraseña: contraseña
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                formAdmin.reset()
                window.location.href = '/administrador';
            } else {
                alert("Credenciales Incorrectas")
                console.error('Error en login');
            }
        })
        .catch(error => console.error('Error en login:', error));
};

const loginTb = (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuarioTrabajador').value.trim();
    const contraseña = document.getElementById('contraseñaTrabajador').value.trim();
    if (usuario === "" || contraseña === "") {
        alert("Por favor, complete todos los campos");
        return;
    }

    if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
    }
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario,
            contraseña: contraseña
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                formTb.reset()
                window.location.href = '/trabajador';
            } else {
                alert("Credenciales Incorrectas")
                console.error('Error en login');
            }
        })
        .catch(error => console.error('Error en login:', error));
};

const loginVt = (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuarioVeterinario').value.trim();
    const contraseña = document.getElementById('contraseñaVeterinario').value.trim();
    if (usuario === "" || contraseña === "") {
        alert("Por favor, complete todos los campos");
        return;
    }

    if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
    }
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario,
            contraseña: contraseña
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                formVt.reset()
                window.location.href = '/veterinario';
            } else {
                alert("Credenciales Incorrectas")

                console.error('Error en login');
            }
        })
        .catch(error => console.error('Error en login:', error));
};

// document.addEventListener('DOMContentLoaded', function () {
//     var modal = new bootstrap.Modal(document.getElementById('ModalToken'));
//     modal.show();
// });

formAdmin.addEventListener("submit", loginAdmin);
formTb.addEventListener("submit", loginTb);
formVt.addEventListener("submit", loginVt);