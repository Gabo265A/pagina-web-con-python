if (document.readyState == 'loading') {
    carritoVacio()
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
    carritoVacio()
}

function ready() {
    var car_btn_delete_item = document.getElementsByClassName('btn-delete')
    for (var i = 0; i < car_btn_delete_item.length; i++) {
        var btn = car_btn_delete_item[i]
        btn.addEventListener('click', eliminarItemCarrito)
    }

    var car_btn_sumar_cantidad = document.getElementsByClassName('sumar-cant')
    for (var i = 0; i < car_btn_sumar_cantidad.length; i++) {
        var car_btns_cant = car_btn_sumar_cantidad[i]
        car_btns_cant.addEventListener('click', sumarCantidad)
    }

    var car_btn_restar_cantidad = document.getElementsByClassName('restar-cant')
    for (var i = 0; i < car_btn_restar_cantidad.length; i++) {
        var car_btns_cant = car_btn_restar_cantidad[i]
        car_btns_cant.addEventListener('click', restarCantidad)
    }

    document.getElementsByClassName('car-btn-pay')[0].addEventListener('click', botonPagarClicked)

}

function eliminarItemCarrito(event) {
    var car_btnClicked = event.target
    var item = car_btnClicked.parentElement;
    var nombre = item.querySelector('.car-item-title').innerText;
    actualizarListaProductos(nombre)
    item.remove()
    actualizarTotalCarrito()
}

function actualizarListaProductos(nombreProducto) {
    fetch('/actualizar_productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombreProducto }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message)
    });
    fetch('/obtener_cantidad_productos')
        .then(response => response.json())
        .then(data => {
            var cantidadProductos = data.cantidad;
            if (cantidadProductos <= 1){
                carritoVacio();
            }
        })
        .catch(error => {
            console.error('Error al obtener la cantidad de productos:', error);
        });
}

function actualizarTotalCarrito() {
    var car_carritoContenedor = document.getElementsByClassName('container-shopping-car')[0]
    var car_carritoItems = car_carritoContenedor.getElementsByClassName('car-item')
    var car_total = 0

    for (var i = 0; i < car_carritoItems.length; i++) {
        var car_item = car_carritoItems[i]
        var car_precioProducto = car_item.getElementsByClassName('car-item-price')[0]
        var car_precio = parseFloat(car_precioProducto.innerText.replace('$', '').replace('.', ''))
        var car_cantidadItem = car_item.getElementsByClassName('car-item-cant')[0]
        var car_cantidad = car_cantidadItem.value
        car_total = car_total + (car_precio * car_cantidad)
    }

    car_total = Math.round(car_total * 100) / 100
    document.getElementsByClassName('car-price-total')[0].innerText = '$' + car_total.toLocaleString("es")
}

function carritoVacio() {
    var car_carritoItems = document.getElementsByClassName('car-items')[0]
    var carritoVacioMsg = document.getElementById('carrito-vacio')

    fetch('/api/productos')
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            carritoVacioMsg.style.display = 'block'
        } else {
            carritoVacioMsg.style.display = 'none'
            agregarItemAlCarrito(data)
            activarScrollEnCarItems()
        }
    })
    .catch(error => {
        console.error('Error al obtener los productos:', error);
    });
}

function sumarCantidad(event) {
    var car_btn_cant_clicked = event.target
    var car_selector = car_btn_cant_clicked.parentElement
    var car_cant_actual = car_selector.getElementsByClassName('car-item-cant')[0].value
    if (car_cant_actual < 10) {
        car_cant_actual++
        car_selector.getElementsByClassName('car-item-cant')[0].value = car_cant_actual
        actualizarTotalCarrito()
    } else {
        alert('¡Para ordenar más de 10 productos (de un mismo producto) haga una orden nueva!')
    }
}

function restarCantidad(event) {
    var car_btn_cant_clicked = event.target
    var car_selector = car_btn_cant_clicked.parentNode.parentNode
    var car_cant_actual = car_selector.getElementsByClassName('car-item-cant')[0].value
    var car_nombre_producto_element = car_selector.querySelector('.car-item-title').innerText

    if (car_cant_actual >= 1) {
        car_cant_actual--
        car_selector.getElementsByClassName('car-item-cant')[0].value = car_cant_actual
        actualizarTotalCarrito()
    }
    if (car_cant_actual < 1){
        actualizarListaProductos(car_nombre_producto_element)
        event.target.closest('.car-item').remove()
        location.reload(true)
    }

}

function activarScrollEnCarItems() {
    var div = document.getElementById('car-items')

    var altura = div.offsetHeight

    var maxHeight = 300

    if (altura >= maxHeight) {
        div.style.overflowY = 'scroll'
    } else {
        div.style.overflowY = 'none'
    }
}

function agregarItemAlCarrito(agregarProductos) {
    for (var i = 0; i < agregarProductos.length; i++) {
        var productoAnalizado = agregarProductos[i];
        var item = document.createElement('div')
        item.className = 'car-item'
        var itemsCarrito = document.getElementById('car-items')
        var nombreItemsCarrito = itemsCarrito.querySelectorAll('.car-item-title')

        var codigoHtmlItemCarrito = `
        <img src="${productoAnalizado.imagen}" alt="" width="80px">
        <div class="car-item-details">
            <span class="car-item-title">${productoAnalizado.nombre}</span>
            <div class="selector-cant">
                <i class='bx bx-minus restar-cant'></i>
                <input type="text" value="1" class="car-item-cant" disabled>
                <i class='bx bx-plus sumar-cant'></i>
            </div>
            <span class="car-item-price">${productoAnalizado.precio}</span>
        </div>
        <span class="btn-delete">
            <i class='bx bxs-trash-alt'></i>
        </span>
        `

        item.innerHTML = codigoHtmlItemCarrito
        itemsCarrito.append(item)

        item.getElementsByClassName('btn-delete')[0].addEventListener('click', eliminarItemCarrito)

        var car_btn_sumar_cantidad_nuevo = item.getElementsByClassName('sumar-cant')[0]
        car_btn_sumar_cantidad_nuevo.addEventListener('click', sumarCantidad)

        var car_btn_restar_cantidad_nuevo = item.getElementsByClassName('restar-cant')[0]
        car_btn_restar_cantidad_nuevo.addEventListener('click', restarCantidad)
        actualizarTotalCarrito()
    }
}

function botonPagarClicked(event) {
    var car_carritoItems = document.getElementsByClassName('car-items')[0]

    if (car_carritoItems.childElementCount > 0) {
         fetch("/validar-pago", {
             method: "POST",
         })
         .then(function(response) {
             alert("¡Gracias por su compra!")
             location.reload(true)
         })
         .catch(function(error) {
            alert("Error:", error);
         });
    } else if (car_carritoItems.childElementCount == 0) {
        alert('¡Carrito vacío!')
    }
}