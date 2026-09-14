/* ===================================================================
   Matebase · i18n.js
   LOCALIZACIÓN. El curso está escrito una sola vez, en castellano, y ese
   texto hace de clave. Cada idioma es un diccionario que traduce esas
   claves; lo que no esté traducido cae al original y se avisa.

   Consecuencia práctica, que es el motivo de hacerlo así: para corregir
   una frase mal traducida no hay que buscar en 96 archivos multiplicados
   por los idiomas, sino cambiar UNA entrada en UN diccionario. Y añadir
   un idioma es añadir un archivo, sin tocar ni una línea del curso.

   Un diccionario tiene cuatro secciones, todas opcionales:

     I18N.add('en', {
       nombre: 'English',        // como se llama el idioma EN ese idioma
       lang:   'en',             // el atributo lang= del documento
       ui:   { 'Glosario': 'Glossary', ... },        // botones y avisos
       cur:  { 'ar-naturales': { t: '...', r: '...', o: [...] }, ... },
       glos: { 'Supremo': { t: 'Supremum', d: '...' }, ... },
       txt:  { 'Una sucesión es…': 'A sequence is…', ... }   // la prosa
     });

   El castellano no necesita diccionario: es el original.
   =================================================================== */
(function (global) {
  'use strict';

  var I18N = {};
  var idiomas = {};          // codigo -> diccionario
  var actual = 'es';
  var dic = null;            // diccionario activo, o null si es el original

  /* El castellano siempre esta, porque es la lengua en la que esta escrito
     el curso. Los demas se registran solos al cargar su archivo. */
  idiomas.es = { nombre: 'Español', lang: 'es', ui: {}, cur: {}, glos: {}, txt: {} };

  I18N.add = function (codigo, d) {
    d = d || {};
    d.ui = d.ui || {}; d.cur = d.cur || {}; d.glos = d.glos || {};
    d.txt = d.txt || {}; d.frag = d.frag || {};
    idiomas[codigo] = d;
    if (codigo === actual) dic = (codigo === 'es') ? null : d;
  };

  /** Los idiomas instalados, en el orden en que se registraron. */
  I18N.lista = function () {
    var out = [];
    for (var k in idiomas) out.push({ codigo: k, nombre: idiomas[k].nombre || k });
    return out;
  };

  I18N.actual = function () { return actual; };

  /** El diccionario crudo de un idioma. Lo usa la bateria de pruebas para
      comprobar que ninguna clave apunta a un tema que ya no existe: una
      clave huerfana no rompe nada -la entrada no se usa nunca- y por eso
      hay que buscarla a proposito. */
  I18N.diccionario = function (codigo) { return idiomas[codigo] || null; };

  I18N.usar = function (codigo) {
    if (!idiomas[codigo]) codigo = 'es';
    actual = codigo;
    dic = (codigo === 'es') ? null : idiomas[codigo];
    document.documentElement.setAttribute('lang', idiomas[codigo].lang || codigo);
    if (I18N.contexto) I18N.contexto(I18N.contexto());   // rehace los pedazos
    return codigo;
  };

  /* ---------- las cuatro puertas de traduccion ---------- */

  /* Lo que se ha pedido traducir y no estaba. Un hueco en la interfaz no
     rompe nada -sale la frase en castellano- y por eso no se descubre
     mirando: hay que preguntar. `I18N.faltan()` en la consola contesta,
     despues de haber paseado por el curso, que frases quedan por traducir
     en el idioma puesto. */
  var huecos = {};

  /** Textos de la interfaz: botones, avisos, etiquetas. */
  I18N.ui = function (s) {
    if (!dic) return s;
    if (dic.ui[s] !== undefined) return dic.ui[s];
    huecos[actual + '\u0000' + s] = 1;
    return s;
  };

  /** Las frases de interfaz que se han pedido y no estaban, en este idioma. */
  I18N.faltan = function (codigo) {
    var c = codigo || actual, out = [];
    for (var k in huecos) {
      var i = k.indexOf('\u0000');
      if (k.slice(0, i) === c) out.push(k.slice(i + 1));
    }
    return out.sort();
  };

  /* El tema que se esta pintando. Lo necesita la traduccion por pedazos:
     ver `I18N.trad`. */
  var tema = null, pedazos = null;
  I18N.contexto = function (id) {
    if (arguments.length) tema = id || null;
    /* La lista de pedazos del tema mas la general, ya unidas: se arma una
       vez al entrar y no en cada frase, que por aqui pasa la pagina entera. */
    pedazos = null;
    if (dic && tema && dic.frag && dic.hechos && dic.hechos[tema]) {
      pedazos = (dic.frag[tema] || []).concat(dic.frag['@'] || []);
    }
    return tema;
  };

  /** Prosa del curso. Se llama desde MathX.inline, el embudo de todo texto.

      Casi toda la prosa es un literal fijo y se busca entera. Pero los
      cuadros de resultado de las demos y los enunciados de los ejercicios
      se arman al vuelo con numeros dentro -«Estás en $4$. Anterior: $3$»-
      y no tienen clave posible: cambian en cada tirada. Para esos, el
      diccionario guarda los PEDAZOS de texto que rodean a los numeros
      (`d.frag`, por tema) y aqui se sustituyen uno a uno, de mas largo a
      mas corto para que un pedazo no se coma el principio de otro. */
  I18N.trad = function (s) {
    if (!dic || typeof s !== 'string') return s;
    var v = dic.txt[s];
    if (v !== undefined) return v;
    /* Solo en un tema traducido. En uno que sigue en castellano, sustituir
       pedazos sueltos daria una frase mitad y mitad, peor que la original. */
    var fr = pedazos;
    if (!fr) return s;
    for (var i = 0; i < fr.length; i++) {
      /* Un pedazo es la pareja [espanol, ingles], o solo el espanol cuando
         su traduccion ya vive en `txt` y no hace falta repetirla. */
      var f = fr[i], a = (typeof f === 'string') ? f : f[0];
      if (s.indexOf(a) < 0) continue;
      var b = (typeof f === 'string') ? dic.txt[a] : f[1];
      if (b) s = s.split(a).join(b);
    }
    return s;
  };

  /** Un tema del temario: titulo, resumen y objetivos. */
  I18N.tema = function (t) {
    if (!dic) return t;
    var v = dic.cur[t.id];
    if (!v) return t;
    var out = { id: t.id, t: v.t || t.t, r: v.r || t.r, o: v.o || t.o };
    for (var k in t) if (out[k] === undefined) out[k] = t[k];
    return out;
  };

  /** Un bloque: titulo y descripcion. */
  I18N.bloque = function (b) {
    if (!dic) return b;
    var v = dic.cur['@' + b.id];
    if (!v) return b;
    var out = {};
    for (var k in b) out[k] = b[k];
    if (v.title) out.title = v.title;
    if (v.desc) out.desc = v.desc;
    return out;
  };

  /** Una entrada del glosario. */
  I18N.glosario = function (e) {
    if (!dic) return e;
    var v = dic.glos[e.t];
    if (!v) return e;
    var out = {};
    for (var k in e) out[k] = e[k];
    if (v.t) out.t = v.t;
    if (v.d) out.d = v.d;
    if (v.v) out.v = v.v;
    return out;
  };

  /** ¿Está traducida la prosa de este tema, o va a salir en castellano? */
  I18N.temaTraducido = function (id) {
    if (!dic) return true;
    return !!(dic.hechos && dic.hechos[id]);
  };

  /** Cuántos temas tienen la prosa traducida en el idioma activo. */
  I18N.cuantosTraducidos = function () {
    if (!dic || !dic.hechos) return 0;
    var n = 0;
    for (var k in dic.hechos) n++;
    return n;
  };

  global.I18N = I18N;
})(window);
