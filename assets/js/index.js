// Creancion de Variables Globales
let arrayCatalogo = new Array();//defrente array vacio
let numPage;
let carrito = [];
// Leer parametros URL
let parametrosURL = new URLSearchParams(location.search);
// Comprobar pagina
if (parseInt(parametrosURL.get("page")) == 1 || parametrosURL.get("page") == null) {
    numPage = 1;
} else {
    numPage = parametrosURL.get("page") == 1;
}
// Solicitar datos al servidor
fetch("products.json").then(respuesta => respuesta.json()).then(objeto => {
    // quiero que array sea igual a objeto 
    arrayCatalogo = objeto;
    // funcion para cargar catalogo
    cargarCatalogo(numPage);
})
// Definir cargar catalogo
function cargarCatalogo(pagina) {
    // Referencia de catalogo
    let filaCatalogo = document.querySelector("#catalogo");
    // Crear elementos
    let inicio = (pagina - 1) * 8;// formula para encontrar el inicio
    let final;
    let tmbfinal = pagina * 8;
    // condicional
    if (arrayCatalogo.length < tmbfinal) {
        final = arrayCatalogo.length;
    } else {
        final = tmbfinal;
    }
    for (let index = inicio; index <= final; index++) {
        // Procesando valores producto
        let nombre = arrayCatalogo[index].name;
        let nomImage = arrayCatalogo[index].image;
        // Calculo de precios
        let precio = arrayCatalogo[index].price;
        let oferta = arrayCatalogo[index].offer * 100;
        let precioFinal = precio - (precio * oferta / 100);
        // Creo Articulo
        let nuevoElemento = document.createElement("article");
        nuevoElemento.setAttribute("class", '"col-xs-12 col-sm-5 col-md-3 col-xl-3"');
        nuevoElemento.innerHTML =
            `
            <div class="card">
            <img src="assets/images/products/${nomImage}" class="card-img-top data-imagen" alt="${nombre}">
            <div class="card-body">
                <h4 class="card-title text-center">${nombre}</h4>
                <div class="d-flex justify-content-center align-items-center gap-2">
                    <p class="card-text card_previous_price text-center mb-0">S/ ${precio}</p>
                    <p class="card-text card_descuento_price text-center">-${oferta}%</p>
                </div> 
                <p class="card-text card_actual_price text-center"> <span class="precioFinal">S/ ${precioFinal}</span></p>
                <div class="d-flex justify-content-center">
                    <button onclick="addCarrito(event)" class="btn btn-primary"><i class='bx bxs-cart-add'></i> Añadir a Carrito</button>
                </div>
            </div>
        </div>
        `;
        
        // Añadir nuevo elemento al catalogo de compras
        filaCatalogo.append(nuevoElemento);
    }

}



function addCarrito(event) {
    const button = event.target; // Obtiene el botón que desencadenó el evento
    const article = button.closest('article'); // Encuentra el elemento padre "article" más cercano al botón
    const nombre = article.querySelector('h4').innerText; // Obtiene el nombre del producto del elemento "h4" dentro del artículo
    const precio = article.querySelector('.precioFinal').innerText; // Obtiene el precio del producto del elemento con la clase "precioFinal" dentro del artículo
    const imagenSrc = article.querySelector('img').getAttribute('src'); // Obtiene la URL de la imagen del producto del atributo "src" de la etiqueta "img"

    const nuevoElemento = document.createElement('div'); // Crea un nuevo elemento "div"
    nuevoElemento.innerHTML = `
      <div class="modal-contenedor py-2">
        <div>
            <img class="img-fluid img-carrito" src="${imagenSrc}" alt="${nombre}">
        </div>
        <div class="p-3">
            <p>Nombre: ${nombre}</p>
            <p>Precio: ${precio}</p>
            <div class="d-flex justify-content-center">
                <button onclick="eliminarProducto(event)" class="btn btn-danger btn-sm">Eliminar Producto <i class="bx bxs-trash-alt"></i></button>
            </div>
        </div>
       </div>
    `;

    const carritoProductos = document.getElementById('carritoProductos'); // Obtiene el elemento con el ID "carritoProductos"
    carritoProductos.appendChild(nuevoElemento); // Agrega el nuevo elemento al elemento "carritoProductos"

    const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal')); // Crea una instancia del modal de Bootstrap con el ID "carritoModal"
    carritoModal.show(); // Muestra el modal
    ocultarMensajeCarritoVacio(); // Llama a la función "ocultarMensajeCarritoVacio" para ocultar el mensaje de carrito vacío si es necesario
}

// Funcion Eliminar Todo
function eliminarTodo() {
    // Vaciar el array del carrito
    carrito = [];

    // Remover todos los elementos del DOM
    const carritoProductos = document.getElementById('carritoProductos');
    while (carritoProductos.firstChild) {
        carritoProductos.removeChild(carritoProductos.firstChild);
    }

    // Mostrar el mensaje de carrito vacío
    aparecerMensajeCarritoEliminado();

    // Cerrar el modal manualmente solo si estaba abierto
    const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
    if (carritoModal._isShown) {
        carritoModal.hide();
    }
}
// Funcion eliminar Producto
function eliminarProducto(event) {
    const button = event.target;
    const producto = button.closest('.modal-contenedor');
    const nombre = producto.querySelector('p:first-child').innerText;

    // Eliminar el producto del carrito
    carrito = carrito.filter(item => item.nombre !== nombre);

    // Remover el elemento del DOM
    producto.remove();
    // Verificar si el carrito está vacío y no tiene productos
    if (carrito.length === 0) {
        aparecerMensajeCarritoEliminado();
    } else {
        console.log("no pasa nada");
    }

}


// Función para ocultar o mostrar el mensaje de carrito vacío
function ocultarMensajeCarritoVacio() {
    const mensajeCarritoVacio = document.getElementById("mensajeCarritoVacio");
    if (carrito.length === 0) {
        mensajeCarritoVacio.style.display = "none"; // Ocultar el mensaje
    } else {
        mensajeCarritoVacio.style.display = "block"; // Mostrar el mensaje
    }
}
// Funcion de mostrar e ocultar mensaje
function aparecerMensajeCarritoEliminado() {
    const mensajeCarritoVacio = document.getElementById("mensajeCarritoVacio");
    if (carrito.length === 0) {
        mensajeCarritoVacio.style.display = "block"; // Mostrar el mensaje
    } else {
        mensajeCarritoVacio.style.display = "none"; // Ocultar el mensaje
    }
}
// Alert y confirm para realizar el pago y finalizar y redireccionar a la pagina principal
function comprarProducto() {
    if (confirm("¿Estás seguro que deseas comprar lo que lleva el carrito?")) {
        alert("Comprado con éxito.");
        window.location.href = "index.html";
    }
}