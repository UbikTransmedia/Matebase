/* ===================================================================
   Matebase · page.js
   Constructor declarativo de paginas. Un tema no toca HTML: encadena
   llamadas a este objeto y la maquetacion sale igual en todo el curso.

     p.section('Titulo')      p.text('parrafo con $x^2$')
     p.formula('e^{i\\pi}=-1')  p.note('aviso', 'warn')
     p.demo({...})            p.exercise({...})
     p.keys(['idea 1', ...])
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

  /** Formula centrada, opcionalmente con etiqueta encima. */
  Page.prototype.formula = function (tex, label) {
    var box = U.el('div.fbox' + (label ? '.fbox--lab' : ''));
    if (label) box.appendChild(U.el('span.fbox__lab', { text: label }));
    box.appendChild(U.el('div', { html: MathX.display(tex) }));
    return this._add(box);
  };

  /** Varias formulas seguidas en la misma caja. */
  Page.prototype.formulas = function (list, label) {
    var box = U.el('div.fbox' + (label ? '.fbox--lab' : ''));
    if (label) box.appendChild(U.el('span.fbox__lab', { text: label }));
    list.forEach(function (t) { box.appendChild(U.el('div', { html: MathX.display(t), style: { margin: '6px 0' } })); });
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
    return Ex.card(this.root, spec, this.id, this._ex);
  };

  /** Varios ejercicios de golpe. */
  Page.prototype.exercises = function (list) {
    var self = this;
    list.forEach(function (s) { self.exercise(s); });
  };

  global.Page = Page;
})(window);
