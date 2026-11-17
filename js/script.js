/* =========================================================
   DISRUPT VINILS · HOME · Interacciones
   1. Menú responsive (jQuery)
   2. Acordeón "VER MÁS" de las fichas (jQuery)
   3. Slider de noticias con scroll horizontal (jQuery)
   4. Ranking de "Lo mejor del mes" (jQuery)
   5. Validación del newsletter (jQuery)
   6. AOS (Animate On Scroll)
   7. Typed.js
   8. Filtro por géneros del catálogo (jQuery)
   El mismo archivo sirve para index.html y catalogo.html: cada bloque
   solo hace algo si su sección existe en la página.
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

        // Cerramos las otras fichas abiertas (y ocultamos su ficha en escritorio)
        $(".acordeon__titulo").not(boton).removeClass("abierto")
            .attr("aria-expanded", false).text("VER MÁS");
        $(".acordeon__contenido").not(contenido).slideUp(300);
        $(".disco").not(boton.closest(".disco")).removeClass("activo");

        // Abrimos o cerramos esta ficha
        contenido.slideToggle(300);
        boton.toggleClass("abierto");

        if (boton.hasClass("abierto")) {
            boton.text("VER MENOS").attr("aria-expanded", true);
        } else {
            boton.text("VER MÁS").attr("aria-expanded", false);
        }
    });


    /* ---------- 2b. FICHA QUE APARECE CON HOVER (escritorio) ----------
       Al entrar en la portada, el disco recibe la clase "activo": el CSS
       saca el vinilo girando y desliza la ficha. Al salir del disco
       (portada + ficha) se quita, salvo que la ficha esté abierta. */
    $(".disco .disco__media").on("mouseenter", function () {
        $(this).closest(".disco").addClass("activo");
    });

    $(".disco").on("mouseleave", function () {
        var abierta = $(this).find(".acordeon__titulo").hasClass("abierto");
        if (!abierta) {
            $(this).removeClass("activo");
            // Quitamos el foco del botón para que la ficha se oculte también
            $(this).find(":focus").trigger("blur");
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

    // Solo en la home: el catálogo no tiene slider
    if (total > 0) {
        actualizarPuntos();
        iniciarAutoplay();
    }


    /* ---------- 4. LO MEJOR DEL MES ----------
       Cada fila del ranking guarda en atributos data-* la información
       de su disco. Al pasar el ratón o pulsar una fila, se marca como
       activa y cambian la portada, el vinilo y los textos del destacado.
       Además, el vinilo del destacado se anima mientras estás en el ranking. */
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
            $("#destacado-portada").attr("src", fila.data("portada"))
                .attr("alt", "Portada de " + fila.data("titulo"));
            $("#destacado-vinilo").attr("src", fila.data("vinilo"));

            $("#destacado-num").text(fila.data("num"));
            $("#destacado-titulo").text(fila.data("titulo"));
            $("#destacado-desc").text(fila.data("desc"));
            media.removeClass("cambiando");
        }, 250);
    });


    // Mientras el ratón (o el foco del teclado) está sobre el ranking,
    // el vinilo del destacado sale de la portada y gira, igual que al
    // pasar por encima de la propia portada
    $(".ranking").on("mouseenter focusin", function () {
        $("#destacado-media").addClass("animado");
    });

    $(".ranking").on("mouseleave focusout", function () {
        $("#destacado-media").removeClass("animado");
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

    // Solo en la home: el catálogo no tiene la frase de "Sobre nosotros"
    if ($("#typed").length) {
        $(window).on("scroll", comprobarTyped);
        comprobarTyped();
    }


    /* ---------- 8. FILTRO DEL CATÁLOGO ----------
       El botón FILTRAR despliega la lista de géneros con slideToggle().
       Cada disco guarda sus géneros en data-generos ("trap pop"...).
       Al elegir un género, se muestran con fadeIn() los discos que lo
       tienen y se ocultan con fadeOut() los demás. */
    var discos = $(".catalogo__lista .disco");

    // Abrir y cerrar la lista de géneros
    $(".filtro__boton").on("click", function () {
        $(".filtro__lista").slideToggle(200);
        $(this).toggleClass("abierto");
        $(this).attr("aria-expanded", $(this).hasClass("abierto"));
    });

    // Si se pulsa fuera del filtro, la lista se cierra
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".filtro").length && $(".filtro__boton").hasClass("abierto")) {
            $(".filtro__boton").trigger("click");
        }
    });

    function filtrar(genero) {
        var visibles = 0;

        // Marcamos la opción elegida y cambiamos el texto del botón
        $(".filtro__opcion").removeClass("activo");
        $('.filtro__opcion[data-genero="' + genero + '"]').addClass("activo");
        $(".filtro__texto").text(genero === "todos" ? "FILTRAR" : genero.toUpperCase());

        discos.each(function () {
            // data-generos puede tener varios géneros separados por espacios
            var generos = $(this).data("generos").split(" ");

            if (genero === "todos" || generos.indexOf(genero) !== -1) {
                $(this).fadeIn(300);
                visibles++;
            } else {
                $(this).fadeOut(300);
            }
        });

        $("#resultado").text(visibles + (visibles === 1 ? " DISCO" : " DISCOS"));

        // AOS recalcula las posiciones cuando cambia el tamaño de la lista
        setTimeout(function () {
            AOS.refresh();
        }, 350);
    }

    $(".filtro__opcion").on("click", function () {
        filtrar($(this).data("genero"));
        $(".filtro__boton").trigger("click");
    });

    // Los enlaces de GÉNEROS del pie (#pop, #jazz...) también filtran
    function filtrarDesdeEnlace() {
        var genero = window.location.hash.replace("#", "");
        if ($('.filtro__opcion[data-genero="' + genero + '"]').length) {
            filtrar(genero);
        }
    }

    if (discos.length) {
        // Al pulsar un género del pie, filtramos y subimos hasta el catálogo
        $(window).on("hashchange", function () {
            filtrarDesdeEnlace();
            $("html, body").animate({ scrollTop: 0 }, 500);
        });
        // Si se llega desde la home con catalogo.html#pop, se filtra al cargar
        filtrarDesdeEnlace();
    }

});
