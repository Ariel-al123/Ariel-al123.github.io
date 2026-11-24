const form = document.querySelector("#form-cafe");

const resumenLineas = document.querySelector("#resumen-lineas");
const totalNumero = document.querySelector("#total-numero");
const cantidadResumen = document.querySelector("#cantidad-resumen");
const previewNombre = document.querySelector("#preview-nombre");
const previewDetalle = document.querySelector("#preview-detalle");

const botonPreparar = document.querySelector("#preparar");
const botonReiniciar = document.querySelector("#reiniciar");
const botonAgregar = document.querySelector("#agregar-pedido");
const botonVaciar = document.querySelector("#vaciar-pedidos");

const lista = document.querySelector("#lista-pedidos");
const listaVacia = document.querySelector("#lista-vacia");

const modal = document.querySelector("#modal-preparacion");
const ticketNombre = document.querySelector("#ticket-nombre");
const ticketFolio = document.querySelector("#ticket-folio");
const ticketDetalle = document.querySelector("#ticket-detalle");
const ticketTotal = document.querySelector("#ticket-total");
const botonOtro = document.querySelector("#otro-cafe");
const botonCerrar = document.querySelector("#cerrar-modal");

let numeroPedido = 0;

function seleccionar(nombre) {
    return form.querySelector('input[name="' + nombre + '"]:checked');
}

function leerFormulario() {
    const base = seleccionar("base");
    const tamano = seleccionar("tamano");
    const temperatura = seleccionar("temperatura");
    const leche = seleccionar("leche");
    const agregados = form.querySelectorAll('input[name="agregados"]:checked');
    const cantidad = Number(document.querySelector("#cantidad").value);
    const nombre = document.querySelector("#nombre").value;

    if (base === null || tamano === null || temperatura === null || leche === null) {
        return null;
    }

    return {
        base: base,
        tamano: tamano,
        temperatura: temperatura,
        leche: leche,
        agregados: agregados,
        cantidad: cantidad,
        nombre: nombre
    };
}

function calcularTotal(datos) {
    let suma = Number(datos.base.dataset.price);

    suma = suma + Number(datos.tamano.dataset.price);
    suma = suma + Number(datos.leche.dataset.price);

    datos.agregados.forEach(function (agregado) {
        suma = suma + Number(agregado.dataset.price);
    });

    return suma * datos.cantidad;
}

function textoAgregados(datos) {
    let texto = "";

    datos.agregados.forEach(function (agregado) {
        texto = texto + " · " + agregado.dataset.label.toLowerCase();
    });

    return texto;
}

// resaltar las opciones elegidas
function resaltarOpciones() {
    const etiquetas = form.querySelectorAll("label.opcion");

    etiquetas.forEach(function (etiqueta) {
        const entrada = etiqueta.querySelector("input");

        if (entrada.checked) {
            etiqueta.classList.add("border-rosa", "bg-vino/30");
        } else {
            etiqueta.classList.remove("border-rosa", "bg-vino/30");
        }
    });
}

// mostrar el resultado en pantalla
function mostrarResumen() {
    const datos = leerFormulario();
    resaltarOpciones();

    if (datos === null) {
        return null;
    }

    const total = calcularTotal(datos);
    const precioBase = Number(datos.base.dataset.price) + Number(datos.tamano.dataset.price);

    let textoLeche = "Incluido";
    if (Number(datos.leche.dataset.price) > 0) {
        textoLeche = "MX$" + datos.leche.dataset.price;
    }

    let lineas = "";
    lineas += `<li class="flex items-start justify-between gap-4">
        <span class="text-crema/90">${datos.base.dataset.label} · ${datos.tamano.dataset.label}</span>
        <span class="font-medium text-rosa">MX$${precioBase}</span>
    </li>`;
    lineas += `<li class="flex items-start justify-between gap-4">
        <span class="text-crema/90">${datos.temperatura.dataset.label}</span>
        <span class="font-medium text-rosa">Incluido</span>
    </li>`;
    lineas += `<li class="flex items-start justify-between gap-4">
        <span class="text-crema/90">${datos.leche.dataset.label}</span>
        <span class="font-medium text-rosa">${textoLeche}</span>
    </li>`;

    datos.agregados.forEach(function (agregado) {
        lineas += `<li class="flex items-start justify-between gap-4">
            <span class="text-crema/90">${agregado.dataset.label}</span>
            <span class="font-medium text-rosa">MX$${agregado.dataset.price}</span>
        </li>`;
    });

    resumenLineas.innerHTML = lineas;
    totalNumero.textContent = total;
    cantidadResumen.textContent = "(" + datos.cantidad + ")";
    previewNombre.textContent = "Tu " + datos.base.dataset.label.toLowerCase();
    previewDetalle.textContent = datos.tamano.dataset.label + " · " + datos.temperatura.dataset.label + " · " + datos.leche.dataset.label + textoAgregados(datos);

    return datos;
}

// revisar si la lista está vacía
function actualizarLista() {
    const pedidos = lista.querySelectorAll("li.pedido");

    if (pedidos.length === 0) {
        listaVacia.classList.remove("hidden");
        botonVaciar.disabled = true;
    } else {
        listaVacia.classList.add("hidden");
        botonVaciar.disabled = false;
    }
}

// darles eventos a los botones de una tarjeta nueva
function conectarBotones(tarjeta) {
    const elegir = tarjeta.querySelector(".boton-elegir");
    const listo = tarjeta.querySelector(".boton-listo");
    const quitar = tarjeta.querySelector(".boton-quitar");

    elegir.addEventListener("click", function () {
        if (tarjeta.classList.contains("elegido")) {
            tarjeta.classList.remove("elegido", "border-rosa", "bg-vino/30");
            elegir.textContent = "Elegir";
        } else {
            tarjeta.classList.add("elegido", "border-rosa", "bg-vino/30");
            elegir.textContent = "Elegido";
        }
    });

    listo.addEventListener("click", function () {
        if (tarjeta.classList.contains("listo")) {
            tarjeta.classList.remove("listo", "border-rosa/60");
            listo.textContent = "Listo";
        } else {
            tarjeta.classList.add("listo", "border-rosa/60");
            listo.textContent = "Pendiente";
        }
    });

    quitar.addEventListener("click", function () {
        tarjeta.remove();
        actualizarLista();
    });
}

// agregar un café a la lista "Mis cafés"
function agregarPedido(datos) {
    numeroPedido = numeroPedido + 1;

    const folio = "CC-" + numeroPedido;
    const total = calcularTotal(datos);
    const detalle = datos.tamano.dataset.label + " · " + datos.temperatura.dataset.label + " · " + datos.leche.dataset.label + textoAgregados(datos);

    const tarjeta = document.createElement("li");
    tarjeta.className = "pedido rounded-2xl border border-white/10 bg-ciruela p-4 shadow-2xl shadow-noche/50";
    tarjeta.innerHTML = `
        <article class="flex flex-col gap-3">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <h3 class="truncate font-serif text-lg">${datos.cantidad} × ${datos.base.dataset.label}</h3>
                    <p class="mt-1 truncate text-xs text-stone-400">${detalle}</p>
                </div>
                <span class="whitespace-nowrap font-semibold text-rosa">MX$${total}</span>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                <span class="text-xs text-stone-500">${folio}</span>
                <div class="flex flex-wrap gap-2">
                    <button type="button" class="boton-elegir rounded-full border border-white/15 px-3 py-1.5 text-xs text-stone-300 transition hover:border-rosa hover:text-rosa">Elegir</button>
                    <button type="button" class="boton-listo rounded-full border border-white/15 px-3 py-1.5 text-xs text-stone-300 transition hover:border-rosa hover:text-rosa">Listo</button>
                    <button type="button" class="boton-quitar rounded-full border border-white/15 px-3 py-1.5 text-xs text-stone-300 transition hover:border-rosa hover:text-rosa">Quitar</button>
                </div>
            </div>
        </article>
    `;

    lista.appendChild(tarjeta);
    conectarBotones(tarjeta);
    actualizarLista();

    return folio;
}

function mostrarTicket(datos, folio) {
    let nombre = datos.nombre;
    if (nombre === "") {
        nombre = "Invitado";
    }

    ticketNombre.textContent = "Preparado para " + nombre + ".";
    ticketFolio.textContent = folio;
    ticketDetalle.textContent = datos.cantidad + " × " + datos.base.dataset.label + " " + datos.tamano.dataset.label + " · " + datos.temperatura.dataset.label + " · " + datos.leche.dataset.label + textoAgregados(datos);
    ticketTotal.textContent = "MX$" + calcularTotal(datos);

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");
    botonCerrar.focus();
}

function cerrarModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.setAttribute("aria-hidden", "true");
}

// Eventos del formulario
form.addEventListener("change", mostrarResumen);
form.addEventListener("input", mostrarResumen);

document.querySelector("#cantidad").addEventListener("change", function (evento) {
    let valor = Number(evento.target.value);

    if (valor < 1) {
        valor = 1;
    }
    if (valor > 10) {
        valor = 10;
    }

    evento.target.value = valor;
    mostrarResumen();
});

botonPreparar.addEventListener("click", function () {
    const datos = mostrarResumen();

    if (datos !== null) {
        const folio = agregarPedido(datos);
        mostrarTicket(datos, folio);
    }
});

botonAgregar.addEventListener("click", function () {
    const datos = mostrarResumen();

    if (datos !== null) {
        agregarPedido(datos);
    }
});

botonVaciar.addEventListener("click", function () {
    const pedidos = lista.querySelectorAll("li.pedido");

    pedidos.forEach(function (pedido) {
        pedido.remove();
    });

    actualizarLista();
});

botonReiniciar.addEventListener("click", function () {
    form.reset();
    mostrarResumen();
});

botonOtro.addEventListener("click", function () {
    form.reset();
    mostrarResumen();
    cerrarModal();
});

botonCerrar.addEventListener("click", cerrarModal);

mostrarResumen();
actualizarLista();
