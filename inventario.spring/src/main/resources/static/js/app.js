// 1. VARIABLES DEL DOM
const formulario = document.getElementById("formProducto");
const tabla = document.getElementById("tablaProductos");
const divMensaje = document.getElementById("mensaje");

// Variable global para guardar los productos y filtrarlos fácil
let listaProductosGlobal = [];

// 2. FUNCIÓN PARA EL DASHBOARD (INDEX.HTML)
function cargarDashboard() {
    const elTotal = document.getElementById("totalProductos");
    const elDisponibles = document.getElementById("totalDisponibles");
    const elAgotados = document.getElementById("totalAgotados");
    const contenedorTarjetas = document.getElementById("tarjetasRecientes");

    if (!elTotal) return; 

    fetch('https://inventario-api-15v1.onrender.com/api/productos')
    .then(respuesta => respuesta.json())
    .then(datos => {
        elTotal.textContent = datos.length;
        elDisponibles.textContent = datos.filter(p => p.cantidad > 0).length;
        elAgotados.textContent = datos.filter(p => p.cantidad === 0).length;

        if (contenedorTarjetas) {
            contenedorTarjetas.innerHTML = ""; 
            const ultimos = datos.slice().reverse().slice(0, 3);
            
            ultimos.forEach(p => {
                let colorBorde = p.cantidad === 0 ? "border-danger" : (p.cantidad < 10 ? "border-warning" : "border-primary");
                let colorTexto = p.cantidad === 0 ? "bg-danger" : (p.cantidad < 10 ? "bg-warning text-dark" : "bg-primary");
                
                contenedorTarjetas.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="card shadow-sm ${colorBorde} h-100" style="border-width: 2px;">
                            <div class="card-body text-center">
                                <h5 class="card-title fw-bold text-uppercase">${p.nombre}</h5>
                                <p class="text-muted small mb-1">Código: ${p.codigo}</p>
                                <h4 class="text-success fw-bold">$${p.precio}</h4>
                                <span class="badge ${colorTexto}">Stock: ${p.cantidad}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    })
    .catch(error => console.error("Error en dashboard:", error));
}

// 3. FUNCIÓN PARA MOSTRAR PRODUCTOS EN LA TABLA
function mostrarProductos() {
    if (!tabla) return; 
    
    fetch('https://inventario-api-15v1.onrender.com/api/productos')
    .then(respuesta => respuesta.json())
    .then(datos => {
        listaProductosGlobal = datos; // Guardamos los datos globalmente
        dibujarTabla(datos);         // Dibujamos la tabla completa
    })
    .catch(error => console.error("Error al cargar productos:", error));
}

// Función auxiliar para pintar la tabla y calcular el total dinámicamente
function dibujarTabla(datos) {
    if (!tabla) return;
    tabla.innerHTML = "";
    let totalGeneral = 0;

    // Obtenemos el rol actual del usuario logueado
    const rol = localStorage.getItem("rolUsuario");

    datos.forEach(p => {
        const valorTotal = p.precio * p.cantidad;
        totalGeneral += valorTotal;

        let estado = p.cantidad === 0 ? "Agotado" : (p.cantidad < 10 ? "Stock bajo" : "Disponible");
        let colorEstado = p.cantidad === 0 ? "bg-danger" : (p.cantidad < 10 ? "bg-warning text-dark" : "bg-success");
        const idReal = p.idProducto || p.id; // Previene errores si el ID cambia de nombre

        // Lógica de botones según el rol (ADMIN u OPERARIO)
        let botonesAccion = '';
        if (rol === 'ADMIN') {
            botonesAccion = `
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editarProducto(${idReal})" title="Editar producto"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${idReal})" title="Eliminar producto"><i class="bi bi-trash"></i></button>
            `;
        } else if (rol === 'OPERARIO') {
            botonesAccion = `
                <button class="btn btn-sm btn-outline-warning" onclick="actualizarStock(${idReal}, ${p.cantidad})" title="Actualizar Stock">
                    <i class="bi bi-box-arrow-in-down"></i> Stock
                </button>
            `;
        }

        tabla.innerHTML += `
            <tr>
                <td class="ps-3"><span class="badge bg-secondary">${p.codigo}</span></td>
                <td class="fw-bold">${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>${p.proveedor || p.proovedor || 'N/A'}</td>
                <td>$${p.precio}</td>
                <td>${p.cantidad}</td>
                <td><span class="badge ${colorEstado}">${estado}</span></td>
                <td>$${valorTotal}</td>
                <td class="text-center pe-3">
                    ${botonesAccion}
                </td>
            </tr>
        `;
    });

    // Fila del valor total del inventario
    tabla.innerHTML += `
        <tr class="table-dark text-end">
            <td colspan="7" class="fw-bold pe-3">VALOR TOTAL DEL INVENTARIO:</td>
            <td colspan="2" class="fw-bold text-start ps-2">$${totalGeneral}</td>
        </tr>
    `;
}

// NUEVA FUNCIÓN PARA FILTRAR EN TIEMPO REAL
function filtrarProductos() {
    const inputElement = document.getElementById("inputBuscar");
    if (!inputElement) return;
    
    const textoBusqueda = inputElement.value.toLowerCase().trim();
    
    const productosFiltrados = listaProductosGlobal.filter(p => {
        const codigoProducto = p.codigo ? p.codigo.toLowerCase() : "";
        return codigoProducto.includes(textoBusqueda);
    });

    dibujarTabla(productosFiltrados);
}

// 4. LÓGICA DEL FORMULARIO - GUARDA EN SPRING BOOT
if (formulario) { 
    const idEditar = localStorage.getItem("idEditar");

    if (idEditar) {
        fetch(`https://inventario-api-l5v1.onrender.com/api/productos/${idEditar}`)
        .then(res => res.json())
        .then(p => {
            document.getElementById("codigo").value = p.codigo;
            document.getElementById("nombre").value = p.nombre;
            document.getElementById("categoria").value = p.categoria;
            document.getElementById("proveedor").value = p.proveedor || p.proovedor;
            document.getElementById("precio").value = p.precio;
            document.getElementById("cantidad").value = p.cantidad;
        });
    }

    formulario.addEventListener("submit", function(event) {
        event.preventDefault(); 

        const producto = {
            codigo: document.getElementById("codigo").value,
            nombre: document.getElementById("nombre").value,
            categoria: document.getElementById("categoria").value,
            proveedor: document.getElementById("proveedor").value,
            precio: document.getElementById("precio").value,
            cantidad: document.getElementById("cantidad").value
        };

        let url = 'https://inventario-api-l5v1.onrender.com/api/productos';
        let metodo = 'POST';

        if (idEditar) {
            producto.id = idEditar;
            url = `https://inventario-api-l5v1.onrender.com/api/productos/${idEditar}`;
            metodo = 'PUT';
        }

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        })
        .then(async respuesta => {
            if (!respuesta.ok) {
                throw new Error("Código repetido"); 
            }
            return respuesta.json();
        })
        .then(data => {
            divMensaje.className = "alert alert-success";
            divMensaje.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ¡Producto ${idEditar ? 'actualizado' : 'guardado'}!`;
            
            if (idEditar) {
                localStorage.removeItem("idEditar"); 
                setTimeout(() => window.location.href = "productos.html", 1500); 
            } else {
                formulario.reset();
            }
        })
        .catch(error => {
            divMensaje.className = "alert alert-danger";
            divMensaje.innerHTML = `<i class="bi bi-x-circle-fill me-2"></i> Error: El código ingresado ya existe.`;
        });
    });
}

function eliminarProducto(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        fetch(`https://inventario-api-l5v1.onrender.com/api/productos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert("Producto eliminado con éxito");
                location.reload(); 
            } else {
                alert("Ocurrió un error al intentar eliminar el producto.");
            }
        })
        .catch(error => console.error("Error al eliminar:", error));
    }
}

function editarProducto(id) {
    localStorage.setItem("idEditar", id);
    window.location.href = "registrar.html"; 
}

// Función exclusiva para que el OPERARIO actualice el stock rápidamente
function actualizarStock(idProducto, cantidadActual) {
    let nuevaCantidad = prompt(`La cantidad actual es ${cantidadActual}. Ingresa la nueva cantidad en stock:`, cantidadActual);

    if (nuevaCantidad === null || nuevaCantidad.trim() === "") return;

    nuevaCantidad = parseInt(nuevaCantidad);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
        alert("Por favor ingresa un número válido mayor o igual a 0.");
        return;
    }

    fetch(`https://inventario-api-l5v1.onrender.com/api/productos/${idProducto}`)
        .then(res => res.json())
        .then(producto => {
            producto.cantidad = nuevaCantidad; 

            return fetch(`https://inventario-api-l5v1.onrender.com/api/productos/${idProducto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
        })
        .then(res => {
            if (res.ok) {
                alert("¡Stock actualizado con éxito!");
                location.reload(); 
            } else {
                alert("Error al actualizar el stock.");
            }
        })
        .catch(err => console.error("Error:", err));
}

// 5. CONTROL DE SESIÓN Y ROLES
function verificarSesion() {
    const logueado = localStorage.getItem("usuarioLogueado");
    const rutaActual = window.location.pathname;

    // Si no está logueado y no está en el index (que ahora es el login), lo mandamos al index
    if (!logueado && !rutaActual.endsWith("index.html") && !rutaActual.endsWith("/")) {
        window.location.href = "index.html";
    }
}

function configurarInterfazSegunRol() {
    const rol = localStorage.getItem("rolUsuario");
    const username = localStorage.getItem("nombreUsuario") || "Usuario";
    
    const menuRegistrar = document.getElementById("menuRegistrar");
    const contenedorNav = document.getElementById("infoUsuarioNav");
    const btnNuevoProducto = document.getElementById("btnNuevoProducto");

    // Pintar información del usuario y botón de salir en la barra de navegación
    if (contenedorNav) {
        contenedorNav.innerHTML = `
            <span class="me-3 small text-white">
                <i class="bi bi-person-circle"></i> <strong>${username}</strong> 
                <span class="badge bg-secondary ms-1">${rol || 'INVITADO'}</span>
            </span>
            <button class="btn btn-outline-light btn-sm" onclick="cerrarSesion()">
                <i class="bi bi-box-arrow-right"></i> Salir
            </button>
        `;
    }

    // Restricciones visuales y de rutas para OPERARIO: Solo ve Inicio y Productos, y en productos solo modifica stock
    if (rol === 'OPERARIO') {
        if (menuRegistrar) menuRegistrar.style.display = 'none';
        if (btnNuevoProducto) btnNuevoProducto.style.display = 'none';

        if (window.location.pathname.indexOf("registrar.html") !== -1) {
            alert("Acceso denegado. Los operarios no tienen permiso para registrar o editar productos.");
            window.location.href = "productos.html";
        }
    }
}

function cerrarSesion() {
    localStorage.clear();
    window.location.href = "index.html";
}

// 6. EJECUTAR FUNCIONES AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    verificarSesion();
    configurarInterfazSegunRol();
    cargarDashboard();
    mostrarProductos();
});

function exportarExcel() {
    if (!listaProductosGlobal || listaProductosGlobal.length === 0) {
        alert("No hay productos para exportar.");
        return;
    }

    const datosExcel = listaProductosGlobal.map(p => ({
        "Código": p.codigo,
        "Nombre": p.nombre,
        "Categoría": p.categoria,
        "Proveedor": p.proveedor || p.proovedor || 'N/A',
        "Precio ($)": p.precio,
        "Cantidad": p.cantidad,
        "Valor Total ($)": p.precio * p.cantidad,
        "Estado": p.cantidad === 0 ? "Agotado" : (p.cantidad < 10 ? "Stock bajo" : "Disponible")
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    XLSX.writeFile(workbook, "Reporte_Inventario.xlsx");
}

function exportarPDF() {
    if (!listaProductosGlobal || listaProductosGlobal.length === 0) {
        alert("No hay productos para exportar.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Reporte General de Inventario", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 28);

    const columnas = ["Código", "Producto", "Categoría", "Precio", "Stock", "Total"];
    const filas = listaProductosGlobal.map(p => [
        p.codigo,
        p.nombre,
        p.categoria,
        `$${p.precio}`,
        p.cantidad,
        `$${p.precio * p.cantidad}`
    ]);

    doc.autoTable({
        head: [columnas],
        body: filas,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [33, 37, 41] },
        styles: { fontSize: 9 }
    });

    doc.save("Reporte_Inventario.pdf");
}