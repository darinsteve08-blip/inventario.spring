document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const divMensaje = document.getElementById("mensajeLogin");

    const credenciales = {
        username: usernameInput,
        password: passwordInput
    };

    fetch('https://inventario-api-15v1.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
    })
    .then(async respuesta => {
        if (!respuesta.ok) {
            throw new Error("Credenciales inválidas");
        }
        return respuesta.json();
    })
    .then(data => {
        // Guardamos los datos de sesión en el navegador
        localStorage.setItem("usuarioLogueado", "true");
        localStorage.setItem("nombreUsuario", data.username);
        localStorage.setItem("rolUsuario", data.rol); // 'ADMIN' o 'OPERARIO'

        divMensaje.className = "alert alert-success";
        divMensaje.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ¡Bienvenido, ${data.username}! Redirigiendo...`;
        divMensaje.classList.remove("d-none");

        // Redirigir al index principal después de 1.2 segundos
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    })
    .catch(error => {
        divMensaje.className = "alert alert-danger";
        divMensaje.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i> Usuario o contraseña incorrectos.`;
        divMensaje.classList.remove("d-none");
    });
});