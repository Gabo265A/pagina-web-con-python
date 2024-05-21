/* Código para el requisito 1 */
let catalogo = document.getElementById('catalogo'),
    item_select = document.getElementById('item-select'),
    img_select = document.getElementById('img'),
    product_select = document.getElementById('product'),
    description = document.getElementById('description'),
    price_product = document.getElementById('price')
    menu_desplegable_otras_paginas = document.getElementById('menu-desplegable-otras-paginas')

function cargar(item) {
    quitarBordes()
    catalogo.style.width = "60%"
    item_select.style.width = "40%"
    item_select.style.opacity = "1"
    item_select.style.visibility = "visible"
    item.style.border = "2px solid orange"
    menu_desplegable_otras_paginas.style.paddingLeft = "53%"

    img_select.src = item.getElementsByTagName("img")[0].src

    product_select.innerHTML = item.getElementsByTagName("p")[0].innerHTML

    if (img_select.src === "http://127.0.0.1:5000/static/img/productos/Arroadearroz.jpg") {
        description.innerHTML = "Arroz Supremo Tradicional Blanco X25 und x500g c-u "
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/Pasta-Clasica-Doria.jpg") {
        description.innerHTML = "Pasta Spaghetti Pastas Doria x1000g"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/cocacola.png") {
        description.innerHTML = "Gaseosa Coca-Cola sin azucar mini-lata 235 ml x4 unds"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/compota.png") {
        description.innerHTML = "Compota BabyFruit Durazno x120g"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/detergente.png") {
        description.innerHTML = "Detergente BonaRopa Liquido Antibacterial x1L"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/dulceotruco.png") {
        description.innerHTML = "Bolsas De Dulce o Truco x4 "
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/limon.png") {
        description.innerHTML = "Malla Limón x1000 gr"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/lomito.png") {
        description.innerHTML = "Lomito de tilapia Pesqueros x450g"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/pimenton.png") {
        description.innerHTML = "Pimenton Rojo x 500g"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/tarritorojo.png") {
        description.innerHTML = "Kola Granulada Tarrito Rojo Tradicional x200g"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/th.jpeg") {
        description.innerHTML = "Mezclas Lista Para Hotcakes x400g"
    } else if (img_select.src === "http://127.0.0.1:5000/static/img/productos/vino.png") {
        description.innerHTML = "Vino Lambrusco Don Vito x750ml (TE AMO GABO - BY JULI)"
    } else {
        description.innerHTML = "Descripcion producto"
    }

    price_product.innerHTML = item.getElementsByTagName("span")[0].innerHTML
}

function quitarBordes() {
    var items = document.getElementsByClassName("item")
    for (i = 0; i < items.length; i++) {
        items[i].style.border = "none"
    }
}

function cerrar() {
    catalogo.style.width = "100%"
    item_select.style.width = "0%"
    item_select.style.opacity = "0"
    item_select.style.visibility = "hidden"
    menu_desplegable_otras_paginas.style.paddingLeft = "93%"
    quitarBordes()
}

document.getElementById("carrito-button").addEventListener("click", function() {
    event.preventDefault();
    window.location.href = "carrito-de-compras";
})

function agregarProducto() {
    var nombre = document.getElementById("product").textContent;
    var precio = document.getElementById("price").textContent;
    var imagen = document.getElementById("img").getAttribute("src");
    var nuevoProducto = {
        nombre: nombre,
        precio: precio,
        imagen: imagen
    };

    fetch('/agregar_producto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message == "¡El producto ya esta agregado en el carrito!"){
            alert(data.message);
        }
    });
    actualizarContadorCarrito()
    actualizarContadorCarrito()
    actualizarContadorCarrito()
}


function actualizarContadorCarrito() {
    var contadorCarrito = document.getElementById("contador-carrito")
    fetch('/obtener_cantidad_productos')
        .then(response => response.json())
        .then(data => {
            var cantidadProductos = data.cantidad;

            contadorCarrito.textContent = cantidadProductos;
        })
        .catch(error => {
            console.error('Error al obtener la cantidad de productos:', error);
        });
}

/* GO TOP */
window.onscroll = function () {
    if (document.documentElement.scrollTop > 100) {
        document.querySelector('.go-top-container')
            .classList.add('show')
    } else {
        document.querySelector('.go-top-container')
            .classList.remove('show')
    }
}

document.querySelector('.go-top-container')
    .addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })