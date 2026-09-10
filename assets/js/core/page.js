/* ===================================================================
   Matebase · page.js
   Constructor declarativo de paginas. Un tema no toca HTML: encadena
   llamadas a este objeto y la maquetacion sale igual en todo el curso.

     p.section('Titulo')      p.text('parrafo con $x^2$')
     p.formula('e^{i\\pi}=-1')  p.note('aviso', 'warn')
     p.demo({...})            p.exercise({...})    p.problem({...})
     p.keys(['idea 1', ...])

   Hay un segundo constructor, el RECOLECTOR, que entiende las mismas
   llamadas pero no pinta nada: solo apunta los ejercicios, las formulas y
   las ideas clave. Con el se montan los simulacros y el formulario sin
   tener que duplicar ni un ejercicio.
   =================================================================== */
(function (global) {
  'use strict';

  function Page(root, node) {
    this.root = root;
    this.node = node || {};
    this.id = this.node.id || 'sin-id';
    this._ex = 0;
    this._demo = 0;
    /** Los enunciados quedan guardados aqui para que tests.html
        pueda auditarlos (que la solucion pase su propio corrector). */
    this.specs = [];
    /** Y las tarjetas, para poder abrir un ejercicio concreto desde un enlace. */
    this.cards = [];
  }

  Page.prototype._add = function (el) { this.root.appendChild(el); return el; };

  /* ---------- estructura ---------- */

  Page.prototype.section = function (t) {
    return this._add(U.el('div.sec', null, U.el('h2', { html: MathX.inline(t) })));
  };
  Page.prototype.sub = function (t) {
    return this._add(U.el('h3.sub', { html: MathX.inline(t) }));
  };

  /* ---------- prosa ---------- */

  Page.prototype.text = function (html) {
    var box = U.el('div.prose');
    var parts = String(html).split(/\n\s*\n/);
    parts.forEach(function (s) {
      s = s.trim();
      if (!s) return;
      if (/^<(p|ul|ol|div|table|blockquote|h[1-6])/i.test(s)) box.innerHTML += MathX.inline(s);
      else box.innerHTML += '<p>' + MathX.inline(s) + '</p>';
    });
    return this._add(box);
  };

  Page.prototype.list = function (items, ordered) {
    var l = U.el(ordered ? 'ol' : 'ul');
    items.forEach(function (i) { l.appendChild(U.el('li', { html: MathX.inline(i) })); });
    return this._add(l);
  };

  /* Boton «?» con la lectura en voz alta de la formula. Es ayuda opcional:
     aparece al pasar el raton y tambien al pulsarlo, para que funcione en un
     movil, donde no hay raton que pasar. */
  function ayudaLectura(box, lectura) {
    box.classList.add('fbox--ayuda');
    var tip = U.el('div.fbox__tip', { html: MathX.inline(lectura), role: 'tooltip' });
    var b = U.el('button.fbox__help', {
      type: 'button', 'aria-expanded': 'false',
      'aria-label': 'Cómo se lee esta fórmula',
      title: 'Cómo se lee',
      onclick: function () {
        var abierto = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', abierto ? 'false' : 'true');
      },
      // Se cerraba en cuanto el foco salía del botón, y salía en cuanto el
      // alumno iba a seleccionar el texto del globo. Ahora solo se cierra
      // si el foco abandona la caja entera.
      onblur: function (e) {
        var v = e && e.relatedTarget;
        if (v && box.contains(v)) return;
        b.setAttribute('aria-expanded', 'false');
      },
      // Y con Escape, como cualquier cosa que se abre encima de otra.
      onkeydown: function (e) {
        if (e.key === 'Escape' && b.getAttribute('aria-expanded') === 'true') {
          b.setAttribute('aria-expanded', 'false');
          e.stopPropagation();
        }
      }
    }, '?');
    tip.tabIndex = -1;                       // se puede enfocar para leerlo
    box.appendChild(b);
    box.appendChild(tip);
  }

  /** Formula centrada, con etiqueta y lectura en voz alta opcionales. */
  Page.prototype.formula = function (tex, label, lectura) {
    var box = U.el('div.fbox' + (label ? '.fbox--lab' : ''));
    if (label) box.appendChild(U.el('span.fbox__lab', { text: label }));
    box.appendChild(U.el('div', { html: MathX.display(tex) }));
    if (lectura) ayudaLectura(box, lectura);
    return this._add(box);
  };

  /** Varias formulas seguidas en la misma caja. */
  Page.prototype.formulas = function (list, label, lectura) {
    var box = U.el('div.fbox' + (label ? '.fbox--lab' : ''));
    if (label) box.appendChild(U.el('span.fbox__lab', { text: label }));
    list.forEach(function (t) { box.appendChild(U.el('div', { html: MathX.display(t), style: { margin: '0' } })); });
    if (lectura) ayudaLectura(box, lectura);
    return this._add(box);
  };

  Page.prototype.note = function (html, kind, title) {
    var box = U.el('div.note' + (kind ? '.note--' + kind : ''));
    if (title) box.appendChild(U.el('span.note__t', { text: title }));
    box.appendChild(U.el('div', { html: MathX.inline(html) }));
    return this._add(box);
  };
  /** Apunte historico: el hilo que une el curso con la historia real. */
  Page.prototype.hist = function (html, title) {
    return this.note(html, 'hist', title || 'De dónde viene esto');
  };
  /** Para que sirve esto de verdad: una aplicacion concreta, fuera del aula. */
  Page.prototype.util = function (html, title) {
    return this.note(html, 'util', title || 'Utilidad');
  };

  Page.prototype.table = function (head, rows, o) {
    o = o || {};
    var wrap = U.el('div.tbl-wrap');
    var t = U.el('table.tbl');
    if (head) {
      var tr = U.el('tr');
      head.forEach(function (h, i) {
        tr.appendChild(U.el('th' + (o.num && o.num.indexOf(i) >= 0 ? '.num' : ''), { html: MathX.inline(h) }));
      });
      t.appendChild(U.el('thead', null, tr));
    }
    var tb = U.el('tbody');
    rows.forEach(function (r) {
      var tr2 = U.el('tr');
      r.forEach(function (c, i) {
        tr2.appendChild(U.el('td' + (o.num && o.num.indexOf(i) >= 0 ? '.num' : ''), { html: MathX.inline(String(c)) }));
      });
      tb.appendChild(tr2);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
    return this._add(wrap);
  };

  Page.prototype.keys = function (items, title) {
    var box = U.el('div.keys');
    box.appendChild(U.el('h3', { text: title || 'Ideas clave' }));
    var l = U.el('ul');
    items.forEach(function (i) { l.appendChild(U.el('li', { html: MathX.inline(i) })); });
    box.appendChild(l);
    return this._add(box);
  };

  Page.prototype.raw = function (el) { return this._add(el); };

  /* ---------- EJEMPLO INTERACTIVO (fijo, explicativo) ---------- */

  Page.prototype.demo = function (spec) {
    this._demo++;
    var card = U.el('div.card.card--demo');
    card.appendChild(U.el('div.card__head', null, [
      U.el('span.card__kind', { text: 'Ejemplo interactivo' }),
      U.el('span.card__title', { html: MathX.inline(spec.title || '') })
    ]));
    var body = U.el('div.card__body');
    if (spec.intro) body.appendChild(U.el('div.prose', { html: '<p>' + MathX.inline(spec.intro) + '</p>' }));

    var d = {
      text: function (h) { body.appendChild(U.el('div.prose', { html: '<p>' + MathX.inline(h) + '</p>' })); },
      row: function () { return W.row(body); },
      out: function (h) { return W.readout(body, h); },
      hint: function (h) { W.hint(body, h); },
      el: body
    };
    card.appendChild(body);
    this._add(card);
    if (spec.build) spec.build(body, d);
    return card;
  };

  /* ---------- EJERCICIO PRACTICO (procedural, corregido) ---------- */

  Page.prototype.exercise = function (spec) {
    this._ex++;
    this.specs.push(spec);
    var c = Ex.card(this.root, spec, this.id, this._ex);
    this.cards.push(c);
    return c;
  };

  /** Problema por apartados, como los de la PAU. Cuenta como un ejercicio. */
  Page.prototype.problem = function (spec) {
    this._ex++;
    this.specs.push(spec);
    var c = Ex.problema(this.root, spec, this.id, this._ex);
    this.cards.push(c);
    return c;
  };

  /** Varios ejercicios de golpe. */
  Page.prototype.exercises = function (list) {
    var self = this;
    list.forEach(function (s) { self.exercise(s); });
  };

  /* ============================ RECOLECTOR ============================
     Mismas llamadas que Page, sin pintar nada. Numera los ejercicios igual
     que Page -ejercicios y problemas comparten contador-, asi que el
     ejercicio 3 de un tema es el 3 aqui y alli, y el progreso que apunte un
     simulacro cae en el mismo sitio que si se hubiera hecho en el tema. */

  function Recolector(node) {
    this.node = node || {};
    this.id = this.node.id || 'sin-id';
    this._ex = 0;
    this._sec = '';
    this.specs = [];
    this.items = [];          // {spec, n, tipo, sec}
    this.vistas = [];         // formulas: {tex:[...], label, sec}
    this.claves = [];         // ideas clave (listas)
  }
  function nada() { return null; }
  ['sub', 'text', 'list', 'note', 'hist', 'util', 'table', 'raw', 'demo'].forEach(function (m) {
    Recolector.prototype[m] = nada;
  });
  Recolector.prototype.section = function (t) { this._sec = t; return null; };
  Recolector.prototype.formula = function (tex, label) {
    this.vistas.push({ tex: [tex], label: label || '', sec: this._sec });
    return null;
  };
  Recolector.prototype.formulas = function (list, label) {
    this.vistas.push({ tex: list.slice(), label: label || '', sec: this._sec });
    return null;
  };
  Recolector.prototype.keys = function (items) { this.claves = this.claves.concat(items); return null; };
  Recolector.prototype.exercise = function (spec) {
    this._ex++;
    this.specs.push(spec);
    this.items.push({ spec: spec, n: this._ex, tipo: 'ejercicio', sec: this._sec });
    return null;
  };
  Recolector.prototype.problem = function (spec) {
    this._ex++;
    this.specs.push(spec);
    this.items.push({ spec: spec, n: this._ex, tipo: 'problema', sec: this._sec });
    return null;
  };
  Recolector.prototype.exercises = function (list) {
    var self = this;
    list.forEach(function (s) { self.exercise(s); });
  };
  // Las paginas de repaso (mapa, simulacro, formulario) no se recolectan.
  ['mapa', 'simulacro', 'formulario'].forEach(function (m) { Recolector.prototype[m] = nada; });

  Page.Recolector = Recolector;
  global.Page = Page;
})(window);
