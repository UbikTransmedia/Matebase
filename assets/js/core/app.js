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
    CURRICULUM.forEach(function (b) {
      b.temas.forEach(function (t) {
        t._block = b;
        if (!t.curso) t.curso = b.curso || '';
        BYID[t.id] = t;
        FLAT.push(t);
      });
    });
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

  /* El buscador del indice mira tambien el glosario. Quien busca «rango» o
     «adjunto» casi nunca busca un tema: busca que significa la palabra. */
  function glosarioEnBusqueda(q, visibles) {
    var viejo = U.$('.glosres', sideScroll);
    if (viejo) viejo.remove();
    if (!q || q.length < 3 || !global.GLOSARIO) {
      if (q && !visibles) sideScroll.appendChild(U.el('div.glosres', null, U.el('p.glosres__nada', { text: 'Ningún tema coincide.' })));
      return;
    }
    var hits = GLOSARIO.filter(function (e) {
      return U.llano(e.t + ' ' + (e.v || '')).indexOf(q) >= 0;
    }).slice(0, 8);
    if (!hits.length && visibles) return;
    var box = U.el('div.glosres');
    if (!visibles) box.appendChild(U.el('p.glosres__nada', { text: 'Ningún tema coincide con la búsqueda.' }));
    if (hits.length) {
      box.appendChild(U.el('div.glosres__t', { text: 'En el glosario' }));
      hits.forEach(function (e) {
        box.appendChild(U.el('button.glosres__b', {
          type: 'button', title: 'Abrir «' + e.t + '» en el glosario',
          onclick: function () { if (glosarioApi) glosarioApi.abre(e.t); }
        }, [
          U.el('span.glosres__n', { text: e.t }),
          (e.i && BYID[e.i]) ? U.el('span.glosres__i', { text: BYID[e.i].t }) : null
        ]));
      });
    }
    sideScroll.appendChild(box);
  }

  function buildItinButtons() {
    var caja = U.$('#itin');
    if (!caja) return;
    U.clear(caja);
    [{ id: 'todo', t: 'Todo el curso' }, { id: 'MII', t: ITIN.MII.abrev }, { id: 'MCS', t: ITIN.MCS.abrev }]
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
    var h = U.el('div.hdr');
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
    box.appendChild(U.el('span.prereq__t', { text: 'Antes de empezar' }));
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
    var antes = antesDeEmpezar(t);
    if (antes) wrapEl.appendChild(antes);
    var body = U.el('div');
    wrapEl.appendChild(body);
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

  function renderHome() {
    U.clear(wrapEl);
    wrapEl.removeAttribute('data-piel');
    crumbEl.innerHTML = '<b>Inicio</b>';
    document.title = 'Matebase · curso interactivo de matemáticas';
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
        type: 'button', 'data-letra': t.id, title: t.titulo,
        onclick: function () { setLetra(t.id); }
      }, [
        U.el('span.themes__i', { style: { fontSize: (0.72 + LETRAS.indexOf(t) * 0.17) + 'rem' } }, 'A'),
        U.el('span', null, t.nombre)
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

  /* ---------------- glosario ----------------
     Columna derecha ocultable. Cada termino es un desplegable que se abre
     en su sitio: el contenido central no se toca nunca. */

  function sinTildes(s) {
    return s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s;
  }

  /** Resalta el trozo buscado dentro del titulo, respetando las tildes. */
  function resaltar(texto, q) {
    if (!q) return texto;
    var plano = sinTildes(texto).toLowerCase();
    var i = plano.indexOf(q);
    if (i < 0) return texto;
    return texto.slice(0, i) + '<mark class="glos__marca">' +
      texto.slice(i, i + q.length) + '</mark>' + texto.slice(i + q.length);
  }

  function montarGlosario() {
    var caja = U.$('#glos');
    var lista = U.$('#glosList');
    var boton = U.$('#glosBtn');
    var buscar = U.$('#glosSearch');
    var cuenta = U.$('#glosCount');
    if (!caja || !lista || !global.GLOSARIO) return;

    var TERMINOS = global.GLOSARIO.slice().sort(function (a, b) {
      return sinTildes(a.t).toLowerCase().localeCompare(sinTildes(b.t).toLowerCase(), 'es');
    });
    // texto sobre el que busca cada entrada: titulo + variantes + definicion
    TERMINOS.forEach(function (e) {
      e._b = sinTildes((e.t + ' ' + (e.v || '') + ' ' +
        String(e.d).replace(/<[^>]+>/g, '')).toLowerCase());
    });

    var abierto = {};   // que definiciones estan desplegadas

    function pintar(q) {
      q = sinTildes(String(q || '').trim().toLowerCase());
      U.clear(lista);
      var vistos = 0;
      TERMINOS.forEach(function (e) {
        if (q && e._b.indexOf(q) < 0) return;
        vistos++;
        var item = U.el('div.glos__item');
        var def = U.el('div.glos__d' + (abierto[e.t] ? '.is-open' : ''), {
          html: MathX.inline(e.d)
        });
        if (e.i && BYID[e.i]) {
          def.appendChild(U.el('a.glos__ir', {
            href: '#/' + e.i, text: 'Ver en «' + BYID[e.i].t + '» →'
          }));
        }
        var bt = U.el('button.glos__t', {
          type: 'button', 'aria-expanded': abierto[e.t] ? 'true' : 'false',
          'data-termino': e.t,
          onclick: function () {
            abierto[e.t] = !abierto[e.t];
            bt.setAttribute('aria-expanded', abierto[e.t] ? 'true' : 'false');
            def.classList.toggle('is-open', !!abierto[e.t]);
          }
        }, [
          U.el('span.glos__caret', null, '▸'),
          U.el('span', { html: resaltar(e.t, q) })
        ]);
        item.appendChild(bt);
        item.appendChild(def);
        lista.appendChild(item);
      });
      if (!vistos) {
        lista.appendChild(U.el('div.glos__nada', {
          html: 'Ningún término coincide con <strong>«' + U.escape(q) + '»</strong>.<br>' +
            'La búsqueda mira también dentro de las definiciones, así que prueba con ' +
            'una palabra suelta.'
        }));
      }
      cuenta.textContent = vistos === TERMINOS.length
        ? TERMINOS.length + ' términos'
        : vistos + ' de ' + TERMINOS.length + ' términos';
    }

    function mostrar(v) {
      caja.classList.toggle('is-open', v);
      boton.setAttribute('aria-expanded', v ? 'true' : 'false');
      Progress.pref('glosario', v ? '1' : '0');
      if (v) buscar.focus();
    }

    boton.addEventListener('click', function () {
      mostrar(!caja.classList.contains('is-open'));
    });
    U.$('#glosClose').addEventListener('click', function () { mostrar(false); });
    buscar.addEventListener('input', function () {
      pintar(buscar.value);
      buscar.parentNode.classList.toggle('is-filled', buscar.value !== '');
    });
    U.$('#glosClear').addEventListener('click', function () {
      buscar.value = ''; pintar(''); buscar.parentNode.classList.remove('is-filled');
      buscar.focus();
    });
    global.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && caja.classList.contains('is-open')) mostrar(false);
    });

    /* Para el buscador del indice: abre el glosario con el termino desplegado. */
    glosarioApi = {
      abre: function (termino) {
        buscar.value = termino;
        buscar.parentNode.classList.add('is-filled');
        abierto[termino] = true;
        pintar(termino);
        mostrar(true);
        var bt = lista.querySelector('.glos__t[data-termino="' + termino.replace(/"/g, '\\"') + '"]');
        if (bt) { bt.focus(); if (bt.scrollIntoView) bt.scrollIntoView({ block: 'nearest' }); }
        var side = U.$('.side');
        if (side) side.classList.remove('is-open');
        var sc = U.$('.scrim');
        if (sc) sc.classList.remove('is-on');
      }
    };

    pintar('');
    if (Progress.pref('glosario') === '1') mostrar(true);
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
    if (!id) return 'Inicio';
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
    if (!r.id) renderHome(); else renderTopic(r.id, r.q);
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

    // El boton de salto lleva el foco al contenido sin tocar el hash, que
    // aqui es la ruta: un href="#wrap" cambiaria de tema.
    var salto = U.$('#saltar');
    if (salto) salto.addEventListener('click', function () {
      var h = wrapEl.querySelector('h1');
      if (h) { h.focus(); h.scrollIntoView({ block: 'start' }); }
    });

    var search = U.$('#search');
    search.addEventListener('input', function () {
      filterIndex(search.value);
      search.parentNode.classList.toggle('is-filled', search.value !== '');
    });
    U.$('#searchClear').addEventListener('click', function () {
      search.value = ''; filterIndex(''); search.parentNode.classList.remove('is-filled'); search.focus();
    });

    U.$('#resetBtn').addEventListener('click', function () {
      if (confirm('¿Borrar el progreso guardado (temas visitados, aciertos y repasos pendientes)?')) {
        Progress.reset(); paintIndex();
        if (!ruta().id) renderHome();
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
