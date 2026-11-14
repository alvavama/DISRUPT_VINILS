/* =========================================================
   DISRUPT VINILS · Interacciones de la Home
   - jQuery: menú responsive, acordeón "VER MÁS", slider de
     noticias, ranking "Lo mejor del mes" y validación newsletter
   - AOS: animaciones al hacer scroll
   - Typed.js: texto que se escribe en "Sobre nosotros"
   ========================================================= */

$(function () {

  /* ---------- 1. MENÚ RESPONSIVE (jQuery) ---------- */
  var $toggle = $('.menu-toggle');
  var $menu = $('.menu');

  $toggle.on('click', function () {
    var abierto = $(this).toggleClass('abierto').hasClass('abierto');
    $(this).attr({
      'aria-expanded': abierto,
      'aria-label': abierto ? 'Cerrar menú' : 'Abrir menú'
    });
    $menu.stop(true, true).slideToggle(300);
  });

  // Al pulsar un enlace en móvil/tablet se cierra el menú
  $menu.find('a').on('click', function () {
    if ($toggle.is(':visible') && $toggle.hasClass('abierto')) {
      $toggle.trigger('click');
    }
  });

  // Si se agranda la ventana a escritorio, quitamos el estilo inline del slideToggle
  $(window).on('resize', function () {
    if (!$toggle.is(':visible')) {
      $menu.removeAttr('style');
      $toggle.removeClass('abierto').attr('aria-expanded', false);
    }
  });


  /* ---------- 2. ACORDEÓN "VER MÁS" en las fichas (jQuery) ---------- */
  $('.boton-desplegar').on('click', function () {
    var $boton = $(this);
    var $extra = $('#' + $boton.attr('aria-controls'));
    var abierto = $boton.attr('aria-expanded') === 'true';

    $extra.stop(true, true).slideToggle(350);
    $boton.attr('aria-expanded', !abierto);
    $boton.find('.boton-desplegar__texto').text(abierto ? 'VER MÁS' : 'VER MENOS');
  });


  /* ---------- 3. SLIDER DE NOTICIAS (jQuery, sin librerías) ---------- */
  var $slider = $('.slider');
  var $pista = $('.slider__pista');
  var $tarjetas = $pista.children('.noticia');
  var $prev = $('.flecha--prev');
  var $next = $('.flecha--next');
  var $puntos = $('.slider__puntos');
  var indice = 0;

  // Cuántas tarjetas caben a la vez según el ancho del slider
  function tarjetasVisibles() {
    var anchoTarjeta = $tarjetas.first().outerWidth();
    return Math.max(1, Math.round($slider.width() / anchoTarjeta));
  }

  function maxIndice() {
    return Math.max(0, $tarjetas.length - tarjetasVisibles());
  }

  // Crea un punto por cada posición posible
  function crearPuntos() {
    $puntos.empty();
    for (var i = 0; i <= maxIndice(); i++) {
      $('<button>', {
        'class': 'slider__punto',
        type: 'button',
        role: 'tab',
        'aria-label': 'Ir a la noticia ' + (i + 1)
      }).data('indice', i).appendTo($puntos);
    }
  }

  function moverSlider() {
    var gap = parseFloat($pista.css('gap')) || 0;
    var paso = $tarjetas.first().outerWidth() + gap;

    indice = Math.min(Math.max(indice, 0), maxIndice());
    $pista.css('transform', 'translateX(' + (-indice * paso) + 'px)');

    $prev.prop('disabled', indice === 0);
    $next.prop('disabled', indice === maxIndice());
    $puntos.children().removeClass('activo').attr('aria-selected', false)
      .eq(indice).addClass('activo').attr('aria-selected', true);
  }

  $prev.on('click', function () { indice--; moverSlider(); });
  $next.on('click', function () { indice++; moverSlider(); });

  $puntos.on('click', '.slider__punto', function () {
    indice = $(this).data('indice');
    moverSlider();
  });

  // Flechas del teclado cuando el foco está dentro del slider
  $('#noticias').on('keydown', function (e) {
    if (e.key === 'ArrowLeft') { $prev.trigger('click'); }
    if (e.key === 'ArrowRight') { $next.trigger('click'); }
  });

  // Recalcular al cambiar el tamaño de la ventana
  var temporizador;
  $(window).on('resize', function () {
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      crearPuntos();
      moverSlider();
    }, 150);
  });

  crearPuntos();
  moverSlider();


  /* ---------- 4. LO MEJOR DEL MES: ranking que cambia el destacado (jQuery) ---------- */
  var $media = $('.destacado__media');

  $('.ranking__fila').on('click mouseenter', function () {
    var $fila = $(this);
    if ($fila.hasClass('activa')) { return; }

    $('.ranking__fila').removeClass('activa');
    $fila.addClass('activa');

    var datos = $fila.data(); // data-num, data-titulo, data-portada, data-vinilo, data-desc

    $media.addClass('cargando');
    setTimeout(function () {
      if (datos.portada) {
        $media.removeClass('sin-imagen');
        $('.js-dest-portada').attr({ src: datos.portada, alt: 'Portada de ' + datos.titulo });
        $('.js-dest-vinilo').attr('src', datos.vinilo);
      } else {
        // Discos sin imagen: portada tipográfica
        $media.addClass('sin-imagen');
        $('.js-dest-texto').text($fila.find('.ranking__disco').text());
      }
      $('.js-dest-num').text(datos.num);
      $('.js-dest-titulo').text(datos.titulo);
      $('.js-dest-desc').text(datos.desc);
      $media.removeClass('cargando');
    }, 250);
  });


  /* ---------- 5. VALIDACIÓN DEL NEWSLETTER (jQuery) ---------- */
  $('.newsletter__form').on('submit', function (e) {
    e.preventDefault();
    var $input = $(this).find('input[type="email"]');
    var $msg = $(this).find('.newsletter__msg');
    var email = $.trim($input.val());
    var patron = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (email === '') {
      $input.addClass('error');
      $msg.removeClass('ok').addClass('error').text('Escribe tu email para suscribirte.');
    } else if (!patron.test(email)) {
      $input.addClass('error');
      $msg.removeClass('ok').addClass('error').text('Ese email no parece válido.');
    } else {
      $input.removeClass('error').val('');
      $msg.removeClass('error').addClass('ok').hide().text('¡Hecho! Te escribiremos con las novedades.').fadeIn(300);
    }
  });

  $('.newsletter__form input').on('input', function () {
    $(this).removeClass('error');
  });


  /* ---------- 6. AOS (Animate On Scroll) ---------- */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80
  });


  /* ---------- 7. TYPED.JS: statement de "Sobre nosotros" ---------- */
  // Empieza a escribir solo cuando la sección entra en pantalla
  var $typed = $('.js-typed');
  var typedIniciado = false;

  function comprobarTyped() {
    if (typedIniciado) { return; }
    var arribaSeccion = $typed.offset().top;
    var abajoVentana = $(window).scrollTop() + $(window).height();

    if (abajoVentana > arribaSeccion + 50) {
      typedIniciado = true;
      new Typed('.js-typed', {
        strings: [$typed.data('texto')],
        typeSpeed: 35,
        showCursor: true,
        cursorChar: '_'
      });
      $(window).off('scroll', comprobarTyped);
    }
  }

  $(window).on('scroll', comprobarTyped);
  comprobarTyped();
});
