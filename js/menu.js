//  mostrar solo los productos de la categoría elegida
function filtrarCarta(categoria) {
    const productos = document.querySelectorAll(".producto");
    const botones = document.querySelectorAll(".boton-filtro");

    productos.forEach(function (producto) {
        if (categoria === "todos" || producto.dataset.categoria === categoria) {
            producto.classList.remove("hidden");
        } else {
            producto.classList.add("hidden");
        }
    });

    botones.forEach(function (boton) {
        if (boton.dataset.categoria === categoria) {
            boton.classList.add("bg-rosa", "text-noche");
            boton.classList.remove("border-white/15", "text-stone-300");
        } else {
            boton.classList.remove("bg-rosa", "text-noche");
            boton.classList.add("border-white/15", "text-stone-300");
        }
    });
}

const botonesFiltro = document.querySelectorAll(".boton-filtro");
botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
        filtrarCarta(boton.dataset.categoria);
    });
});

filtrarCarta("todos");
