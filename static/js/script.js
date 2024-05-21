/* Código para el requisito 5

var contenidoNumeroTarjetaAux

const tarjeta = document.querySelector('#tarjeta'),
    btnAbrirFormulario = document.querySelector('#btn-abrir-formulario'),
    formulario = document.querySelector('#formulario-tarjeta'),
    numeroTarjeta = document.querySelector('#tarjeta .numero'),
    nombreTarjeta = document.querySelector('#tarjeta .nombre'),
    logoMarca = document.querySelector('#logo-marca'),
    firma = document.querySelector('#tarjeta .firma p'),
    mesExpiracion = document.querySelector('#tarjeta .mes'),
    yearExpiracion = document.querySelector('#tarjeta .year'),
    ccv = document.querySelector('#tarjeta .ccv'),
    btnGuardarInformacionTarjeta = document.querySelector('#btn-guardar-tarjeta'),
    numeroTarjetaInput = document.querySelector('#inputNumero'),
    nombreTarjetaInput = document.querySelector('#inputNombre'),
    mesSeleccionadoLista = document.querySelector('#selectMes'),
    yearSeleccionadoLista = document.querySelector('#selectYear'),
    ccvSeleccionadoLista = document.querySelector('#inputCCV')

const mostrarFrente = () => {
    if (tarjeta.classList.contains('active')) {
        tarjeta.classList.remove('active')
    }
}

btnGuardarInformacionTarjeta.addEventListener('click', () => {
    if (logoMarca.querySelector('img') && logoMarca.querySelector('img').getAttribute('src') !== null) {
        if (mesExpiracion.innerText != 'MM') {
            if (yearExpiracion.innerText != 'AA') {
                console.log(numeroTarjetaInput.innerText.length)
                if (numeroTarjeta.innerText != '#### #### #### ####' && numeroTarjetaInput.value.length == 19) {
                    if (nombreTarjeta.innerText != 'JHON DOE' && nombreTarjetaInput.value.length >= 5) {
                        if (ccv.innerText != '' && ccv.innerText.length == 3) {
                            alert('¡Información guardada!')
                            numeroTarjeta.innerText = '#### #### #### ####'
                            nombreTarjeta.innerText = 'JHON DOE'
                            logoMarca.innerHTML = ''
                            mesExpiracion.innerText = 'MM'
                            yearExpiracion.innerText = 'AA'
                            firma.innerText = ''
                            ccv.innerText = ''
                            numeroTarjetaInput.value = ''
                            nombreTarjetaInput.value = ''
                            mesSeleccionadoLista.value = 'Mes'
                            yearSeleccionadoLista.value = 'Año'
                            ccvSeleccionadoLista.value = ''
                            mostrarFrente()
                        } else {
                            alert('¡Escriba los tres números CCV de su tarjeta!')
                        }
                    } else {
                        alert('¡Escriba un nombre mayor a 5 caracteres!')
                    }
                } else {
                    alert('¡Escriba los 16 digítos de su tarjeta!')
                }
            } else {
                alert('¡Seleccione un año válido!')
            }
        } else {
            alert('¡Seleccione un mes válido!')
        }
    } else {
        alert('¡Por el momento solo aceptamos Visa y MasterCard!')
    }
})

tarjeta.addEventListener('click', () => {
    tarjeta.classList.toggle('active')
})

btnAbrirFormulario.addEventListener('click', () => {
    btnAbrirFormulario.classList.toggle('active')
    formulario.classList.toggle('active')
})

for (let i = 1; i <= 12; i++) {
    let opcion = document.createElement('option')
    opcion.value = i
    opcion.innerText = i
    formulario.selectMes.appendChild(opcion)
}

const yearActual = new Date().getFullYear()
for (let i = yearActual; i <= yearActual + 8; i++) {
    let opcion = document.createElement('option')
    opcion.value = i
    opcion.innerText = i
    formulario.selectYear.appendChild(opcion)
}


formulario.inputNumero.addEventListener('keyup', (e) => {
    let valorInput = e.target.value

    formulario.inputNumero.value = valorInput.replace(/\s/g, '')
        .replace(/\D/g, '').replace(/([0-9]{4})/g, '$1 ').trim()

    numeroTarjeta.textContent = valorInput

    if (valorInput == '') {
        numeroTarjeta.textContent = '#### #### #### ####'

        logoMarca.innerHTML = ''
    }

    if (contenidoNumeroTarjetaAux != valorInput) {
        logoMarca.innerHTML = ''
    }

    contenidoNumeroTarjetaAux = valorInput

    if (valorInput[0] == 4) {
        logoMarca.innerHTML = ''
        const imagen = document.createElement('img')
        imagen.src = '/static/img/logos/visa.png'
        logoMarca.appendChild(imagen)
    } else if (valorInput[0] == 5) {
        logoMarca.innerHTML = ''
        const imagen = document.createElement('img')
        imagen.src = '/static/img/logos/mastercard.png'
        logoMarca.appendChild(imagen)
    }

    mostrarFrente()
})

formulario.inputNombre.addEventListener('keyup', (e) => {
    let valorInput = e.target.value

    formulario.inputNombre.value = valorInput.replace(/[0-9]/g, '')
    nombreTarjeta.textContent = valorInput
    firma.textContent = valorInput
    if (valorInput == '') {
        nombreTarjeta.textContent = 'Jhon Doe'
    }

    mostrarFrente()
})

formulario.selectMes.addEventListener('change', (e) => {
    mesExpiracion.textContent = e.target.value
    mostrarFrente()
})

formulario.selectYear.addEventListener('change', (e) => {
    yearExpiracion.textContent = e.target.value.slice(2)
    mostrarFrente()
})

formulario.inputCCV.addEventListener('keyup', () => {
    if (!tarjeta.classList.contains('active')) {
        tarjeta.classList.toggle('active')
    }

    formulario.inputCCV.value = formulario.inputCCV.value.replace(/\s/g, '')
        .replace(/\D/g, '')

    ccv.textContent = formulario.inputCCV.value;
}) */

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