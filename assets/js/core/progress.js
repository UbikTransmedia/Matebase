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

  /* Las dos funciones de arriba miran `data.t`, que es el progreso de QUIEN
     esta usando el curso. Para la vista de clase hace falta lo mismo sobre un
     progreso ajeno, recien leido de un archivo, asi que se separan: `estadoEn`
     y `dominioEn` trabajan sobre el mapa que se les pase. */
  function dominioEn(t) {
    if (!t) return { tipos: 0, resueltos: 0 };
    var r = 0;
    for (var k in (t.ex || {})) if (t.ex[k].ok > 0 && (!t.nex || +k <= t.nex)) r++;
    return { tipos: t.nex || 0, resueltos: r };
  }
  function estadoEn(t) {
    if (!t || (!t.seen && !t.tries)) return '';
    if (t.nex !== undefined) {
      if (!t.nex) return 'seen';
      return dominioEn(t).resueltos >= t.nex ? 'done' : 'seen';
    }
    return (t.ok >= 5) ? 'done' : 'seen';
  }
  P.estadoEn = estadoEn;
  P.dominioEn = dominioEn;

  P.stats = function (mapa) {
    var m = mapa || data.t;
    var seen = 0, done = 0, ok = 0, tries = 0;
    for (var k in m) {
      var t = m[k];
      if (k.charAt(0) === '_') continue;
      if (t.seen) seen++;
      if (estadoEn(t) === 'done') done++;
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

  /* ---------------- llevarse el progreso ----------------
     El progreso vive en el navegador, y eso tiene dos consecuencias malas:
     se pierde al cambiar de ordenador, y quien enseña no ve nada. Las dos
     se arreglan con lo mismo y sin servidor: que el progreso sea un TEXTO
     que se copia, se guarda en un archivo y se vuelve a leer. */

  var FORMATO = 1;

  P.exporta = function (nombre) {
    return JSON.stringify({
      matebase: FORMATO,
      version: global.MATEBASE_VERSION || '',
      fecha: new Date().toISOString().slice(0, 10),
      nombre: String(nombre || '').slice(0, 60),
      ultimo: data.ultimo || null,
      t: data.t
    });
  };

  /** Lee un texto exportado SIN aplicarlo. Devuelve {ok, datos|error}. */
  P.lee = function (texto) {
    var o;
    try { o = JSON.parse(String(texto || '').trim()); }
    catch (e) { return { ok: false, error: 'Eso no es un progreso de Matebase: el texto no se entiende.' }; }
    if (!o || typeof o !== 'object') return { ok: false, error: 'El archivo está vacío o no es lo que parece.' };
    if (!o.matebase) return { ok: false, error: 'Falta la marca de Matebase: ¿seguro que es un archivo de progreso?' };
    if (o.matebase > FORMATO) {
      return { ok: false, error: 'Ese archivo lo escribió una versión más nueva del curso. Actualiza antes de leerlo.' };
    }
    if (!o.t || typeof o.t !== 'object') return { ok: false, error: 'El archivo no trae ningún tema.' };
    return { ok: true, datos: o };
  };

  /** Aplica un progreso leido. `modo` es 'reemplazar' o 'fundir'. */
  P.importa = function (texto, modo) {
    var r = P.lee(texto);
    if (!r.ok) return r;
    var nuevo = r.datos.t;
    if (modo === 'fundir') {
      for (var id in nuevo) {
        var a = data.t[id], b = nuevo[id];
        if (!a) { data.t[id] = b; continue; }
        /* Al fundir gana lo mas avanzado, nunca lo mas reciente: nadie
           quiere que abrir el curso en el movil le borre lo del portatil. */
        a.seen = Math.max(a.seen || 0, b.seen || 0);
        a.ok = Math.max(a.ok || 0, b.ok || 0);
        a.tries = Math.max(a.tries || 0, b.tries || 0);
        if (b.nex !== undefined) a.nex = b.nex;
        a.ex = a.ex || {};
        for (var n in (b.ex || {})) {
          var ea = a.ex[n], eb = b.ex[n];
          if (!ea) { a.ex[n] = eb; continue; }
          ea.ok = Math.max(ea.ok || 0, eb.ok || 0);
          ea.tries = Math.max(ea.tries || 0, eb.tries || 0);
          if ((eb.racha || 0) > (ea.racha || 0)) { ea.racha = eb.racha; ea.last = eb.last; ea.prox = eb.prox; }
        }
      }
    } else {
      data.t = nuevo;
      if (r.datos.ultimo) data.ultimo = r.datos.ultimo;
    }
    save();
    U.bus.emit('progress', null);
    return { ok: true, temas: Object.keys(nuevo).length, nombre: r.datos.nombre || '' };
  };

  /** Resumen de un progreso cualquiera, para poner varios en una tabla. */
  P.resumen = function (mapa) {
    var m = mapa || data.t;
    var st = P.stats(m);
    var porBloque = {};
    if (global.CURRICULUM) {
      CURRICULUM.forEach(function (b) {
        var vistos = 0, hechos = 0;
        b.temas.forEach(function (t) {
          var e = estadoEn(m[t.id]);
          if (e) vistos++;
          if (e === 'done') hechos++;
        });
        porBloque[b.id] = { n: b.n, title: b.title, total: b.temas.length, vistos: vistos, hechos: hechos };
      });
    }
    return { vistos: st.seen, dominados: st.done, ok: st.ok, intentos: st.tries, bloques: porBloque };
  };

  P.INTERVALOS = INTERVALOS;
  P.FORMATO = FORMATO;
  global.Progress = P;
})(window);
