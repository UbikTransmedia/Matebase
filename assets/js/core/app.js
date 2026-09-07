/* ===================================================================
   Matebase · app.js
   Arranque: indice desplegable, buscador, enrutado por #/id, tema
   claro/oscuro y carga perezosa de los temas.

   Los temas NO se cargan con fetch (el navegador lo prohibe en file://):
   se inyecta una etiqueta <script src="topics/<id>.js"> la primera vez
   que hace falta. Por eso el curso funciona con doble clic, sin servidor.
   =================================================================== */
(function (global) {
  'use strict';

  /* ---------------- registro de temas ---------------- */

  var Course = {
    reg: {},        // id -> funcion constructora
    status: {}      // id -> 'ok' | 'fail' | 'loading'
  };
  /** Cada archivo de topics/ se registra llamando aqui. */
  Course.topic = function (id, builder) { Course.reg[id] = builder; };

  Course.load = function (id, cb) {
    if (Course.reg[id]) return cb(true);
    if (Course.status[id] === 'fail') return cb(false);
    var s = document.createElement('script');
    s.src = 'topics/' + id + '.js';
    s.async = false;
    s.onload = function () {
      Course.status[id] = Course.reg[id] ? 'ok' : 'fail';
      cb(!!Course.reg[id]);
    };
    s.onerror = function () { Course.status[id] = 'fail'; cb(false); };
    document.head.appendChild(s);
  };

  global.Course = Course;

  /* ---------------- indice plano y busqueda ---------------- */

  var FLAT = [];   // [{node, block, i}]
  var BYID = {};

  function flatten() {
    CURRICULUM.forEach(function (b) {
      b.temas.forEach(function (t) {
        t._block = b;
        BYID[t.id] = t;
        FLAT.push(t);
      });
    });
  }

  /* ---------------- construccion del indice ---------------- */

  var sideScroll, mainEl, wrapEl, crumbEl;

  function buildIndex() {
    U.clear(sideScroll);
    CURRICULUM.forEach(function (b) {
      var blk = U.el('div.blk', { 'data-blk': b.id });
      var caret = U.el('span.blk__caret', { html: '&#9654;' });
      var btn = U.el('button.blk__btn', { type: 'button' }, [
        U.el('span.blk__num', { text: b.n }),
        U.el('span', { text: b.title }),
        caret
      ]);
      var list = U.el('div.blk__list');
      b.temas.forEach(function (t) {
        var a = U.el('a.tpc', { href: '#/' + t.id, 'data-id': t.id }, [
          U.el('span.tpc__dot'),
          U.el('span.tpc__t', { text: t.t })
        ]);
        list.appendChild(a);
      });
      btn.addEventListener('click', function () {
        var open = blk.classList.toggle('is-open');
        Progress.openBlock(b.id, open);
      });
      U.add(blk, [btn, list]);
      sideScroll.appendChild(blk);
      if (Progress.openBlock(b.id)) blk.classList.add('is-open');
    });
    paintIndex();
  }

  /** Marca el tema activo, los vistos y los que aun no existen. */
  function paintIndex() {
    var cur = location.hash.replace('#/', '');
    U.$$('.tpc', sideScroll).forEach(function (a) {
      var id = a.getAttribute('data-id');
      a.classList.toggle('is-active', id === cur);
      a.classList.remove('is-seen', 'is-done');
      var st = Progress.state(id);
      if (st) a.classList.add('is-' + st);
      if (Course.status[id] === 'fail') a.classList.add('is-soon');
    });
  }

  function openBlockOf(id) {
    var t = BYID[id];
    if (!t) return;
    var blk = U.$('.blk[data-blk="' + t._block.id + '"]', sideScroll);
    if (blk && !blk.classList.contains('is-open')) {
      blk.classList.add('is-open');
      Progress.openBlock(t._block.id, true);
    }
    var a = U.$('.tpc[data-id="' + id + '"]', sideScroll);
    if (a && a.scrollIntoView) a.scrollIntoView({ block: 'nearest' });
  }

  function filterIndex(q) {
    q = q.trim().toLowerCase();
    var norm = function (s) { return s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s; };
    q = norm(q);
    U.$$('.blk', sideScroll).forEach(function (blk) {
      var any = false;
      U.$$('.tpc', blk).forEach(function (a) {
        var t = BYID[a.getAttribute('data-id')];
        var hay = norm((t.t + ' ' + (t.r || '') + ' ' + (t.o || []).join(' ')).toLowerCase());
        var show = !q || hay.indexOf(q) >= 0;
        a.style.display = show ? '' : 'none';
        if (show) any = true;
      });
      blk.style.display = any ? '' : 'none';
      if (q) blk.classList.add('is-open');
    });
  }

  /* ---------------- render de una pagina ---------------- */

  function header(t) {
    var h = U.el('div.hdr');
    h.appendChild(U.el('div.hdr__over', { text: 'Bloque ' + t._block.n + ' · ' + t._block.title }));
    h.appendChild(U.el('h1', { html: MathX.inline(t.t) }));
    if (t.r) h.appendChild(U.el('p.hdr__sub', { html: MathX.inline(t.r) }));
    if (t.o && t.o.length) {
      var meta = U.el('div.hdr__meta');
      t.o.forEach(function (o) { meta.appendChild(U.el('span.tag', { text: o })); });
      h.appendChild(meta);
    }
    return h;
  }

  function pager(t) {
    var i = FLAT.indexOf(t);
    var prev = FLAT[i - 1], next = FLAT[i + 1];
    var box = U.el('div.pager');
    if (prev) box.appendChild(U.el('a', { href: '#/' + prev.id }, [
      U.el('div.k', { text: '← Anterior' }), U.el('div.t', { text: prev.t })
    ]));
    else box.appendChild(U.el('div.sp'));
    if (next) box.appendChild(U.el('a.nx', { href: '#/' + next.id }, [
      U.el('div.k', { text: 'Siguiente →' }), U.el('div.t', { text: next.t })
    ]));
    else box.appendChild(U.el('div.sp'));
    return box;
  }

  function placeholder(root, t) {
    var box = U.el('div.soon');
    box.innerHTML = '<h3>Este tema todavía no está escrito</h3>' +
      '<p>Ya tiene su sitio reservado en el temario. Cuando se añada el archivo ' +
      '<code>topics/' + t.id + '.js</code> aparecerá aquí sin tocar nada más.</p>' +
      '<p><strong>Lo que cubrirá:</strong></p>';
    var ul = U.el('ul');
    (t.o || []).forEach(function (o) { ul.appendChild(U.el('li', { text: o })); });
    box.appendChild(ul);
    root.appendChild(box);
  }

  function renderTopic(id) {
    var t = BYID[id];
    if (!t) return renderHome();
    U.clear(wrapEl);
    crumbEl.innerHTML = '<b>' + U.escape(t._block.title) + '</b> &nbsp;/&nbsp; ' + U.escape(t.t);
    wrapEl.appendChild(header(t));
    var body = U.el('div');
    wrapEl.appendChild(body);
    wrapEl.appendChild(pager(t));
    mainEl.scrollTop = 0;
    Progress.visit(id);
    openBlockOf(id);
    paintIndex();
    document.title = t.t + ' · Matebase';

    Course.load(id, function (ok) {
      if (location.hash.replace('#/', '') !== id) return;   // el alumno ya se movio
      if (!ok) { placeholder(body, t); paintIndex(); return; }
      var p = new Page(body, t);
      try { Course.reg[id](p); }
      catch (e) {
        console.error('Error en el tema ' + id, e);
        body.appendChild(U.el('div.note.note--warn', {
          html: '<span class="note__t">Fallo al construir el tema</span>' + U.escape(e.message)
        }));
      }
    });
  }

  function renderHome() {
    U.clear(wrapEl);
    crumbEl.innerHTML = '<b>Inicio</b>';
    document.title = 'Matebase · curso interactivo de matemáticas';
    var st = Progress.stats();
    var total = FLAT.length;

    var h = U.el('div.hdr');
    h.innerHTML = '<div class="hdr__over">Curso interactivo</div>' +
      '<h1>Matemáticas desde el principio</h1>' +
      '<p class="hdr__sub">De contar con los dedos a los sistemas dinámicos, en ' + total +
      ' temas con ejemplos que se tocan y ejercicios que nunca se repiten.</p>';
    wrapEl.appendChild(h);

    var p = new Page(wrapEl, { id: '__home' });

    p.text('Si alguna vez has pensado que las matemáticas no son para ti, es muy probable que el ' +
      'problema no fueras tú. Casi todo el mundo que se atasca lo hace en un punto concreto —una ' +
      'tarde que faltó a clase, un profesor que iba deprisa— y a partir de ahí todo lo demás se ' +
      'construye encima de un hueco. Este curso está hecho para taparlo: empieza tan atrás que ' +
      'parecerá innecesario, y avanza sin saltarse un solo escalón.');

    p.text('La idea de fondo es que las matemáticas son un <strong>idioma</strong>, no una prueba de ' +
      'inteligencia. Un idioma que sirve para decir con precisión cosas que ya sabes: que cada socio ' +
      'del gimnasio tiene una taquilla y solo una, que dos autobuses que pasan cada 12 y cada 18 ' +
      'minutos vuelven a coincidir cada 36, que subir un 10 % y bajar un 10 % no te deja donde ' +
      'estabas. Cuando aprendes a decirlo con símbolos ganas tres cosas: entiendes lo que ya ' +
      'conocías, puedes modelarlo y, con suerte, predecirlo. Por eso cada concepto viene aquí con un ' +
      'cuadro de <strong>utilidad</strong> que cuenta dónde vive fuera del aula, y por eso las ' +
      'fórmulas traen un botón <strong>?</strong> que te las lee en voz alta: reconocer un símbolo y ' +
      'saber pronunciarlo no es lo mismo, y nadie aprende un idioma que no sabe decir.');

    p.text('El recorrido va de contar con los dedos a la teoría del caos, pasando por todo el temario ' +
      'de la ESO y el Bachillerato español. No hay vídeos, no hay que registrarse y no se envía nada ' +
      'a ninguna parte: son ' + total + ' temas que se leen a tu ritmo, y que rinden mucho más si te ' +
      'paras a mover los mandos de los ejemplos en vez de mirarlos, que es de lo que se trata.');

    p.text('Este curso está pensado para recorrerse <strong>en orden</strong>. Cada tema supone ' +
      'que entiendes el anterior y ninguno usa una herramienta que no se haya explicado antes. Si ' +
      'algo no se entiende, casi siempre la respuesta está uno o dos temas más atrás, no más ' +
      'adelante.');

    p.text('Dentro de cada tema encontrarás dos cosas distintas, y conviene no confundirlas:');
    p.raw(U.el('div.grid2', null, [
      U.el('div.card.card--demo', null, [
        U.el('div.card__head', null, [U.el('span.card__kind', { text: 'Ejemplo interactivo' })]),
        U.el('div.card__body', { html: '<div class="prose"><p>Un escenario fijo con mandos que puedes mover. ' +
          'No se corrige ni puntúa: está para que <em>veas</em> qué significa el concepto.</p></div>' })
      ]),
      U.el('div.card.card--ex', null, [
        U.el('div.card__head', null, [U.el('span.card__kind', { text: 'Ejercicio práctico' })]),
        U.el('div.card__body', { html: '<div class="prose"><p>Un enunciado <strong>generado al azar</strong>. ' +
          'Pulsa «Otro ejercicio» y cambian los números: puedes practicar el mismo tipo ' +
          'las veces que quieras y comprobar cada intento.</p></div>' })
      ])
    ]));

    p.section('Tu progreso');
    p.raw(U.el('div.readout', {
      html: 'Temas visitados: <strong>' + st.seen + '</strong> de ' + total + '<br>' +
        'Temas dominados (5 aciertos o más): <strong>' + st.done + '</strong><br>' +
        'Ejercicios acertados: <strong>' + st.ok + '</strong> de ' + st.tries + ' intentos'
    }));

    p.section('El recorrido');
    CURRICULUM.forEach(function (b) {
      var written = b.temas.filter(function (t) { return Course.status[t.id] !== 'fail'; }).length;
      var card = U.el('div.card');
      card.appendChild(U.el('div.card__head', null, [
        U.el('span.blk__num', { text: b.n }),
        U.el('span.card__title', { text: b.title }),
        U.el('span.card__spacer'),
        U.el('span.card__score', { text: b.temas.length + ' temas' })
      ]));
      var bd = U.el('div.card__body');
      bd.appendChild(U.el('div.prose', { html: '<p>' + b.desc + '</p>' }));
      var chips = U.el('div.chips');
      b.temas.forEach(function (t) {
        chips.appendChild(U.el('a.chip', { href: '#/' + t.id, text: t.t }));
      });
      bd.appendChild(chips);
      card.appendChild(bd);
      wrapEl.appendChild(card);
    });

    p.note('Todo funciona sin conexión y sin servidor. Puedes copiar la carpeta en un ' +
      'lápiz de memoria y abrir <code>index.html</code> en cualquier ordenador.', 'ok', 'Nota técnica');

    wrapEl.appendChild(U.el('footer.creditos', {
      html: '<p>Diseñado por <a href="https://gcarbonell.com" target="_blank" rel="noopener noreferrer">' +
        'Guillem Carbonell</a>.</p>' +
        '<p>Se distribuye bajo licencia libre <strong>GPLv3</strong>: puedes usarlo, copiarlo, ' +
        'modificarlo y repartirlo, incluso en clase o comercialmente, siempre que lo que publiques a ' +
        'partir de él conserve esta misma libertad. El texto completo está en el archivo ' +
        '<code>LICENSE</code> de la carpeta.</p>'
    }));

    mainEl.scrollTop = 0;
    paintIndex();
  }

  /* ---------------- temas: claro, oscuro y monokai ---------------- */

  var TEMAS = [
    { id: 'light', nombre: 'Claro', icono: '☀' },
    { id: 'dark', nombre: 'Oscuro', icono: '☾' },
    { id: 'monokai', nombre: 'Monokai', icono: '◐' }
  ];

  /** Un boton por tema, para que se vean los tres y no haya que adivinarlos. */
  function buildThemeButtons() {
    var caja = U.$('#themes');
    if (!caja) return;
    U.clear(caja);
    TEMAS.forEach(function (t) {
      caja.appendChild(U.el('button.themes__b', {
        type: 'button',
        'data-tema': t.id,
        title: 'Tema ' + t.nombre.toLowerCase(),
        onclick: function () { setTheme(t.id); }
      }, [
        U.el('span.themes__i', null, t.icono),
        U.el('span', null, t.nombre)
      ]));
    });
  }

  function setTheme(mode) {
    var t = TEMAS.filter(function (x) { return x.id === mode; })[0] || TEMAS[0];
    document.documentElement.setAttribute('data-theme', t.id);
    Progress.pref('theme', t.id);
    U.$$('#themes .themes__b').forEach(function (b) {
      var activo = b.getAttribute('data-tema') === t.id;
      b.classList.toggle('is-on', activo);
      b.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });
    U.bus.emit('theme', t.id);
  }

  function irAInicio(e) {
    if (e) e.preventDefault();
    if (location.hash.replace(/^#\/?/, '') === '') { route(); return; }
    location.hash = '';
    if (!location.hash) route();
  }

  /* ---------------- arranque ---------------- */

  function route() {
    var id = location.hash.replace(/^#\/?/, '');
    if (!id) renderHome(); else renderTopic(id);
    var side = U.$('.side');
    if (side) side.classList.remove('is-open');
    var sc = U.$('.scrim');
    if (sc) sc.classList.remove('is-on');
  }

  function start() {
    flatten();
    sideScroll = U.$('#sideScroll');
    mainEl = U.$('#main');
    wrapEl = U.$('#wrap');
    crumbEl = U.$('#crumb');

    buildIndex();
    buildThemeButtons();
    // Por defecto, claro: es el tema en el que esta pensado el curso. Los otros
    // dos se eligen a mano, y la eleccion se recuerda.
    setTheme(Progress.pref('theme') || 'light');

    var search = U.$('#search');
    search.addEventListener('input', function () {
      filterIndex(search.value);
      search.parentNode.classList.toggle('is-filled', search.value !== '');
    });
    U.$('#searchClear').addEventListener('click', function () {
      search.value = ''; filterIndex(''); search.parentNode.classList.remove('is-filled'); search.focus();
    });

    U.$('#resetBtn').addEventListener('click', function () {
      if (confirm('¿Borrar el progreso guardado (temas visitados y aciertos)?')) {
        Progress.reset(); paintIndex();
        if (!location.hash.replace(/^#\/?/, '')) renderHome();
      }
    });
    U.$('#burger').addEventListener('click', function () {
      U.$('.side').classList.toggle('is-open');
      U.$('.scrim').classList.toggle('is-on');
    });
    U.$('.scrim').addEventListener('click', function () {
      U.$('.side').classList.remove('is-open');
      this.classList.remove('is-on');
    });
    U.$('#homeLink').addEventListener('click', irAInicio);
    U.$('#homeBtn').addEventListener('click', irAInicio);

    U.bus.on('progress', function () { paintIndex(); });
    global.addEventListener('hashchange', route);

    // Navegacion con teclado: flechas izquierda/derecha entre temas.
    global.addEventListener('keydown', function (e) {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var id = location.hash.replace(/^#\/?/, '');
      var i = FLAT.indexOf(BYID[id]);
      if (e.key === 'ArrowRight' && i >= 0 && FLAT[i + 1]) location.hash = '#/' + FLAT[i + 1].id;
      if (e.key === 'ArrowLeft' && i > 0) location.hash = '#/' + FLAT[i - 1].id;
    });

    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window);
