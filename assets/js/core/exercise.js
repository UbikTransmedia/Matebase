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
       hint:   function (d) { return 'pista' | ['suave', 'mas concreta', ...]; },
       errores:[{ si: function (v, d) {...}, msg: '...' }],   // errores tipicos
       steps:  function (d) { return ['paso 1', 'paso 2']; },
       answer: function (d) { return 'x = 3 o x = -1'; }
     }

   · Un campo con `opts` es de ELECCION: el alumno pulsa una opcion en vez
     de escribirla. opts: ['SCD', 'SCI', 'SI'] o [{t: 'texto', v: 'valor'}].
   · Si `hint` devuelve una lista, cada pulsacion descubre una pista mas.
   · `errores` pone nombre a los fallos clasicos: si la respuesta coincide
     con la de un error conocido, se dice cual en vez de «todavia no».

   Un PROBLEMA POR APARTADOS (p.problem) comparte `gen` y un enunciado comun
   (`intro`) y reparte todo lo demas en `partes`, cada una con sus campos,
   su solucion, sus pistas y sus pasos. Los apartados se abren en orden,
   como en un examen de la PAU.

   El alumno pulsa «Otro ejercicio» y `gen` se vuelve a ejecutar con una
   semilla nueva: mismos conceptos, numeros distintos, infinitas veces.
   =================================================================== */
(function (global) {
  'use strict';

  /* Los rotulos fijos de una tarjeta de ejercicio son interfaz, no prosa del
     curso: van al diccionario de interfaz. El enunciado no, que lo fabrica
     `gen` con numeros distintos cada vez y no tiene frase fija. */
  function UI(s) { return global.I18N ? I18N.ui(s) : s; }

  var Ex = {};
  var LEVEL = {
    basico: ['tag--b', 'básico'],
    medio: ['tag--m', 'medio'],
    avanzado: ['tag--a', 'avanzado']
  };
  var LETRAS = 'abcdefghijkl';
  var cuenta = 0;          // ids unicos para enlazar etiquetas y casillas

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

  /* La tolerancia relativa de Ex.same no casa con un enunciado que pide "N
     decimales": cerca de cero rechaza la respuesta bien redondeada (0,3333
     frente a 1/3 con tol 1e-6) y con valores grandes acepta de mas. Un
     ejercicio que pide decimales declara `dec`, y uno cuya respuesta se mueve
     por varios ordenes de magnitud (una cota de error, un periodo) declara
     `rel`. Cada una puede ser un numero, para todos los campos, o un objeto
     {campo: valor}. */

  /** Correcto si el error absoluto no pasa de medio decimal de los pedidos. */
  Ex.sameDec = function (got, want, dec) {
    if (isNaN(got)) return false;
    return Math.abs(got - want) <= 0.5 * Math.pow(10, -dec) * (1 + 1e-6);
  };

  /** Correcto si el error relativo no pasa de `rel`. */
  Ex.sameRel = function (got, want, rel) {
    if (isNaN(got)) return false;
    return Math.abs(got - want) <= rel * Math.abs(want) + 1e-12;
  };

  function opcionCampo(spec, prop, name) {
    var o = spec[prop];
    if (o === undefined || o === null) return null;
    if (typeof o === 'number') return o;
    return (o[name] === undefined || o[name] === null) ? null : o[name];
  }

  /** Compara campo a campo lo tecleado (v, de Pregunta#values) con la
   *  solucion, con el criterio que declare el ejercicio: dec, rel o tol. */
  Ex.compara = function (spec, v, want) {
    var fields = {}, ok = true;
    for (var n in want) {
      var w = want[n], bien;
      if (typeof w === 'string') bien = Ex.same(v.raw[n], w);
      else {
        var dec = opcionCampo(spec, 'dec', n), rel = opcionCampo(spec, 'rel', n);
        // Con dec o rel, una tol explicita se suma como segunda via: sirve
        // para admitir ademas el error relativo de un calculo encadenado.
        var porTol = spec.tol !== undefined && Ex.same(v[n], w, spec.tol);
        if (dec !== null) bien = Ex.sameDec(v[n], w, dec) || porTol;
        else if (rel !== null) bien = Ex.sameRel(v[n], w, rel) || porTol;
        else bien = Ex.same(v[n], w, spec.tol);
      }
      fields[n] = bien;
      if (!bien) ok = false;
    }
    return { ok: ok, fields: fields };
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

  /* El corrector entiende mucho mas de lo que el alumno imagina: fracciones,
     raices, potencias, pi, expresiones enteras. Si no se dice, nadie lo usa,
     y quien no calcula bien de cabeza se queda fuera de un ejercicio que en
     realidad no iba de calcular. Va en la misma esquina y con el mismo globo
     amarillo que la ayuda de lectura de las formulas. */
  function panelComo() {
    return U.el('div.ans__panel', {
      html: '<strong>No hace falta que calcules el decimal.</strong> ' +
        'La casilla admite tal cual:' +
        '<ul>' +
        '<li>fracciones: <em>3/4</em>, <em>120/7</em></li>' +
        '<li>decimales con coma: <em>-2,5</em></li>' +
        '<li>potencias: <em>2^10</em></li>' +
        '<li>raíces: <em>sqrt(2)</em> o <em>raiz(2)</em></li>' +
        '<li>constantes: <em>pi</em>, <em>e</em></li>' +
        '<li>cuentas sin resolver: <em>(3+5)*2</em></li>' +
        '</ul>' +
        'Y si la respuesta es una expresión, vale escribirla entera: ' +
        '<em>2x+1</em>, <em>(x-3)(x+2)</em>.'
    });
  }

  /** El circulito que abre y cierra ese panel. Se rehace con cada enunciado. */
  function botonComo(panel) {
    var caja = U.el('div.ans__como');
    var b = U.el('button.fbox__help', {
      type: 'button', 'aria-expanded': 'false',
      'aria-label': 'Cómo se escribe la respuesta',
      title: 'Cómo escribir la respuesta',
      onclick: function () {
        var abierto = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', abierto ? 'false' : 'true');
        panel.classList.toggle('is-on', !abierto);
      },
      onkeydown: function (e) {
        if (e.key === 'Escape' && b.getAttribute('aria-expanded') === 'true') {
          b.setAttribute('aria-expanded', 'false');
          panel.classList.remove('is-on');
          e.stopPropagation();
        }
      }
    }, '?');
    caja.appendChild(b);
    return caja;
  }

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
  Ex.aseado = aseado;

  /** Las opciones de un campo de eleccion, siempre como {t, v}. */
  function opcionesDe(f) {
    return (f.opts || []).map(function (o) {
      if (o !== null && typeof o === 'object') {
        return { t: String(o.t), v: String(o.v !== undefined ? o.v : o.t) };
      }
      return { t: String(o), v: String(o) };
    });
  }
  Ex.opciones = opcionesDe;

  /* ============================ PREGUNTA ============================
     La unidad minima que se corrige: unas casillas, su correccion, sus
     pistas y su solucion. Un ejercicio tiene una; un problema por
     apartados tiene tantas como apartados. Quien la contiene decide donde
     van los botones y que hacer cuando se acierta. */

  function Pregunta(spec, o) {
    this.spec = spec;
    this.o = o || {};
    this.qEl = U.el('div.q');
    this.showEl = U.el('div');
    this.ansEl = U.el('div.ans');
    this.comoEl = panelComo();
    // «Correcto» / «No es correcto» aparecia sin avisar: para quien usa
    // lector de pantalla, pulsar Comprobar no producia ninguna respuesta.
    this.verdict = U.el('div.verdict', { role: 'status', 'aria-live': 'polite' });
    this.stepsEl = U.el('div.steps', { role: 'region', 'aria-label': 'Solución paso a paso' });
    this.bCheck = U.el('button.btn.btn--ok', { type: 'button', text: UI('Comprobar') });
    this.bHint = U.el('button.btn', { type: 'button', text: UI('Pista') });
    this.bSol = U.el('button.btn', { type: 'button', text: UI('Ver solución') });
    var self = this;
    this.bCheck.addEventListener('click', function () { self.check(); });
    this.bHint.addEventListener('click', function () { self.showHint(); });
    this.bSol.addEventListener('click', function () { self.reveal(); });
    this.inputs = {};
  }

  Pregunta.prototype.nodos = function () {
    return [this.qEl, this.showEl, this.ansEl, this.comoEl, this.verdict, this.stepsEl];
  };
  Pregunta.prototype.botones = function () {
    return [this.bCheck, this.spec.hint ? this.bHint : null, this.bSol];
  };

  /** Monta el enunciado y las casillas para unos datos nuevos. */
  Pregunta.prototype.nueva = function (data, antes) {
    var s = this.spec, self = this;
    this.data = data;
    this.tried = false;
    this.resuelta = false;
    this.consultada = false;
    this.pistas = 0;

    this.qEl.innerHTML = (antes || '') + (s.ask ? MathX.inline(s.ask(data)) : '');
    // Si el enunciado trae un recuadro de codigo, colorearlo como el editor.
    if (global.W && W.pintaBloques) W.pintaBloques(this.qEl);
    U.clear(this.showEl);
    if (s.show) s.show(data, this.showEl);

    U.clear(this.ansEl);
    this.comoEl.classList.remove('is-on');
    this.fields = (typeof s.fields === 'function' ? s.fields(data) : s.fields) ||
      [{ name: 'r', label: 'Respuesta' }];
    this.inputs = {};
    this.fields.forEach(function (f) {
      if (f.opts) self._opciones(f); else self._casilla(f);
    });
    // El globo de «cómo se escribe» solo tiene sentido si hay algo que escribir.
    if (this.fields.some(function (f) { return !f.opts; })) {
      this.ansEl.appendChild(botonComo(this.comoEl));
    }

    this.verdict.className = 'verdict';
    this.verdict.innerHTML = '';
    this.stepsEl.className = 'steps';
    this.stepsEl.innerHTML = '';
    this.bHint.textContent = UI('Pista');
    this.bloquea(false);
  };

  Pregunta.prototype._casilla = function (f) {
    var self = this;
    var id = 'fld' + (++cuenta);
    var box = U.el('div.fld' + (f.w ? '.fld--' + f.w : ''));
    box.appendChild(U.el('label', { 'for': id, html: MathX.inline(f.label || f.name) }));
    var inp = U.el('input', {
      id: id, type: 'text', autocomplete: 'off', spellcheck: 'false',
      placeholder: f.ph || ''
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !self.o.examen) self.check();
    });
    box.appendChild(inp);
    // Marca de acierto o fallo que NO depende del color: quien no distingue
    // el rojo del verde tiene que poder saber igual que campo ha fallado.
    var senal = U.el('span.fld__marca', { 'aria-hidden': 'true' });
    box.appendChild(senal);
    this.ansEl.appendChild(box);
    this.inputs[f.name] = { input: inp, box: box, def: f, marca: senal };
  };

  /* Un campo de ELECCION. Escribir «compatible indeterminado» a mano no
     mide si se sabe discutir un sistema: mide si se escribe bien. Aqui se
     pulsa. Es un grupo de radio de verdad: se recorre con las flechas, se
     anuncia el estado y el acierto no depende del color. */
  Pregunta.prototype._opciones = function (f) {
    var self = this;
    var ops = opcionesDe(f);
    var idEt = 'opc' + (++cuenta);
    var box = U.el('div.fld.fld--opc');
    var estado = U.el('span.sr-solo');
    var et = U.el('span.fld__et', { id: idEt, html: MathX.inline(f.label || f.name) });
    et.appendChild(estado);
    box.appendChild(et);
    var grupo = U.el('div.opc', { role: 'radiogroup', 'aria-labelledby': idEt });
    var botones = [], valor = '';
    var senal = U.el('span.fld__marca', { 'aria-hidden': 'true' });

    function elige(i, sinLimpiar) {
      valor = i < 0 ? '' : ops[i].v;
      botones.forEach(function (b, k) {
        var on = k === i;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.tabIndex = (on || (i < 0 && k === 0)) ? 0 : -1;
      });
      if (!sinLimpiar) {
        box.classList.remove('is-ok', 'is-bad');
        senal.textContent = '';
        estado.textContent = '';
      }
    }

    ops.forEach(function (op, i) {
      var b = U.el('button.opc__b', {
        type: 'button', role: 'radio', 'aria-checked': 'false',
        tabindex: i === 0 ? '0' : '-1', html: MathX.inline(op.t)
      });
      b.addEventListener('click', function () { elige(i); });
      b.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % ops.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + ops.length) % ops.length;
        else if (e.key === 'Enter' && !self.o.examen) { e.preventDefault(); elige(i); self.check(); return; }
        if (j === null) return;
        e.preventDefault();
        e.stopPropagation();
        elige(j);
        botones[j].focus();
      });
      botones.push(b);
      grupo.appendChild(b);
    });

    var fila = U.el('div.opc__fila', null, [grupo, senal]);
    box.appendChild(fila);
    this.ansEl.appendChild(box);
    // `input` se comporta como una casilla de texto: se lee y se escribe su
    // `value`. Asi el resto del motor, y tests.html, no distinguen los dos casos.
    var falso = {
      get value() { return valor; },
      set value(v) {
        var k = -1;
        for (var i = 0; i < ops.length; i++) if (ops[i].v === String(v)) k = i;
        elige(k);
      },
      focus: function () { (botones[Math.max(0, ops.map(function (o) { return o.v; }).indexOf(valor))] || botones[0]).focus(); },
      setAttribute: function () { },
      disabled: false
    };
    this.inputs[f.name] = {
      input: falso, box: box, def: f, marca: senal, opc: botones,
      grupo: grupo, estado: estado, ops: ops
    };
  };

  Pregunta.prototype.values = function () {
    var v = { raw: {} };
    for (var k in this.inputs) {
      var f = this.inputs[k];
      var bruto = f.input.value;
      var s = f.opc ? String(bruto || '') : aseado(bruto);
      // si al asear se queda vacio, vale lo que escribio: no inventamos nada
      if (!f.opc && s === '' && String(bruto).trim() !== '') s = String(bruto).trim();
      v.raw[k] = s;
      v[k] = s === '' ? NaN : ML.tryEval(s);
    }
    return v;
  };

  Pregunta.prototype.mark = function (name, ok) {
    var f = this.inputs[name];
    if (!f) return;
    f.box.classList.remove('is-ok', 'is-bad');
    f.box.classList.add(ok ? 'is-ok' : 'is-bad');
    if (f.marca) f.marca.textContent = ok ? '✓' : '✗';
    if (f.opc) {
      // el grupo se nombra con su etiqueta: el veredicto va dentro de ella
      f.estado.textContent = ok ? ', correcto' : ', incorrecto';
      return;
    }
    // y para quien navega con lector de pantalla
    f.input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    var etq = String((f.def && f.def.label) || (f.def && f.def.name) || 'respuesta')
      .replace(/<[^>]+>/g, '').replace(/[$\\]/g, '').replace(/[\s=:]+$/, '').trim() || 'respuesta';
    f.input.setAttribute('aria-label', etq + (ok ? ', correcto' : ', incorrecto'));
  };

  function hayAlgo(v) {
    for (var k in v.raw) if (v.raw[k] !== '') return true;
    return false;
  }

  /** Corrige. `silencioso` es para los examenes: lo vacio cuenta como fallo. */
  Pregunta.prototype.check = function (silencioso) {
    var s = this.spec, v = this.values(), res;

    if (!hayAlgo(v)) {
      if (!silencioso) {
        var soloOpciones = this.fields.every(function (f) { return !!f.opts; });
        this.verdict.className = 'verdict verdict--hint is-on';
        this.verdict.innerHTML = soloOpciones
          ? 'Elige una de las opciones antes de comprobar.'
          : 'Escribe tu respuesta antes de comprobar. ' +
            'Vale una fracción o una cuenta sin resolver: mira el <strong>?</strong> ' +
            'que hay junto a la casilla.';
        return null;
      }
      for (var q0 in this.inputs) this.mark(q0, false);
      this.verdict.className = 'verdict is-on verdict--bad';
      this.verdict.innerHTML = '<strong>' + UI('Sin responder.') + '</strong>';
      this._fin(false);
      return false;
    }

    try {
      if (s.check) res = s.check(v, this.data);
      else {
        var cmp = Ex.compara(s, v, s.sol(this.data));
        for (var n in cmp.fields) this.mark(n, cmp.fields[n]);
        res = cmp.ok;
      }
    } catch (e) {
      res = { ok: false, msg: 'No he podido leer la respuesta. Revisa lo que has escrito.' };
    }
    if (typeof res === 'boolean' || !res) res = { ok: !!res };
    if (res.fields) for (var m in res.fields) this.mark(m, res.fields[m]);
    else if (s.check) for (var q in this.inputs) this.mark(q, res.ok);

    // Un error con nombre dice más que un «todavía no»: si la respuesta es
    // la de un fallo clásico, se dice cuál.
    var msg = res.msg;
    if (!res.ok && s.errores) msg = this._diagnostico(v) || msg;
    this.verdict.className = 'verdict is-on ' + (res.ok ? 'verdict--ok' : 'verdict--bad');
    this.verdict.innerHTML = MathX.inline(msg || (res.ok
      ? (this.o.bien || '<strong>¡Correcto!</strong> Pulsa «Otro ejercicio» para practicar con números nuevos.')
      : this._casi()));
    this._fin(res.ok);
    // El boton no se bloquea: si el alumno quiere escribirlo de otra forma y
    // volver a comprobar, que pueda. El acierto ya esta apuntado.
    return res.ok;
  };

  Pregunta.prototype._fin = function (ok) {
    var primera = !this.tried;
    this.tried = true;
    if (ok) this.resuelta = true;
    if (this.o.alComprobar) this.o.alComprobar(ok, primera, this);
  };

  /** Busca un error tipico que explique la respuesta. */
  Pregunta.prototype._diagnostico = function (v) {
    var lista = this.spec.errores || [];
    for (var i = 0; i < lista.length; i++) {
      try {
        if (lista[i].si(v, this.data)) {
          var m = typeof lista[i].msg === 'function' ? lista[i].msg(v, this.data) : lista[i].msg;
          /* Se apunta. El catalogo de errores frecuentes del bloque de
             repaso deja de ser una lista general y pasa a ser la lista de
             los TUYOS, que es la unica que se lee con atencion. */
          if (this.topicId && this.topicId.charAt(0) !== '_') {
            Progress.apuntaError(this.topicId, this.index || 0, i, quitaMarcas(m));
          }
          return '<strong>Error típico.</strong> ' + m +
            ' <span class="verdict__mas">Corrígelo y vuelve a comprobar.</span>';
        }
      } catch (e) { /* una regla rota no puede tapar la correccion */ }
    }
    return null;
  };

  /* El mensaje de un error trae etiquetas y formulas; para guardarlo y
     volver a enseñarlo en una lista basta con el texto. */
  function quitaMarcas(html) {
    return String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);
  }

  /* Cuando hay varios campos y unos cuantos estan bien, decirlo. No es
     consuelo: es informacion, y le dice al alumno donde mirar. */
  Pregunta.prototype._casi = function () {
    var n = 0, bien = 0;
    for (var k in this.inputs) {
      n++;
      if (this.inputs[k].box.classList.contains('is-ok')) bien++;
    }
    if (n > 1 && bien > 0) {
      return '<strong>Casi.</strong> ' + (bien === 1 ? 'Uno' : bien) + ' de ' + n +
        ' está' + (bien === 1 ? '' : 'n') + ' bien; repasa ' +
        (n - bien === 1 ? 'el que falta' : 'los que faltan') +
        '. La pista y la solución paso a paso están ahí abajo.';
    }
    return '<strong>Todavía no.</strong> Prueba otra vez, mira la pista, ' +
      'o abre la solución paso a paso: consultarla no resta nada.';
  };

  /* Pistas graduadas: la primera empuja, la segunda señala, la ultima casi
     resuelve. Darlo todo a la primera le quita al alumno la ocasion de
     resolverlo con solo un empujon. */
  Pregunta.prototype.showHint = function () {
    if (!this.spec.hint) return;
    var h = this.spec.hint(this.data);
    var lista = Array.isArray(h) ? h : [h];
    this.pistas = Math.min(lista.length, (this.pistas || 0) + 1);
    var html;
    if (lista.length === 1) {
      html = '<strong>Pista.</strong> ' + MathX.inline(lista[0]);
    } else {
      html = '<strong>Pista ' + this.pistas + ' de ' + lista.length + '.</strong>' +
        '<ol class="pistas">' + lista.slice(0, this.pistas).map(function (x) {
          return '<li>' + MathX.inline(x) + '</li>';
        }).join('') + '</ol>';
      this.bHint.textContent = UI(this.pistas < lista.length ? 'Otra pista' : 'Pista');
    }
    this.verdict.className = 'verdict verdict--hint is-on';
    this.verdict.innerHTML = html;
  };

  Pregunta.prototype.reveal = function () {
    var s = this.spec;
    // Consultar sale gratis. Se marca el ejercicio como ya mirado -para que
    // copiar la solucion no cuente como acierto- pero no se apunta ningun
    // fallo: cobrarle a alguien por leer la explicacion es la mejor forma
    // de que no la lea.
    this.tried = true;
    this.consultada = true;
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
    if (this.o.alConsultar) this.o.alConsultar(this);
  };

  Pregunta.prototype.bloquea = function (si) {
    si = !!si;
    for (var k in this.inputs) {
      var f = this.inputs[k];
      if (f.opc) f.opc.forEach(function (b) { b.disabled = si; });
      else f.input.disabled = si;
    }
    this.bCheck.disabled = si;
    this.bHint.disabled = si;
    this.bSol.disabled = si;
  };

  /* ------------------------------------------------------------------ */

  /** Lo que lleva resuelto: anima a seguir, no lleva la cuenta de tropiezos. */
  function marcador(topicId, index) {
    var t = Progress.topic(topicId);
    if (!t.ok) return '';
    var e = t.ex && t.ex[index];
    var partes = [];
    if (e && e.ok) partes.push(e.ok === 1 ? 'este, 1 vez' : 'este, ' + e.ok + ' veces');
    partes.push(t.ok === 1 ? '1 resuelto en el tema' : t.ok + ' resueltos en el tema');
    return partes.join(' · ');
  }

  /* Un enlace que abre ESTE enunciado, con ESTOS numeros. Sirve para que
     toda una clase trabaje el mismo ejercicio, para preguntar una duda
     concreta o para guardarse uno que costó. La semilla no es un dato
     personal: solo dice que numeros salieron. */
  function botonEnlace(tarjeta) {
    var b = U.el('button.btn.btn--sm.btn--ghost', {
      type: 'button',
      title: 'Copiar un enlace que abre este mismo enunciado, con estos mismos números',
      html: '&#128279; ' + UI('Enlace')
    });
    b.addEventListener('click', function () {
      var url = location.href.split('#')[0] + '#/' + tarjeta.topicId +
        '?e=' + tarjeta.index + '&s=' + tarjeta.seed;
      function manual() {
        U.clear(tarjeta.aviso);
        tarjeta.aviso.appendChild(U.el('span', { text: UI('Copia este enlace:') + ' ' }));
        var inp = U.el('input.card__url', {
          type: 'text', readonly: true, value: url, 'aria-label': 'Enlace a este enunciado'
        });
        tarjeta.aviso.appendChild(inp);
        inp.focus();
        inp.select();
      }
      try {
        navigator.clipboard.writeText(url).then(function () {
          tarjeta.aviso.textContent = 'Enlace copiado. Quien lo abra verá este mismo enunciado, ' +
            'con estos números: sirve para trabajarlo en clase o para preguntar una duda concreta.';
        }, manual);
      } catch (e) { manual(); }
    });
    return b;
  }

  /* Los deberes son una lista de enunciados concretos -tema, numero y
     semilla- que se guarda en el progreso y se comparte como un enlace.
     No hace falta servidor: el enlace LLEVA los deberes dentro. */
  Ex.deberes = function (lista) {
    if (lista === undefined) {
      var crudo = Progress.pref('deberes');
      return crudo ? Ex.leeDeberes(crudo) : [];
    }
    Progress.pref('deberes', Ex.codificaDeberes(lista));
    U.bus.emit('deberes', lista.length);
    return lista;
  };
  Ex.codificaDeberes = function (lista) {
    return lista.map(function (d) { return d.id + ':' + d.n + ':' + d.s; }).join('~');
  };
  Ex.leeDeberes = function (txt) {
    return String(txt || '').split('~').map(function (p) {
      var x = p.split(':');
      if (x.length !== 3) return null;
      var n = parseInt(x[1], 10), s = parseInt(x[2], 10);
      if (!x[0] || isNaN(n) || isNaN(s)) return null;
      return { id: x[0], n: n, s: s };
    }).filter(Boolean);
  };

  function botonDeberes(tarjeta) {
    var b = U.el('button.btn.btn--sm.btn--ghost', {
      type: 'button',
      title: 'Añadir este enunciado, con estos números, a una lista que se comparte como un enlace',
      html: '&#43; ' + UI('Deberes')
    });
    b.addEventListener('click', function () {
      var lista = Ex.deberes();
      var ya = lista.filter(function (d) {
        return d.id === tarjeta.topicId && d.n === tarjeta.index && d.s === tarjeta.seed;
      }).length;
      if (ya) {
        tarjeta.aviso.textContent = 'Ese enunciado ya estaba en la lista.';
        return;
      }
      lista.push({ id: tarjeta.topicId, n: tarjeta.index, s: tarjeta.seed });
      Ex.deberes(lista);
      U.clear(tarjeta.aviso);
      tarjeta.aviso.appendChild(U.el('span', {
        text: 'Añadido. La lista va por ' + lista.length + ' ' +
          U.plural(lista.length, 'enunciado', 'enunciados') + '. '
      }));
      tarjeta.aviso.appendChild(U.el('a', { href: '#/__deberes', text: UI('Ver los deberes y copiar el enlace →') }));
    });
    return b;
  }

  /** En un simulacro, de qué tema sale cada pregunta. */
  function origen(tarjeta) {
    if (!tarjeta.o.origen) return null;
    return U.el('span.tag.tag--origen', { text: tarjeta.o.origen, title: 'Tema del que sale esta pregunta' });
  }

  /* ============================== EJERCICIO ============================== */

  function Card(host, spec, topicId, index, o) {
    this.spec = spec;
    this.topicId = topicId;
    this.index = index;
    this.o = o || {};
    this.examen = !!this.o.examen;
    this.data = null;
    this.build(host);
    this.regen(this.o.semilla);
  }

  Card.prototype.build = function (host) {
    var self = this, s = this.spec;
    var lv = LEVEL[s.level || 'basico'] || LEVEL.basico;

    this.el = U.el('div.card.card--ex' + (this.examen ? '.is-examen' : ''));
    this.el.__card = this;
    this.head = U.el('div.card__head', null, [
      U.el('span.card__kind', { text: UI('Ejercicio práctico') }),
      U.el('span.card__title', { html: MathX.inline(s.title || 'Practica') }),
      U.el('span.card__spacer'),
      origen(this),
      U.el('span.tag.' + lv[0], { text: UI(lv[1]) })
    ]);
    this.body = U.el('div.card__body');
    this.preg = new Pregunta(s, {
      examen: this.examen,
      alComprobar: function (ok, primera) {
        if (self.examen) return;
        if (primera) Progress.answer(self.topicId, ok, self.index);
        self.paintScore();
      }
    });
    U.add(this.body, this.preg.nodos());

    this.score = U.el('span.card__score');
    this.bNew = U.el('button.btn.btn--main', { type: 'button', html: '&#8635; ' + UI('Otro ejercicio') });
    this.bNew.addEventListener('click', function () { self.regen(); });
    this.aviso = U.el('div.card__aviso', { role: 'status', 'aria-live': 'polite' });
    this.foot = U.el('div.card__foot', null, this.preg.botones().concat([
      U.el('span.card__spacer'), this.score, botonEnlace(this), botonDeberes(this), this.bNew
    ]));

    U.add(this.el, [this.head, this.body, this.examen ? null : this.foot, this.aviso]);
    host.appendChild(this.el);
  };

  Card.prototype.paintScore = function () {
    this.score.textContent = marcador(this.topicId, this.index);
  };

  /** Genera un enunciado nuevo. Con semilla, exactamente el mismo de antes. */
  Card.prototype.regen = function (semilla) {
    var s = this.spec;
    var r = U.rng(semilla);
    this.seed = r.seed;
    var guard = 0;
    do { this.data = s.gen ? s.gen(r) : {}; } while (this.data === null && ++guard < 40);
    this.preg.nueva(this.data, '<span class="qn">' + (this.o.numero || this.index) + '.</span>');
    // alias: quien toca la tarjeta desde fuera (tests.html, el simulacro)
    this.inputs = this.preg.inputs;
    this.verdict = this.preg.verdict;
    this.aviso.textContent = '';
    this.el.classList.remove('is-corregida');
    if (!this.examen) this.paintScore();
  };

  Card.prototype.check = function () { return this.preg.check(); };
  Card.prototype.showHint = function () { this.preg.showHint(); };
  Card.prototype.reveal = function () { this.preg.reveal(); };
  Card.prototype.respondida = function () { return hayAlgo(this.preg.values()); };

  /** Corrige de golpe, como al entregar un examen. Devuelve la nota (0 o 1). */
  Card.prototype.corregir = function () {
    var ok = !!this.preg.check(true);
    this.preg.reveal();
    this.preg.bloquea(true);
    this.el.classList.add('is-corregida');
    Progress.answer(this.topicId, ok, this.index);
    return ok ? 1 : 0;
  };

  /* ======================= PROBLEMA POR APARTADOS ======================= */

  function Problema(host, spec, topicId, index, o) {
    this.spec = spec;
    this.topicId = topicId;
    this.index = index;
    this.o = o || {};
    this.examen = !!this.o.examen;
    this.build(host);
    this.regen(this.o.semilla);
  }

  Problema.prototype.build = function (host) {
    var self = this, s = this.spec;
    var lv = LEVEL[s.level || 'medio'] || LEVEL.medio;
    var n = (s.partes || []).length;

    this.el = U.el('div.card.card--ex.card--prob' + (this.examen ? '.is-examen' : ''));
    this.el.__card = this;
    this.head = U.el('div.card__head', null, [
      U.el('span.card__kind', { text: UI('Ejercicio práctico') }),
      U.el('span.card__title', { html: MathX.inline(s.title || 'Problema') }),
      U.el('span.card__spacer'),
      origen(this),
      U.el('span.tag.tag--partes', { text: n + ' apartados' }),
      U.el('span.tag.' + lv[0], { text: UI(lv[1]) })
    ]);
    this.body = U.el('div.card__body');
    this.qEl = U.el('div.q');
    this.showEl = U.el('div');
    U.add(this.body, [this.qEl, this.showEl]);

    this.partes = [];
    (s.partes || []).forEach(function (ps, i) {
      var parte = { spec: ps };
      parte.caja = U.el('div.parte', { role: 'group', 'aria-label': 'Apartado ' + LETRAS[i] });
      parte.preg = new Pregunta(ps, {
        examen: self.examen,
        bien: i < n - 1
          ? '<strong>¡Correcto!</strong> Sigue con el apartado siguiente.'
          : '<strong>¡Correcto!</strong> Con esto el problema está terminado.',
        alComprobar: function (ok, primera) {
          if (primera) parte.limpia = ok;
          if (ok) self._avanza(i);
          else self.paintScore();
        },
        alConsultar: function () {
          if (parte.limpia === undefined) parte.limpia = false;
          self._avanza(i);
        }
      });
      U.add(parte.caja, parte.preg.nodos());
      parte.caja.appendChild(U.el('div.parte__cerrojo', {
        text: UI('Este apartado se abre al resolver o consultar el anterior: casi siempre usa su resultado.')
      }));
      if (!self.examen) parte.caja.appendChild(U.el('div.parte__pie', null, parte.preg.botones()));
      self.partes.push(parte);
      self.body.appendChild(parte.caja);
    });

    this.score = U.el('span.card__score');
    this.bNew = U.el('button.btn.btn--main', { type: 'button', html: '&#8635; ' + UI('Otro problema') });
    this.bNew.addEventListener('click', function () { self.regen(); });
    this.aviso = U.el('div.card__aviso', { role: 'status', 'aria-live': 'polite' });
    this.foot = U.el('div.card__foot', null, [
      U.el('span.card__spacer'), this.score, botonEnlace(this), botonDeberes(this), this.bNew
    ]);
    U.add(this.el, [this.head, this.body, this.examen ? null : this.foot, this.aviso]);
    host.appendChild(this.el);
  };

  Problema.prototype.regen = function (semilla) {
    var s = this.spec, self = this;
    var r = U.rng(semilla);
    this.seed = r.seed;
    var guard = 0;
    do { this.data = s.gen ? s.gen(r) : {}; } while (this.data === null && ++guard < 40);
    var intro = s.intro ? s.intro(this.data) : (s.ask ? s.ask(this.data) : '');
    this.qEl.innerHTML = '<span class="qn">' + (this.o.numero || this.index) + '.</span>' + MathX.inline(intro);
    if (global.W && W.pintaBloques) W.pintaBloques(this.qEl);
    U.clear(this.showEl);
    if (s.show) s.show(this.data, this.showEl);
    this.apuntado = false;
    this.partes.forEach(function (p, i) {
      p.hecha = false;
      p.limpia = undefined;
      p.caja.classList.remove('is-hecha');
      p.preg.nueva(self.data, '<span class="parte__letra">' + LETRAS[i] + ')</span>');
      if (i > 0 && !self.examen) self._cierra(p); else self._abre(p);
    });
    this.aviso.textContent = '';
    this.el.classList.remove('is-corregida');
    this.paintScore();
  };

  Problema.prototype._abre = function (p) {
    p.cerrada = false;
    p.caja.classList.remove('is-cerrada');
    p.caja.removeAttribute('inert');
    p.preg.bloquea(false);
  };
  Problema.prototype._cierra = function (p) {
    p.cerrada = true;
    p.caja.classList.add('is-cerrada');
    p.caja.setAttribute('inert', '');
    p.preg.bloquea(true);
  };

  Problema.prototype._avanza = function (i) {
    var p = this.partes[i];
    p.hecha = true;
    p.caja.classList.add('is-hecha');
    var sig = this.partes[i + 1];
    if (sig && sig.cerrada) this._abre(sig);
    this.paintScore();
    if (this.examen || this.apuntado) return;
    if (!this.partes.every(function (x) { return x.hecha; })) return;
    // Se apunta una vez, al terminar: cuenta como acierto si cada apartado
    // salió bien a la primera y sin consultar.
    this.apuntado = true;
    Progress.answer(this.topicId, this.partes.every(function (x) { return x.limpia === true; }), this.index);
    this.paintScore();
  };

  Problema.prototype.paintScore = function () {
    if (this.examen) return;
    var bien = this.partes.filter(function (p) { return p.preg.resuelta; }).length;
    var txt = 'apartados: ' + bien + ' de ' + this.partes.length;
    var m = marcador(this.topicId, this.index);
    this.score.textContent = m ? txt + ' · ' + m : txt;
  };

  /** Todos los apartados de la pregunta, para quien quiera recorrerlos. */
  Problema.prototype.check = function () { return this.partes[0] ? this.partes[0].preg.check() : null; };
  Problema.prototype.respondida = function () {
    return this.partes.some(function (p) { return hayAlgo(p.preg.values()); });
  };

  /** Corrige todos los apartados de golpe. Devuelve la fraccion acertada. */
  Problema.prototype.corregir = function () {
    var bien = 0;
    this.partes.forEach(function (p) {
      if (p.preg.check(true)) bien++;
      p.preg.reveal();
      p.preg.bloquea(true);
    });
    this.el.classList.add('is-corregida');
    Progress.answer(this.topicId, bien === this.partes.length, this.index);
    return this.partes.length ? bien / this.partes.length : 0;
  };

  Ex.card = function (host, spec, topicId, index, o) { return new Card(host, spec, topicId, index, o); };
  Ex.problema = function (host, spec, topicId, index, o) { return new Problema(host, spec, topicId, index, o); };
  Ex.Pregunta = Pregunta;
  global.Ex = Ex;
})(window);
