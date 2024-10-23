

document.addEventListener('DOMContentLoaded', () => {
    const appInfo = document.getElementById('app-info');
    const quienesSomos = document.getElementById('quienes-somos');
    const appInfoBtn = document.getElementById('app-info-btn');
    const quienesSomosBtn = document.getElementById('quienes-somos-btn');
    
    if (appInfo && quienesSomos) {
        console.log('Elementos app-info y quienes-somos encontrados');
        appInfo.style.display = 'block';
        quienesSomos.style.display = 'none';
    } else {
        console.error('No se encontraron los elementos app-info y quienes-somos');
    }

    if (appInfoBtn) {
        console.log('Botón app-info-btn encontrado');
        appInfoBtn.addEventListener('click', function() {
            console.log('Botón app-info-btn clickeado');
            if (appInfo && quienesSomos) {
                appInfo.style.display = 'block';
                quienesSomos.style.display = 'none';
            }
        });
    } else {
        console.error('Botón app-info-btn no encontrado');
    }

    if (quienesSomosBtn) {
        console.log('Botón quienes-somos-btn encontrado');
        quienesSomosBtn.addEventListener('click', function() {
            console.log('Botón quienes-somos-btn clickeado');
            if (appInfo && quienesSomos) {
                appInfo.style.display = 'none';
                quienesSomos.style.display = 'block';
            }
        });
    } else {
        console.error('Botón quienes-somos-btn no encontrado');
    }
});













function redirigir() {
    window.location.href = 'login.html';
}

