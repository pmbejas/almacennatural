let productos = []
let carrito = {
    fecha: Date.now,
    cantidadItems: 0,
    totalPagar: 0.00,
    listadoProductos: []
}

const mostrarMenuMovil = () => {
    const menu = document.getElementById('barraNavegacionMovil')
    menu.classList.toggle('ocultar')
}

const mostrarPagina = (eleccion) => {
    let bloques = document.getElementsByClassName('mainContent')
    for (const bloque of bloques) {
        bloque.classList.add('ocultar')
    }

    switch (eleccion) {
        case 'inicio':
            let bloques = document.getElementsByClassName('mainContent')
                    for (const bloque of bloques) {
                bloque.classList.remove('ocultar')
            }
            var bloque = document.getElementById('itemNosotros')
            bloque.classList.add('ocultar')
            var bloque = document.getElementById('itemContacto')
            bloque.classList.add('ocultar')
            break;
        case 'nosotros':
            var bloque = document.getElementById('itemNosotros')
            bloque.classList.toggle('ocultar')
            break;
        case 'productos':
            var bloque = document.getElementById('itemProductos')
            mostrarProductos('db/productos.json','cajonProductos')
            bloque.classList.toggle('ocultar')
            break;
        case 'recetas':
            var bloque = document.getElementById('itemRecetas')
            bloque.classList.toggle('ocultar')
            break;
        case 'contacto':
            var bloque = document.getElementById('itemContacto')
            bloque.classList.toggle('ocultar')
            break;
    }
}

const mostrarProductos = (url, elemento) => {
    let array = []
    fetch(url)
        .then( res => res.json() )
        .then( datos => {
            let httpProductos = document.getElementById(elemento)
            httpProductos.innerHTML = ""
            for (producto of datos) {
                httpProductos.innerHTML += `
                    <div class="card">
                    <img class="cardFotoProducto pointer" onclick="mostrarDatosProducto(${producto.id})" src="${producto.foto}" alt="lechuga">
                    <span class="cardNombreProducto pointer" onclick="mostrarDatosProducto(${producto.id})">${producto.nombre}</span>
                    <span class="cardPrecioProducto">$ ${producto.precio}</span>
                    </div>
                `
                productos.push(producto)
            }
        });
}


const toggleVentana = () => {
    
    const cuerpo = document.getElementById('cuerpo')
    cuerpo.classList.toggle('scroll')

    const ventana = document.getElementById('ventanaEmergente')
    ventana.classList.toggle('ocultar')

    const globo = document.getElementById('globoCarrito')
    globo.classList.toggle('ocultar')
}

const CarritoCompras = (accion) => {
    if (accion=="mostrar") {
        toggleVentana()
    }
    const ventana = document.getElementById('contenidoVentanaEmergente')
    ventana.innerHTML=`
            <div class="tituloVentana" >
                <span class="textoTituloVentana">CARRITO DE COMPRAS</span>
            </div>`
    if (carrito.cantidadItems > 0) {
        ventana.innerHTML +=`
            <div class="contenidoVentana">
                <div class="resumenCarrito">
                    <div class="cardResumenCarrito">
                        <span class="tituloCardResumenCarrito">Cantidad de Items</span>
                        <span class="textoCardResumenCarrito">${carrito.cantidadItems}</span>
                    </div>
                    <div class="cardResumenCarrito">
                        <span class="tituloCardResumenCarrito">Total a Pagar</span>
                        <span class="textoCardResumenCarrito">$ ${carrito.totalPagar}</span>
                    </div>
                </div>
                <table class="tablaCarrito">
                    <span class="tituloTablaCarrito">Detalle de Productos:</span>
                    <thead>
                        <tr>
                            <th scope="col">Cant.</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Total</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody id="tablaCarrito" id="tablaCarrito">
                    </tbody>
                </table>
            </div>
        ` 
        const tablaElementosCarrito = document.getElementById('tablaCarrito')
        for (item of carrito.listadoProductos) {
            tablaElementosCarrito.innerHTML += `
                    <th scope='row'>${item.cantidad}</th>
                    <td>${item.nombre}</td>
                    <td>$ ${item.precio}</td>
                    <td>$ ${item.precio * item.cantidad}</td>
                    <td><i class="bi bi-trash3 pointer" onclick="eliminarItemCarrito(${item.id})"></i></td>
                </tr>
            `
        }
    } else {
        ventana.innerHTML += `
            <div class="contenidoVentana carritoVacio">
                EL CARRITO ESTA VACIO.<br>HACE TU COMPRA EN LA SECCION PRODUCTOS
            </div>
        `
    }
    ventana.innerHTML += `
        <div class="pieVentana">
            <input type="button" id="botonCancelar" class="boton btnCerrar pointer" onclick="toggleVentana()" value="Cerrar">
        </div>
        `
}

const eliminarItemCarrito = (id) => {
    let indice = carrito.listadoProductos.findIndex(elemento => elemento.id === id); 
    carrito.cantidadItems = carrito.cantidadItems - parseInt(carrito.listadoProductos[indice].cantidad)
    carrito.totalPagar = carrito.totalPagar - parseInt(carrito.listadoProductos[indice].total)
    if (indice !== -1) {
        carrito.listadoProductos.splice(indice, 1);
    }
    CarritoCompras('actualizar')
    alerta('celeste','Se ha Eliminado el Producto del Carrito', 2500)
}

const agregarProductoCarrito = (id, cantidad, nombre, precio) => {
    const existeProducto = carrito.listadoProductos.find(producto => producto.id == id)
    const inputCantidad = document.getElementById('cantidadId'+id)
    if (existeProducto) { 
        existeProducto.cantidad += parseInt(inputCantidad.value)
        existeProducto.total = existeProducto.cantidad * existeProducto.precio
        carrito.cantidadItems += parseInt(inputCantidad.value)
        carrito.totalPagar += precio * parseInt(inputCantidad.value)
    } else {
        const producto = {
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: parseInt(inputCantidad.value),
            total: precio * parseInt(inputCantidad.value)
        }
        carrito.cantidadItems += parseInt(inputCantidad.value)
        carrito.totalPagar += precio * parseInt(inputCantidad.value)
        carrito.listadoProductos.push(producto)
    }
    alerta('verde','Se agregó el prducto al carrito de compras. Muchas Gracias', 2500)
}

const mostrarDatosProducto = (id) => {
    toggleVentana()
    const producto = productos.find((productoBuscado) => {
        return productoBuscado.id == id;
      });
    const ventana = document.getElementById('contenidoVentanaEmergente')
    ventana.innerHTML=`
        <form action="">
            <div class="tituloVentana" >
                <span class="textoTituloVentana">Detalle del Producto</span>
            </div>
            <div class="contenidoVentana">
                <span class="nombreProductoVentana">${producto.nombre}</span>
                <div class="imagenDescripcion">
                    <img class="imagenProductoVentana" src="${producto.foto}" alt="">
                    <p class="textoDescripcion">${producto.beneficios}</p>
                </div>
                <div class="cantidadCarrito">
                    <p class="precioProductoVentana" ><b>Precio: </b>$${producto.precio}</p>
                    <input type="number" class="campo" min="1" max="10" id="cantidadId${producto.id}" value="1" style="text-align: center; font-weight: 600;">
                    <input type="button" id="botonAgregar" class="boton btnAgregar pointer" onclick="agregarProductoCarrito(${producto.id},1,'${producto.nombre}',${producto.precio})" value="Agregar al Carrito">
                </div>
            </div>
            <div class="pieVentana">
                <input type="button" id="botonCancelar" class="boton btnCerrar pointer" onclick="toggleVentana()" value="Cerrar">
            </div>
        </form>
    ` 
}

const alerta = (fondo, texto, tiempo) => {
    const ventana = document.getElementById('ventanaAlert')
    while (ventana.classList.length > 0) {
        ventana.classList.remove(ventana.classList.item(0))    
    }
    ventana.classList.add('ventanaAlert')
    
    switch (fondo) {
        case 'naranja':
            ventana.classList.add('fondoNaranja')
            break;
        case 'verde':
            ventana.classList.add('fondoVerde')
            break;
        case 'blanco':
            ventana.classList.add('fondoBlanco')
            break;
        case 'azul':
            ventana.classList.add('fondoAzul')
            break;
        case 'negro':
            ventana.classList.add('fondoNegro')
            break;
        case 'celeste':
            ventana.classList.add('fondoCeleste')
            break;
    }
    setTimeout(() => {
        ventana.classList.add('opacidad1')
      }, 10);


    const textoVentana = document.getElementById('textoAlert')
    textoVentana.innerHTML=`${texto}`

    setTimeout(() => {
        ventana.classList.remove('opacidad1');
      }, tiempo);
      setTimeout(() => {
        ventana.classList.add('ocultar');
      }, tiempo+1000);
}

mostrarProductos('db/productos.json','cajonProductos')
