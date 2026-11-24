/* Los colores viven en tema.css; aquí solo se mapean a clases Tailwind. */
window.tailwind.config = {
    theme: {
        extend: {
            colors: {
                noche: 'rgb(var(--noche-rgb) / <alpha-value>)',
                ciruela: 'rgb(var(--ciruela-rgb) / <alpha-value>)',
                vino: 'rgb(var(--vino-rgb) / <alpha-value>)',
                cereza: 'rgb(var(--cereza-rgb) / <alpha-value>)',
                orchid: 'rgb(var(--orchid-rgb) / <alpha-value>)',
                magenta: 'rgb(var(--magenta-rgb) / <alpha-value>)',
                malva: 'rgb(var(--malva-rgb) / <alpha-value>)',
                rosa: 'rgb(var(--rosa-rgb) / <alpha-value>)',
                crema: 'rgb(var(--crema-rgb) / <alpha-value>)',
            },
        },
    },
};
