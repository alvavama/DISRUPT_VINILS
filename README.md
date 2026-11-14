# DISRUPT_VINILS

Web interactiva de una tienda de vinilos independiente en Madrid.
**Diseño Web Avanzado · Práctica 02 — Web interactiva con jQuery y librerías JS** (UDIT, curso 2026/27).

- Diseño en Figma: [DWA-P2](https://www.figma.com/design/56XYFJlEcYw10isRoIyGHR/DWA-P2)
- Integrantes: Álvaro Vallejo

## Páginas

| Página | Secciones | Estado |
| --- | --- | --- |
| `index.html` (Home) | Recién llegado · Noticias y novedades · Lo mejor del mes · Sobre nosotros | ✅ |
| `catalogo.html` | Filtro por género (Pop, Jazz, Trap, Soul) | 🚧 Pendiente |

## Tecnologías

- HTML5 semántico (`header`, `nav`, `main`, `section`, `article`, `footer`, `time`, `address`…)
- CSS3 con variables, Flexbox y Grid. Sin frameworks.
- Responsive con media queries: **escritorio** (≥1024px), **tablet** (768–1023px) y **móvil** (≤767px).
- Tipografías: *Bitcount Prop Single* (Google Fonts) y *Helvetica Neue*.

## Interacciones y librerías

| Interacción | Dónde | Librería |
| --- | --- | --- |
| Slider / carrusel de noticias (flechas, puntos, teclado, responsive) | Noticias y novedades | jQuery (sin librerías de sliders) |
| Menú de navegación responsive (hamburguesa + `slideToggle`) | Cabecera (tablet y móvil) | jQuery |
| Acordeón "VER MÁS / VER MENOS" con ficha del disco | Recién llegado | jQuery |
| Ranking que cambia el disco destacado | Lo mejor del mes | jQuery |
| Validación del formulario de newsletter | Footer | jQuery |
| Animaciones al hacer scroll (títulos, discos, datos) | Varias secciones | AOS |
| Texto que se escribe solo al llegar a la sección | Sobre nosotros | Typed.js |
| Vinilo que sale de la funda al pasar el ratón · logo que gira · marquee | Varias | CSS |

## Estructura

```
├── index.html
├── css/styles.css
├── js/script.js
└── img/
```

## Flujo de trabajo con Git

- `main`: rama estable.
- `dev-alvaro`: rama personal de desarrollo; los cambios se fusionan en `main`.

## Uso de IA

Se ha utilizado Claude (Anthropic) como apoyo para completar el diseño de la Home en Figma y generar una primera versión del código, que después se ha revisado y adaptado.
