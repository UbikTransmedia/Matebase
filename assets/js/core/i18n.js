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
    d.ui = d.ui || {}; d.cur = d.cur || {}; d.glos = d.glos || {}; d.txt = d.txt || {};
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

  I18N.usar = function (codigo) {
    if (!idiomas[codigo]) codigo = 'es';
    actual = codigo;
    dic = (codigo === 'es') ? null : idiomas[codigo];
    document.documentElement.setAttribute('lang', idiomas[codigo].lang || codigo);
    return codigo;
  };

  /* ---------- las cuatro puertas de traduccion ---------- */

  /** Textos de la interfaz: botones, avisos, etiquetas. */
  I18N.ui = function (s) {
    if (!dic) return s;
    return (dic.ui[s] !== undefined) ? dic.ui[s] : s;
  };

  /** Prosa del curso. Se llama desde MathX.inline, el embudo de todo texto. */
  I18N.trad = function (s) {
    if (!dic || typeof s !== 'string') return s;
    var v = dic.txt[s];
    return (v !== undefined) ? v : s;
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
