let productos = []
let usuarioActivo = {
    id: 0,
    nombre: "",
    apellido: "",
    email:"",
    avatar: 0
}

let carrito = {
    fecha: Date.now,
    cantidadItems: 0,
    totalPagar: 0.00,
    listadoProductos: []
}
const carritoLocal = window.localStorage;

const mostrarMenuMovil = () => {
    const menu = document.getElementById('barraNavegacionMovil')
    menu.classList.toggle('ocultar')
}

const mostrarUsuarioActivo = () => {
    toggleElemento('cardUsuario','add')
    toggleElemento('cardUsuarioInactivo','add')

    if (usuarioActivo.id > 0) {
        toggleElemento('iconoUsuarioActivo', 'remove')
        toggleElemento('iconoUsuarioInactivo', 'add')

        const nombre= document.getElementById('nombreUsuario')
        nombre.innerHTML = usuarioActivo.nombre + " " + usuarioActivo.apellido;
        const email = document.getElementById('emailUsuario')
        email.innerHTML = usuarioActivo.email;
        const foto = document.getElementById('iconoUsuarioActivo')
        foto.src = './img/usuarios/usuarioId'+usuarioActivo.id+'.jpg'

    } else {
        toggleElemento('iconoUsuarioActivo', 'add')
        toggleElemento('iconoUsuarioInactivo', 'remove')
    }
}

const logOut = () => {
    usuarioActivo = {
        id: 0,
        nombre: "",
        apellido: "",
        email:"",
        avatar: 0
    }
    mostrarUsuarioActivo()
}

const logIn = () => {
    
    toggleElemento('cardUsuarioInactivo','add')
    toggleVentana()

    const ventana = document.getElementById('contenidoVentanaEmergente')
    ventana.innerHTML=`
            <div class="tituloVentana" >
                <span class="textoTituloVentana">Formulario de LogIn</span>
                <i class="bi bi-x-lg pointer botonCerrarVentana" id="botonCancelar" onclick="toggleVentana()" ></i>
            </div>
            <div class="contenidoVentana">
                <div class="login">
                    <form class="formLogin" action="" id="formLogin">
                        <span class"tituloFormLogin">Acceso al Sistema</span>
                        <div class="lineaFormulario">
                            <label for="email">Email:</label>
                            <input class="campoUsuario" type="email" name="email" id="campoUsuario" required>
                        </div>
                        <div class="lineaFormulario">
                            <label for="contraseña">Contraseña:</label>
                            <input class="campoUsuario" type="password" name="contrasena" id="campoContrasena" required>
                        </div>
                        <div class="lineaFormulario">
                            <button class="boton btnAgregar" type="submit" onclick="identificarse()">Identificarse</button>
                        </div>
                    </form>
                </div>
            </div>
            `
}

const identificarse = () => {
    const formulario = document.getElementById('formLogin');
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        fetch("./db/usuarios.json")
        .then( res => res.json() )
        .then( usuarios => {
            let usuarioSeleccionado  = usuarios.find(usuario => usuario.email === formulario.email.value); 
            if (usuarioSeleccionado) {
                if (usuarioSeleccionado.contrasena === formulario.contrasena.value) {
                    usuarioActivo = {
                        id: usuarioSeleccionado.id,
                        nombre: usuarioSeleccionado.nombre,
                        apellido: usuarioSeleccionado.apellido,
                        email: usuarioSeleccionado.email,
                        avatar: 1
                    }
                    toggleVentana()
                    mostrarUsuarioActivo()
                    alerta('celeste','Acceso Correcto', 2000)
                } else {
                    alerta('rojo','Contraseña Incorrecta', 2000)
                }
            } else {
                alerta('rojo','Email NO registrado', 2000)
            }
        });
    })

}

const mostrarPagina = (eleccion) => {

    const elementoToggle = document.getElementById('cardUsuario')
    elementoToggle.classList.add('ocultar')

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
                        <div class="pieCard">
                            <span class="cardPrecioProducto">$ ${producto.precio}</span>
                            <span class="cardMas pointer" onclick="mostrarDatosProducto(${producto.id})">mas datos</span>
                        </div>
                    </div>
                `
                productos.push(producto)
            }
        });
}


const toggleElemento = (elemento, accion) => {
    const elementoClase = document.getElementById(elemento)
    switch (accion) {
        case 'add':
            elementoClase.classList.add('ocultar')        
            break;
        case 'toggle':
            elementoClase.classList.toggle('ocultar')        
            break;
        case 'remove':
            elementoClase.classList.remove('ocultar')        
            break;
    }
}

const toggleVentana = () => {

    const elementoToggle = document.getElementById('cardUsuario')
    elementoToggle.classList.add('ocultar')

    toggleElemento('ventanaEmergente', 'toggle')

    const globo = document.getElementById('globoCarrito')
    globo.classList.toggle('ocultar')
}


function guardarCarritoLocal () {
    carritoLocal.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoLocal () {
    if (carritoLocal.getItem('carrito') !== null) {
            carrito = JSON.parse(carritoLocal.getItem('carrito'));
    }
}

const CarritoCompras = (accion) => {
    if (accion=="mostrar") {
        toggleVentana()
    }
    const ventana = document.getElementById('contenidoVentanaEmergente')
    ventana.innerHTML=`
            <div class="tituloVentana" >
                <span class="textoTituloVentana">CARRITO DE COMPRAS</span>
                <i class="bi bi-x-lg pointer botonCerrarVentana" id="botonCancelar" onclick="toggleVentana()" ></i>
            </div> `
    if (carrito.cantidadItems > 0) {
        ventana.innerHTML +=`
            <div class="contenidoVentana">
                <div class="resumenCarrito">
                    <div class="cardResumenCarrito">
                        <span class="tituloCardResumenCarrito">Items</span>
                        <span class="textoCardResumenCarrito">${carrito.cantidadItems}</span>
                    </div>
                    <div class="cardResumenCarrito">
                        <span class="tituloCardResumenCarrito">Total a Pagar</span>
                        <span class="textoCardResumenCarrito">$ ${carrito.totalPagar}</span>
                    </div>
                </div>
                <table class="tablaCarrito">
                    <span class="tituloTablaCarrito">Detalle de Productos</span>
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
}

const eliminarItemCarrito = (id) => {
    let indice = carrito.listadoProductos.findIndex(elemento => elemento.id === id); 
    carrito.cantidadItems = carrito.cantidadItems - parseInt(carrito.listadoProductos[indice].cantidad)
    carrito.totalPagar = carrito.totalPagar - parseInt(carrito.listadoProductos[indice].total)
    if (indice !== -1) {
        carrito.listadoProductos.splice(indice, 1);
    }
    CarritoCompras('actualizar')
    guardarCarritoLocal()
    alerta('celeste','Se ha Eliminado el Producto del Carrito', 2500);
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
    guardarCarritoLocal()
    alerta('verde','Se agregó el prducto al carrito de compras. Muchas Gracias', 2500)
}

const buscarProducto = (seccion) => {
    const texto = document.getElementById(seccion)
    const existeProducto = productos.filter(producto => producto.nombre.toUpperCase().includes(texto.value.toUpperCase()))
    let httpProductos = document.getElementById('cajonProductos')
    httpProductos.innerHTML = ""
        for (producto of existeProducto) {
            httpProductos.innerHTML += `
                <div class="card">
                    <img class="cardFotoProducto pointer" onclick="mostrarDatosProducto(${producto.id})" src="${producto.foto}" alt="lechuga">
                    <span class="cardNombreProducto pointer" onclick="mostrarDatosProducto(${producto.id})">${producto.nombre}</span>
                    <div class="pieCard">
                        <span class="cardPrecioProducto">$ ${producto.precio}</span>
                        <span class="cardMas pointer" onclick="mostrarDatosProducto(${producto.id})">mas datos</span>
                    </div>
                </div>
            `
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
                <i class="bi bi-x-lg pointer botonCerrarVentana" id="botonCancelar" onclick="toggleVentana()" ></i>
            </div>
            <div class="contenidoVentana">
                <span class="nombreProductoVentana">${producto.nombre}</span>
                <div class="imagenDescripcion">
                    <img class="imagenProductoVentana" src="${producto.foto}" alt="">
                    <div class="grupoElementosVentana">
                        <p class="textoDescripcion">${producto.beneficios}</p>
                        <div class="cantidadCarrito">
                            <p class="precioProductoVentana" ><b>Precio: </b>$${producto.precio}</p>
                            <input type="number" class="campo" min="1" max="10" id="cantidadId${producto.id}" value="1" style="text-align: center; font-weight: 600;">
                            <input type="button" id="botonAgregar" class="boton btnAgregar pointer" onclick="agregarProductoCarrito(${producto.id},1,'${producto.nombre}',${producto.precio})" value="Agregar al Carrito">
                        </div>
                    </div>
                </div>
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
        case 'rojo':
            ventana.classList.add('fondoRojo')
            break;
        case 'rojoClaro':
            ventana.classList.add('fondoRojoClaro')
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

const cambioScreenSize = () => {
    let agregarHTML
    if (document.documentElement.clientWidth < 1024) {
        agregarHTML = document.getElementById('divUsuario')
        agregarHTML.innerHTML = ""    
        agregarHTML = document.getElementById('usuarioMovil')
    } else {
        agregarHTML = document.getElementById('usuarioMovil')
        agregarHTML.innerHTML = ""    
        agregarHTML = document.getElementById('divUsuario')
    }
    agregarHTML.innerHTML = `
        <img class="fotoUsuario pointer" id="iconoUsuarioActivo" src="" alt="" onclick="toggleElemento('cardUsuario','toggle')">
        <div class="cardUsuario ocultar" id="cardUsuario">
            <img class="cardFotoUsuario" src="./img/usuarios/usuarioId1.jpg" alt="">
            <h4 id="nombreUsuario"></h4>
            <span id="emailUsuario"></span>
            <div class="separador"></div>
            <div class="items pointer">
                <div class="itemUsuario" onclick="logOut()">
                    <i class="bi bi-box-arrow-right"></i>
                    <span class="">Salir</span>
                </div>
            </div>
        </div>
        <img class="fotoUsuario pointer ocultar" id="iconoUsuarioInactivo" src="./img/usuarios/userBlanco.png" alt="" onclick="toggleElemento('cardUsuarioInactivo','toggle')">
        <div class="cardUsuario ocultar" id="cardUsuarioInactivo">
            <img class="cardFotoUsuario" src="./img/usuarios/userBlanco.png" alt="">
            <span>Usuario Inactivo</span>
            <div class="separador"></div>
            <div class="items pointer">
                <div class="itemUsuario" onclick="logIn()">
                    <i class="bi bi-box-arrow-in-left"></i>
                    <span class="">Identificarse</span>
                </div>
            </div>
        </div>
    `
    mostrarUsuarioActivo()
}

document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('resize', cambioScreenSize);

    cambioScreenSize()

    mostrarUsuarioActivo()
    
    cargarCarritoLocal()
    
    mostrarProductos('db/productos.json','cajonProductos')

    var input = document.getElementById('campoBuscar');
    input.addEventListener("keypress", (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault();
            buscarProducto('campoBuscar')
        }
    });

    const formulario = document.getElementById('formularioContacto');
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!formulario.checkValidity()) {
            alerta('naranja','Por favor, complete todos los campos requeridos.', 3000);
        } else {
            if (!isNaN(formulario.telefono.value)){
                if (formulario.opcionTelefono.value > 0 ) {
                    alerta('verde','se ha enviado su consulta con éxito', 3000);
                } else {
                    alerta('naranja','Por favor, indique si quiere ser contactado via Telefónica.', 3000);
                }
            } else {
                alerta('naranja','Por favor, ingrese solo numeros en el "numero de teléfono".', 3000);
            }
        }
    });
});
