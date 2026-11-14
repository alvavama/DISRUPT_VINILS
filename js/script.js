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


  /* ---------- 3. SLIDER DE NOTICIAS con scroll horizontal (jQuery, sin librerías) ----------
     El viewport (.slider) tiene overflow-x: auto, así que se puede recorrer con
     el trackpad, la rueda + Shift o el dedo. jQuery añade: flechas, puntos,
     arrastre con el ratón y teclado, todos moviendo el scrollLeft del viewport. */
  var $slider = $('.slider');
  var $pista = $('.slider__pista');
  var $tarjetas = $pista.children('.noticia');
  var $prev = $('.flecha--prev');
  var $next = $('.flecha--next');
  var $puntos = $('.slider__puntos');

  // Distancia entre el inicio de una tarjeta y la siguiente
  function paso() {
    var gap = parseFloat($pista.css('column-gap')) || 0;
    return $tarjetas.first().outerWidth() + gap;
  }

  function scrollMaximo() {
    return $slider[0].scrollWidth - $slider[0].clientWidth;
  }

  // Tarjeta que está al principio del viewport
  function indiceActual() {
    if ($slider.scrollLeft() >= scrollMaximo() - 2) { return $tarjetas.length - 1; }
    return Math.round($slider.scrollLeft() / paso());
  }

  function irA(indice) {
    indice = Math.min(Math.max(indice, 0), $tarjetas.length - 1);
    var destino = Math.min(indice * paso(), scrollMaximo());
    $slider.stop().animate({ scrollLeft: destino }, 450);
  }

  // Un punto por tarjeta
  $tarjetas.each(function (i) {
    $('<button>', {
      'class': 'slider__punto',
      type: 'button',
      'aria-label': 'Ir a la noticia ' + (i + 1)
    }).data('indice', i).appendTo($puntos);
  });

  // Actualiza puntos y flechas según la posición del scroll
  function actualizarSlider() {
    var actual = indiceActual();
    $puntos.children().removeClass('activo').removeAttr('aria-current')
      .eq(actual).addClass('activo').attr('aria-current', 'true');
    $prev.prop('disabled', $slider.scrollLeft() <= 2);
    $next.prop('disabled', $slider.scrollLeft() >= scrollMaximo() - 2);
  }

  $prev.on('click', function () { irA(indiceActual() - 1); });
  $next.on('click', function () {
    // Si estamos entre dos tarjetas, avanzamos a la siguiente completa
    irA(Math.floor($slider.scrollLeft() / paso() + 0.05) + 1);
  });
  $puntos.on('click', '.slider__punto', function () { irA($(this).data('indice')); });
  $slider.on('scroll', actualizarSlider);

  // Teclado: flechas izquierda/derecha cuando el foco está en la sección
  $('#noticias').on('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); $prev.trigger('click'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); $next.trigger('click'); }
  });

  // Arrastrar con el ratón para hacer scroll
  var arrastre = { activo: false, x: 0, scroll: 0, movido: false };

  $slider.on('mousedown', function (e) {
    if (e.which !== 1) { return; }
    e.preventDefault(); // evita seleccionar texto o arrastrar la imagen
    arrastre = { activo: true, x: e.pageX, scroll: $slider.scrollLeft(), movido: false };
    $slider.stop();
  });

  $(document).on('mousemove', function (e) {
    if (!arrastre.activo) { return; }
    var distancia = e.pageX - arrastre.x;
    if (Math.abs(distancia) > 5) {
      arrastre.movido = true;
      $slider.addClass('arrastrando');
    }
    $slider.scrollLeft(arrastre.scroll - distancia);
  });

  $(document).on('mouseup', function () {
    if (!arrastre.activo) { return; }
    arrastre.activo = false;
    // Al soltar, se ajusta a la tarjeta más cercana
    if (arrastre.movido) { irA(Math.round($slider.scrollLeft() / paso())); }
    setTimeout(function () { $slider.removeClass('arrastrando'); }, 0);
  });

  $(window).on('resize', actualizarSlider);
  actualizarSlider();


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
