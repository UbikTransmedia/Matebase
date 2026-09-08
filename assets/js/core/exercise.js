/* ===================================================================
   Matebase · exercise.js
   Motor de EJERCICIOS PRACTICOS generados proceduralmente.

   Cada ejercicio se describe con un objeto:

     {
       title:  'Resuelve la ecuacion de segundo grado',
       level:  'basico' | 'medio' | 'avanzado',
       gen:    function (r) { ...usa el RNG r... return datos; },
       ask:    function (d) { return 'enunciado con $latex$'; },
       show:   function (d, host) { ... dibujo opcional ... },
       fields: function (d) { return [{name:'x1', label:'x_1 ='}]; },
       sol:    function (d) { return {x1: 3, x2: -1}; },     // correccion automatica
       check:  function (v, d) { return true|false|{ok,msg}; }, // o correccion a medida
       hint:   function (d) { return 'pista'; },
       steps:  function (d) { return ['paso 1', 'paso 2']; },
       answer: function (d) { return 'x = 3 o x = -1'; }
     }

   El alumno pulsa «Otro ejercicio» y `gen` se vuelve a ejecutar con una
   semilla nueva: mismos conceptos, numeros distintos, infinitas veces.
   =================================================================== */
(function (global) {
  'use strict';

  var Ex = {};
  var LEVEL = {
    basico: ['tag--b', 'básico'],
    medio: ['tag--m', 'medio'],
    avanzado: ['tag--a', 'avanzado']
  };

  /** Compara la respuesta del alumno con el valor esperado. */
  Ex.same = function (got, want, tol) {
    if (typeof want === 'string') {
      var a = String(got).trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
      var b = want.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
      return a === b;
    }
    if (isNaN(got)) return false;
    var t = (tol === undefined) ? 1e-6 : tol;
    return Math.abs(got - want) <= t * (1 + Math.abs(want));
  };

  /** Conjunto de soluciones sin importar el orden: "3; -1" */
  Ex.sameSet = function (rawList, want, tol) {
    var got = String(rawList).split(/[;]/).map(function (s) { return ML.tryEval(s); });
    if (got.length !== want.length) return false;
    var used = want.map(function () { return false; });
    for (var i = 0; i < got.length; i++) {
      var found = -1;
      for (var j = 0; j < want.length; j++) {
        if (!used[j] && Ex.same(got[i], want[j], tol)) { found = j; break; }
      }
      if (found < 0) return false;
      used[found] = true;
    }
    return true;
  };

  /* ------------------------------------------------------------------ */

  function Card(host, spec, topicId, index) {
    this.spec = spec;
    this.topicId = topicId;
    this.index = index;
    this.data = null;
    this.tried = false;
    this.build(host);
    this.regen();
  }

  Card.prototype.build = function (host) {
    var self = this, s = this.spec;
    var lv = LEVEL[s.level || 'basico'];

    this.el = U.el('div.card.card--ex');
    this.head = U.el('div.card__head', null, [
      U.el('span.card__kind', { text: 'Ejercicio práctico' }),
      U.el('span.card__title', { html: MathX.inline(s.title || 'Practica') }),
      U.el('span.card__spacer'),
      U.el('span.tag.' + lv[0], { text: lv[1] })
    ]);
    this.body = U.el('div.card__body');
    this.qEl = U.el('div.q');
    this.showEl = U.el('div');
    this.ansEl = U.el('div.ans');
    this.verdict = U.el('div.verdict');
    this.stepsEl = U.el('div.steps');
    U.add(this.body, [this.qEl, this.showEl, this.ansEl, this.verdict, this.stepsEl]);

    this.bCheck = U.el('button.btn.btn--ok', { type: 'button', text: 'Comprobar' });
    this.bHint = U.el('button.btn', { type: 'button', text: 'Pista' });
    this.bSol = U.el('button.btn', { type: 'button', text: 'Ver solución' });
    this.bNew = U.el('button.btn.btn--main', { type: 'button', html: '&#8635; Otro ejercicio' });
    this.score = U.el('span.card__score');

    this.bCheck.addEventListener('click', function () { self.check(); });
    this.bHint.addEventListener('click', function () { self.showHint(); });
    this.bSol.addEventListener('click', function () { self.reveal(); });
    this.bNew.addEventListener('click', function () { self.regen(); });

    this.foot = U.el('div.card__foot', null, [
      this.bCheck, s.hint ? this.bHint : null, this.bSol,
      U.el('span.card__spacer'), this.score, this.bNew
    ]);

    U.add(this.el, [this.head, this.body, this.foot]);
    host.appendChild(this.el);
    this.paintScore();
  };

  Card.prototype.paintScore = function () {
    var t = Progress.topic(this.topicId);
    this.score.textContent = t.tries ? ('aciertos ' + t.ok + '/' + t.tries) : '';
  };

  /** Genera un enunciado nuevo. */
  Card.prototype.regen = function () {
    var s = this.spec;
    var r = U.rng();
    this.seed = r.seed;
    var guard = 0;
    do { this.data = s.gen ? s.gen(r) : {}; } while (this.data === null && ++guard < 40);

    this.qEl.innerHTML = '<span class="qn">' + this.index + '.</span>' + MathX.inline(s.ask ? s.ask(this.data) : '');
    U.clear(this.showEl);
    if (s.show) s.show(this.data, this.showEl);

    U.clear(this.ansEl);
    this.fields = (typeof s.fields === 'function' ? s.fields(this.data) : s.fields) ||
      [{ name: 'r', label: 'Respuesta' }];
    this.inputs = {};
    var self = this;
    this.fields.forEach(function (f) {
      var box = U.el('div.fld' + (f.w ? '.fld--' + f.w : ''));
      box.appendChild(U.el('label', { html: MathX.inline(f.label || f.name) }));
      var inp = U.el('input', {
        type: 'text', autocomplete: 'off', spellcheck: 'false',
        placeholder: f.ph || ''
      });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') self.check(); });
      box.appendChild(inp);
      self.ansEl.appendChild(box);
      self.inputs[f.name] = { input: inp, box: box, def: f };
    });

    this.verdict.className = 'verdict';
    this.verdict.innerHTML = '';
    this.stepsEl.className = 'steps';
    this.stepsEl.innerHTML = '';
    this.tried = false;
    this.bCheck.disabled = false;
    this.paintScore();
  };

  /* Cortesias de redaccion: el alumno escribe como habla, y no debe perder
     un ejercicio por terminar la frase con un punto o por anteponer «es».
     Se limpia aqui, una vez, para que ningun corrector tenga que ocuparse. */
  function aseado(s) {
    s = String(s == null ? '' : s).trim();
    s = s.replace(/[.;,\s]+$/, '');                    // punto o coma al final
    s = s.replace(/^(?:es|son|seria|serian|creo que)\s+/i, '');
    s = s.replace(/^(?:el|la|los|las|un|una)\s+(?=\S)/i, '');
    return s.trim();
  }

  Card.prototype.values = function () {
    var v = { raw: {} };
    for (var k in this.inputs) {
      var bruto = this.inputs[k].input.value;
      var s = aseado(bruto);
      // si al asear se queda vacio, vale lo que escribio: no inventamos nada
      if (s === '' && String(bruto).trim() !== '') s = String(bruto).trim();
      v.raw[k] = s;
      v[k] = s === '' ? NaN : ML.tryEval(s);
    }
    return v;
  };
  Ex.aseado = aseado;

  Card.prototype.mark = function (name, ok) {
    var f = this.inputs[name];
    if (!f) return;
    f.box.classList.remove('is-ok', 'is-bad');
    f.box.classList.add(ok ? 'is-ok' : 'is-bad');
  };

  Card.prototype.check = function () {
    var s = this.spec, v = this.values(), res;

    var empty = true;
    for (var k in v.raw) if (v.raw[k] !== '') empty = false;
    if (empty) {
      this.verdict.className = 'verdict verdict--hint is-on';
      this.verdict.innerHTML = 'Escribe tu respuesta antes de comprobar.';
      return;
    }

    if (s.check) res = s.check(v, this.data);
    else {
      var want = s.sol(this.data), all = true;
      for (var n in want) {
        var ok = Ex.same(typeof want[n] === 'string' ? v.raw[n] : v[n], want[n], s.tol);
        this.mark(n, ok);
        if (!ok) all = false;
      }
      res = all;
    }
    if (typeof res === 'boolean') res = { ok: res };
    if (res.fields) for (var m in res.fields) this.mark(m, res.fields[m]);
    else if (s.check) for (var q in this.inputs) this.mark(q, res.ok);

    this.verdict.className = 'verdict is-on ' + (res.ok ? 'verdict--ok' : 'verdict--bad');
    this.verdict.innerHTML = MathX.inline(res.msg ||
      (res.ok ? '<strong>¡Correcto!</strong> Pulsa «Otro ejercicio» para practicar con números nuevos.'
        : '<strong>No es correcto.</strong> Revisa el cálculo, o mira la pista y la solución paso a paso.'));

    if (!this.tried) { Progress.answer(this.topicId, res.ok); this.tried = true; }
    this.paintScore();
    if (res.ok) this.bCheck.disabled = true;
  };

  Card.prototype.showHint = function () {
    var h = this.spec.hint(this.data);
    this.verdict.className = 'verdict verdict--hint is-on';
    this.verdict.innerHTML = '<strong>Pista.</strong> ' + MathX.inline(h);
  };

  Card.prototype.reveal = function () {
    var s = this.spec;
    if (!this.tried) { Progress.answer(this.topicId, false); this.tried = true; this.paintScore(); }
    var html = '';
    if (s.steps) {
      var st = s.steps(this.data);
      html += '<ol>';
      st.forEach(function (x) { html += '<li>' + MathX.inline(x) + '</li>'; });
      html += '</ol>';
    }
    if (s.answer) html += '<div class="fin">' + MathX.inline(s.answer(this.data)) + '</div>';
    else if (s.sol) {
      var w = s.sol(this.data), bits = [];
      for (var k in w) bits.push(k + ' = ' + (typeof w[k] === 'number' ? U.fmt(w[k], 4) : w[k]));
      html += '<div class="fin">' + bits.join(' &nbsp;·&nbsp; ') + '</div>';
    }
    this.stepsEl.innerHTML = html;
    this.stepsEl.classList.add('is-on');
  };

  Ex.card = function (host, spec, topicId, index) { return new Card(host, spec, topicId, index); };
  global.Ex = Ex;
})(window);
