/* =========================================================
   DISRUPT VINILS · HOME · Interacciones
   1. Menú responsive (jQuery)
   2. Acordeón "VER MÁS" de las fichas (jQuery)
   3. Slider de noticias con scroll horizontal (jQuery)
   4. Ranking de "Lo mejor del mes" (jQuery)
   5. Validación del newsletter (jQuery)
   6. AOS (Animate On Scroll)
   7. Typed.js
   ========================================================= */

$(document).ready(function () {

    /* ---------- 1. MENÚ RESPONSIVE ----------
       En móvil y tablet el menú está oculto (display: none en el CSS).
       Al pulsar el botón, slideToggle() lo despliega o lo pliega
       y toggleClass("abierto") convierte las tres barras en una X. */
    $(".menu-btn").on("click", function () {
        $(".menu").slideToggle(300);
        $(this).toggleClass("abierto");

        // Actualizamos los atributos de accesibilidad
        var abierto = $(this).hasClass("abierto");
        $(this).attr("aria-expanded", abierto);
        $(this).attr("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    // Al pulsar un enlace del menú en móvil, el menú se cierra
    $(".menu a").on("click", function () {
        if ($(".menu-btn").hasClass("abierto")) {
            $(".menu-btn").trigger("click");
        }
    });


    /* ---------- 2. ACORDEÓN "VER MÁS" ----------
       Cada ficha tiene un botón .acordeon__titulo y, justo antes,
       su .acordeon__contenido. Al pulsar el botón:
       - se pliegan las demás fichas que estuvieran abiertas
       - se despliega o pliega la ficha pulsada con slideToggle() */
    $(".acordeon__titulo").on("click", function () {
        var boton = $(this);
        var contenido = boton.prev(".acordeon__contenido");

        // Cerramos las otras fichas abiertas
        $(".acordeon__titulo").not(boton).removeClass("abierto")
            .attr("aria-expanded", false).text("VER MÁS");
        $(".acordeon__contenido").not(contenido).slideUp(300);

        // Abrimos o cerramos esta ficha
        contenido.slideToggle(300);
        boton.toggleClass("abierto");

        if (boton.hasClass("abierto")) {
            boton.text("VER MENOS").attr("aria-expanded", true);
        } else {
            boton.text("VER MÁS").attr("aria-expanded", false);
        }
    });


    /* ---------- 3. SLIDER DE NOTICIAS ----------
       El viewport (.slider) tiene overflow-x: auto, así que también se
       puede recorrer con el trackpad, la rueda + Shift o el dedo.
       jQuery lo controla con la misma lógica de un slideshow:
       una posición actual, un total y una función mostrar(n),
       pero en vez de fadeIn/fadeOut movemos el scroll con animate(). */
    var viewport = $(".slider");
    var slides = $(".noticia");
    var actual = 0;
    var total = slides.length;
    var autoplay;

    // Creamos un punto por cada noticia
    for (var i = 0; i < total; i++) {
        $("#puntos").append('<button type="button" class="slider__punto" aria-label="Ir a la noticia ' + (i + 1) + '"></button>');
    }
    var puntos = $(".slider__punto");

    // Distancia entre el inicio de una noticia y la siguiente (ancho + gap)
    function paso() {
        return slides.eq(1).offset().left - slides.eq(0).offset().left;
    }

    // Lo máximo que se puede desplazar el viewport
    function scrollMaximo() {
        return viewport[0].scrollWidth - viewport.outerWidth();
    }

    // Marca el punto de la noticia actual
    function actualizarPuntos() {
        puntos.removeClass("activo");
        puntos.eq(actual).addClass("activo");
    }

    // Lleva el slider a la noticia n
    function mostrar(n) {
        actual = n;
        var destino = Math.min(actual * paso(), scrollMaximo());
        viewport.stop().animate({ scrollLeft: destino }, 500);
        actualizarPuntos();
    }

    function siguiente() {
        // Si ya se ve el final del slider, volvemos a la primera noticia
        if (viewport.scrollLeft() >= scrollMaximo() - 5) {
            mostrar(0);
        } else {
            mostrar(actual + 1);
        }
    }

    function anterior() {
        if (actual === 0) {
            mostrar(total - 1);
        } else {
            mostrar(actual - 1);
        }
    }

    // Avance automático cada 4 segundos
    function iniciarAutoplay() {
        clearInterval(autoplay);
        autoplay = setInterval(siguiente, 4000);
    }

    // Si se pulsa un control, paramos el avance y lo reanudamos 5 segundos después
    function pausarAutoplay() {
        clearInterval(autoplay);
        clearTimeout(viewport.data("reanudar"));
        viewport.data("reanudar", setTimeout(iniciarAutoplay, 5000));
    }

    $("#siguiente").on("click", function () {
        siguiente();
        pausarAutoplay();
    });

    $("#anterior").on("click", function () {
        anterior();
        pausarAutoplay();
    });

    puntos.on("click", function () {
        mostrar($(this).index());
        pausarAutoplay();
    });

    // Mientras el ratón está encima del slider, no avanza solo
    viewport.on("mouseenter", function () {
        clearInterval(autoplay);
    });

    viewport.on("mouseleave", function () {
        iniciarAutoplay();
    });

    // Si el usuario hace scroll a mano, actualizamos la noticia actual
    viewport.on("scroll", function () {
        if (viewport.is(":animated")) {
            return;
        }
        if (viewport.scrollLeft() >= scrollMaximo() - 5) {
            actual = total - 1;
        } else {
            actual = Math.round(viewport.scrollLeft() / paso());
        }
        actualizarPuntos();
    });

    // Flechas del teclado cuando el foco está en el slider
    viewport.on("keydown", function (e) {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            $("#siguiente").trigger("click");
        }
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            $("#anterior").trigger("click");
        }
    });

    actualizarPuntos();
    iniciarAutoplay();


    /* ---------- 4. LO MEJOR DEL MES ----------
       Cada fila del ranking guarda en atributos data-* la información
       de su disco. Al pasar el ratón o pulsar una fila, se marca como
       activa y cambian la portada, el vinilo y los textos del destacado. */
    $(".ranking__fila").on("mouseenter click", function () {
        var fila = $(this);

        if (fila.hasClass("activa")) {
            return;
        }

        $(".ranking__fila").removeClass("activa");
        fila.addClass("activa");

        var media = $("#destacado-media");
        media.addClass("cambiando");

        // Esperamos a que termine el fundido para cambiar el contenido
        setTimeout(function () {
            if (fila.data("portada")) {
                media.removeClass("sin-imagen");
                $("#destacado-portada").attr("src", fila.data("portada"))
                    .attr("alt", "Portada de " + fila.data("titulo"));
                $("#destacado-vinilo").attr("src", fila.data("vinilo"));
            } else {
                // Discos sin imagen: portada tipográfica con el nombre del disco
                media.addClass("sin-imagen");
                $("#destacado-texto").text(fila.find(".ranking__disco").text());
            }

            $("#destacado-num").text(fila.data("num"));
            $("#destacado-titulo").text(fila.data("titulo"));
            $("#destacado-desc").text(fila.data("desc"));
            media.removeClass("cambiando");
        }, 250);
    });


    /* ---------- 5. VALIDACIÓN DEL NEWSLETTER ----------
       Comprobamos que el email no esté vacío y que tenga un formato
       válido antes de dar la suscripción por hecha. */
    $("#newsletter").on("submit", function (e) {
        e.preventDefault();

        var campo = $("#email");
        var mensaje = $("#newsletter-mensaje");
        var email = campo.val().trim();
        var formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (email === "") {
            campo.addClass("error");
            mensaje.removeClass("ok").addClass("error").text("Escribe tu email para suscribirte.");
        } else if (!formato.test(email)) {
            campo.addClass("error");
            mensaje.removeClass("ok").addClass("error").text("Ese email no parece válido.");
        } else {
            campo.removeClass("error").val("");
            mensaje.removeClass("error").addClass("ok").hide()
                .text("¡Hecho! Te escribiremos con las novedades.").fadeIn(400);
        }
    });

    // Al volver a escribir, quitamos el borde de error
    $("#email").on("input", function () {
        $(this).removeClass("error");
    });


    /* ---------- 6. AOS ----------
       Anima los elementos que tienen el atributo data-aos al hacer scroll. */
    AOS.init({
        duration: 700,
        offset: 80,
        once: true
    });


    /* ---------- 7. TYPED.JS ----------
       Escribe la frase de "Sobre nosotros". Para que se vea escribirse,
       solo empieza cuando la frase entra en la pantalla. */
    var typedIniciado = false;

    function comprobarTyped() {
        var posicionFrase = $("#typed").offset().top;
        var finalPantalla = $(window).scrollTop() + $(window).height();

        if (!typedIniciado && finalPantalla > posicionFrase + 50) {
            typedIniciado = true;

            new Typed("#typed", {
                strings: ["VINILOS NUEVOS Y DE SEGUNDA MANO DESDE MADRID, PARA LOS QUE AÚN ESCUCHAN LOS DISCOS ENTEROS"],
                typeSpeed: 35,
                showCursor: true,
                cursorChar: "_"
            });

            $(window).off("scroll", comprobarTyped);
        }
    }

    $(window).on("scroll", comprobarTyped);
    comprobarTyped();

});
