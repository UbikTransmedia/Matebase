/* ===================================================================
   Matebase · logica.js
   EL BANCO DE CIRCUITOS. El alumno escribe una netlist -una linea por
   puerta- y de ahi salen tres cosas: el diagrama dibujado, la tabla de
   verdad completa y un simulador que avanza por instantes.

       s = xor(a, b);
       c = and(a, b);

   Por que texto y no arrastrar cables: arrastrar pide un editor de
   grafos entero y deja fuera a quien no usa raton. El texto es
   accesible por construccion, se corrige solo con las herramientas que
   ya tiene el curso, y el dibujo que sale lleva su descripcion.

   POR QUE SE SIMULA POR INSTANTES Y NO EN ORDEN TOPOLOGICO. Un orden
   topologico resuelve cualquier circuito sin ciclos de un tiron, y es
   lo que haria cualquiera. Pero entonces el biestable -que es un ciclo-
   no tendria solucion, y el biestable es justo el tema que hace que
   esto valga la pena. Aqui TODAS las puertas calculan a la vez a partir
   de los valores del instante anterior, que es lo que hace un cable de
   verdad: tarda. Un circuito sin ciclos se estabiliza en tantos
   instantes como capas tenga; uno con ciclos puede estabilizarse -y
   entonces recuerda- o no estabilizarse nunca, y entonces OSCILA. Esa
   oscilacion es contenido del tema, no un fallo del simulador.
   =================================================================== */
(function (global) {
  'use strict';

  var LOG = {};

  /* ---------------- las puertas ----------------
     Siete nombres, y solo uno hace falta: nand las construye todas.
     Las binarias admiten mas de dos entradas plegando por la izquierda;
     nand y nor se pliegan como and/or y se niegan al final, que es lo
     que espera quien escribe nand(a, b, c). */
  var PUERTAS = {
    not: { ar: 1, f: function (v) { return v[0] ? 0 : 1; } },
    and: { ar: 2, f: function (v) { return v.every(function (x) { return x; }) ? 1 : 0; } },
    or: { ar: 2, f: function (v) { return v.some(function (x) { return x; }) ? 1 : 0; } },
    xor: { ar: 2, f: function (v) { return v.reduce(function (a, b) { return a ^ b; }, 0) ? 1 : 0; } },
    nand: { ar: 2, f: function (v) { return v.every(function (x) { return x; }) ? 0 : 1; } },
    nor: { ar: 2, f: function (v) { return v.some(function (x) { return x; }) ? 0 : 1; } },
    xnor: { ar: 2, f: function (v) { return v.reduce(function (a, b) { return a ^ b; }, 0) ? 0 : 1; } }
  };
  LOG.PUERTAS = PUERTAS;
  LOG.NOMBRES = Object.keys(PUERTAS);

  /* ---------------- el analizador ----------------
     Una sentencia por puerta: nombre = puerta(arg, arg). Tambien vale
     `x = y` (un cable con nombre nuevo) y `x = 0` o `x = 1` (una
     constante). Los errores llevan el numero de linea QUE VE EL ALUMNO,
     como hace el visor de shaders. */
  var RE_SENT = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/;
  var RE_LLAM = /^([A-Za-z_][A-Za-z0-9_]*)\s*\(([^()]*)\)$/;
  var RE_NOM = /^[A-Za-z_][A-Za-z0-9_]*$/;

  LOG.analiza = function (texto) {
    var nodos = {}, orden = [], errores = [], usados = {};
    var lineas = String(texto == null ? '' : texto).split('\n');

    lineas.forEach(function (cruda, i) {
      var num = i + 1;
      var linea = cruda.replace(/\/\/.*$/, '').trim();
      if (!linea) return;
      linea.split(';').forEach(function (trozo) {
        var s = trozo.trim();
        if (!s) return;
        var m = RE_SENT.exec(s);
        if (!m) {
          errores.push({ linea: num, msg: 'esto no es una asignación: se escribe «nombre = puerta(a, b)»' });
          return;
        }
        var nombre = m[1], der = m[2].trim();
        if (PUERTAS[nombre]) {
          errores.push({ linea: num, msg: '«' + nombre + '» es el nombre de una puerta: elige otro para el cable' });
          return;
        }
        if (nodos[nombre]) {
          errores.push({ linea: num, msg: '«' + nombre + '» ya estaba definido más arriba' });
          return;
        }
        var def = null;
        var lm = RE_LLAM.exec(der);
        if (lm) {
          var puerta = lm[1].toLowerCase();
          if (!PUERTAS[puerta]) {
            errores.push({ linea: num, msg: 'no existe la puerta «' + lm[1] + '». Hay: ' + LOG.NOMBRES.join(', ') });
            return;
          }
          var args = lm[2].split(',').map(function (a) { return a.trim(); }).filter(function (a) { return a !== ''; });
          if (!args.length) {
            errores.push({ linea: num, msg: '«' + puerta + '» necesita entradas entre los paréntesis' });
            return;
          }
          var ar = PUERTAS[puerta].ar;
          if (ar === 1 && args.length !== 1) {
            errores.push({ linea: num, msg: '«not» lleva una sola entrada, no ' + args.length });
            return;
          }
          if (ar === 2 && args.length < 2) {
            errores.push({ linea: num, msg: '«' + puerta + '» necesita al menos dos entradas' });
            return;
          }
          var mal = null;
          args.forEach(function (a) {
            if (!(RE_NOM.test(a) || a === '0' || a === '1')) mal = a;
          });
          if (mal !== null) {
            errores.push({ linea: num, msg: '«' + mal + '» no es un nombre de cable válido' });
            return;
          }
          def = { puerta: puerta, args: args, linea: num };
        } else if (RE_NOM.test(der) || der === '0' || der === '1') {
          def = { puerta: null, args: [der], linea: num };   // cable o constante
        } else {
          errores.push({ linea: num, msg: 'no entiendo «' + der + '»: se espera puerta(a, b), un cable o 0/1' });
          return;
        }
        nodos[nombre] = def;
        orden.push(nombre);
        def.args.forEach(function (a) { if (a !== '0' && a !== '1') usados[a] = 1; });
      });
    });

    /* Entradas: lo que se usa y nunca se define. Salidas: lo que se
       define y nadie consume. Si todo se consume -un biestable, donde
       cada mitad alimenta a la otra- no hay salidas «libres», y entonces
       son salidas todas: es lo que interesa mirar. */
    var entradas = Object.keys(usados).filter(function (n) { return !nodos[n]; }).sort();
    var salidas = orden.filter(function (n) { return !usados[n]; });
    if (!salidas.length) salidas = orden.slice();

    /* Un cable que no lleva a ninguna parte suele ser una errata. */
    orden.forEach(function (n) {
      nodos[n].args.forEach(function (a) {
        if (a !== '0' && a !== '1' && !nodos[a] && entradas.indexOf(a) < 0) {
          errores.push({ linea: nodos[n].linea, msg: 'el cable «' + a + '» no viene de ninguna parte' });
        }
      });
    });

    return {
      nodos: nodos, orden: orden, entradas: entradas, salidas: salidas,
      errores: errores, puertas: orden.filter(function (n) { return nodos[n].puerta; }).length
    };
  };

  /* ---------------- el simulador, por instantes ----------------
     Todas las puertas leen los valores del instante anterior y escriben
     los del siguiente. Eso es el retardo del cable. */
  function valorDe(a, v) {
    if (a === '0') return 0;
    if (a === '1') return 1;
    return v[a] ? 1 : 0;
  }

  LOG.simula = function (c, entradas, o) {
    o = o || {};
    var tope = o.tope || 80;
    var v = {}, i;
    c.entradas.forEach(function (n) { v[n] = entradas && entradas[n] ? 1 : 0; });
    c.orden.forEach(function (n) { v[n] = (o.inicial && o.inicial[n]) ? 1 : 0; });
    var historia = [];
    function foto() { var f = {}; Object.keys(v).forEach(function (k) { f[k] = v[k]; }); return f; }
    historia.push(foto());

    for (i = 0; i < tope; i++) {
      var nuevo = {}, cambia = false;
      c.orden.forEach(function (n) {
        var d = c.nodos[n];
        var vals = d.args.map(function (a) { return valorDe(a, v); });
        nuevo[n] = d.puerta ? PUERTAS[d.puerta].f(vals) : vals[0];
      });
      c.orden.forEach(function (n) { if (nuevo[n] !== v[n]) cambia = true; v[n] = nuevo[n]; });
      historia.push(foto());
      if (!cambia) return { estable: true, oscila: false, instantes: i, valores: v, historia: historia };
    }
    return { estable: false, oscila: true, instantes: tope, valores: v, historia: historia };
  };

  /* ---------------- la tabla de verdad ----------------
     Todas las combinaciones de entradas, cada una simulada hasta que se
     estabiliza. Si alguna oscila se marca: es informacion, no un error. */
  LOG.tabla = function (c, o) {
    var ent = c.entradas, n = ent.length, filas = [];
    if (n > 10) return { entradas: ent, salidas: c.salidas, filas: [], demasiadas: true };
    for (var i = 0; i < (1 << n); i++) {
      var asig = {};
      ent.forEach(function (e, k) { asig[e] = (i >> (n - 1 - k)) & 1; });
      var r = LOG.simula(c, asig, o);
      filas.push({
        ent: ent.map(function (e) { return asig[e]; }),
        sal: c.salidas.map(function (s) { return r.oscila ? null : r.valores[s]; }),
        oscila: r.oscila, instantes: r.instantes
      });
    }
    return { entradas: ent, salidas: c.salidas, filas: filas, demasiadas: false };
  };

  /* ---------------- trivialidad ----------------
     El equivalente al «shader que pinta liso»: si una columna de salida
     se puede conseguir con un cable pelado, con su negacion o con una
     constante, ese ejercicio no se ha resuelto. */
  LOG.esTrivial = function (tabla) {
    if (!tabla.filas.length) return true;
    var triviales = 0;
    tabla.salidas.forEach(function (s, k) {
      var col = tabla.filas.map(function (f) { return f.sal[k]; });
      var cte = col.every(function (x) { return x === col[0]; });
      if (cte) { triviales++; return; }
      var copia = tabla.entradas.some(function (e, j) {
        var directa = true, negada = true;
        tabla.filas.forEach(function (f, i) {
          if (f.ent[j] !== col[i]) directa = false;
          if ((f.ent[j] ? 0 : 1) !== col[i]) negada = false;
        });
        return directa || negada;
      });
      if (copia) triviales++;
    });
    return triviales === tabla.salidas.length;
  };

  /* ---------------- disposicion del dibujo ----------------
     Por capas de izquierda a derecha. Con ciclos no hay capas bien
     definidas, asi que se relaja unas cuantas vueltas con tope: para
     dibujar basta con que quede legible. */
  LOG.disposicion = function (c) {
    var nivel = {};
    c.entradas.forEach(function (n) { nivel[n] = 0; });
    c.orden.forEach(function (n) { nivel[n] = 1; });
    for (var vuelta = 0; vuelta < c.orden.length + 2; vuelta++) {
      var cambia = false;
      c.orden.forEach(function (n) {
        var mx = 0;
        c.nodos[n].args.forEach(function (a) {
          if (a === '0' || a === '1') return;
          var l = nivel[a] === undefined ? 0 : nivel[a];
          if (l > mx) mx = l;
        });
        if (mx + 1 > nivel[n] && mx + 1 <= c.orden.length + 1) { nivel[n] = mx + 1; cambia = true; }
      });
      if (!cambia) break;
    }
    var columnas = {};
    Object.keys(nivel).forEach(function (n) {
      var l = nivel[n];
      (columnas[l] = columnas[l] || []).push(n);
    });
    return { nivel: nivel, columnas: columnas, ancho: Math.max.apply(null, Object.keys(columnas).map(Number)) + 1 };
  };

  /* ---------------- comparar comportamiento ----------------
     Como W.glslIguales, que compara lo que pintan dos shaders y no su
     texto: aqui se compara la tabla de verdad, asi que vale cualquier
     circuito equivalente. `esperada` es {entradas, salidas, filas}, con
     cada fila = entradas seguidas de salidas. */
  LOG.iguales = function (texto, esperada, o) {
    var c = LOG.analiza(texto);
    if (c.errores.length) {
      return { ok: false, porQue: 'La netlist tiene errores: ' + c.errores[0].msg, puertas: 0 };
    }
    var faltan = esperada.entradas.filter(function (e) { return c.entradas.indexOf(e) < 0; });
    if (faltan.length) {
      return { ok: false, porQue: 'Falta usar la entrada «' + faltan[0] + '».', puertas: c.puertas };
    }
    var sobran = c.entradas.filter(function (e) { return esperada.entradas.indexOf(e) < 0; });
    if (sobran.length) {
      return { ok: false, porQue: 'Hay una entrada de más: «' + sobran[0] + '».', puertas: c.puertas };
    }
    if (c.salidas.length !== esperada.salidas.length) {
      return {
        ok: false, puertas: c.puertas,
        porQue: 'Se esperaban ' + esperada.salidas.length + ' salidas y hay ' + c.salidas.length + '.'
      };
    }
    var n = esperada.entradas.length;
    for (var i = 0; i < esperada.filas.length; i++) {
      var fila = esperada.filas[i], asig = {};
      esperada.entradas.forEach(function (e, k) { asig[e] = fila[k]; });
      var r = LOG.simula(c, asig, o);
      if (r.oscila) {
        return {
          ok: false, puertas: c.puertas,
          porQue: 'Con ' + esperada.entradas.map(function (e, k) { return e + '=' + fila[k]; }).join(', ') +
            ' el circuito oscila y nunca se queda quieto.'
        };
      }
      for (var k = 0; k < esperada.salidas.length; k++) {
        var got = r.valores[c.salidas[k]], want = fila[n + k];
        if (got !== want) {
          return {
            ok: false, puertas: c.puertas,
            porQue: 'Con ' + esperada.entradas.map(function (e, j) { return e + '=' + fila[j]; }).join(', ') +
              ' debería salir ' + want + ' y sale ' + got + '.'
          };
        }
      }
    }
    return { ok: true, porQue: '', puertas: c.puertas };
  };

  /* ================== coloreado de la netlist ==================
     Mismos ocho papeles que el editor de shaders, y por tanto los mismos
     colores ya auditados; lo unico que cambia es que palabra es que. */
  function escapa(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var RE_TOK_NET = /\/\/[^\n]*|\b\d+\b|[A-Za-z_][A-Za-z0-9_]*|[^\sA-Za-z0-9_]+|\s+/g;

  LOG.pinta = function (texto) {
    var out = '', m;
    RE_TOK_NET.lastIndex = 0;
    var src = String(texto == null ? '' : texto);
    while ((m = RE_TOK_NET.exec(src))) {
      var t = m[0], c = null;
      if (t.charAt(0) === '/') c = 'com';
      else if (/^\d+$/.test(t)) c = 'num';
      else if (PUERTAS[t.toLowerCase()]) c = 'fun';
      else if (/^[A-Za-z_]/.test(t)) c = null;               // nombres de cable: sin color
      else if (/^\s+$/.test(t)) c = null;
      else c = 'pun';
      out += c ? '<span class="cod-' + c + '">' + escapa(t) + '</span>' : escapa(t);
    }
    return out;
  };

  /* ================== el banco de circuitos ==================
     Misma forma que W.shader: `id` para recordar lo que escribio el
     alumno, `alto`, `aria` con la descripcion del dibujo y `nota` con lo
     que hay que mirar. Nada existe solo como dibujo: debajo del diagrama
     esta siempre la tabla. */
  function Banco(host, o) {
    o = o || {};
    this.o = o;
    this.original = (o.texto || '').replace(/^\n/, '');
    this.alto = o.alto || 260;
    this.tope = o.tope || 80;
    this.instante = null;        // null = estabilizado; un numero = paso a paso
    this.manual = {};            // conmutadores de entrada
    this.build(host);
  }

  Banco.prototype.build = function (host) {
    var self = this, o = this.o;
    this.el = U.el('div.cir');
    this.el.__cir = this;                       // asa para tests.html

    /* --- el editor: dos capas, como el de shaders --- */
    this.caja = U.el('div.shd__caja.shd__caja--prog');
    this.capa = U.el('pre.shd__pinta', { 'aria-hidden': 'true' });
    this.caja.appendChild(this.capa);
    this.ed = U.el('textarea.shd__ed', {
      spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off',
      'aria-label': 'Netlist del circuito, una puerta por línea',
      rows: String(Math.max(3, this.original.split('\n').length + 1))
    });
    this.ed.value = this.original;
    this.caja.appendChild(this.ed);
    this.el.appendChild(this.caja);
    this.ed.addEventListener('input', function () { self.repinta(); self.recalcula(); self.guarda(); });
    this.ed.addEventListener('scroll', function () {
      self.capa.scrollTop = self.ed.scrollTop; self.capa.scrollLeft = self.ed.scrollLeft;
    });

    this.aviso = U.el('div.cir__aviso', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(this.aviso);

    /* --- el diagrama --- */
    this.plot = W.plot(this.el, {
      xmin: 0, xmax: 10, ymin: 0, ymax: 6, height: this.alto,
      axes: false, grid: false,
      aria: o.aria || 'Diagrama del circuito: las entradas a la izquierda, las puertas en columnas y los cables uniéndolas.',
      draw: function (g) { self.dibuja(g); }
    });

    /* --- conmutadores de entrada --- */
    this.fila = W.row(this.el);

    /* --- botones del instante --- */
    var bs = [
      { t: 'Un instante', on: function () { self.paso(); } },
      { t: '↺ Estabilizar', on: function () { self.instante = null; self.recalcula(); } }
    ];
    if (o.reinicia !== false) bs.push({ t: '↺ Volver al original', on: function () { self.ed.value = self.original; self.repinta(); self.recalcula(); self.guarda(); } });
    W.buttons(this.el, bs);

    /* --- la tabla, que es lo que de verdad dice lo que hace --- */
    this.tablaCaja = U.el('div.cir__tabla');
    this.el.appendChild(this.tablaCaja);

    if (o.nota) this.el.appendChild(U.el('p.cir__nota', { html: MathX.inline(o.nota) }));

    host.appendChild(this.el);

    /* --- lo que el alumno estaba escribiendo --- */
    if (o.id && global.Progress) {
      var g = Progress.pref('cir:' + o.id);
      if (g) this.ed.value = g;
    }
    this.repinta();
    this.recalcula();

    /* --- fuera de pantalla no se calcula --- */
    if (global.IntersectionObserver) {
      this.io = new IntersectionObserver(function (ents) {
        self.visible = ents[0].isIntersecting;
      }, { threshold: 0 });
      this.io.observe(this.el);
    }
  };

  Banco.prototype.guarda = function () {
    if (this.o.id && global.Progress) Progress.pref('cir:' + this.o.id, this.ed.value);
  };

  Banco.prototype.repinta = function () {
    this.capa.innerHTML = LOG.pinta(this.ed.value) + '\n';
    this.capa.scrollTop = this.ed.scrollTop;
    this.capa.scrollLeft = this.ed.scrollLeft;
  };

  /** Rehace el circuito a partir del texto y actualiza todo lo de abajo. */
  Banco.prototype.recalcula = function () {
    var self = this;
    var c = LOG.analiza(this.ed.value);
    this.c = c;
    this.el.classList.toggle('cir--roto', c.errores.length > 0);

    if (c.errores.length) {
      var e = c.errores[0];
      this.aviso.textContent = 'Línea ' + e.linea + ': ' + e.msg;
      this.tablaCaja.innerHTML = '';
      this.fila.innerHTML = '';
      this.plot.render();
      return;
    }

    /* conmutadores: uno por entrada, y se conservan los valores puestos */
    var previos = this.manual;
    this.manual = {};
    c.entradas.forEach(function (n) { self.manual[n] = previos[n] ? 1 : 0; });
    this.pintaConmutadores();

    this.estado = (this.instante === null)
      ? LOG.simula(c, this.manual, { tope: this.tope })
      : this.hasta(this.instante);

    this.pintaAviso();
    this.pintaTabla();
    this.plot.render();
  };

  /** Simula exactamente `n` instantes, para el paso a paso. */
  Banco.prototype.hasta = function (n) {
    var r = LOG.simula(this.c, this.manual, { tope: Math.max(1, n) });
    var f = r.historia[Math.min(n, r.historia.length - 1)];
    return { valores: f, oscila: false, estable: false, instantes: n, historia: r.historia, paso: true };
  };

  Banco.prototype.paso = function () {
    this.instante = (this.instante === null ? 0 : this.instante) + 1;
    this.recalcula();
  };

  Banco.prototype.pintaConmutadores = function () {
    var self = this;
    this.fila.innerHTML = '';
    if (!this.c.entradas.length) return;
    this.c.entradas.forEach(function (n) {
      var b = U.el('button.cir__sw', {
        type: 'button',
        'aria-pressed': self.manual[n] ? 'true' : 'false',
        text: n + ' = ' + (self.manual[n] ? 1 : 0)
      });
      b.addEventListener('click', function () {
        self.manual[n] = self.manual[n] ? 0 : 1;
        self.instante = null;
        self.recalcula();
      });
      self.fila.appendChild(b);
    });
  };

  Banco.prototype.pintaAviso = function () {
    var e = this.estado, c = this.c;
    var val = c.salidas.map(function (s) {
      return s + ' = ' + (e.valores[s] === undefined ? '?' : e.valores[s]);
    }).join(' · ');
    if (e.oscila) {
      this.aviso.textContent = 'OSCILA: tras ' + this.tope + ' instantes el circuito no se queda quieto. ' +
        'No es un fallo del simulador: hay un bucle que se persigue a sí mismo.';
    } else if (e.paso) {
      this.aviso.textContent = 'Instante ' + e.instantes + ' · ' + val + ' · ' + c.puertas + ' ' +
        (c.puertas === 1 ? 'puerta' : 'puertas');
    } else {
      this.aviso.textContent = 'Estable tras ' + e.instantes + ' ' +
        (e.instantes === 1 ? 'instante' : 'instantes') + ' · ' + val + ' · ' + c.puertas + ' ' +
        (c.puertas === 1 ? 'puerta' : 'puertas');
    }
  };

  Banco.prototype.pintaTabla = function () {
    var t = LOG.tabla(this.c, { tope: this.tope });
    this.tablaCaja.innerHTML = '';
    if (t.demasiadas) {
      this.tablaCaja.appendChild(U.el('p.cir__nota', { text: 'Demasiadas entradas para escribir la tabla entera.' }));
      return;
    }
    var wrap = U.el('div.tbl-wrap'), tb = U.el('table.tbl');
    var tr = U.el('tr');
    t.entradas.forEach(function (e) { tr.appendChild(U.el('th', { text: e })); });
    t.salidas.forEach(function (s) { tr.appendChild(U.el('th', { text: s })); });
    tb.appendChild(U.el('thead', null, tr));
    var body = U.el('tbody');
    t.filas.forEach(function (f) {
      var fila = U.el('tr');
      f.ent.forEach(function (v) { fila.appendChild(U.el('td.num', { text: String(v) })); });
      f.sal.forEach(function (v) {
        fila.appendChild(U.el('td.num', { text: v === null ? 'oscila' : String(v) }));
      });
      body.appendChild(fila);
    });
    tb.appendChild(body);
    wrap.appendChild(tb);
    this.tablaCaja.appendChild(wrap);
  };

  /* --- el dibujo: columnas de izquierda a derecha --- */
  Banco.prototype.dibuja = function (g) {
    var c = this.c, e = this.estado;
    if (!c || c.errores.length) {
      g.text(5, 3, 'Corrige la netlist para ver el circuito', { align: 'center', size: 13, color: 'axis' });
      return;
    }
    var d = LOG.disposicion(c);
    var cols = d.ancho, self = this;
    var ancho = 10, alto = 6;
    var dx = ancho / (cols + 0.6);
    var pos = {};

    /* sitio de cada cosa */
    Object.keys(d.columnas).forEach(function (l) {
      var lista = d.columnas[l], k = lista.length;
      lista.forEach(function (n, i) {
        pos[n] = { x: 0.5 + Number(l) * dx, y: alto - (alto * (i + 1) / (k + 1)) };
      });
    });

    /* cables primero, para que las cajas queden encima */
    c.orden.forEach(function (n) {
      var p = pos[n];
      c.nodos[n].args.forEach(function (a, i) {
        var q = (a === '0' || a === '1') ? { x: p.x - dx * 0.7, y: p.y + (i - 0.5) * 0.45 } : pos[a];
        if (!q) return;
        var encendido = (a === '1') || (e && e.valores[a] === 1);
        var med = (q.x + p.x) / 2;
        g.poly([[q.x + 0.32, q.y], [med, q.y], [med, p.y], [p.x - 0.42, p.y]],
          { color: encendido ? 2 : 'axis', w: encendido ? 2.4 : 1.4 });
      });
    });

    /* entradas */
    c.entradas.forEach(function (n) {
      var p = pos[n];
      if (!p) return;
      var on = e && e.valores[n] === 1;
      g.circle(p.x, p.y, 0.3, { color: on ? 2 : 'axis', w: 2, fill: on ? 2 : null, fillAlpha: 0.25 });
      g.text(p.x - 0.45, p.y, n, { align: 'right', size: 12, color: 'ink' });
    });

    /* puertas */
    c.orden.forEach(function (n) {
      var p = pos[n], d2 = c.nodos[n];
      if (!p) return;
      var on = e && e.valores[n] === 1;
      g.rect(p.x - 0.42, p.y - 0.34, 0.84, 0.68,
        { fill: on ? 2 : 0, fillAlpha: on ? 0.28 : 0.1, color: on ? 2 : 'axis', w: 1.6 });
      g.text(p.x, p.y, d2.puerta ? d2.puerta : '=', { align: 'center', size: 11, color: 'ink' });
      var esSalida = c.salidas.indexOf(n) >= 0;
      g.text(p.x, p.y + 0.52, n + (esSalida ? '' : ''), { align: 'center', size: 11, color: 'axis' });
    });
  };

  W.circuito = function (host, o) { return new Banco(host, o); };
  W.circuitoIguales = LOG.iguales;
  W.circuitoPinta = LOG.pinta;
  W.circuitoTrivial = LOG.esTrivial;

  global.LOG = LOG;
})(window);
