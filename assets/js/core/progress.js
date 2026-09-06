/* ===================================================================
   Matebase · progress.js
   Progreso del alumno en localStorage. Tolerante a fallos: si el
   navegador bloquea el almacenamiento, el curso sigue funcionando.
   =================================================================== */
(function (global) {
  'use strict';

  var KEY = 'matebase.progress.v1';
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
    return data.t[id];
  };
  P.visit = function (id) { var t = P.topic(id); t.seen = (t.seen || 0) + 1; save(); U.bus.emit('progress', id); };
  P.answer = function (id, correct) {
    var t = P.topic(id);
    t.tries++; if (correct) t.ok++;
    save(); U.bus.emit('progress', id);
  };
  /** Estado para el indice: '', 'seen' o 'done'. */
  P.state = function (id) {
    var t = data.t[id];
    if (!t || !t.seen) return '';
    return (t.ok >= 5) ? 'done' : 'seen';
  };
  P.stats = function () {
    var seen = 0, done = 0, ok = 0, tries = 0;
    for (var k in data.t) {
      var t = data.t[k];
      if (t.seen) seen++;
      if (t.ok >= 5) done++;
      ok += t.ok || 0; tries += t.tries || 0;
    }
    return { seen: seen, done: done, ok: ok, tries: tries };
  };
  P.reset = function () { data.t = {}; save(); U.bus.emit('progress', null); };

  P.pref = function (k, v) {
    if (v === undefined) return data[k];
    data[k] = v; save();
    return v;
  };
  P.openBlock = function (id, v) {
    if (v === undefined) return data.open[id];
    data.open[id] = v; save();
  };

  global.Progress = P;
})(window);
