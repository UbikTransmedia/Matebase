/* ===================================================================
   Matebase · util.js
   Ayudas de DOM, generador aleatorio reproducible y formato numerico.
   No depende de nada. Se carga el primero.
   =================================================================== */
(function (global) {
  'use strict';

  var U = {};

  /* ---------------- DOM ---------------- */

  /** Crea un elemento. U.el('div.card#x', {attr}, 'texto' | [hijos]) */
  U.el = function (spec, attrs, kids) {
    var m = /^([a-zA-Z0-9]+)?((?:[.#][^.#]+)*)$/.exec(spec) || [];
    var tag = m[1] || 'div';
    var node = document.createElement(tag);
    var rest = m[2] || '';
    var parts = rest.match(/[.#][^.#]+/g) || [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].charAt(0) === '.') node.classList.add(parts[i].slice(1));
      else node.id = parts[i].slice(1);
    }
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style' && typeof v === 'object') { for (var s in v) node.style[s] = v[s]; }
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      }
    }
    U.add(node, kids);
    return node;
  };

  /** Anade hijos: string (HTML), nodo o array. */
  U.add = function (parent, kids) {
    if (kids === null || kids === undefined) return parent;
    if (!Array.isArray(kids)) kids = [kids];
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i];
      if (c === null || c === undefined || c === false) continue;
      if (typeof c === 'string' || typeof c === 'number') {
        var t = document.createElement('template');
        t.innerHTML = String(c);
        parent.appendChild(t.content);
      } else parent.appendChild(c);
    }
    return parent;
  };

  U.clear = function (n) { while (n && n.firstChild) n.removeChild(n.firstChild); return n; };
  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  U.on = function (n, ev, fn, opt) { n.addEventListener(ev, fn, opt); return n; };

  U.escape = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  /* ---------------- Numeros aleatorios reproducibles ----------------
     RNG con semilla (mulberry32). Permite regenerar un ejercicio y,
     si hace falta, reproducir exactamente el mismo enunciado.        */

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function RNG(seed) {
    this.seed = (seed === undefined || seed === null) ? (Date.now() ^ (Math.random() * 1e9)) | 0 : seed | 0;
    this._r = mulberry32(this.seed);
  }
  RNG.prototype.next = function () { return this._r(); };
  /** Entero en [a,b] ambos incluidos. */
  RNG.prototype.int = function (a, b) { return a + Math.floor(this._r() * (b - a + 1)); };
  /** Entero en [a,b] distinto de 0. */
  RNG.prototype.nz = function (a, b) {
    var v = 0, guard = 0;
    do { v = this.int(a, b); } while (v === 0 && ++guard < 60);
    return v || 1;
  };
  /** Entero no nulo con signo aleatorio y valor absoluto en [a,b]. */
  RNG.prototype.pm = function (a, b) { return this.int(a, b) * (this._r() < 0.5 ? -1 : 1); };
  RNG.prototype.sign = function () { return this._r() < 0.5 ? -1 : 1; };
  RNG.prototype.real = function (a, b, dec) {
    var v = a + this._r() * (b - a);
    return dec === undefined ? v : Math.round(v * Math.pow(10, dec)) / Math.pow(10, dec);
  };
  RNG.prototype.pick = function (arr) { return arr[Math.floor(this._r() * arr.length)]; };
  RNG.prototype.bool = function (p) { return this._r() < (p === undefined ? 0.5 : p); };
  RNG.prototype.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(this._r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  /** n valores distintos del array. */
  RNG.prototype.sample = function (arr, n) { return this.shuffle(arr).slice(0, n); };
  U.RNG = RNG;
  U.rng = function (seed) { return new RNG(seed); };

  /* ---------------- Formato ---------------- */

  /** Numero con coma decimal (convencion espanola). */
  U.fmt = function (x, dec) {
    if (!isFinite(x)) return x > 0 ? '∞' : '-∞';
    var d = (dec === undefined) ? 4 : dec;
    var v = Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
    if (Object.is(v, -0)) v = 0;
    var s = (dec === undefined) ? String(v) : v.toFixed(d);
    return s.replace('.', ',');
  };
  /** Igual que fmt pero anadiendo el signo siempre. */
  U.fmts = function (x, dec) { return (x < 0 ? '' : '+') + U.fmt(x, dec); };

  U.clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  U.round = function (v, d) { var p = Math.pow(10, d || 0); return Math.round(v * p) / p; };
  U.sum = function (a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; };
  U.near = function (a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); };

  /** Separa los millares con un espacio fino: 571114 -> 571 114 */
  U.miles = function (n) {
    var s = String(Math.abs(Math.trunc(n))), out = '';
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 === 0) out += '\\,';
      out += s[i];
    }
    return (n < 0 ? '-' : '') + out;
  };

  /** Plural sencillo: U.plural(n,'raiz','raices') */
  U.plural = function (n, s, p) { return n === 1 ? s : p; };

  /* ---------------- Colores del tema (para canvas) ---------------- */
  U.css = function (name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    v = (v || '').trim();
    return v || fallback || '#888';
  };
  U.palette = function () {
    return {
      bg: U.css('--plot-bg', '#fff'),
      grid: U.css('--plot-grid', '#e6e6e6'),
      grid2: U.css('--plot-grid2', '#f3f3f3'),
      axis: U.css('--plot-axis', '#888'),
      ink: U.css('--plot-ink', '#333'),
      c: [U.css('--c1'), U.css('--c2'), U.css('--c3'), U.css('--c4'), U.css('--c5'), U.css('--c6')],
      ok: U.css('--ok', '#0a0'),
      bad: U.css('--bad', '#c00'),
      accent: U.css('--accent', '#33c')
    };
  };

  /* ---------------- Sucesos globales ---------------- */
  U.bus = {
    _m: {},
    on: function (ev, fn) { (this._m[ev] = this._m[ev] || []).push(fn); },
    emit: function (ev, data) {
      var l = this._m[ev] || [];
      for (var i = 0; i < l.length; i++) { try { l[i](data); } catch (e) { console.error(e); } }
    }
  };

  /* ---------- corregir respuestas escritas con palabras ----------
     Los ejercicios de opcion («negativa o positiva», «esencial o
     instrumental») no se pueden corregir buscando una palabra suelta: el
     alumno escribe frases, con tildes, y a menudo NIEGA una opcion para
     elegir la otra («no esencial», «el integral, no el proporcional»).
     Esto lo resuelve una vez para todos. */

  /** Quita tildes y pasa a minusculas, para comparar sin sorpresas. */
  /** Numero con dos decimales y punto: para CSS y para canvas, no para leer. */
  U.fmt2 = function (n) { return Math.round(n * 100) / 100; };

  /** ¿Ha pedido el sistema que se mueva lo menos posible? */
  U.pocoMovimiento = function () {
    return !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  U.llano = function (s) {
    s = String(s == null ? '' : s).toLowerCase();
    return s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s;
  };

  /**
   * Decide cual de varias opciones ha elegido el alumno.
   *   clases: { nombre: /expresion/ , ... }  (sin tildes, en minusculas)
   * Devuelve el nombre elegido, o null si no se entiende o es ambiguo.
   *
   * Reglas:
   *   - Una opcion precedida de «no», «ni», «sin» o «tampoco» cuenta como
   *     NEGADA, no como elegida.
   *   - Si solo hay dos opciones y el alumno niega una, elige la otra.
   */
  /* Rendirse no es elegir. Sin esto, «no lo se» entra por la clase «no» en
     cualquier pregunta de si o no, y el corrector da por buena una respuesta
     que dice justamente que no se sabe la respuesta. */
  var RENDIRSE = /^(no(\s+l[oa])?\s*se|nose|ni\s+idea|ns|npi|paso|no\s+lo\s+entiendo|no\s+se\s+cuall?e?s?)$/;

  U.eligeOpcion = function (texto, clases) {
    var s = U.llano(texto);
    if (!s.trim()) return null;
    if (RENDIRSE.test(s.trim())) return null;
    var nombres = Object.keys(clases);
    var elegidas = [], negadas = [];
    nombres.forEach(function (k) {
      var re = clases[k];
      re.lastIndex = 0;
      var m = re.exec(s);
      if (!m) return;
      // ¿hay una negacion justo antes, en las pocas palabras anteriores?
      var antes = s.slice(Math.max(0, m.index - 24), m.index);
      if (/\b(no|ni|sin|tampoco)\b[^,.;]*$/.test(antes)) negadas.push(k);
      else elegidas.push(k);
    });
    if (elegidas.length === 1) return elegidas[0];
    if (elegidas.length > 1) return null;                  // ha dicho dos cosas
    if (nombres.length === 2 && negadas.length === 1) {    // negar una es elegir la otra
      return nombres[0] === negadas[0] ? nombres[1] : nombres[0];
    }
    return null;
  };

  global.U = U;
})(window);
