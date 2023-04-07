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
            TODAVIA EN CONSTRUCCION
        </div>
        <div class="pieVentana">
            <input type="button" id="botonCancelar" class="boton btnCerrar pointer" onclick="toggleVentana()" value="Cerrar">
        </div>

    ` 
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
                        <p class="precioProductoVentana" ><b>Precio: </b>$${producto.precio}</p>
                    </div>
                    <div class="pieVentana">
                        <input type="button" id="botonCancelar" class="boton btnCerrar pointer" onclick="toggleVentana()" value="Cerrar">
                    </div>
                </form>
    ` 
}

mostrarProductos('./db/productos.json','cajonProductos')




