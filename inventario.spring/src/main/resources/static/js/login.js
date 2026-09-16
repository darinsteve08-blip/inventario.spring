// --- 1. LÓGICA PARA CAMBIAR ENTRE LOGIN Y REGISTRO ---
const btnMostrarRegistro = document.getElementById("btnMostrarRegistro");
const btnMostrarLogin = document.getElementById("btnMostrarLogin");
const seccionLogin = document.getElementById("seccion-login");
const seccionRegistro = document.getElementById("seccion-registro");

if (btnMostrarRegistro && btnMostrarLogin) {
    btnMostrarRegistro.addEventListener("click", function(e) {
        e.preventDefault();
        seccionLogin.style.display = "none";
        seccionRegistro.style.display = "block";
    });

    btnMostrarLogin.addEventListener("click", function(e) {
        e.preventDefault();
        seccionRegistro.style.display = "none";
        seccionLogin.style.display = "block";
    });
}

// --- 2. TU CÓDIGO ORIGINAL DE LOGIN (Intacto) ---
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const divMensaje = document.getElementById("mensajeLogin");

    const credenciales = {
        username: usernameInput,
        password: passwordInput
    };

    fetch('https://inventario-api-15v1.onrender.com/api/usuarios/index', {
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

// --- 3. NUEVA PARTE: REGISTRO DE OPERARIOS ---
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    formRegistro.addEventListener("submit", function(event) {
        event.preventDefault();

        const nombreInput = document.getElementById("reg-nombre").value.trim();
        const emailInput = document.getElementById("reg-email").value.trim();
        const passwordInput = document.getElementById("reg-password").value.trim();
        const divMensajeReg = document.getElementById("mensajeRegistro");

        const nuevoOperario = {
            username: nombreInput, // O 'nombre' dependiendo de cómo lo reciba tu backend
            email: emailInput,
            password: passwordInput
        };

        fetch('https://inventario-api-15v1.onrender.com/api/usuarios/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoOperario)
        })
        .then(async respuesta => {
            if (!respuesta.ok) {
                throw new Error("No se pudo completar el registro");
            }
            return respuesta.json();
        })
        .then(data => {
            divMensajeReg.className = "alert alert-success";
            divMensajeReg.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ¡Registro exitoso! Ya puedes iniciar sesión.`;
            divMensajeReg.classList.remove("d-none");

            formRegistro.reset();

            // Regresar al login después de 2 segundos
            setTimeout(() => {
                divMensajeReg.classList.add("d-none");
                seccionRegistro.style.display = "none";
                seccionLogin.style.display = "block";
            }, 2000);
        })
        .catch(error => {
            divMensajeReg.className = "alert alert-danger";
            divMensajeReg.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i> Error al registrarse. Intenta con otro usuario o correo.`;
            divMensajeReg.classList.remove("d-none");
        });
    });
}