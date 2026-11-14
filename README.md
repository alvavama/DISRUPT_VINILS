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
- Responsive *mobile first* con media queries: **móvil** (base), **tablet** (≥768px) y **escritorio** (≥1024px).
- Tipografías: *Bitcount Prop Single* (Google Fonts) y *Helvetica Neue*.

## Interacciones y librerías

| Interacción | Dónde | Librería |
| --- | --- | --- |
| Slider de noticias con scroll horizontal (flechas, puntos, avance automático y teclado) | Noticias y novedades | jQuery (sin librerías de sliders) |
| Menú de navegación responsive (hamburguesa + `slideToggle`) | Cabecera (móvil y tablet) | jQuery |
| Acordeón "VER MÁS / VER MENOS" con ficha del disco | Recién llegado | jQuery |
| Ranking que cambia el disco destacado | Lo mejor del mes | jQuery |
| Validación del formulario de newsletter | Footer | jQuery |
| Animaciones al hacer scroll (títulos, discos, datos) | Varias secciones | AOS |
| Texto que se escribe solo al llegar a la sección | Sobre nosotros | Typed.js |
| Vinilo que sale de la portada y gira · bandas del logo que giran · marquee | Varias | CSS |

## Estructura

```
├── index.html
├── css/styles.css
├── js/script.js
└── img/
```

## Flujo de trabajo con Git

- `main`: rama estable con la versión publicada.
- `HOME`: rama de desarrollo de la página Home; sus cambios se fusionan en `main`.

## Uso de IA

Se ha utilizado Claude (Anthropic) como apoyo para completar el diseño de la Home en Figma y generar una primera versión del código, que después se ha revisado y adaptado.
