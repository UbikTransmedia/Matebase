/* ===================================================================
   Matebase · app.js
   Arranque: indice desplegable, buscador, enrutado por #/id, tema
   claro/oscuro y carga perezosa de los temas.

   Los temas NO se cargan con fetch (el navegador lo prohibe en file://):
   se inyecta una etiqueta <script src="topics/<id>.js"> la primera vez
   que hace falta. Por eso el curso funciona con doble clic, sin servidor.

   Rutas:
     #/                      portada
     #/<id>                  un tema
     #/<id>?e=3              el ejercicio 3 de ese tema, con numeros nuevos
     #/<id>?e=3&s=12345      el ejercicio 3 con la semilla 12345: el mismo
                             enunciado, con los mismos numeros, para todos
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

  /* ---------------- cursos e itinerarios ----------------
     El curso sube desde contar, pero quien lo abre suele estar en 2.º de
     Bachillerato con la PAU delante. Cada tema dice a que curso pertenece y,
     si es de 2.º, a que asignatura: asi el indice puede mostrar solo el
     temario de uno, y cada tema puede avisar de lo que da por sabido. */

  var CURSOS = {
    ESO: 'ESO', '1B': '1.º Bachillerato', '2B': '2.º Bachillerato', AMP: 'Ampliación'
  };
  var ITIN = {
    MII: { corto: 'Matemáticas II', abrev: 'Mat. II', largo: 'Matemáticas II (Ciencias y Tecnología)' },
    MCS: { corto: 'MACS II', abrev: 'MACS II', largo: 'Matemáticas Aplicadas a las Ciencias Sociales II' }
  };
  Course.CURSOS = CURSOS;
  Course.ITIN = ITIN;

  var itin = 'todo';

  function enItinerario(t, it) {
    if (!it || it === 'todo') return true;
    return t.curso === '2B' && (t.itin || []).indexOf(it) >= 0;
  }
  Course.enItinerario = enItinerario;

  /* ---------------- indice plano y busqueda ---------------- */

  var FLAT = [];   // [{node, block, i}]
  var BYID = {};

  function flatten() {
    FLAT = []; BYID = {};
    CURRICULUM.forEach(function (b) {
      /* El original se guarda la primera vez, para poder volver al castellano
         y para que traducir dos veces no traduzca sobre lo traducido. */
      if (b._t0 === undefined) { b._t0 = b.title; b._d0 = b.desc; }
      var bt = global.I18N ? I18N.bloque({ id: b.id, title: b._t0, desc: b._d0 }) : null;
      b.title = bt ? bt.title : b._t0;
      b.desc = bt ? bt.desc : b._d0;
      b.temas.forEach(function (t) {
        if (t._t0 === undefined) { t._t0 = t.t; t._r0 = t.r; }
        var tt = global.I18N ? I18N.tema({ id: t.id, t: t._t0, r: t._r0 }) : null;
        t.t = tt ? tt.t : t._t0;
        t.r = tt ? tt.r : t._r0;
        t._block = b;
        if (!t.curso) t.curso = b.curso || '';
        BYID[t.id] = t;
        FLAT.push(t);
      });
    });
  }

  /* Un texto de interfaz. Si no hay diccionario -o la frase no esta en el-,
     sale en castellano, que es el original. */
  function T(s) { return global.I18N ? I18N.ui(s) : s; }
  Course.T = T;

  /* Los rotulos que vienen escritos en index.html. Son pocos y estan en un
     sitio, asi que se traducen de una vez al arrancar y al cambiar de
     idioma, en vez de repartir llamadas por el HTML. */
  function traduceChrome() {
    /* atributo -> [selector, atributo, original] */
    var attrs = [
      ['#search', 'placeholder', 'Buscar un tema…'],
      ['#glosSearch', 'placeholder', 'Buscar un término…'],
      ['#searchClear', 'title', 'Limpiar'],
      ['#homeLink', 'title', 'Volver al índice del curso'],
      ['#homeBtn', 'title', 'Volver al índice del curso'],
      ['#navAtras', 'title', 'Tema anterior visitado'],
      ['#navAtras', 'aria-label', 'Atrás'],
      ['#navAlante', 'title', 'Tema siguiente visitado'],
      ['#navAlante', 'aria-label', 'Adelante'],
      ['#burger', 'aria-label', 'Índice'],
      ['#resetBtn', 'title', 'Borrar el progreso guardado'],
      ['#sideScroll', 'aria-label', 'Índice del curso'],
      ['#itin', 'aria-label', 'Temario que muestra el índice'],
      ['#themes', 'aria-label', 'Tema de color'],
      ['#letras', 'aria-label', 'Tamaño de la letra'],
      ['#idiomas', 'aria-label', 'Idioma']
    ];
    attrs.forEach(function (a) {
      var el = U.$(a[0]);
      if (el) el.setAttribute(a[1], T(a[2]));
    });

    /* texto -> [selector, original] */
    var textos = [
      ['#homeBtn span', 'Inicio'],
      ['#resetBtn', 'Reiniciar'],
      ['#glosTitle', 'Glosario'],
      ['#glosBtn span', 'Glosario'],
      ['#saltar', 'Saltar al contenido']
    ];
    textos.forEach(function (t) {
      var el = U.$(t[0]);
      if (el) el.textContent = T(t[1]);
    });

    /* «Diseñado por» lleva un enlace al lado, asi que solo se toca su primer
       nodo de texto; el nombre propio no se traduce. */
    var by = U.$('.side__by');
    if (by && by.firstChild && by.firstChild.nodeType === 3) {
      by.firstChild.nodeValue = T('Diseñado por') + ' ';
    }

    var version = U.$('#version');
    if (version && global.MATEBASE_VERSION) {
      version.textContent = T('versión') + ' ' + global.MATEBASE_VERSION;
    }

    /* Los botones de color y de tamaño llevan su rotulo dentro, asi que se
       vuelven a montar y se les devuelve la marca de cual esta puesto. */
    buildThemeButtons();
    setTheme(Progress.pref('theme') || 'light');
    buildLetraButtons();
    setLetra(Progress.pref('letra') || 'n');
  }

  /** La ruta actual, separando el tema de sus parametros. */
  function ruta() {
    var h = location.hash.replace(/^#\/?/, '');
    var i = h.indexOf('?'), q = {};
    var id = i < 0 ? h : h.slice(0, i);
    if (i >= 0) {
      h.slice(i + 1).split('&').forEach(function (kv) {
        var par = kv.split('=');
        if (par[0]) {
          try { q[decodeURIComponent(par[0])] = decodeURIComponent(par[1] || ''); } catch (e) { }
        }
      });
    }
    return { id: id, q: q };
  }

  /* ---------------- construccion del indice ---------------- */

  var sideScroll, mainEl, wrapEl, crumbEl;
  var glosarioApi = null;

  function buildIndex() {
    U.clear(sideScroll);
    CURRICULUM.forEach(function (b) {
      /* El bloque de programacion grafica no es solo matemáticas: es
         programación y arte, y tiene que notarse antes de leer una palabra.
         Se marca aquí y el color lo hereda todo lo de dentro, desde el CSS. */
      var blk = U.el('div.blk', { 'data-blk': b.id, 'data-piel': b.piel || null });
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
    var cur = ruta().id;
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
    q = U.llano(String(q || '').trim());
    var visibles = 0;
    U.$$('.blk', sideScroll).forEach(function (blk) {
      var any = false;
      U.$$('.tpc', blk).forEach(function (a) {
        var t = BYID[a.getAttribute('data-id')];
        var hay = U.llano(t.t + ' ' + (t.r || '') + ' ' + (t.o || []).join(' '));
        var show = (!q || hay.indexOf(q) >= 0) && enItinerario(t, itin);
        a.style.display = show ? '' : 'none';
        if (show) { any = true; visibles++; }
      });
      blk.style.display = any ? '' : 'none';
      if ((q || itin !== 'todo') && any) blk.classList.add('is-open');
    });
    notaItinerario(visibles);
    glosarioEnBusqueda(q, visibles);
  }

  function notaItinerario(n) {
    var nota = U.$('#itinNota');
    if (!nota) return;
    nota.textContent = itin === 'todo' ? '' :
      'Solo el temario de 2.º de ' + ITIN[itin].corto + ' (' + n + ' temas). Lo de cursos ' +
      'anteriores sigue enlazado en «Antes de empezar», al principio de cada tema.';
  }

  /* El buscador del indice mira tambien el glosario y la referencia GLSL.
     Quien busca «rango» o «adjunto» casi nunca busca un tema: busca que
     significa la palabra; y quien busca «smoothstep», que hace la funcion. */
  function glosarioEnBusqueda(q, visibles) {
    var viejo = U.$('.glosres', sideScroll);
    if (viejo) viejo.remove();
    if (!q || q.length < 3 || (!global.GLOSARIO && !global.GLSL)) {
      if (q && !visibles) sideScroll.appendChild(U.el('div.glosres', null, U.el('p.glosres__nada', { text: 'Ningún tema coincide.' })));
      return;
    }
    function coincide(e) { return U.llano(e.t + ' ' + (e.v || '')).indexOf(q) >= 0; }
    var enGlosario = (global.GLOSARIO || []).filter(coincide).slice(0, 8);
    var enGlsl = (global.GLSL ? global.GLSL.entradas : []).filter(coincide).slice(0, 6);
    if (!enGlosario.length && !enGlsl.length && visibles) return;
    var box = U.el('div.glosres');
    if (!visibles) box.appendChild(U.el('p.glosres__nada', { text: 'Ningún tema coincide con la búsqueda.' }));
    function seccion(titulo, lista, modo, donde) {
      if (!lista.length) return;
      box.appendChild(U.el('div.glosres__t', { text: titulo }));
      lista.forEach(function (e) {
        box.appendChild(U.el('button.glosres__b', {
          type: 'button', title: 'Abrir «' + e.t + '» en ' + donde,
          onclick: function () { if (glosarioApi) glosarioApi.abre(modo, e.t); }
        }, [
          U.el('span.glosres__n' + (modo === 'glsl' && !e.p ? '.glosres__n--cod' : ''), { text: e.t }),
          (e.i && BYID[e.i]) ? U.el('span.glosres__i', { text: BYID[e.i].t }) : null
        ]));
      });
    }
    seccion('En el glosario', enGlosario, 'glos', 'el glosario');
    seccion('En la referencia GLSL', enGlsl, 'glsl', 'la referencia GLSL');
    sideScroll.appendChild(box);
  }

  function buildItinButtons() {
    var caja = U.$('#itin');
    if (!caja) return;
    U.clear(caja);
    [{ id: 'todo', t: T('Todo el curso') }, { id: 'MII', t: ITIN.MII.abrev }, { id: 'MCS', t: ITIN.MCS.abrev }]
      .forEach(function (o) {
        caja.appendChild(U.el('button.themes__b', {
          type: 'button', 'data-itin': o.id,
          title: o.id === 'todo' ? 'Mostrar el curso entero'
            : 'Mostrar solo el temario de 2.º de ' + ITIN[o.id].largo,
          onclick: function () { setItinerario(o.id); }
        }, o.t));
      });
  }

  function setItinerario(id) {
    itin = (id === 'MII' || id === 'MCS') ? id : 'todo';
    Progress.pref('itin', itin);
    U.$$('#itin .themes__b').forEach(function (b) {
      var on = b.getAttribute('data-itin') === itin;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    buildIndex();
    var s = U.$('#search');
    filterIndex(s ? s.value : '');
  }
  Course.setItinerario = function (id) { setItinerario(id); };

  /* ---------------- render de una pagina ---------------- */

  function etiquetasCurso(t) {
    var out = [];
    if (t.curso && CURSOS[t.curso]) out.push(U.el('span.tag.tag--curso', { text: CURSOS[t.curso] }));
    (t.itin || []).forEach(function (k) {
      if (ITIN[k]) out.push(U.el('span.tag.tag--' + k.toLowerCase(), { text: ITIN[k].corto, title: ITIN[k].largo }));
    });
    return out;
  }

  function header(t) {
    /* `data-ruta` no se ve en pantalla: la usa la hoja de impresion para
       poner al pie de la ficha de donde sale, que en papel es lo unico que
       permite volver. */
    var h = U.el('div.hdr', { 'data-ruta': (location.pathname.split('/').pop() || 'index.html') + '#/' + t.id });
    h.appendChild(U.el('div.hdr__over', { text: 'Bloque ' + t._block.n + ' · ' + t._block.title }));
    // El titulo se puede enfocar: al cambiar de tema, el foco aterriza aqui
    // en vez de quedarse a mitad del indice.
    h.appendChild(U.el('h1', { html: MathX.inline(t.t), tabindex: '-1' }));
    if (t.r) h.appendChild(U.el('p.hdr__sub', { html: MathX.inline(t.r) }));
    var cur = etiquetasCurso(t);
    if (cur.length) h.appendChild(U.el('div.hdr__curso', null, cur));
    if (t.o && t.o.length) {
      var meta = U.el('div.hdr__meta');
      t.o.forEach(function (o) { meta.appendChild(U.el('span.tag', { text: o })); });
      h.appendChild(meta);
    }
    return h;
  }

  /* «Antes de empezar». Casi todo el que se atasca lo hace por un escalon
     de atras, no por el tema que tiene delante. Aqui se ven los escalones
     que este tema da por subidos, y en que estado estan para ti. */
  function antesDeEmpezar(t) {
    var req = (t.req || []).filter(function (r) { return BYID[r]; });
    if (!req.length) return null;
    var box = U.el('nav.prereq', { 'aria-label': 'Temas que este da por sabidos' });
    box.appendChild(U.el('span.prereq__t', { text: T('Antes de empezar') }));
    var flojos = 0;
    var ul = U.el('ul.prereq__l');
    req.forEach(function (rid) {
      var r = BYID[rid];
      var st = Progress.state(rid);
      if (st !== 'done') flojos++;
      ul.appendChild(U.el('li', null, U.el('a.prereq__a.is-' + (st || 'nuevo'), { href: '#/' + rid }, [
        U.el('span.tpc__dot', { 'aria-hidden': 'true' }),
        U.el('span', { text: r.t }),
        U.el('span.prereq__st', { text: st === 'done' ? 'dominado' : (st === 'seen' ? 'visto' : 'sin empezar') })
      ])));
    });
    box.appendChild(U.el('p', {
      text: flojos
        ? 'Este tema da por sabidos los de la lista. Si alguno no lo dominas todavía, empieza por él: ' +
          'casi todos los atascos vienen de un escalón anterior.'
        : 'Dominas todo lo que este tema necesita. Adelante.'
    }));
    box.appendChild(ul);
    return box;
  }

  /* Un tema se puede imprimir como ficha de trabajo: el enunciado y las
     casillas en blanco, sin botones ni ayudas. El boton va al pie, junto a
     la navegacion, porque es lo ultimo que se hace con un tema. */
  function botonImprimir(t) {
    return U.el('div.chips.imprimir', null, [
      U.el('button.btn.btn--sm.btn--ghost', {
        type: 'button',
        title: 'Imprime este tema como ficha: los enunciados con sus casillas en blanco, sin botones',
        onclick: function () { global.print(); }
      }, '🖨 Imprimir como ficha')
    ]);
  }

  function pager(t) {
    var i = FLAT.indexOf(t);
    var prev = FLAT[i - 1], next = FLAT[i + 1];
    var box = U.el('div.pager');
    if (prev) box.appendChild(U.el('a', { href: '#/' + prev.id }, [
      U.el('div.k', { text: T('← Anterior') }), U.el('div.t', { text: prev.t })
    ]));
    else box.appendChild(U.el('div.sp'));
    if (next) box.appendChild(U.el('a.nx', { href: '#/' + next.id }, [
      U.el('div.k', { text: T('Siguiente →') }), U.el('div.t', { text: next.t })
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

  /* El indice del tema: sus secciones, en una linea, antes de empezar a
     leer. Sirve para saber cuanto queda y para volver a «Practica» sin
     recorrerlo todo. Los enlaces no tocan el hash, que es la ruta. */
  function indiceDelTema(p, body) {
    if (!p.secciones || p.secciones.length < 3) return;
    var nav = U.el('nav.toc', { 'aria-label': 'Secciones de este tema' });
    nav.appendChild(U.el('span.toc__t', { text: 'En este tema' }));
    var ol = U.el('ol.toc__l');
    p.secciones.forEach(function (s) {
      var a = U.el('a', { href: '#' + s.el.id, html: MathX.inline(s.t) });
      a.addEventListener('click', function (e) {
        e.preventDefault();
        s.el.scrollIntoView({ block: 'start' });
        s.el.focus({ preventScroll: true });
      });
      ol.appendChild(U.el('li', null, a));
    });
    nav.appendChild(ol);
    body.insertBefore(nav, body.firstChild);
  }

  /** Abre el ejercicio que pide el enlace: con su semilla, si la trae. */
  function abreEjercicio(p, q) {
    if (!q || !q.e) return;
    var c = p.cards[parseInt(q.e, 10) - 1];
    if (!c) return;
    var s = parseInt(q.s, 10);
    if (!isNaN(s)) c.regen(s);
    c.el.classList.add('is-destacada');
    setTimeout(function () {
      if (c.el.scrollIntoView) c.el.scrollIntoView({ block: 'start' });
      var primero = c.el.querySelector('input:not([disabled]), .opc__b:not([disabled])');
      if (primero) primero.focus({ preventScroll: true });
    }, 40);
  }

  function renderTopic(id, q) {
    var t = BYID[id];
    if (!t) return renderHome();
    U.clear(wrapEl);
    // La piel del bloque tiñe el contenido entero: secciones, avisos,
    // enlaces, botones y hasta las gráficas, que leen las variables CSS.
    if (t._block.piel) wrapEl.setAttribute('data-piel', t._block.piel);
    else wrapEl.removeAttribute('data-piel');
    crumbEl.innerHTML = '<b>' + U.escape(t._block.title) + '</b> &nbsp;/&nbsp; ' + U.escape(t.t);
    wrapEl.appendChild(header(t));
    if (!global.I18N || !I18N.temaTraducido(t.id)) {
      avisoIdioma(wrapEl, 'El texto de este tema está en castellano.');
    }
    var antes = antesDeEmpezar(t);
    if (antes) wrapEl.appendChild(antes);
    var body = U.el('div');
    wrapEl.appendChild(body);
    wrapEl.appendChild(botonImprimir(t));
    wrapEl.appendChild(pager(t));
    mainEl.scrollTop = 0;
    Progress.visit(id);
    openBlockOf(id);
    paintIndex();
    document.title = t.t + ' · Matebase';
    t._q = q || {};        // las paginas de repaso leen de aqui la semilla

    Course.load(id, function (ok) {
      if (ruta().id !== id) return;   // el alumno ya se movio
      if (!ok) { placeholder(body, t); paintIndex(); return; }
      var p = new Page(body, t);
      try {
        Course.reg[id](p);
        indiceDelTema(p, body);
        if (W.pintaBloques) W.pintaBloques(body);
        Progress.tipos(id, p._ex);
        paintIndex();
        abreEjercicio(p, q);
      }
      catch (e) {
        console.error('Error en el tema ' + id, e);
        body.appendChild(U.el('div.note.note--warn', {
          html: '<span class="note__t">Fallo al construir el tema</span>' + U.escape(e.message)
        }));
      }
    });
  }

  /* Si se esta leyendo en otro idioma, se dice ANTES de empezar a leer: la
     prosa sigue en castellano y eso no puede ser una sorpresa a mitad de
     pagina. El aviso va en la portada y en cada tema, porque son las dos
     puertas por las que se entra. */
  function avisoIdioma(host, frase) {
    if (!global.I18N || I18N.actual() === 'es') return;
    host.appendChild(U.el('div.avisoIdioma', {
      role: 'note',
      html: '<strong>' + T(frase) + '</strong> ' +
        T('La interfaz y el temario están traducidos; la explicación, todavía no.')
    }));
  }

  function renderHome() {
    U.clear(wrapEl);
    wrapEl.removeAttribute('data-piel');
    crumbEl.innerHTML = '<b>' + U.escape(T('Inicio')) + '</b>';
    document.title = 'Matebase · ' + T('curso interactivo de matemáticas');
    var st = Progress.stats();
    var total = FLAT.length;

    var h = U.el('div.hdr');
    h.innerHTML = '<div class="hdr__over">Curso interactivo diseñado por ' +
      '<a href="https://gcarbonell.com" target="_blank" rel="noopener noreferrer">' +
      'Guillem Carbonell</a></div>' +
      '<h1>Matemáticas desde el principio</h1>' +
      '<p class="hdr__sub">De contar con los dedos a las matemáticas de 2.º de Bachillerato y la PAU, ' +
      'y de ahí a los sistemas dinámicos, en ' + total +
      ' temas con ejemplos que se tocan y ejercicios que nunca se repiten.</p>';
    wrapEl.appendChild(h);
    avisoIdioma(wrapEl, 'El curso está escrito en castellano.');

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
      'adelante: por eso cada tema empieza con una lista de lo que da por sabido.');

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
          'las veces que quieras y comprobar cada intento. Los problemas largos van ' +
          '<strong>por apartados</strong>, como en la PAU.</p></div>' })
      ])
    ]));

    p.section('Tu progreso');
    p.raw(U.el('div.readout', {
      html: 'Temas visitados: <strong>' + st.seen + '</strong> de ' + total + '<br>' +
        'Temas dominados (cada tipo de ejercicio resuelto al menos una vez): <strong>' + st.done + '</strong><br>' +
        'Ejercicios resueltos: <strong>' + st.ok + '</strong>'
    }));

    var ult = Progress.ultimo();
    if (ult && BYID[ult]) {
      p.raw(U.el('a.seguir', { href: '#/' + ult }, [
        U.el('span.seguir__k', { text: 'Continúa donde lo dejaste' }),
        U.el('span.seguir__t', { text: BYID[ult].t }),
        U.el('span.seguir__f', { 'aria-hidden': 'true', text: '→' })
      ]));
    }

    var pend = Progress.pendientes(8).filter(function (x) { return BYID[x.id]; });
    if (pend.length) {
      p.sub('Para repasar hoy');
      p.text('Estos ejercicios ya los hiciste, y toca volver a ellos: un repaso justo cuando empieza a ' +
        'olvidarse fija más que diez seguidos el mismo día. Los que fallaste vuelven antes; los que ' +
        'aciertas se van espaciando.');
      var lista = U.el('ul.repaso');
      pend.forEach(function (x) {
        lista.appendChild(U.el('li', null, U.el('a.repaso__i' + (x.fallado ? '.is-fallado' : ''), {
          href: '#/' + x.id + '?e=' + x.n
        }, [
          U.el('span.repaso__t', { text: BYID[x.id].t }),
          U.el('span.repaso__n', {
            text: 'ejercicio ' + x.n + ' · ' + (x.fallado ? 'lo fallaste la última vez' : 'repaso ' + (x.racha + 1))
          })
        ])));
      });
      p.raw(lista);
    }

    p.section('Si estás en 2.º de Bachillerato');
    p.text('Si lo que tienes delante es la PAU, puedes ir directo a lo tuyo. Elige tu asignatura: el ' +
      'índice mostrará solo su temario, y cada tema te dirá qué necesitas de cursos anteriores. ' +
      'En el bloque <strong>Repaso de 2.º y PAU</strong> tienes el mapa del temario con tu estado, ' +
      'simulacros de examen corregidos, un formulario para imprimir y los errores que más puntos cuestan.');
    var fila = U.el('div.itin-inicio');
    ['MII', 'MCS'].forEach(function (k) {
      fila.appendChild(U.el('button.btn' + (itin === k ? '.btn--main' : ''), {
        type: 'button', 'aria-pressed': itin === k ? 'true' : 'false',
        onclick: function () { setItinerario(itin === k ? 'todo' : k); renderHome(); }
      }, 'Temario de ' + ITIN[k].corto));
    });
    if (BYID['pau-mapa']) fila.appendChild(U.el('a.btn', { href: '#/pau-mapa', text: 'Mapa de 2.º y simulacros →' }));
    fila.appendChild(U.el('a.btn', { href: '#/__rutas', text: 'Rutas de la ampliación →' }));
    fila.appendChild(U.el('a.btn', { href: '#/__examen', text: 'Montar un examen →' }));
    fila.appendChild(U.el('a.btn', { href: '#/__progreso', text: 'Progreso y clase →' }));
    p.raw(fila);

    p.section('El recorrido');
    CURRICULUM.forEach(function (b) {
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
        '<p>Se distribuye bajo licencia libre <strong>GPLv3</strong> o, a tu elección, cualquier ' +
        'versión posterior: puedes usarlo, copiarlo, ' +
        'modificarlo y repartirlo, incluso en clase o comercialmente, siempre que lo que publiques a ' +
        'partir de él conserve esta misma libertad. El texto completo está en el archivo ' +
        '<code>LICENSE</code> de la carpeta.</p>'
    }));

    mainEl.scrollTop = 0;
    paintIndex();
  }

  /* ---------------- deberes ----------------
     Una lista de enunciados concretos -tema, numero y semilla- que se
     comparte como un enlace. El enlace LLEVA los deberes dentro, asi que no
     hace falta servidor, ni cuentas, ni recoger nada: el profesor elige,
     copia y pega; el alumno abre y los tiene, con los mismos numeros. */

  function renderDeberes(q) {
    U.clear(wrapEl);
    wrapEl.removeAttribute('data-piel');
    var recibidos = q && q.d ? Ex.leeDeberes(q.d) : null;
    var lista = recibidos || Ex.deberes();
    crumbEl.innerHTML = '<a href="#/">' + U.escape(T('Inicio')) + '</a> › <b>' + U.escape(T('Deberes')) + '</b>';
    document.title = 'Deberes · Matebase';

    var h = U.el('div.hdr');
    h.innerHTML = '<h1 tabindex="-1">Deberes</h1><p class="hdr__sub">' +
      (recibidos
        ? 'Alguien te ha pasado esta lista. Son ' + lista.length + ' ' +
          U.plural(lista.length, 'enunciado', 'enunciados') + ' concretos, con los mismos números ' +
          'que vio quien la preparó.'
        : 'Los enunciados que has ido apartando con el botón «+ Deberes». Se comparten en un enlace ' +
          'que los lleva dentro: quien lo abra verá exactamente estos, con estos números.') +
      '</p>';
    wrapEl.appendChild(h);
    avisoIdioma(wrapEl, 'Esta página está escrita en castellano.');

    var p = new Page(wrapEl, { id: '__deberes' });

    if (!lista.length) {
      p.note('Todavía no hay ninguno. En cualquier ejercicio del curso, el botón ' +
        '<strong>+ Deberes</strong> lo aparta con los números que tenga en ese momento. Cuando tengas ' +
        'los que quieras, vuelve aquí y copia el enlace.', null, 'Cómo se hace una lista');
      p.raw(U.el('div.chips', null, [U.el('a.btn', { href: '#/', text: '← Al índice' })]));
      mainEl.scrollTop = 0; paintIndex(); return;
    }

    var ol = U.el('ol.deberes');
    lista.forEach(function (d, i) {
      var t = BYID[d.id];
      var dom = Progress.dominio(d.id);
      var ex = (Progress.topic(d.id).ex || {})[d.n];
      var hecho = ex && ex.ok > 0;
      var li = U.el('li.deberes__t' + (hecho ? '.is-done' : ''));
      li.appendChild(U.el('a.deberes__link', {
        href: '#/' + d.id + '?e=' + d.n + '&s=' + d.s,
        text: (t ? t.t : d.id) + ' · ejercicio ' + d.n
      }));
      li.appendChild(U.el('span.deberes__est', {
        text: hecho ? 'resuelto alguna vez' : 'pendiente'
      }));
      if (!recibidos) {
        li.appendChild(U.el('button.btn.btn--sm.btn--ghost', {
          type: 'button', title: 'Quitar de la lista',
          onclick: function () {
            var nueva = Ex.deberes().filter(function (x, k) { return k !== i; });
            Ex.deberes(nueva);
            renderDeberes(q);
          }
        }, '×'));
      }
      ol.appendChild(li);
    });
    p.raw(ol);

    if (recibidos) {
      p.note('El estado que ves al lado de cada uno es <strong>tuyo</strong>, y sale de tu progreso en ' +
        'este navegador: dice si alguna vez has resuelto ese tipo de ejercicio, no si has hecho ' +
        'exactamente este enunciado. Nadie más lo ve.', null, 'De dónde sale ese «resuelto»');
      p.raw(U.el('div.chips', null, [
        U.el('a.btn.btn--main', { href: '#/' + lista[0].id + '?e=' + lista[0].n + '&s=' + lista[0].s, text: 'Empezar por el primero →' }),
        U.el('button.btn', {
          type: 'button',
          onclick: function () { Ex.deberes(lista.slice()); renderDeberes({}); }
        }, 'Copiarlos a mi lista')
      ]));
    } else {
      p.section('El enlace');
      var url = location.href.split('#')[0] + '#/__deberes?d=' +
        encodeURIComponent(Ex.codificaDeberes(lista));
      var caja = U.el('input.card__url', {
        type: 'text', readonly: true, value: url, 'aria-label': 'Enlace con estos deberes'
      });
      var av = U.el('p.card__aviso');
      p.raw(U.el('div.chips', null, [
        U.el('button.btn.btn--main', {
          type: 'button',
          onclick: function () {
            try {
              navigator.clipboard.writeText(url).then(function () {
                av.textContent = 'Copiado. Pégalo donde quieras: quien lo abra verá estos mismos enunciados.';
              }, function () { caja.focus(); caja.select(); });
            } catch (e) { caja.focus(); caja.select(); }
          }
        }, '⧉ Copiar el enlace'),
        U.el('button.btn', {
          type: 'button',
          onclick: function () {
            if (!global.confirm('¿Vaciar la lista de deberes?')) return;
            Ex.deberes([]); renderDeberes(q);
          }
        }, 'Vaciar')
      ]));
      p.raw(caja);
      p.raw(av);
      p.note('El enlace lleva los deberes dentro, así que funciona sin servidor y sin cuentas: por ' +
        'correo, por mensaje o escrito en la pizarra. Lo que <strong>no</strong> lleva es ninguna ' +
        'respuesta ni ningún dato de nadie.', 'ok', 'Qué viaja en el enlace');
    }

    mainEl.scrollTop = 0;
    paintIndex();
  }
  Course.renderDeberes = renderDeberes;

  /* ---------------- examen de cualquier bloque ----------------
     La maquinaria del simulacro existia y solo servia para la PAU. Abrirla a
     cualquier seleccion de bloques convierte el curso en su propio generador
     de examenes, y con la misma propiedad util: el enlace de un examen
     reproduce las mismas preguntas con los mismos numeros. */

  function renderExamen(q) {
    U.clear(wrapEl);
    wrapEl.removeAttribute('data-piel');
    crumbEl.innerHTML = '<a href="#/">' + U.escape(T('Inicio')) + '</a> › <b>' + U.escape(T('Examen')) + '</b>';
    document.title = 'Examen de cualquier bloque · Matebase';

    var h = U.el('div.hdr');
    h.innerHTML = '<h1 tabindex="-1">Examen de cualquier bloque</h1>' +
      '<p class="hdr__sub">Elige de dónde entran las preguntas y el curso monta un examen: sin ' +
      'pistas, con cronómetro si quieres, y con la corrección y el paso a paso al entregar.</p>';
    wrapEl.appendChild(h);
    avisoIdioma(wrapEl, 'Esta página está escrita en castellano.');

    var elegidos = {};
    (q && q.b ? String(q.b).split(',') : []).forEach(function (x) { elegidos[x] = 1; });
    var porBloque = parseInt((q && q.n) || '2', 10);
    if (isNaN(porBloque) || porBloque < 1) porBloque = 2;

    var p = new Page(wrapEl, { id: '__examen' });
    var zona = U.el('div');

    var rej = U.el('div.examen__bloques');
    CURRICULUM.forEach(function (b) {
      var conEjercicios = b.temas.filter(function (t) { return t.id.indexOf('pau-') !== 0; });
      if (!conEjercicios.length) return;
      var idc = 'ex-b-' + b.id;
      var chk = U.el('input', { type: 'checkbox', id: idc, checked: !!elegidos[b.id] });
      chk.addEventListener('change', function () {
        if (chk.checked) elegidos[b.id] = 1; else delete elegidos[b.id];
        pinta();
      });
      rej.appendChild(U.el('label.examen__b', { 'for': idc }, [
        chk, U.el('span', { html: '<span class="blk__num">' + b.n + '</span> ' + U.escape(b.title) })
      ]));
    });
    p.section('De dónde entran las preguntas');
    p.raw(rej);

    var fila = U.el('div.chips');
    W.chips(fila, [1, 2, 3, 4].map(function (n) {
      return { label: n + (n === 1 ? ' pregunta' : ' preguntas') + ' por bloque', value: String(n) };
    }), {
      value: String(porBloque),
      on: function (v) { porBloque = parseInt(v, 10); pinta(); }
    });
    p.raw(fila);

    var resumen = U.el('p.card__aviso');
    p.raw(resumen);
    p.raw(U.el('div.chips', null, [
      U.el('button.btn.btn--main', { type: 'button', onclick: function () { monta(); } }, 'Preparar el examen'),
      U.el('button.btn', {
        type: 'button',
        onclick: function () {
          var ids = Object.keys(elegidos);
          if (!ids.length) return;
          var url = location.href.split('#')[0] + '#/__examen?b=' + ids.join(',') + '&n=' + porBloque;
          var inp = U.el('input.card__url', { type: 'text', readonly: true, value: url, 'aria-label': 'Enlace de este examen' });
          U.clear(resumen);
          resumen.appendChild(U.el('span', { text: 'Enlace de esta configuración: ' }));
          resumen.appendChild(inp);
          inp.focus(); inp.select();
        }
      }, 'Enlace de esta configuración')
    ]));
    p.raw(zona);

    function pinta() {
      var n = Object.keys(elegidos).length;
      resumen.textContent = n
        ? n + ' ' + U.plural(n, 'bloque', 'bloques') + ' · ' + (n * porBloque) + ' preguntas · ≈' +
          (n * porBloque * 10) + ' minutos'
        : 'Elige al menos un bloque.';
    }

    function monta() {
      U.clear(zona);
      var ids = Object.keys(elegidos);
      if (!ids.length) return;
      var partes = [];
      CURRICULUM.forEach(function (b) {
        if (!elegidos[b.id]) return;
        var temas = b.temas.filter(function (t) { return t.id.indexOf('pau-') !== 0; })
          .map(function (t) { return t.id; });
        if (!temas.length) return;
        partes.push({ titulo: b.title, temas: temas, n: porBloque, min: porBloque * 10 });
      });
      var p2 = new Page(zona, { id: '__examen-sim', _q: (q || {}) });
      p2.node = { _q: q || {} };
      p2.simulacro({ titulo: 'Examen de ' + partes.length + ' ' + U.plural(partes.length, 'bloque', 'bloques'), partes: partes });
      if (zona.scrollIntoView) zona.scrollIntoView({ block: 'start' });
    }

    pinta();
    if (Object.keys(elegidos).length) monta();

    p.note('Es la misma maquinaria de los simulacros de la PAU, con los bloques abiertos. Las preguntas ' +
      'salen de los ejercicios de los temas, dando preferencia a los problemas por apartados, y un ' +
      'tema escogido no repite: primero se reparte entre temas distintos.', null, 'De dónde sale esto');

    mainEl.scrollTop = 0;
    paintIndex();
  }
  Course.renderExamen = renderExamen;

  /* ---------------- las rutas de la ampliacion ----------------
     Los bloques 0 a 7 se recorren en orden y tienen itinerario de examen.
     Los 161 temas de ampliacion no: son optativos y no se presuponen entre
     si, asi que sin una ruta son un catalogo. Esta pagina es a la ampliacion
     lo que el mapa de 2.º es al examen. */

  function horas(n) {
    var h = n * (RUTAS.MIN_POR_TEMA || 50) / 60;
    return h < 10 ? (Math.round(h * 2) / 2).toString().replace('.', ',') : String(Math.round(h));
  }

  function rutaPorId(id) {
    for (var i = 0; i < RUTAS.length; i++) if (RUTAS[i].id === id) return RUTAS[i];
    return null;
  }

  /** El primer tema de la ruta que no esté dominado: por donde seguir. */
  function siguienteDe(r) {
    for (var i = 0; i < r.temas.length; i++) {
      if (Progress.state(r.temas[i]) !== 'done') return r.temas[i];
    }
    return null;
  }

  function cuentaRuta(r) {
    var vistos = 0, hechos = 0;
    r.temas.forEach(function (id) {
      var e = Progress.state(id);
      if (e) vistos++;
      if (e === 'done') hechos++;
    });
    return { vistos: vistos, hechos: hechos, total: r.temas.length };
  }

  function tarjetaRuta(r, conLista) {
    var c = cuentaRuta(r);
    var card = U.el('div.card');
    card.appendChild(U.el('div.card__head', null, [
      U.el('span.card__title', { text: r.t }),
      U.el('span.card__spacer'),
      U.el('span.card__score', { text: r.temas.length + ' temas · ≈' + horas(r.temas.length) + ' h' })
    ]));
    var bd = U.el('div.card__body');
    bd.appendChild(U.el('div.prose', { html: '<p>' + r.r + '</p><p><em>' + r.para + '</em></p>' }));
    bd.appendChild(barra(c.hechos, c.vistos, c.total));
    bd.appendChild(U.el('p.card__aviso', {
      text: c.vistos
        ? c.hechos + ' de ' + c.total + ' dominados, ' + c.vistos + ' empezados.'
        : 'Sin empezar. Se entra por «' + nombreDe(r.temas[0]) + '».'
    }));
    var fila = U.el('div.chips');
    var sig = siguienteDe(r);
    if (sig) {
      fila.appendChild(U.el('a.btn.btn--main', {
        href: '#/' + sig, text: (c.vistos ? 'Seguir en' : 'Empezar por') + ' «' + nombreDe(sig) + '» →'
      }));
    } else {
      fila.appendChild(U.el('span.card__score', { text: 'Ruta completa ✓' }));
    }
    if (!conLista) fila.appendChild(U.el('a.btn', { href: '#/__rutas?r=' + r.id, text: 'Ver el recorrido' }));
    bd.appendChild(fila);

    if (conLista) {
      var nuc = {};
      r.nucleo.forEach(function (x) { nuc[x] = 1; });
      var ol = U.el('ol.ruta');
      r.temas.forEach(function (id) {
        var t = BYID[id];
        var st = Progress.state(id);
        var li = U.el('li.ruta__t' + (st ? '.is-' + st : '') + (nuc[id] ? '.is-nucleo' : ''));
        li.appendChild(U.el('a', { href: '#/' + id, text: t ? t.t : id }));
        li.appendChild(U.el('span.ruta__bl', { text: t ? ('bloque ' + t._block.n) : '' }));
        ol.appendChild(li);
      });
      bd.appendChild(ol);
      bd.appendChild(U.el('p.card__aviso', {
        html: 'Los <strong>marcados</strong> son a lo que se venía; los demás son camino: ' +
          'temas que estos dan por sabidos y que la ruta incluye para no mandarte a un sitio ' +
          'donde te falte algo.'
      }));
    }
    card.appendChild(bd);
    return card;
  }

  function renderRutas(q) {
    U.clear(wrapEl);
    wrapEl.removeAttribute('data-piel');
    var sola = q && q.r ? rutaPorId(q.r) : null;
    crumbEl.innerHTML = '<a href="#/">' + U.escape(T('Inicio')) + '</a> › ' +
      (sola ? '<a href="#/__rutas">' + U.escape(T('Rutas')) + '</a> › <b>' + sola.t + '</b>'
            : '<b>' + U.escape(T('Rutas de la ampliación')) + '</b>');
    document.title = (sola ? sola.t : 'Rutas de la ampliación') + ' · Matebase';

    var h = U.el('div.hdr');
    h.innerHTML = '<h1 tabindex="-1">' + (sola ? sola.t : 'Rutas de la ampliación') + '</h1>' +
      '<p class="hdr__sub">' + (sola ? sola.r
        : 'Más allá de 2.º hay ' + FLAT.filter(function (t) { return t.curso === 'AMP'; }).length +
          ' temas optativos que no se presuponen entre sí. Estas tres rutas los recorren con ' +
          'sentido: cada una dice a dónde llega y por dónde se pasa.') + '</p>';
    wrapEl.appendChild(h);
    avisoIdioma(wrapEl, 'Esta página está escrita en castellano.');

    var p = new Page(wrapEl, { id: '__rutas' });

    if (sola) {
      p.raw(tarjetaRuta(sola, true));
      p.raw(U.el('div.chips', null, [U.el('a.btn', { href: '#/__rutas', text: '← Las tres rutas' })]));
    } else {
      p.text('No hay que elegir una y casarse con ella: comparten temas, y terminar una deja media ' +
        'de otra hecha. La estimación de horas sale de contar <strong>' + (RUTAS.MIN_POR_TEMA || 50) +
        ' minutos por tema</strong>, que es lo que cuesta leerlo y hacer sus ejercicios sin prisa.');
      RUTAS.forEach(function (r) { p.raw(tarjetaRuta(r, false)); });
      p.note('Lo que no está en ninguna ruta no es peor: es que no cabía en ningún hilo. Programación ' +
        'gráfica y criptografía son bloques que se recorren enteros y por su cuenta, y el índice de la ' +
        'izquierda sigue estando para eso.', null, 'Y lo demás');
    }

    mainEl.scrollTop = 0;
    paintIndex();
  }
  Course.renderRutas = renderRutas;

  /* ---------------- progreso portatil y vista de clase ----------------
     El progreso vive en el navegador. Eso esta bien para quien estudia -no
     hay que registrarse- y es ciego para quien enseña. Las dos cosas se
     arreglan sin servidor: el progreso se exporta como texto, se guarda en
     un archivo y se vuelve a leer; y quien enseña lee varios a la vez y los
     pone en una tabla. Nada sale del ordenador si nadie lo manda. */

  var clase = [];      // [{nombre, resumen}] cargados en esta sesion

  function descarga(texto, nombre) {
    try {
      var b = new Blob([texto], { type: 'application/json' });
      var u = URL.createObjectURL(b);
      var a = U.el('a', { href: u, download: nombre });
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 400);
      return true;
    } catch (e) { return false; }
  }

  function barra(hechos, vistos, total) {
    var el = U.el('span.barrita', { title: hechos + ' dominados y ' + vistos + ' vistos de ' + total });
    el.appendChild(U.el('i.barrita__done', { style: { width: (100 * hechos / total) + '%' } }));
    el.appendChild(U.el('i.barrita__seen', { style: { width: (100 * Math.max(0, vistos - hechos) / total) + '%' } }));
    return el;
  }

  function renderProgreso() {
    U.clear(wrapEl);
    wrapEl.removeAttribute('data-piel');
    crumbEl.innerHTML = '<a href="#/">' + U.escape(T('Inicio')) + '</a> › <b>' + U.escape(T('Progreso y clase')) + '</b>';
    document.title = 'Progreso y clase · Matebase';

    var h = U.el('div.hdr');
    h.innerHTML = '<h1 tabindex="-1">Progreso y clase</h1>' +
      '<p class="hdr__sub">Tu progreso vive en este navegador y no se manda a ninguna parte. ' +
      'Aquí puedes llevártelo a otro ordenador, recuperarlo, o —si das clase— leer los de tu grupo.</p>';
    wrapEl.appendChild(h);
    avisoIdioma(wrapEl, 'Esta página está escrita en castellano.');

    var p = new Page(wrapEl, { id: '__progreso' });

    /* --- lo mío --- */
    p.section('Tu progreso');
    var st = Progress.stats();
    var res = Progress.resumen();
    p.text('Ahora mismo has abierto <strong>' + st.seen + '</strong> ' +
      U.plural(st.seen, 'tema', 'temas') + ' y dominas <strong>' + st.done + '</strong>, ' +
      'con ' + st.ok + ' ' + U.plural(st.ok, 'acierto', 'aciertos') + ' de ' + st.tries + ' ' +
      U.plural(st.tries, 'intento', 'intentos') + '. Dominar un tema es haber resuelto al menos ' +
      'una vez cada tipo de ejercicio que tiene, no haber acertado cinco veces el mismo.');

    var nombreEd = U.el('input.card__url', {
      type: 'text', maxlength: '60', placeholder: 'Tu nombre (opcional, va dentro del archivo)',
      'aria-label': 'Nombre para el archivo de progreso',
      value: Progress.pref('nombre') || ''
    });
    p.raw(nombreEd);

    var avisoEx = U.el('p.card__aviso');
    var filaEx = U.el('div.chips');
    filaEx.appendChild(U.el('button.btn.btn--main', {
      type: 'button',
      onclick: function () {
        var n = nombreEd.value.trim();
        Progress.pref('nombre', n);
        var txt = Progress.exporta(n);
        var nom = 'matebase-' + (n ? n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' : '') +
          new Date().toISOString().slice(0, 10) + '.json';
        avisoEx.textContent = descarga(txt, nom)
          ? 'Guardado como «' + nom + '». Llévatelo donde quieras y cárgalo ahí abajo.'
          : 'Este navegador no deja descargar archivos. Copia el texto de abajo a mano.';
        cajaEx.value = txt;
        cajaEx.hidden = false;
      }
    }, '⭳ Guardar en un archivo'));
    filaEx.appendChild(U.el('button.btn', {
      type: 'button',
      onclick: function () {
        cajaEx.value = Progress.exporta(nombreEd.value.trim());
        cajaEx.hidden = false;
        cajaEx.focus(); cajaEx.select();
        avisoEx.textContent = 'Ahí está el texto. Cópialo y pégalo donde quieras guardarlo.';
      }
    }, 'Ver el texto para copiarlo'));
    p.raw(filaEx);
    var cajaEx = U.el('textarea.card__url', {
      rows: '3', hidden: true, readonly: '', 'aria-label': 'Tu progreso en texto'
    });
    p.raw(cajaEx);
    p.raw(avisoEx);

    /* --- traerlo de vuelta --- */
    p.sub('Traerlo de vuelta');
    p.text('Carga aquí un archivo guardado antes. <strong>Fundir</strong> conserva lo más avanzado de ' +
      'cada lado, que es lo que quieres si has estudiado en dos sitios; <strong>reemplazar</strong> ' +
      'tira lo de este navegador y deja exactamente lo del archivo.');

    var avisoIm = U.el('p.card__aviso');
    var cajaIm = U.el('textarea.card__url', {
      rows: '3', placeholder: 'Pega aquí el texto del progreso, o usa el botón de abajo',
      'aria-label': 'Progreso a recuperar'
    });
    p.raw(cajaIm);

    function aplica(modo) {
      var r = Progress.importa(cajaIm.value, modo);
      if (!r.ok) { avisoIm.textContent = r.error; return; }
      avisoIm.textContent = 'Listo: ' + r.temas + ' ' + U.plural(r.temas, 'tema', 'temas') +
        (modo === 'fundir' ? ' fundidos con lo que ya había.' : ' cargados, reemplazando lo anterior.') +
        (r.nombre ? ' (archivo de ' + r.nombre + ')' : '');
      renderProgreso();
      var a = wrapEl.querySelector('.card__aviso');
      if (a) a.textContent = avisoIm.textContent;
    }

    var filaIm = U.el('div.chips');
    var file = U.el('input', {
      type: 'file', accept: '.json,application/json', 'aria-label': 'Archivo de progreso',
      onchange: function () {
        var f = file.files && file.files[0];
        if (!f) return;
        var fr = new FileReader();
        fr.onload = function () { cajaIm.value = String(fr.result || ''); aplica('fundir'); };
        fr.onerror = function () { avisoIm.textContent = 'No se ha podido leer el archivo.'; };
        fr.readAsText(f);
      }
    });
    filaIm.appendChild(file);
    filaIm.appendChild(U.el('button.btn.btn--main', { type: 'button', onclick: function () { aplica('fundir'); } }, 'Fundir con lo mío'));
    filaIm.appendChild(U.el('button.btn', { type: 'button', onclick: function () { aplica('reemplazar'); } }, 'Reemplazar'));
    p.raw(filaIm);
    p.raw(avisoIm);

    p.note('Si el navegador borra los datos del sitio —o los borras tú— el progreso se va sin aviso. ' +
      'Guardar el archivo de vez en cuando es la única copia de seguridad que hay.', 'warn', 'Antes de que pase');

    /* --- por bloques --- */
    p.section('Por dónde vas');
    var tb = U.el('table.tbl');
    var thead = U.el('tr');
    ['Bloque', 'Temas', 'Vistos', 'Dominados', ''].forEach(function (x, i) {
      thead.appendChild(U.el(i > 0 && i < 4 ? 'th.num' : 'th', { text: x }));
    });
    tb.appendChild(U.el('thead', null, thead));
    var tbody = U.el('tbody');
    CURRICULUM.forEach(function (b) {
      var r = res.bloques[b.id];
      var tr = U.el('tr');
      tr.appendChild(U.el('td', null, [U.el('span.blk__num', { text: b.n }), U.el('span', { text: ' ' + b.title })]));
      tr.appendChild(U.el('td.num', { text: String(r.total) }));
      tr.appendChild(U.el('td.num', { text: String(r.vistos) }));
      tr.appendChild(U.el('td.num', { text: String(r.hechos) }));
      tr.appendChild(U.el('td', null, [barra(r.hechos, r.vistos, r.total)]));
      tbody.appendChild(tr);
    });
    tb.appendChild(tbody);
    p.raw(U.el('div.tbl-wrap', null, [tb]));

    /* --- la clase --- */
    p.section('Vista de clase');
    p.text('Para quien da clase: carga aquí los archivos que te entreguen y verás a todo el grupo en ' +
      'una tabla. Los archivos <strong>no se guardan</strong> en ninguna parte: se leen, se suman y ' +
      'desaparecen al recargar la página.');

    var avisoCl = U.el('p.card__aviso');
    var fileCl = U.el('input', {
      type: 'file', accept: '.json,application/json', multiple: '',
      'aria-label': 'Archivos de progreso del grupo',
      onchange: function () {
        var fs = [].slice.call(fileCl.files || []);
        if (!fs.length) return;
        var pend = fs.length, malos = 0;
        fs.forEach(function (f) {
          var fr = new FileReader();
          fr.onload = function () {
            var r = Progress.lee(String(fr.result || ''));
            if (r.ok) {
              clase.push({
                nombre: r.datos.nombre || f.name.replace(/\.json$/i, ''),
                fecha: r.datos.fecha || '',
                resumen: Progress.resumen(r.datos.t)
              });
            } else malos++;
            if (--pend === 0) {
              avisoCl.textContent = malos ? (malos + ' ' + U.plural(malos, 'archivo no se ha entendido', 'archivos no se han entendido') + '.') : '';
              pintaClase();
            }
          };
          fr.readAsText(f);
        });
      }
    });
    var filaCl = U.el('div.chips', null, [fileCl]);
    filaCl.appendChild(U.el('button.btn', {
      type: 'button', onclick: function () { clase = []; pintaClase(); avisoCl.textContent = ''; }
    }, 'Vaciar la lista'));
    p.raw(filaCl);
    p.raw(avisoCl);

    var cajaClase = U.el('div');
    p.raw(cajaClase);

    function pintaClase() {
      U.clear(cajaClase);
      if (!clase.length) {
        cajaClase.appendChild(U.el('p.card__aviso', {
          text: 'Todavía no has cargado ningún archivo. Puedes seleccionar varios a la vez.'
        }));
        return;
      }
      var t2 = U.el('table.tbl');
      var h2 = U.el('tr');
      ['Alumno', 'Fecha', 'Vistos', 'Dominados', 'Aciertos', 'Intentos', 'Acierto'].forEach(function (x, i) {
        h2.appendChild(U.el(i >= 2 ? 'th.num' : 'th', { text: x }));
      });
      t2.appendChild(U.el('thead', null, h2));
      var b2 = U.el('tbody');
      clase.slice().sort(function (a, b) { return b.resumen.dominados - a.resumen.dominados; })
        .forEach(function (al) {
          var r = al.resumen, tr = U.el('tr');
          var pct = r.intentos ? Math.round(100 * r.ok / r.intentos) : 0;
          tr.appendChild(U.el('td', { text: al.nombre }));
          tr.appendChild(U.el('td', { text: al.fecha }));
          tr.appendChild(U.el('td.num', { text: String(r.vistos) }));
          tr.appendChild(U.el('td.num', { text: String(r.dominados) }));
          tr.appendChild(U.el('td.num', { text: String(r.ok) }));
          tr.appendChild(U.el('td.num', { text: String(r.intentos) }));
          tr.appendChild(U.el('td.num', { text: r.intentos ? pct + ' %' : '—' }));
          b2.appendChild(tr);
        });
      t2.appendChild(b2);
      cajaClase.appendChild(U.el('div.tbl-wrap', null, [t2]));

      /* Donde se atasca el grupo: los bloques con mas distancia entre
         abrirlos y dominarlos son los que hay que mirar en clase. */
      var agg = {};
      clase.forEach(function (al) {
        for (var k in al.resumen.bloques) {
          var b = al.resumen.bloques[k];
          if (!agg[k]) agg[k] = { n: b.n, title: b.title, total: b.total, vistos: 0, hechos: 0 };
          agg[k].vistos += b.vistos; agg[k].hechos += b.hechos;
        }
      });
      var lista = [];
      for (var k2 in agg) if (agg[k2].vistos) lista.push(agg[k2]);
      lista.sort(function (a, b) {
        return (a.hechos / a.vistos) - (b.hechos / b.vistos);
      });
      if (lista.length) {
        cajaClase.appendChild(U.el('p.card__aviso', {
          html: '<strong>Donde más se atasca el grupo:</strong> ' +
            lista.slice(0, 3).map(function (b) {
              return b.title + ' (' + Math.round(100 * b.hechos / b.vistos) + ' % de lo abierto, dominado)';
            }).join(' · ')
        }));
      }
    }
    pintaClase();

    /* --- borrar --- */
    p.section('Empezar de cero');
    var avisoRe = U.el('p.card__aviso');
    p.raw(U.el('div.chips', null, [
      U.el('button.btn', {
        type: 'button',
        onclick: function () {
          if (!global.confirm('Se borrará todo tu progreso en este navegador. ¿Seguro?')) return;
          Progress.reset();
          renderProgreso();
        }
      }, 'Borrar mi progreso')
    ]));
    p.raw(avisoRe);
    p.text('Antes de borrar, guarda el archivo: es la única forma de volver atrás.');

    mainEl.scrollTop = 0;
    paintIndex();
  }
  Course.renderProgreso = renderProgreso;

  /* ---------------- temas: claro, oscuro y monokai ---------------- */

  var TEMAS = [
    { id: 'light', nombre: 'Claro', icono: '☀' },
    { id: 'dark', nombre: 'Oscuro', icono: '☾' },
    { id: 'monokai', nombre: 'Monokai', icono: '◐' }
  ];

  /* Tamano de lectura. Todo el curso mide la letra en rem, asi que basta
     con mover el tamano de la raiz para que crezca hasta la ultima etiqueta
     de las graficas. Quien lee con esfuerzo no deberia tener que pelearse
     con los ajustes del navegador para leer un libro de texto. */
  var LETRAS = [
    { id: 'n', nombre: 'Normal', px: 16, titulo: 'Tamaño de letra normal' },
    { id: 'g', nombre: 'Grande', px: 18.5, titulo: 'Letra grande' },
    { id: 'xg', nombre: 'Mayor', px: 21.5, titulo: 'Letra muy grande' }
  ];

  function buildLetraButtons() {
    var caja = U.$('#letras');
    if (!caja) return;
    U.clear(caja);
    LETRAS.forEach(function (t) {
      caja.appendChild(U.el('button.themes__b', {
        type: 'button', 'data-letra': t.id, title: T(t.titulo),
        onclick: function () { setLetra(t.id); }
      }, [
        U.el('span.themes__i', { style: { fontSize: (0.72 + LETRAS.indexOf(t) * 0.17) + 'rem' } }, 'A'),
        U.el('span', null, T(t.nombre))
      ]));
    });
  }

  function setLetra(id) {
    var t = LETRAS[0];
    for (var i = 0; i < LETRAS.length; i++) if (LETRAS[i].id === id) t = LETRAS[i];
    document.documentElement.style.fontSize = t.px + 'px';
    Progress.pref('letra', t.id);
    U.$$('#letras .themes__b').forEach(function (b) {
      var activo = b.getAttribute('data-letra') === t.id;
      b.classList.toggle('is-on', activo);
      b.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });
    // Las graficas dibujan su texto en el canvas: hay que repintarlas.
    U.bus.emit('letra', t.id);
    if (window.W && W.redibuja) W.redibuja();
  }

  /** Un boton por tema, para que se vean los tres y no haya que adivinarlos. */
  /* ---------------- idioma ----------------
     El curso esta escrito en castellano y esa es su lengua. Un diccionario
     traduce la INTERFAZ y el TEMARIO -titulos y resumenes- y deja la prosa
     como esta, que es lo que permite que el curso se pueda recorrer y citar
     sin haber traducido 246 temas. Cuando se elige otro idioma, el aviso lo
     dice: nadie tiene que descubrirlo abriendo un tema. */

  function buildIdiomaButtons() {
    var caja = U.$('#idiomas');
    if (!caja || !global.I18N) return;
    var lista = I18N.lista();
    if (lista.length < 2) { caja.style.display = 'none'; return; }
    U.clear(caja);
    lista.forEach(function (l) {
      caja.appendChild(U.el('button.themes__b', {
        type: 'button', 'data-idioma': l.codigo,
        title: l.nombre,
        onclick: function () { setIdioma(l.codigo); }
      }, l.codigo.toUpperCase()));
    });
  }

  function setIdioma(codigo) {
    if (!global.I18N) return;
    var usado = I18N.usar(codigo);
    Progress.pref('idioma', usado);
    U.$$('#idiomas .themes__b').forEach(function (b) {
      var on = b.getAttribute('data-idioma') === usado;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    flatten();                      // el temario se vuelve a leer traducido
    traduceChrome();
    buildItinButtons();
    setItinerario(itin);            // reconstruye el indice con los rotulos nuevos
    route();                        // y la pagina de ahora se repinta
  }
  Course.setIdioma = setIdioma;

  function buildThemeButtons() {
    var caja = U.$('#themes');
    if (!caja) return;
    U.clear(caja);
    TEMAS.forEach(function (t) {
      caja.appendChild(U.el('button.themes__b', {
        type: 'button',
        'data-tema': t.id,
        title: T('Tema') + ' ' + T(t.nombre).toLowerCase(),
        onclick: function () { setTheme(t.id); }
      }, [
        U.el('span.themes__i', null, t.icono),
        U.el('span', null, T(t.nombre))
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

  /* ---------------- glosario y referencia GLSL ----------------
     Columna derecha ocultable con dos documentos que comparten sitio: el
     glosario del curso y la referencia del lenguaje de los shaders. Cada
     boton de la barra superior abre el suyo; pulsarlo cuando su contenido
     ya se ve cierra la columna, y pulsar el otro cambia de documento sin
     cerrarla. Cada entrada es un desplegable que se abre en su sitio: el
     contenido central no se toca nunca. */

  function sinTildes(s) {
    return s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s;
  }

  /** Resalta el trozo buscado dentro del titulo, respetando las tildes. El
      titulo se escapa: en la referencia GLSL hay titulos con < y &. */
  function resaltar(texto, q) {
    if (!q) return U.escape(texto);
    var plano = sinTildes(texto).toLowerCase();
    var i = plano.indexOf(q);
    if (i < 0) return U.escape(texto);
    return U.escape(texto.slice(0, i)) + '<mark class="glos__marca">' +
      U.escape(texto.slice(i, i + q.length)) + '</mark>' + U.escape(texto.slice(i + q.length));
  }

  function montarGlosario() {
    var caja = U.$('#glos');
    var lista = U.$('#glosList');
    var buscar = U.$('#glosSearch');
    var cuenta = U.$('#glosCount');
    var titulo = U.$('#glosTitle');
    var cerrar = U.$('#glosClose');
    if (!caja || !lista || !buscar) return;

    /* Texto sobre el que busca cada entrada: titulo, variantes y definicion. */
    function indexa(e, extra) {
      e._t = sinTildes(String(e.t).toLowerCase());
      e._v = sinTildes(String(e.v || '').toLowerCase());
      e._b = sinTildes((e.t + ' ' + (e.v || '') + ' ' + (extra || '') + ' ' +
        String(e.d).replace(/<[^>]+>/g, '')).toLowerCase());
    }

    var TERMINOS = (global.GLOSARIO || []).slice().sort(function (a, b) {
      return sinTildes(a.t).toLowerCase().localeCompare(sinTildes(b.t).toLowerCase(), 'es');
    });
    TERMINOS.forEach(function (e) { indexa(e); });

    var REF = global.GLSL || { intro: '', grupos: [], entradas: [] };
    var GRUPO = {};
    REF.grupos.forEach(function (g) { GRUPO[g.id] = g; });
    REF.entradas.forEach(function (e) {
      indexa(e, (e.s || '') + ' ' + (GRUPO[e.g] ? GRUPO[e.g].t : ''));
    });

    /* Lo que cambia de un documento a otro. Cada uno recuerda lo que se
       estaba buscando, que entradas estaban abiertas y por donde se iba. */
    var MODOS = {
      glos: {
        boton: U.$('#glosBtn'), titulo: 'Glosario', aria: 'Glosario de términos',
        ph: 'Buscar un término…', cierre: 'Ocultar el glosario',
        nombre: 'términos', total: TERMINOS.length, q: '', abierto: {}, scroll: 0
      },
      glsl: {
        boton: U.$('#glslBtn'), titulo: 'Referencia GLSL', aria: 'Referencia del lenguaje GLSL',
        ph: 'Buscar una función o palabra…', cierre: 'Ocultar la referencia GLSL',
        nombre: 'entradas', total: REF.entradas.length, q: '', abierto: {}, scroll: 0
      }
    };
    var modo = 'glos';

    function pintaCodigo(txt) {
      return (global.W && W.glslPinta) ? W.glslPinta(txt) : U.escape(txt);
    }

    /* Un desplegable. `rellena` construye la definicion la primera vez que se
       abre: la referencia colorea codigo, y no tiene sentido colorear ciento
       y pico ejemplos en cada pulsacion del buscador. */
    function desplegable(e, q, abierto, deCodigo, rellena, etiqueta) {
      var item = U.el('div.glos__item');
      var def = U.el('div.glos__d');
      var hecho = false, bt;
      function abre(v) {
        if (v && !hecho) { rellena(def); hecho = true; }
        def.classList.toggle('is-open', v);
        bt.setAttribute('aria-expanded', v ? 'true' : 'false');
      }
      bt = U.el('button.glos__t' + (deCodigo ? '.glos__t--cod' : ''), {
        type: 'button', 'aria-expanded': 'false', 'data-termino': e.t,
        onclick: function () { abierto[e.t] = !abierto[e.t]; abre(!!abierto[e.t]); }
      }, [
        U.el('span.glos__caret', null, '▸'),
        U.el('span.glos__n', { html: resaltar(e.t, q) }),
        etiqueta ? U.el('span.glos__tag', { text: etiqueta }) : null
      ]);
      item.appendChild(bt);
      item.appendChild(def);
      if (abierto[e.t]) abre(true);
      return item;
    }

    function enlaceTema(def, e) {
      if (e.i && BYID[e.i]) {
        def.appendChild(U.el('a.glos__ir', { href: '#/' + e.i, text: 'Ver en «' + BYID[e.i].t + '» →' }));
      }
    }

    function entradaGlosario(e, q, m) {
      return desplegable(e, q, m.abierto, false, function (def) {
        def.innerHTML = MathX.inline(e.d);
        enlaceTema(def, e);
      });
    }

    function entradaGlsl(e, q, m, etiqueta) {
      return desplegable(e, q, m.abierto, !e.p, function (def) {
        if (e.s) def.appendChild(U.el('pre.glos__cod', { html: pintaCodigo(e.s) }));
        def.appendChild(U.el('div', { html: MathX.inline(e.d) }));
        if (e.e) {
          def.appendChild(U.el('div.glos__ejt', { text: 'Ejemplo' }));
          def.appendChild(U.el('pre.glos__cod', { html: pintaCodigo(e.e) }));
        }
        enlaceTema(def, e);
      }, etiqueta);
    }

    function pintaGlosario(q, m) {
      var vistos = 0;
      TERMINOS.forEach(function (e) {
        if (q && e._b.indexOf(q) < 0) return;
        vistos++;
        lista.appendChild(entradaGlosario(e, q, m));
      });
      return vistos;
    }

    /* Sin buscar, la referencia va por grupos, en el orden en que se aprende.
       Buscando, primero lo que se llama asi y despues lo que lo menciona:
       quien escribe «mix» quiere mix, no las entradas que lo usan de pasada. */
    function pintaGlsl(q, m) {
      var vistos = 0;
      if (!q) {
        if (REF.intro) lista.appendChild(U.el('p.glos__intro', { html: MathX.inline(REF.intro) }));
        REF.grupos.forEach(function (g) {
          var suyas = REF.entradas.filter(function (e) { return e.g === g.id; });
          if (!suyas.length) return;
          lista.appendChild(U.el('div.glos__grupo', { role: 'heading', 'aria-level': '3', text: g.t }));
          suyas.forEach(function (e) { vistos++; lista.appendChild(entradaGlsl(e, q, m)); });
        });
        return vistos;
      }
      var nombre = [], mencion = [];
      REF.entradas.forEach(function (e, i) {
        if (e._t.indexOf(q) >= 0 || e._v.indexOf(q) >= 0) {
          // el titulo exacto delante: «sin» antes que «asin»
          var exacto = (' ' + e._t.replace(/[^a-z0-9_#]+/g, ' ') + ' ').indexOf(' ' + q + ' ') >= 0;
          nombre.push({ e: e, k: exacto ? 0 : (e._t.indexOf(q) >= 0 ? 1 : 2), i: i });
        } else if (e._b.indexOf(q) >= 0) mencion.push(e);
      });
      nombre.sort(function (a, b) { return a.k - b.k || a.i - b.i; });
      function etiq(e) { return GRUPO[e.g] ? (GRUPO[e.g].c || GRUPO[e.g].t) : ''; }
      nombre.forEach(function (x) { vistos++; lista.appendChild(entradaGlsl(x.e, q, m, etiq(x.e))); });
      if (mencion.length) {
        if (nombre.length) {
          lista.appendChild(U.el('div.glos__grupo', { role: 'heading', 'aria-level': '3', text: 'También lo mencionan' }));
        }
        mencion.forEach(function (e) { vistos++; lista.appendChild(entradaGlsl(e, q, m, etiq(e))); });
      }
      return vistos;
    }

    function pintar() {
      var m = MODOS[modo];
      var q = sinTildes(String(m.q || '').trim().toLowerCase());
      U.clear(lista);
      var vistos = modo === 'glsl' ? pintaGlsl(q, m) : pintaGlosario(q, m);
      if (!vistos) {
        lista.appendChild(U.el('div.glos__nada', {
          html: (modo === 'glsl' ? 'Ninguna entrada' : 'Ningún término') + ' coincide con <strong>«' +
            U.escape(q) + '»</strong>.<br>La búsqueda mira también dentro de las ' +
            (modo === 'glsl' ? 'explicaciones' : 'definiciones') + ', así que prueba con una palabra suelta.'
        }));
      }
      cuenta.textContent = vistos === m.total ? m.total + ' ' + m.nombre
        : vistos + ' de ' + m.total + ' ' + m.nombre;
    }

    function cabecera() {
      var m = MODOS[modo];
      caja.setAttribute('data-modo', modo);
      caja.setAttribute('aria-label', m.aria);
      if (titulo) titulo.textContent = m.titulo;
      if (cerrar) cerrar.setAttribute('aria-label', m.cierre);
      buscar.placeholder = m.ph;
      buscar.value = m.q;
      buscar.parentNode.classList.toggle('is-filled', m.q !== '');
    }

    function abierta() { return caja.classList.contains('is-open'); }

    function marcaBotones() {
      Object.keys(MODOS).forEach(function (k) {
        var b = MODOS[k].boton;
        if (b) b.setAttribute('aria-expanded', abierta() && k === modo ? 'true' : 'false');
      });
    }

    /** Pasa al otro documento, conservando en cada uno lo que se buscaba y
        por donde se iba leyendo. */
    function cambiaA(k) {
      if (k === modo) return;
      MODOS[modo].scroll = lista.scrollTop;
      modo = k;
      cabecera();
      pintar();
      lista.scrollTop = MODOS[modo].scroll;
    }

    /** k: 'glos', 'glsl' o false para cerrar la columna. */
    function mostrar(k, sinFoco) {
      if (k) { cambiaA(k); caja.classList.add('is-open'); }
      else caja.classList.remove('is-open');
      marcaBotones();
      Progress.pref('glosario', k || '0');
      if (k && !sinFoco) buscar.focus();
    }

    function botonActivo() { return MODOS[modo].boton; }

    Object.keys(MODOS).forEach(function (k) {
      var b = MODOS[k].boton;
      if (b) b.addEventListener('click', function () {
        mostrar(abierta() && modo === k ? false : k);
      });
    });
    if (cerrar) cerrar.addEventListener('click', function () {
      mostrar(false);
      if (botonActivo()) botonActivo().focus();     // el aspa desaparece: el foco no
    });
    buscar.addEventListener('input', function () {
      MODOS[modo].q = buscar.value;
      pintar();
      buscar.parentNode.classList.toggle('is-filled', buscar.value !== '');
    });
    U.$('#glosClear').addEventListener('click', function () {
      buscar.value = '';
      MODOS[modo].q = '';
      pintar();
      buscar.parentNode.classList.remove('is-filled');
      buscar.focus();
    });
    global.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape' || !abierta()) return;
      var dentro = caja.contains(document.activeElement);
      mostrar(false);
      if (dentro && botonActivo()) botonActivo().focus();
    });

    /* Para el buscador del indice: abre un documento con la entrada desplegada. */
    glosarioApi = {
      abre: function (k, termino) {
        if (termino === undefined) { termino = k; k = 'glos'; }
        if (!MODOS[k]) return;
        if (modo !== k) MODOS[modo].scroll = lista.scrollTop;
        modo = k;
        MODOS[k].q = termino;
        MODOS[k].abierto[termino] = true;
        cabecera();
        pintar();
        lista.scrollTop = 0;
        mostrar(k, true);
        var bt = null;
        [].forEach.call(lista.querySelectorAll('.glos__t'), function (b) {
          if (!bt && b.getAttribute('data-termino') === termino) bt = b;
        });
        if (bt) { bt.focus(); if (bt.scrollIntoView) bt.scrollIntoView({ block: 'nearest' }); }
        var side = U.$('.side');
        if (side) side.classList.remove('is-open');
        var sc = U.$('.scrim');
        if (sc) sc.classList.remove('is-on');
      }
    };

    cabecera();
    pintar();
    var guardado = Progress.pref('glosario');
    if (guardado === '1') guardado = 'glos';       // como se guardaba antes de haber dos
    if (guardado === 'glos' || guardado === 'glsl') mostrar(guardado, true);
  }

  function irAInicio(e) {
    if (e) e.preventDefault();
    if (ruta().id === '') { route(); return; }
    location.hash = '';
    if (!location.hash) route();
  }

  /* ---------------- historial de navegación ----------------
     El curso vive en el hash, así que el «atrás» del navegador ya
     funcionaba. Lo que faltaba era poder volver sobre tus pasos sin salir
     de la página y, sobre todo, VER por dónde has pasado. Se lleva una pila
     propia porque el navegador no deja preguntar si hay algo detrás: sin
     ella no se podrían apagar los botones cuando no llevan a ningún sitio. */
  var pila = [], cur = -1, saltando = false;

  function nombreDe(id) {
    if (!id) return T('Inicio');
    if (id === '__progreso') return T('Progreso y clase');
    if (id === '__rutas') return T('Rutas de la ampliación');
    if (id === '__deberes') return T('Deberes');
    if (id === '__examen') return T('Examen');
    var t = BYID[id];
    return t ? t.t : id;
  }

  function apila(id) {
    if (saltando) { saltando = false; return; }
    if (pila[cur] === id) return;              // recargar no cuenta como viaje
    pila = pila.slice(0, cur + 1);             // navegar corta el futuro
    pila.push(id);
    if (pila.length > 60) pila.shift();        // no crece sin fin
    cur = pila.length - 1;
    Progress.pref('historial', pila.slice(-25).join(','));
  }

  function vaA(i) {
    if (i < 0 || i >= pila.length || i === cur) return;
    cur = i;
    saltando = true;
    var destino = pila[i] ? '#/' + pila[i] : '';
    if (ruta().id === (pila[i] || '')) { saltando = false; route(); }
    else location.hash = destino;
    pintarNav();
  }

  function pintarNav() {
    var a = U.$('#navAtras'), d = U.$('#navAlante');
    if (!a) return;
    a.disabled = (cur <= 0);
    d.disabled = (cur >= pila.length - 1);
    // El título dice a dónde lleva: así se sabe antes de pulsar.
    a.title = a.disabled ? 'No hay nada detrás' : 'Volver a «' + nombreDe(pila[cur - 1]) + '»';
    d.title = d.disabled ? 'No hay nada delante' : 'Ir a «' + nombreDe(pila[cur + 1]) + '»';
  }

  /* ---------------- arranque ---------------- */

  var arrancado = false;

  function route() {
    var r = ruta();
    apila(r.id);
    pintarNav();
    if (!r.id) renderHome();
    else if (r.id === '__progreso') renderProgreso();
    else if (r.id === '__rutas') renderRutas(r.q);
    else if (r.id === '__deberes') renderDeberes(r.q);
    else if (r.id === '__examen') renderExamen(r.q);
    else renderTopic(r.id, r.q);
    // Al navegar, llevar el foco al titulo: quien usa teclado no tiene que
    // volver a recorrer el indice, y quien usa lector de pantalla se entera
    // de que ha cambiado de tema.
    if (arrancado) {
      var h1 = wrapEl && wrapEl.querySelector('h1');
      if (h1 && h1.focus) h1.focus({ preventScroll: true });
    }
    arrancado = true;
    var side = U.$('.side');
    if (side) side.classList.remove('is-open');
    var sc = U.$('.scrim');
    if (sc) sc.classList.remove('is-on');
  }

  function start() {
    /* El idioma se elige ANTES de montar nada. Si se restaura despues, el
       temario, los botones del itinerario y el indice se construyen en
       castellano y hay que rehacerlos; y lo que se olvide rehacer se queda
       en castellano sin que nadie se entere. */
    if (global.I18N) I18N.usar(Progress.pref('idioma') || 'es');
    flatten();
    sideScroll = U.$('#sideScroll');
    mainEl = U.$('#main');
    wrapEl = U.$('#wrap');
    crumbEl = U.$('#crumb');

    buildItinButtons();
    setItinerario(Progress.pref('itin') || 'todo');      // construye el indice
    buildThemeButtons();
    // Por defecto, claro: es el tema en el que esta pensado el curso. Los otros
    // dos se eligen a mano, y la eleccion se recuerda.
    setTheme(Progress.pref('theme') || 'light');
    buildLetraButtons();
    setLetra(Progress.pref('letra') || 'n');
    buildIdiomaButtons();
    if (global.I18N) {
      U.$$('#idiomas .themes__b').forEach(function (b) {
        var on = b.getAttribute('data-idioma') === I18N.actual();
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    // El boton de salto lleva el foco al contenido sin tocar el hash, que
    // aqui es la ruta: un href="#wrap" cambiaria de tema.
    var salto = U.$('#saltar');
    if (salto) salto.addEventListener('click', function () {
      var h = wrapEl.querySelector('h1');
      if (h) { h.focus(); h.scrollIntoView({ block: 'start' }); }
    });

    traduceChrome();

    var search = U.$('#search');
    search.addEventListener('input', function () {
      filterIndex(search.value);
      search.parentNode.classList.toggle('is-filled', search.value !== '');
    });
    U.$('#searchClear').addEventListener('click', function () {
      search.value = ''; filterIndex(''); search.parentNode.classList.remove('is-filled'); search.focus();
    });

    U.$('#resetBtn').addEventListener('click', function () {
      if (confirm(T('¿Borrar el progreso guardado (temas visitados, aciertos y repasos pendientes)?'))) {
        Progress.reset(); paintIndex();
        if (!ruta().id) renderHome();
      }
    });

    // La version, en la esquina inferior izquierda del indice. El numero
    // solo se cambia en version.js.
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

    U.$('#navAtras').addEventListener('click', function () { vaA(cur - 1); });
    U.$('#navAlante').addEventListener('click', function () { vaA(cur + 1); });
    montarGlosario();

    U.bus.on('progress', function () { paintIndex(); });
    global.addEventListener('hashchange', route);

    // Navegacion con teclado: flechas izquierda/derecha entre temas.
    // Antes saltaba de tema aunque la flecha la estuviera usando otra cosa
    // -mover un punto de una grafica, elegir una opcion-: una grafica que se
    // maneja con el teclado mandaba al alumno al tema siguiente al primer
    // toque. Ahora solo navega si nadie mas ha usado la tecla.
    global.addEventListener('keydown', function (e) {
      if (e.defaultPrevented) return;
      var tg = e.target;
      if (tg && /input|textarea|select/i.test(tg.tagName)) return;
      if (tg && tg.closest && tg.closest('[role="application"], [role="radiogroup"], canvas')) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var id = ruta().id;
      var i = FLAT.indexOf(BYID[id]);
      if (e.key === 'ArrowRight' && i >= 0 && FLAT[i + 1]) location.hash = '#/' + FLAT[i + 1].id;
      if (e.key === 'ArrowLeft' && i > 0) location.hash = '#/' + FLAT[i - 1].id;
    });

    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window);
