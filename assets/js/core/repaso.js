/* ===================================================================
   Matebase · repaso.js
   Las paginas de REPASO DE 2.º: el mapa del temario, los simulacros de
   examen y el formulario. No tienen contenido propio: se montan con los
   ejercicios, las formulas y las ideas clave de los demas temas, que se
   recogen con el recolector de page.js. Asi un ejercicio nuevo en un tema
   entra solo en los simulacros, sin copiarlo a ningun sitio.

     p.mapa()                              el temario de 2.º con tu estado
     p.simulacro({ titulo, itin, partes, kind, intro }) examen con preguntas de varios temas
       kind e intro cambian el rotulo («Simulacro») y el parrafo de entrada:
       los examenes de bloque de la ampliacion no hablan de la PAU.
     p.formulario({ itin })                formulas e ideas clave, para imprimir

   Las tres cargan temas ajenos, y eso solo se puede hacer con el curso
   abierto: tests.html las construye sin cargar nada.
   =================================================================== */
(function (global) {
  'use strict';

  var ITIN = {
    MII: 'Matemáticas II',
    MCS: 'Matemáticas Aplicadas a las Ciencias Sociales II'
  };

  function todos() {
    var out = [];
    (global.CURRICULUM || []).forEach(function (b) {
      b.temas.forEach(function (t) { out.push({ t: t, b: b }); });
    });
    return out;
  }
  function porId(id) {
    var r = null;
    todos().forEach(function (x) { if (x.t.id === id) r = x; });
    return r;
  }
  function cursoDe(x) { return x.t.curso || x.b.curso || ''; }
  function puedeCargar() {
    return !!(global.Course && typeof Course.load === 'function' && Course.reg);
  }
  function temario(it) {
    return todos().filter(function (x) {
      return cursoDe(x) === '2B' && x.b.id !== 'pau' && (x.t.itin || []).indexOf(it) >= 0;
    });
  }
  function itinInicial() {
    var p = Progress.pref('itin');
    return (p === 'MII' || p === 'MCS') ? p : 'MII';
  }

  /** Carga una lista de temas y recoge de cada uno ejercicios y formulas. */
  function recoge(ids, cb) {
    var res = {}, i = 0;
    (function sig() {
      if (i >= ids.length) { cb(res); return; }
      var id = ids[i++];
      Course.load(id, function (ok) {
        if (ok && Course.reg[id]) {
          var x = porId(id);
          var rec = new Page.Recolector(x ? x.t : { id: id });
          try { Course.reg[id](rec); res[id] = rec; }
          catch (e) { if (global.console) console.error('Recogiendo ' + id, e); }
        }
        // se suelta el hilo entre tema y tema: la pagina no se congela
        setTimeout(sig, 0);
      });
    })();
  }

  function estadoTxt(st) {
    return st === 'done' ? 'dominado' : (st === 'seen' ? 'visto' : 'sin empezar');
  }

  /* ============================== MAPA ============================== */

  Page.prototype.mapa = function () {
    var caja = U.el('div.mapa');
    this._add(caja);
    var cual = itinInicial();
    W.chips(caja, [
      { label: 'Matemáticas II', value: 'MII' },
      { label: 'MACS II', value: 'MCS' }
    ], { value: cual, on: function (v) { cual = v; pinta(); } });
    var resumen = W.readout(caja, '');
    var zona = U.el('div');
    caja.appendChild(zona);

    function pinta() {
      U.clear(zona);
      var lista = temario(cual);
      var dom = 0, vis = 0, bloque = null, tb = null;
      lista.forEach(function (x) {
        if (x.b !== bloque) {
          bloque = x.b;
          zona.appendChild(U.el('h3.sub', { text: x.b.title }));
          var wrap = U.el('div.tbl-wrap');
          var t = U.el('table.tbl.mapa__tbl');
          t.appendChild(U.el('thead', null, U.el('tr', null, [
            U.el('th', { text: 'Tema' }), U.el('th', { text: 'Tu estado' }),
            U.el('th', { text: 'Lo que da por sabido' })
          ])));
          tb = U.el('tbody');
          t.appendChild(tb);
          wrap.appendChild(t);
          zona.appendChild(wrap);
        }
        var st = Progress.state(x.t.id);
        if (st === 'done') dom++;
        if (st) vis++;
        var d = Progress.dominio(x.t.id);
        var req = (x.t.req || []).filter(function (r) { return porId(r); });
        tb.appendChild(U.el('tr', null, [
          U.el('td', { html: MathX.inline('[[' + x.t.id + ']]') }),
          U.el('td', { html: '<span class="punto is-' + (st || 'nuevo') + '" aria-hidden="true"></span>' +
            estadoTxt(st) + (d.tipos ? ' <span class="mapa__n">(' + d.resueltos + '/' + d.tipos + ')</span>' : '') }),
          U.el('td.mapa__req', { html: req.length ? MathX.inline(req.map(function (r) { return '[[' + r + ']]'; }).join(' · ')) : '—' })
        ]));
      });
      resumen.set('Temario de 2.º de <strong>' + ITIN[cual] + '</strong>: ' + lista.length + ' temas. ' +
        'Dominados: <strong>' + dom + '</strong> · vistos sin dominar: <strong>' + (vis - dom) + '</strong> · ' +
        'sin empezar: <strong>' + (lista.length - vis) + '</strong>.<br>' +
        '<span style="font-size:0.8125rem;color:var(--ink-faint)">«Dominado» significa haber resuelto ' +
        'al menos una vez cada tipo de ejercicio del tema. Entre paréntesis, cuántos llevas.</span>');
    }
    pinta();
    U.bus.on('progress', function () { if (caja.isConnected) pinta(); });
  };

  /* ============================ SIMULACRO ============================
     Un examen hecho con los ejercicios de los temas. Sin pistas y sin
     solucion hasta entregar, con cronometro si se quiere, y al final la
     nota por bloques y la lista de lo que conviene repasar, con enlace al
     ejercicio concreto. La semilla del examen va en el enlace: un profesor
     puede pasar el mismo simulacro a toda la clase. */

  Page.prototype.simulacro = function (o) {
    o = o || {};
    var self = this;
    var partes = o.partes || [];
    var elegidas = partes.map(function () { return true; });
    var conReloj = true;
    var ajusta = false;

    var caja = U.el('div.card.simul');
    caja.appendChild(U.el('div.card__head', null, [
      U.el('span.card__kind.simul__kind', { text: o.kind || 'Simulacro' }),
      U.el('span.card__title', { text: o.titulo || 'Examen de práctica' })
    ]));
    var cuerpo = U.el('div.card__body');
    caja.appendChild(cuerpo);
    this._add(caja);

    cuerpo.appendChild(U.el('p.simul__intro', {
      text: o.intro || ('Elige los bloques que entran. Las preguntas se sacan al azar de los ejercicios de ' +
        'cada tema, dando preferencia a los problemas por apartados, que son los que más se ' +
        'parecen a la PAU. No hay pistas: la corrección y la solución paso a paso llegan al entregar.')
    }));
    var lista = U.el('div.simul__partes');
    partes.forEach(function (pt, i) {
      var id = 'simul-' + self.id + '-' + i;
      var chk = U.el('input', { type: 'checkbox', id: id, checked: true });
      chk.addEventListener('change', function () { elegidas[i] = chk.checked; resumen(); });
      var nombres = pt.temas.map(function (tid) { var x = porId(tid); return x ? x.t.t : tid; });
      lista.appendChild(U.el('label.simul__parte', { 'for': id }, [
        chk,
        U.el('span', { html: '<strong>' + U.escape(pt.titulo) + '</strong> · ' + pt.n +
          (pt.n === 1 ? ' pregunta' : ' preguntas') + ' · ' + (pt.min || 20) + ' min' +
          '<span class="simul__de">de: ' + U.escape(nombres.join(', ')) + '</span>' })
      ]));
    });
    cuerpo.appendChild(lista);
    var idR = 'simul-' + self.id + '-reloj';
    var reloj = U.el('input', { type: 'checkbox', id: idR, checked: true });
    reloj.addEventListener('change', function () { conReloj = reloj.checked; resumen(); });
    cuerpo.appendChild(U.el('label.simul__parte.simul__reloj-op', { 'for': idR }, [
      reloj, U.el('span', { text: 'Con cronómetro (orientativo: al acabar el tiempo avisa, no corta)' })
    ]));
    var idA = 'simul-' + self.id + '-ajusta';
    var chkA = U.el('input', { type: 'checkbox', id: idA });
    chkA.addEventListener('change', function () { ajusta = chkA.checked; resumen(); });
    cuerpo.appendChild(U.el('label.simul__parte.simul__reloj-op', { 'for': idA }, [
      chkA, U.el('span', {
        html: 'Ajustado a lo que llevas hecho <span class="simul__de">entran antes las preguntas que ' +
          'no has resuelto nunca y las de los temas que aún no dominas</span>'
      })
    ]));
    var info = U.el('p.simul__info');
    cuerpo.appendChild(info);
    var bEmpezar = U.el('button.btn.btn--main', { type: 'button', text: 'Empezar el simulacro' });
    cuerpo.appendChild(U.el('div.simul__pie', null, [bEmpezar]));
    var aviso = U.el('div.card__aviso', { role: 'status', 'aria-live': 'polite' });
    caja.appendChild(aviso);
    var zona = U.el('div.simul__zona');
    this._add(zona);

    function minutos() {
      var m = 0;
      partes.forEach(function (pt, i) { if (elegidas[i]) m += pt.min || 20; });
      return m;
    }
    function resumen() {
      var n = 0;
      partes.forEach(function (pt, i) { if (elegidas[i]) n += pt.n; });
      info.textContent = n ? n + ' preguntas' + (conReloj ? ' · ' + minutos() + ' minutos' : ' · sin límite de tiempo') +
          (ajusta ? ' · ajustado a tus fallos' : ' · al azar')
        : 'Elige al menos un bloque.';
      bEmpezar.disabled = !n;
    }
    resumen();

    var q = (this.node && this.node._q) || {};
    var semillaPedida = parseInt(q.s, 10);
    bEmpezar.addEventListener('click', function () {
      empezar(isNaN(semillaPedida) ? undefined : semillaPedida);
      semillaPedida = NaN;              // la segunda vez, otro examen
    });

    /* Cuanto le hace falta a ESTA persona una pregunta: 2 si nunca la ha
       resuelto, 1 si el tema no esta dominado, 0 si va sobrado. Es lo que
       convierte un examen al azar en uno que insiste donde duele. */
    function falta(c) {
      var t = Progress.topic(c.tid);
      var e = (t.ex || {})[c.it.n];
      if (!e || !e.ok) return 2;
      if (Progress.state(c.tid) !== 'done') return 1;
      return 0;
    }

    function escoge(cands, n, rng) {
      var pau = rng.shuffle(cands.filter(function (c) {
        return c.it.tipo === 'problema' || c.it.spec.level !== 'basico';
      }));
      pau.sort(function (a, b) { return (b.it.tipo === 'problema') - (a.it.tipo === 'problema'); });
      /* Ajustar NO cambia el tipo de pregunta que entra -siguen mandando los
         problemas por apartados, que es lo que se parece a la PAU-: cambia
         cual, dentro de las que ya cabian. */
      if (ajusta) {
        var peso = function (a, b) { return falta(b) - falta(a); };
        pau.sort(function (a, b) {
          var d = (b.it.tipo === 'problema') - (a.it.tipo === 'problema');
          return d || peso(a, b);
        });
      }
      var resto = rng.shuffle(cands.filter(function (c) { return pau.indexOf(c) < 0; }));
      if (ajusta) resto.sort(function (a, b) { return falta(b) - falta(a); });
      var out = [], usados = {};
      // primero, a ser posible, un tema distinto por pregunta
      [pau, resto].forEach(function (l) {
        l.forEach(function (c) { if (out.length < n && !usados[c.tid]) { out.push(c); usados[c.tid] = 1; } });
      });
      [pau, resto].forEach(function (l) {
        l.forEach(function (c) { if (out.length < n && out.indexOf(c) < 0) out.push(c); });
      });
      return out;
    }

    function empezar(semilla) {
      if (!puedeCargar()) {
        aviso.textContent = 'El simulacro necesita el curso abierto desde index.html.';
        return;
      }
      var rng = U.rng(semilla);
      var semillaExamen = rng.seed;
      bEmpezar.disabled = true;
      aviso.textContent = 'Preparando las preguntas…';
      var ids = [];
      partes.forEach(function (pt, i) {
        if (elegidas[i]) pt.temas.forEach(function (tid) { if (ids.indexOf(tid) < 0) ids.push(tid); });
      });
      recoge(ids, function (rec) {
        var grupos = [];
        partes.forEach(function (pt, i) {
          if (!elegidas[i]) return;
          var cands = [];
          pt.temas.forEach(function (tid) {
            if (!rec[tid]) return;
            rec[tid].items.forEach(function (it) { cands.push({ tid: tid, it: it }); });
          });
          grupos.push({ parte: pt, items: escoge(cands, pt.n, rng) });
        });
        aviso.textContent = '';
        bEmpezar.disabled = false;
        bEmpezar.textContent = 'Empezar otro simulacro';
        monta(grupos, rng, semillaExamen);
      });
    }

    function monta(grupos, rng, semillaExamen) {
      U.clear(zona);
      var tarjetas = [], total = 0, num = 0;
      grupos.forEach(function (g) { total += g.items.length; });

      var relojEl = U.el('span.simul__reloj');
      var cuentaEl = U.el('span.simul__cuenta');
      var bEntregar = U.el('button.btn.btn--ok', { type: 'button', text: 'Entregar y corregir' });
      zona.appendChild(U.el('div.simul__barra', { role: 'region', 'aria-label': 'Control del simulacro' }, [
        conReloj ? relojEl : null, cuentaEl, U.el('span.card__spacer'), bEntregar
      ]));
      var resultado = U.el('div.simul__res', { role: 'status', 'aria-live': 'polite' });
      zona.appendChild(resultado);

      grupos.forEach(function (g) {
        zona.appendChild(U.el('div.sec', null, U.el('h2', { text: g.parte.titulo })));
        g.items.forEach(function (c) {
          num++;
          var x = porId(c.tid);
          var host = U.el('div');
          zona.appendChild(host);
          var op = { examen: true, origen: x ? x.t.t : c.tid, semilla: rng.int(1, 2000000000), numero: num };
          var card = c.it.tipo === 'problema'
            ? Ex.problema(host, c.it.spec, c.tid, c.it.n, op)
            : Ex.card(host, c.it.spec, c.tid, c.it.n, op);
          var reg = { card: card, parte: g.parte, tid: c.tid, n: c.it.n, titulo: c.it.spec.title || '', num: num };
          /* Cuando se toca por primera vez una pregunta y cuando se toca por
             ultima. Con eso, al corregir se puede decir en cual se fue el
             tiempo, que es lo que de verdad hay que aprender a repartir. */
          host.addEventListener('input', function () {
            var t = Date.now();
            if (!reg.t0) reg.t0 = t;
            reg.t1 = t;
          });
          tarjetas.push(reg);
        });
      });

      function cuenta() {
        var r = tarjetas.filter(function (t) { return t.card.respondida(); }).length;
        cuentaEl.textContent = r + ' de ' + total + ' con respuesta';
      }
      zona.addEventListener('input', cuenta);
      zona.addEventListener('click', function () { setTimeout(cuenta, 0); });
      cuenta();

      var arranque = Date.now();
      var intervalo = null;
      if (conReloj) {
        var limite = arranque + minutos() * 60000;
        var tic = function () {
          if (!relojEl.isConnected) { clearInterval(intervalo); return; }
          var resta = Math.max(0, limite - Date.now());
          var m = Math.floor(resta / 60000), s = Math.floor(resta / 1000) % 60;
          relojEl.textContent = '⏱ ' + m + ':' + (s < 10 ? '0' : '') + s;
          if (resta <= 0) {
            clearInterval(intervalo);
            relojEl.classList.add('is-fin');
            relojEl.setAttribute('role', 'status');
            relojEl.textContent = '⏱ Tiempo cumplido: entrega cuando quieras';
          }
        };
        tic();
        intervalo = setInterval(tic, 1000);
      }

      var urlExamen = location.href.split('#')[0] + '#/' + self.id + '?s=' + semillaExamen;

      bEntregar.addEventListener('click', function () {
        var sin = tarjetas.filter(function (t) { return !t.card.respondida(); }).length;
        if (sin && !confirm('Quedan ' + sin + ' preguntas sin responder. ¿Entregar igualmente?')) return;
        if (intervalo) clearInterval(intervalo);
        bEntregar.disabled = true;
        var suma = 0, porParte = [], idx = {};
        tarjetas.forEach(function (t) {
          var nota = t.card.corregir();
          suma += nota;
          var k = t.parte.titulo;
          if (idx[k] === undefined) { idx[k] = porParte.length; porParte.push({ titulo: k, suma: 0, n: 0, flojos: [] }); }
          var pp = porParte[idx[k]];
          pp.suma += nota; pp.n++;
          if (nota < 1) pp.flojos.push(t);
        });
        var nota10 = total ? 10 * suma / total : 0;
        var html = '<div class="simul__nota"><span class="simul__cifra">' + U.fmt(nota10, 1) +
          '</span><span class="simul__sobre"> sobre 10</span></div>';
        html += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Bloque</th><th class="num">Puntos</th>' +
          '<th>Para repasar</th></tr></thead><tbody>';
        porParte.forEach(function (pp) {
          html += '<tr><td>' + U.escape(pp.titulo) + '</td><td class="num">' + U.fmt(pp.suma, 2) + ' / ' + pp.n + '</td><td>' +
            (pp.flojos.length ? pp.flojos.map(function (t) {
              var x = porId(t.tid);
              return '<a class="simul__repasa" href="#/' + t.tid + '?e=' + t.n + '">' +
                U.escape((x ? x.t.t : t.tid) + ' · ' + t.titulo.replace(/<[^>]+>|\$/g, '')) + '</a>';
            }).join('<br>') : 'nada: todo bien') + '</td></tr>';
        });
        html += '</tbody></table></div>';
        /* EL REPARTO DEL TIEMPO. En un examen no basta con saber: hay que
           saber cuando soltar una pregunta. Se dice en que se fue el tiempo
           con lo unico que se puede medir sin inventarse nada: cuando se
           toco cada pregunta por primera y por ultima vez. */
        var tocadas = tarjetas.filter(function (t) { return t.t0; });
        if (tocadas.length >= 2) {
          var minutosTotal = (Date.now() - arranque) / 60000;
          var conTiempo = tocadas.map(function (t) {
            return { num: t.num, tid: t.tid, mins: (t.t1 - t.t0) / 60000, desde: (t.t0 - arranque) / 60000 };
          }).sort(function (a, b) { return b.mins - a.mins; });
          var lenta = conTiempo[0];
          var presupuesto = minutos();
          var porPregunta = presupuesto / total;
          /* Un solo criterio de redondeo para todo el parrafo: por debajo de
             diez minutos, con un decimal. Decir «unos 1 min» arriba y «0,1
             min» abajo para la misma pregunta es peor que no decir nada. */
          function mm(x) { return x < 10 ? U.fmt(x, 1) : U.fmt(x, 0); }
          html += '<div class="simul__tiempo"><strong>El reparto del tiempo.</strong> ' +
            'Has tardado <strong>' + mm(minutosTotal) + ' min</strong>' +
            (conReloj ? ' de los ' + presupuesto + ' del examen' : '') + '. ' +
            (lenta.mins < 0.5
              ? 'Ninguna pregunta te ha llevado ni medio minuto, así que aquí no hay mucho que mirar: ' +
                'el reparto del tiempo se ve cuando el examen se hace de verdad.'
              : 'Donde más rato estuviste fue en la <strong>pregunta ' + lenta.num + '</strong>, ' +
                mm(lenta.mins) + ' min' +
                (lenta.mins > porPregunta * 2
                  ? ', más del doble de los ' + mm(porPregunta) + ' que le tocaban. En un examen de ' +
                    'verdad, ése es el momento de dejarla a medias, hacer las demás y volver.'
                  : ', y le tocaban ' + mm(porPregunta) + ': dentro de lo razonable.')) +
            '<br><span class="simul__tiempo-det">' +
            conTiempo.slice(0, 5).map(function (x) {
              return 'p' + x.num + ': ' + mm(x.mins) + ' min';
            }).join(' · ') +
            '</span></div>';
        }

        html += '<p class="simul__nota-pie">Cada pregunta vale lo mismo; en los problemas por apartados ' +
          'cuenta la parte acertada. Las soluciones paso a paso están ya abiertas debajo de cada ' +
          'pregunta. Lo que falles volverá a salirte en «Para repasar hoy», en la portada.</p>';
        resultado.innerHTML = html;
        var pie = U.el('div.simul__pie');
        pie.appendChild(U.el('button.btn.btn--main', {
          type: 'button', text: 'Otro simulacro',
          onclick: function () { empezar(); caja.scrollIntoView({ block: 'start' }); }
        }));
        var bEnlace = U.el('button.btn', { type: 'button', html: '&#128279; Enlace a este mismo examen' });
        bEnlace.addEventListener('click', function () {
          try {
            navigator.clipboard.writeText(urlExamen).then(function () {
              bEnlace.textContent = 'Enlace copiado: quien lo abra tendrá estas mismas preguntas';
            }, function () { prompt('Copia este enlace:', urlExamen); });
          } catch (e) { prompt('Copia este enlace:', urlExamen); }
        });
        pie.appendChild(bEnlace);
        resultado.appendChild(pie);
        if (resultado.scrollIntoView) resultado.scrollIntoView({ block: 'center' });
      });
      if (zona.scrollIntoView) zona.scrollIntoView({ block: 'start' });
    }
  };

  /* =========================== FORMULARIO ===========================
     Las formulas y las ideas clave del temario de 2.º, en una sola pagina
     que se imprime bien. No se escribe a mano: sale de los temas, asi que
     no puede quedarse desfasado. */

  Page.prototype.formulario = function () {
    var caja = U.el('div.formu');
    this._add(caja);
    var cual = itinInicial();
    var barra = U.el('div.formu__barra');
    caja.appendChild(barra);
    W.chips(barra, [
      { label: 'Matemáticas II', value: 'MII' },
      { label: 'MACS II', value: 'MCS' }
    ], { value: cual, on: function (v) { cual = v; monta(); } });
    barra.appendChild(U.el('button.btn', {
      type: 'button', html: '&#128424; Imprimir o guardar en PDF',
      onclick: function () { global.print(); }
    }));
    var aviso = U.el('div.formu__aviso', { role: 'status', 'aria-live': 'polite' });
    caja.appendChild(aviso);
    var zona = U.el('div.formu__zona');
    caja.appendChild(zona);
    var turno = 0;

    function monta() {
      U.clear(zona);
      if (!puedeCargar()) {
        aviso.textContent = 'El formulario se monta al abrir el curso desde index.html.';
        return;
      }
      var lista = temario(cual);
      var mio = ++turno;
      aviso.textContent = 'Reuniendo las fórmulas de ' + lista.length + ' temas…';
      recoge(lista.map(function (x) { return x.t.id; }), function (rec) {
        if (mio !== turno) return;
        var bloque = null;
        lista.forEach(function (x) {
          var r = rec[x.t.id];
          if (!r || (!r.vistas.length && !r.claves.length)) return;
          if (x.b !== bloque) {
            bloque = x.b;
            zona.appendChild(U.el('h2.formu__bloque', { text: x.b.title }));
          }
          var art = U.el('section.formu__tema');
          art.appendChild(U.el('h3', null, U.el('a', { href: '#/' + x.t.id, text: x.t.t })));
          r.vistas.forEach(function (f) {
            var fb = U.el('div.fbox' + (f.label ? '.fbox--lab' : ''));
            if (f.label) fb.appendChild(U.el('span.fbox__lab', { text: f.label }));
            f.tex.forEach(function (t) { fb.appendChild(U.el('div', { html: MathX.display(t) })); });
            art.appendChild(fb);
          });
          if (r.claves.length) {
            var k = U.el('div.keys');
            k.appendChild(U.el('h3', { text: 'Ideas clave' }));
            var ul = U.el('ul');
            r.claves.forEach(function (c) { ul.appendChild(U.el('li', { html: MathX.inline(c) })); });
            k.appendChild(ul);
            art.appendChild(k);
          }
          zona.appendChild(art);
        });
        aviso.textContent = '';
      });
    }
    monta();
  };

})(window);
