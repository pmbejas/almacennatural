let productos = []
let carrito = {
    fecha: Date.now,
    cantidadItems: 0,
    totalPagar: 0.00,
    listadoProductos: []
}

const mostrarPagina = (eleccion) => {
    let bloques = document.getElementsByClassName('mainContent')
    for (const bloque of bloques) {
        bloque.classList.add('ocultar')
    }
    switch (eleccion) {
        case 'inicio':
            var bloque = document.getElementById('itemInicio')
            break;
        case 'nosotros':
            var bloque = document.getElementById('itemNosotros')
            break;
        case 'productos':
            var bloque = document.getElementById('itemProductos')
            mostrarProductos('./db/productos.json','cajonProductos2')
            break;
        case 'ofertas':
            var bloque = document.getElementById('itemOfertas')
            break;
        case 'recetas':
            var bloque = document.getElementById('itemRecetas')
            break;
        case 'contacto':
            var bloque = document.getElementById('itemContacto')
            break;
    }
    bloque.classList.toggle('ocultar')
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
                    <img class="cardFotoProducto" src="${producto.foto}" alt="lechuga">
                    <span class="cardNombreProducto pointer" onclick="mostrarDatosProducto(${producto.id})">${producto.nombre}</span>
                    <span class="cardPrecioProducto">${producto.precio}</span>
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

const mostrarCarritoCompras = () => {
    toggleVentana()

    const ventana = document.getElementById('contenidoVentanaEmergente')
    ventana.innerHTML=`
        <div class="tituloVentana" >
            <span class="textoTituloVentana">CARRITO DE COMPRAS</span>
        </div>
        <div class="contenidoVentana">
            <table class="tablaCarrito">
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
                <td>${item.precio}</td>
                <td>${item.precio * item.cantidad}</td>
                <td><i class="bi bi-trash3 pointer" onclick="eliminarItemCarrito(${item.id})"></i></td>
            </tr>
        `
    }
    ventana.innerHTML += `
        <div class="pieCarrito">
            <div class="cantidadItems">
                <span class="">Cantidad de Items</span>
                <span class="">${carrito.cantidadItems}</span>
            </div>
            <div class="totalPagar">
                <span class="">Total a Pagar</span>
                <span class="">${carrito.totalPagar}</span>
            </div>
        </div>
    <div class="pieVentana">
        <input type="button" id="botonCancelar" class="boton btnCerrar pointer" onclick="toggleVentana()" value="Cerrar">
    </div>

    `
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

mostrarProductos('./db/productos.json','cajonProductos')




