/* ===================================================================
   Matebase · progress.js
   Progreso del alumno en localStorage. Tolerante a fallos: si el
   navegador bloquea el almacenamiento, el curso sigue funcionando.

   Por cada tema se guarda:
     seen    veces que se ha abierto
     ok      ejercicios resueltos (en total)
     tries   intentos (en total)
     nex     cuantos TIPOS de ejercicio tiene el tema (lo apunta app.js
             la primera vez que lo construye)
     ex      por tipo de ejercicio: { ok, tries, racha, last, prox }

   «Dominar» un tema significa haber resuelto al menos una vez CADA tipo de
   ejercicio que tiene. Antes bastaban cinco aciertos cualesquiera, y se
   podia dominar el tema de matrices resolviendo cinco determinantes 2×2 sin
   haber tocado la inversa.
   =================================================================== */
(function (global) {
  'use strict';

  var KEY = 'matebase.progress.v1';
  var DIA = 86400000;
  /* Repaso espaciado. Cada acierto seguido aleja el siguiente repaso; un
     fallo devuelve el ejercicio a la cola del dia. Los intervalos son los
     clasicos de la curva del olvido: lo que se recuerda al dia siguiente, a
     los tres dias y a la semana ya no se va. */
  var INTERVALOS = [1, 3, 7, 16, 35];

  var data = { t: {}, theme: null, open: {} };

  try {
    var raw = localStorage.getItem(KEY);
    if (raw) data = JSON.parse(raw) || data;
    if (!data.t) data.t = {};
    if (!data.open) data.open = {};
  } catch (e) { /* sin almacenamiento: memoria volatil */ }

  var save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { }
  };

  var P = {};

  P.topic = function (id) {
    if (!data.t[id]) data.t[id] = { seen: 0, ok: 0, tries: 0 };
    if (!data.t[id].ex) data.t[id].ex = {};
    return data.t[id];
  };

  P.visit = function (id) {
    var t = P.topic(id);
    t.seen = (t.seen || 0) + 1;
    data.ultimo = id;
    save();
    U.bus.emit('progress', id);
  };

  /** Apunta un intento. `n` es el numero del ejercicio dentro del tema. */
  P.answer = function (id, correct, n) {
    var t = P.topic(id);
    t.tries++;
    if (correct) t.ok++;
    if (n) {
      var e = t.ex[n] || (t.ex[n] = { ok: 0, tries: 0, racha: 0 });
      var ahora = Date.now();
      e.tries++;
      if (correct) {
        e.ok++;
        e.racha = (e.racha || 0) + 1;
        e.last = ahora;
        e.prox = ahora + INTERVALOS[Math.min(e.racha, INTERVALOS.length) - 1] * DIA;
      } else {
        e.racha = 0;
        e.prox = ahora;
      }
    }
    save();
    U.bus.emit('progress', id);
  };

  /** Cuantos tipos de ejercicio tiene el tema. */
  P.tipos = function (id, n) {
    var t = P.topic(id);
    if (t.nex === n) return;
    t.nex = n;
    save();
  };

  /** { tipos, resueltos }: cuantos tipos hay y de cuantos se ha acertado alguno. */
  P.dominio = function (id) {
    var t = data.t[id];
    if (!t) return { tipos: 0, resueltos: 0 };
    var r = 0;
    for (var k in (t.ex || {})) if (t.ex[k].ok > 0 && (!t.nex || +k <= t.nex)) r++;
    return { tipos: t.nex || 0, resueltos: r };
  };

  /** Estado para el indice: '', 'seen' o 'done'. */
  P.state = function (id) {
    var t = data.t[id];
    if (!t || (!t.seen && !t.tries)) return '';
    if (t.nex !== undefined) {
      if (!t.nex) return 'seen';                 // un tema sin ejercicios se ve, no se domina
      return P.dominio(id).resueltos >= t.nex ? 'done' : 'seen';
    }
    return (t.ok >= 5) ? 'done' : 'seen';        // tema aun sin construir en este navegador
  };

  P.stats = function () {
    var seen = 0, done = 0, ok = 0, tries = 0;
    for (var k in data.t) {
      var t = data.t[k];
      if (t.seen) seen++;
      if (P.state(k) === 'done') done++;
      ok += t.ok || 0; tries += t.tries || 0;
    }
    return { seen: seen, done: done, ok: ok, tries: tries };
  };

  /** Ejercicios cuyo repaso ya toca, del mas atrasado al menos. */
  P.pendientes = function (max) {
    var ahora = Date.now(), out = [];
    for (var id in data.t) {
      if (id.charAt(0) === '_') continue;        // pruebas internas
      var ex = data.t[id].ex || {};
      for (var n in ex) {
        var e = ex[n];
        if (e.tries && e.prox !== undefined && e.prox <= ahora) {
          out.push({ id: id, n: +n, prox: e.prox, racha: e.racha || 0, fallado: !e.racha });
        }
      }
    }
    out.sort(function (a, b) { return a.prox - b.prox; });
    return max ? out.slice(0, max) : out;
  };

  /** El ultimo tema abierto, para «continuar donde lo dejaste». */
  P.ultimo = function () { return data.ultimo || null; };

  P.reset = function () {
    data.t = {};
    data.ultimo = null;
    save();
    U.bus.emit('progress', null);
  };

  P.pref = function (k, v) {
    if (v === undefined) return data[k];
    data[k] = v; save();
    return v;
  };
  P.openBlock = function (id, v) {
    if (v === undefined) return data.open[id];
    data.open[id] = v; save();
  };

  P.INTERVALOS = INTERVALOS;
  global.Progress = P;
})(window);
