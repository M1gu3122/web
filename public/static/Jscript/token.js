const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del JWT
        return payload.exp * 1000 < Date.now(); // Compara la fecha de expiración con la fecha actual
    }
    return true; // Si no hay token, se considera expirado
};

const extenderToken = () => {
    if (isTokenExpired()) {
        console.error('El token ha expirado, no se puede renovar.');
        window.location.href = '/login'; // Redirigir al login si el token ha expirado
        return;
    }

    axios.post('/renew-token', {}, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(renewResponse => {
        console.log('Token renovado:', renewResponse.data.token);
        localStorage.setItem('token', renewResponse.data.token);
        
        // Verificar la nueva fecha de expiración
        const newPayload = JSON.parse(atob(renewResponse.data.token.split('.')[1]));
        const expirationDate = new Date(newPayload.exp * 1000);
        console.log('El nuevo token caduca el:', expirationDate);

        var modal = bootstrap.Modal.getInstance(document.getElementById('ModalToken'));
        modal.hide();
        setTimeout(checkTokenStatus, 10000); // 10 segundos

    })
    .catch(renewError => {
        console.error('Error al renovar el token:', renewError);
        window.location.href = '/login'; // Redirigir al login en caso de error
    });
};

const checkTokenStatus = () => {
    axios.get('/token-status')
        .then(response => {
            if (response.data.expired) {
                // Intentar renovar el token
                var modal = new bootstrap.Modal(document.getElementById('ModalToken'));
                modal.show();
            }
        })
        .catch(error => {
            console.error(error);
        });
};

setTimeout(checkTokenStatus, 10000); // 10 segundos