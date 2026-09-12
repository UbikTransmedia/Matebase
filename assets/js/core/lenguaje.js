/* ===================================================================
   Matebase · lenguaje.js
   PIZCA, el lenguaje del bloque. Se llama así porque es lo justo: siete
   palabras, cuatro operaciones y seis comparaciones. Y corre de verdad,
   de dos maneras distintas, que es lo que el bloque quiere enseñar.

       fun doble(n) { vuelve n * 2; }
       sea x = 3;
       mientras x > 0 {
         muestra doble(x);
         x = x - 1;
       }

   EL CAMINO COMPLETO, que es el índice del tramo B:

       texto  →  tokens  →  árbol  →  ┬→  intérprete  →  salida
                                      └→  ensamblador →  MÁQUINA → salida

   Las dos salidas tienen que ser la misma. Eso no es un deseo: es una
   prueba que corre en tests.html con una batería de programas, y es la
   forma de saber que el compilador no miente.

   DECISIONES:

   · PIZCA ES UN LENGUAJE DE OCHO BITS. Sus números son los de la
     máquina: enteros de -128 a 127, con vuelta al desbordar, y división
     entera. El intérprete desborda igual que la CPU a propósito, porque
     si no, las dos ramas del dibujo de arriba darían cosas distintas y
     la prueba diferencial no valdría nada.

   · NI `eval` NI `new Function` CON LO QUE ESCRIBE EL ALUMNO. Todo pasa
     por el analizador de este archivo. Es la regla del curso y además
     es el tema: quien construye el traductor no necesita atajos.

   · LAS FUNCIONES SE COMPILAN SALVANDO Y RESTAURANDO SUS HUECOS. La
     máquina no sabe leer una celda cuya dirección esté en otra celda,
     así que no hay marcos de pila de verdad. En su lugar, cada función
     tiene huecos fijos, y quien llama guarda los valores de esos huecos
     en la pila antes de la llamada y los devuelve a su sitio al volver.
     Con eso la recursión funciona, la pila crece una vez por llamada
     -que es justo lo que hay que ver- y el día que se pasa de 64,
     la máquina lo dice.
   =================================================================== */
(function (global) {
  'use strict';

  var LEN = {};

  LEN.NOMBRE = 'Pizca';
  LEN.PALABRAS = ['sea', 'si', 'sino', 'mientras', 'fun', 'vuelve', 'muestra'];

  /* ---------------- 1. el analizador léxico ----------------
     Trocear el texto en piezas con nombre. Cada token se queda con su
     línea, porque un error sin número de línea no sirve de nada. */
  var DOBLES = ['==', '!=', '<=', '>='];
  var SIMPLES = '+-*/()<>={};,';

  LEN.tokeniza = function (texto) {
    var src = String(texto == null ? '' : texto);
    var tokens = [], errores = [], i = 0, linea = 1;

    function esLetra(c) { return /[A-Za-z_]/.test(c); }
    function esNum(c) { return /[0-9]/.test(c); }

    while (i < src.length) {
      var c = src.charAt(i);
      if (c === '\n') { linea++; i++; continue; }
      if (/\s/.test(c)) { i++; continue; }
      if (c === '#' || (c === '/' && src.charAt(i + 1) === '/')) {      // comentario
        while (i < src.length && src.charAt(i) !== '\n') i++;
        continue;
      }
      if (esNum(c)) {
        var n = '';
        while (i < src.length && esNum(src.charAt(i))) { n += src.charAt(i); i++; }
        tokens.push({ t: 'num', v: parseInt(n, 10), texto: n, linea: linea });
        continue;
      }
      if (esLetra(c)) {
        var p = '';
        while (i < src.length && /[A-Za-z0-9_]/.test(src.charAt(i))) { p += src.charAt(i); i++; }
        tokens.push({ t: LEN.PALABRAS.indexOf(p) >= 0 ? 'palabra' : 'nombre', v: p, texto: p, linea: linea });
        continue;
      }
      var dos = src.substr(i, 2);
      if (DOBLES.indexOf(dos) >= 0) {
        tokens.push({ t: 'op', v: dos, texto: dos, linea: linea });
        i += 2; continue;
      }
      if (SIMPLES.indexOf(c) >= 0) {
        tokens.push({ t: 'op', v: c, texto: c, linea: linea });
        i++; continue;
      }
      errores.push({ linea: linea, msg: 'no sé qué es «' + c + '»' });
      i++;
    }
    tokens.push({ t: 'fin', v: '', texto: '', linea: linea });
    return { tokens: tokens, errores: errores };
  };

  /* ---------------- 2. el analizador sintáctico ----------------
     Descenso recursivo: una función por regla de la gramática, y la
     precedencia sale del orden en que se llaman unas a otras. */
  LEN.analiza = function (texto) {
    var lex = LEN.tokeniza(texto);
    if (lex.errores.length) return { ast: null, errores: lex.errores, tokens: lex.tokens };

    var ts = lex.tokens, k = 0, errores = [];
    function mira() { return ts[k]; }
    function come() { return ts[k++]; }
    function es(v) { var t = ts[k]; return (t.t === 'op' || t.t === 'palabra') && t.v === v; }
    function fallo(msg) {
      if (!errores.length) errores.push({ linea: mira().linea, msg: msg });
      throw { corte: true };
    }
    function exige(v) {
      if (!es(v)) fallo('esperaba «' + v + '» y he encontrado ' + (mira().t === 'fin' ? 'el final del programa' : '«' + mira().texto + '»'));
      return come();
    }

    /* --- expresiones, de menos a más fuerte --- */
    var COMPARA = ['<', '>', '<=', '>=', '==', '!='];
    function expr() { return comparacion(); }
    function comparacion() {
      var i = suma();
      while (mira().t === 'op' && COMPARA.indexOf(mira().v) >= 0) {
        var op = come().v;
        i = { t: 'bin', op: op, i: i, d: suma() };
      }
      return i;
    }
    function suma() {
      var i = producto();
      while (mira().t === 'op' && (mira().v === '+' || mira().v === '-')) {
        var op = come().v;
        i = { t: 'bin', op: op, i: i, d: producto() };
      }
      return i;
    }
    function producto() {
      var i = unario();
      while (mira().t === 'op' && (mira().v === '*' || mira().v === '/')) {
        var op = come().v;
        i = { t: 'bin', op: op, i: i, d: unario() };
      }
      return i;
    }
    function unario() {
      if (es('-')) { come(); return { t: 'neg', e: unario() }; }
      return atomo();
    }
    function atomo() {
      var t = mira();
      if (t.t === 'num') { come(); return { t: 'num', v: t.v }; }
      if (t.t === 'nombre') {
        come();
        if (es('(')) {
          come();
          var args = [];
          if (!es(')')) {
            args.push(expr());
            while (es(',')) { come(); args.push(expr()); }
          }
          exige(')');
          return { t: 'llamada', n: t.v, args: args, linea: t.linea };
        }
        return { t: 'var', n: t.v, linea: t.linea };
      }
      if (es('(')) { come(); var e = expr(); exige(')'); return e; }
      fallo('aquí esperaba un número, un nombre o un paréntesis, y hay ' +
        (t.t === 'fin' ? 'el final del programa' : '«' + t.texto + '»'));
    }

    /* --- sentencias --- */
    function bloque() {
      exige('{');
      var ss = [];
      while (!es('}') && mira().t !== 'fin') ss.push(sentencia());
      exige('}');
      return { t: 'bloque', ss: ss };
    }
    function sentencia() {
      var t = mira();
      if (es('sea')) {
        come();
        if (mira().t !== 'nombre') fallo('después de «sea» va un nombre');
        var n = come().v;
        exige('=');
        var e = expr();
        exige(';');
        return { t: 'sea', n: n, e: e, linea: t.linea };
      }
      if (es('muestra')) { come(); var em = expr(); exige(';'); return { t: 'muestra', e: em, linea: t.linea }; }
      if (es('vuelve')) { come(); var ev = expr(); exige(';'); return { t: 'vuelve', e: ev, linea: t.linea }; }
      if (es('si')) {
        come();
        var c = expr(), ent = bloque(), sino = null;
        if (es('sino')) { come(); sino = bloque(); }
        return { t: 'si', c: c, ent: ent, sino: sino, linea: t.linea };
      }
      if (es('mientras')) {
        come();
        var cm = expr(), cu = bloque();
        return { t: 'mientras', c: cm, cuerpo: cu, linea: t.linea };
      }
      if (es('fun')) {
        come();
        if (mira().t !== 'nombre') fallo('después de «fun» va el nombre de la función');
        var nf = come().v;
        exige('(');
        var ps = [];
        if (!es(')')) {
          if (mira().t !== 'nombre') fallo('los parámetros son nombres');
          ps.push(come().v);
          while (es(',')) {
            come();
            if (mira().t !== 'nombre') fallo('los parámetros son nombres');
            ps.push(come().v);
          }
        }
        exige(')');
        return { t: 'fun', n: nf, params: ps, cuerpo: bloque(), linea: t.linea };
      }
      if (t.t === 'nombre') {
        /* Una llamada puede ir sola, como sentencia: se hace y se tira lo
           que devuelva. Sin esto, una funcion que solo muestra cosas no se
           podria usar, y el mensaje de error hablaria de un «=» que no
           venia a cuento. */
        if (ts[k + 1] && ts[k + 1].t === 'op' && ts[k + 1].v === '(') {
          var ll = expr();
          exige(';');
          return { t: 'tirar', e: ll, linea: t.linea };
        }
        come();
        exige('=');
        var ea = expr();
        exige(';');
        return { t: 'asig', n: t.v, e: ea, linea: t.linea };
      }
      fallo('esto no empieza ninguna sentencia: ' +
        (t.t === 'fin' ? 'el programa se acaba antes de tiempo' : '«' + t.texto + '»'));
    }

    var prog = { t: 'programa', ss: [] };
    try {
      while (mira().t !== 'fin') prog.ss.push(sentencia());
    } catch (e) {
      if (!e || !e.corte) throw e;
      return { ast: null, errores: errores, tokens: ts };
    }
    return { ast: prog, errores: errores, tokens: ts };
  };

  /* ---------------- 3. el intérprete ----------------
     Recorre el árbol y va haciendo. El entorno es una cadena de
     diccionarios: se busca en el de dentro y, si no está, en el de
     fuera. Eso es todo lo que significa «ámbito». */
  function ocho(v) {
    var w = ((v % 256) + 256) % 256;
    return w > 127 ? w - 256 : w;
  }
  LEN.ocho = ocho;

  function Entorno(padre) { this.v = {}; this.padre = padre; }
  Entorno.prototype.busca = function (n) {
    var e = this;
    while (e) { if (Object.prototype.hasOwnProperty.call(e.v, n)) return e; e = e.padre; }
    return null;
  };

  LEN.evalua = function (ast, o) {
    o = o || {};
    var tope = o.tope || 20000;
    var salida = [], pasos = 0, funs = {}, parada = '';
    var raiz = new Entorno(null);

    function corta(msg) { throw { fin: true, msg: msg }; }
    function paso() { if (++pasos > tope) corta('se han dado ' + tope + ' pasos sin terminar: o es un bucle sin fin, o hace falta más cuerda'); }

    function valor(nodo, ent) {
      paso();
      switch (nodo.t) {
        case 'num': return ocho(nodo.v);
        case 'var': {
          var e = ent.busca(nodo.n);
          if (!e) corta('no hay ninguna variable que se llame «' + nodo.n + '»');
          return e.v[nodo.n];
        }
        case 'neg': return ocho(-valor(nodo.e, ent));
        case 'bin': {
          var a = valor(nodo.i, ent), b = valor(nodo.d, ent);
          switch (nodo.op) {
            case '+': return ocho(a + b);
            case '-': return ocho(a - b);
            case '*': return ocho(a * b);
            case '/':
              if (b === 0) corta('se ha intentado dividir entre cero');
              return ocho(Math.trunc(a / b));
            case '<': return a < b ? 1 : 0;
            case '>': return a > b ? 1 : 0;
            case '<=': return a <= b ? 1 : 0;
            case '>=': return a >= b ? 1 : 0;
            case '==': return a === b ? 1 : 0;
            case '!=': return a !== b ? 1 : 0;
          }
          corta('operador desconocido: ' + nodo.op);
          break;
        }
        case 'llamada': {
          var f = funs[nodo.n];
          if (!f) corta('no hay ninguna función que se llame «' + nodo.n + '»');
          if (f.params.length !== nodo.args.length) {
            corta('«' + nodo.n + '» necesita ' + f.params.length + ' ' +
              (f.params.length === 1 ? 'dato' : 'datos') + ' y le has dado ' + nodo.args.length);
          }
          var hijo = new Entorno(raiz);
          f.params.forEach(function (pn, idx) { hijo.v[pn] = valor(nodo.args[idx], ent); });
          try {
            ejecuta(f.cuerpo, hijo);
          } catch (x) {
            if (x && x.vuelve) return x.valor;
            throw x;
          }
          return 0;                                   // función sin `vuelve`
        }
      }
      corta('no sé evaluar esto');
    }

    function ejecuta(nodo, ent) {
      paso();
      switch (nodo.t) {
        case 'programa': case 'bloque':
          for (var i = 0; i < nodo.ss.length; i++) ejecuta(nodo.ss[i], ent);
          return;
        case 'fun': funs[nodo.n] = nodo; return;
        case 'sea': ent.v[nodo.n] = valor(nodo.e, ent); return;
        case 'asig': {
          var e = ent.busca(nodo.n);
          if (!e) corta('no hay ninguna variable que se llame «' + nodo.n + '». Para crearla, «sea ' + nodo.n + ' = ...;»');
          e.v[nodo.n] = valor(nodo.e, ent);
          return;
        }
        case 'muestra':
          if (salida.length >= 200) corta('el programa ha escrito más de 200 números: seguramente es un bucle sin fin');
          salida.push(valor(nodo.e, ent));
          return;
        case 'tirar': valor(nodo.e, ent); return;
        case 'vuelve': throw { vuelve: true, valor: valor(nodo.e, ent) };
        case 'si':
          if (valor(nodo.c, ent)) ejecuta(nodo.ent, ent);
          else if (nodo.sino) ejecuta(nodo.sino, ent);
          return;
        case 'mientras':
          while (valor(nodo.c, ent)) { ejecuta(nodo.cuerpo, ent); paso(); }
          return;
      }
      corta('no sé ejecutar esto');
    }

    /* Las funciones se apuntan antes, para poder llamarlas desde arriba. */
    ast.ss.forEach(function (s) { if (s.t === 'fun') funs[s.n] = s; });

    try {
      ejecuta(ast, raiz);
      parada = 'el programa ha terminado';
    } catch (x) {
      if (x && x.vuelve) parada = 'el programa ha terminado';
      else if (x && x.fin) parada = x.msg;
      else throw x;
    }
    return { salida: salida, pasos: pasos, porQue: parada, funs: Object.keys(funs) };
  };

  /* ---------------- 4. el compilador ----------------
     Un recorrido en postorden: izquierda, METE, derecha, operación. La
     máquina está hecha para que esa frase sea literalmente el
     compilador de las expresiones. */
  LEN.compila = function (ast) {
    var out = [], errores = [], n = 0, huecos = {}, funs = {};
    function eti() { return 'L' + (n++); }
    function pon(s) { out.push(s); }
    function hueco(nombre) { huecos[nombre] = 1; return nombre; }

    ast.ss.forEach(function (s) { if (s.t === 'fun') funs[s.n] = s; });

    /* Los huecos de una función: sus parámetros y todo lo que declare
       dentro con `sea`. Se buscan una vez y se usan en cada llamada. */
    function declaradas(nodo, lista) {
      if (!nodo || typeof nodo !== 'object') return lista;
      if (nodo.t === 'sea' && lista.indexOf(nodo.n) < 0) lista.push(nodo.n);
      ['ss', 'args'].forEach(function (k) {
        if (nodo[k]) nodo[k].forEach(function (x) { declaradas(x, lista); });
      });
      ['e', 'c', 'ent', 'sino', 'cuerpo', 'i', 'd'].forEach(function (k) {
        if (nodo[k]) declaradas(nodo[k], lista);
      });
      return lista;
    }
    function huecosDe(f) {
      if (!f.__huecos) f.__huecos = f.params.concat(declaradas(f.cuerpo, []));
      return f.__huecos.map(function (x) { return f.n + '_' + x; });
    }

    /* En qué celda vive un nombre: dentro de una función, en su hueco;
       fuera, en el global. */
    function celda(nombre, ctx) {
      if (ctx && ctx.locales.indexOf(nombre) >= 0) return hueco(ctx.f.n + '_' + nombre);
      return hueco('g_' + nombre);
    }

    function expr(e, ctx) {
      switch (e.t) {
        case 'num': pon('NUM ' + ocho(e.v)); return;
        case 'var': pon('CARGA ' + celda(e.n, ctx)); return;
        case 'neg': pon('NUM 0'); pon('METE'); expr(e.e, ctx); pon('RESTA'); return;
        case 'bin': return binaria(e, ctx);
        case 'llamada': return llamada(e, ctx);
      }
      errores.push({ linea: e.linea || 0, msg: 'no sé compilar esto' });
    }

    function binaria(e, ctx) {
      var op = e.op;
      /* Las cuatro operaciones son directas: izquierda, METE, derecha, op. */
      var DIRECTA = { '+': 'SUMA', '-': 'RESTA', '*': 'MULT', '/': 'DIV' };
      if (DIRECTA[op]) {
        expr(e.i, ctx); pon('METE'); expr(e.d, ctx); pon(DIRECTA[op]);
        return;
      }
      /* Comparar: la máquina solo sabe «menor». Las demás salen dándole
         la vuelta a los operandos o negando el resultado. */
      if (op === '<' || op === '>') {
        if (op === '<') { expr(e.i, ctx); pon('METE'); expr(e.d, ctx); }
        else { expr(e.d, ctx); pon('METE'); expr(e.i, ctx); }
        pon('MENOR');
        return;
      }
      if (op === '>=' || op === '<=') {
        /* a >= b es «no (a < b)» */
        if (op === '>=') { expr(e.i, ctx); pon('METE'); expr(e.d, ctx); }
        else { expr(e.d, ctx); pon('METE'); expr(e.i, ctx); }
        pon('MENOR');
        niega();
        return;
      }
      if (op === '==' || op === '!=') {
        expr(e.i, ctx); pon('METE'); expr(e.d, ctx); pon('RESTA');   // 0 si iguales
        if (op === '==') { cero(); } else { cero(); niega(); }
        return;
      }
      errores.push({ linea: e.linea || 0, msg: 'no sé compilar el operador ' + op });
    }

    /* Deja 1 si el acumulador valía 0, y 0 si no. */
    function cero() {
      var a = eti(), b = eti();
      pon('SICERO ' + a);
      pon('NUM 0');
      pon('SALTA ' + b);
      pon(a + ':');
      pon('NUM 1');
      pon(b + ':');
    }
    /* Cambia un 0 por un 1 y cualquier otra cosa por un 0. */
    function niega() { cero(); }

    function llamada(e, ctx) {
      var f = funs[e.n];
      if (!f) { errores.push({ linea: e.linea || 0, msg: 'no hay ninguna función que se llame «' + e.n + '»' }); return; }
      if (f.params.length !== e.args.length) {
        errores.push({ linea: e.linea || 0, msg: '«' + e.n + '» necesita ' + f.params.length + ' datos y le has dado ' + e.args.length });
        return;
      }
      var hs = huecosDe(f);
      /* 1) salvar los huecos de la función en la pila, por si ya estamos
            dentro de ella: esto es lo que hace posible la recursión. */
      hs.forEach(function (h) { pon('CARGA ' + hueco(h)); pon('METE'); });
      /* 2) calcular los argumentos y METERLOS EN LA PILA, no en celdas
            temporales. Con celdas no valdria: un argumento puede ser
            otra llamada a la misma funcion, y esa llamada usaria las
            mismas celdas y pisaria el argumento ya calculado. La pila
            no tiene ese problema porque cada nivel usa su propio sitio.
            Despues se sacan al reves, que es el orden en que salen. */
      e.args.forEach(function (a) { expr(a, ctx); pon('METE'); });
      for (var k = e.args.length - 1; k >= 0; k--) {
        pon('SACA');
        pon('GUARDA ' + hueco(f.n + '_' + f.params[k]));
      }
      /* 3) llamar */
      pon('LLAMA f_' + f.n);
      /* 4) devolver los huecos a su sitio sin perder el resultado */
      pon('GUARDA ' + hueco('ret'));
      hs.slice().reverse().forEach(function (h) { pon('SACA'); pon('GUARDA ' + hueco(h)); });
      pon('CARGA ' + hueco('ret'));
    }

    function sent(s, ctx) {
      switch (s.t) {
        case 'programa': case 'bloque':
          s.ss.forEach(function (x) { sent(x, ctx); });
          return;
        case 'fun': return;                                   // se emiten al final
        case 'sea': case 'asig':
          expr(s.e, ctx);
          pon('GUARDA ' + celda(s.n, ctx));
          return;
        case 'muestra': expr(s.e, ctx); pon('MUESTRA'); return;
        case 'tirar': expr(s.e, ctx); return;          // se hace y se tira
        case 'vuelve':
          if (!ctx) { errores.push({ linea: s.linea || 0, msg: '«vuelve» solo tiene sentido dentro de una función' }); return; }
          expr(s.e, ctx);
          pon('VUELVE');
          return;
        case 'si': {
          var fin = eti();
          expr(s.c, ctx);
          if (s.sino) {
            var otra = eti();
            pon('SICERO ' + otra);
            sent(s.ent, ctx);
            pon('SALTA ' + fin);
            pon(otra + ':');
            sent(s.sino, ctx);
            pon(fin + ':');
          } else {
            pon('SICERO ' + fin);
            sent(s.ent, ctx);
            pon(fin + ':');
          }
          return;
        }
        case 'mientras': {
          var ini = eti(), sal = eti();
          pon(ini + ':');
          expr(s.c, ctx);
          pon('SICERO ' + sal);
          sent(s.cuerpo, ctx);
          pon('SALTA ' + ini);
          pon(sal + ':');
          return;
        }
      }
      errores.push({ linea: s.linea || 0, msg: 'no sé compilar esta sentencia' });
    }

    /* --- el programa principal --- */
    ast.ss.forEach(function (s) { sent(s, null); });
    pon('PARA');

    /* --- y detrás, una por una, las funciones --- */
    Object.keys(funs).forEach(function (nf) {
      var f = funs[nf];
      var ctx = { f: f, locales: f.params.concat(declaradas(f.cuerpo, [])) };
      pon('f_' + nf + ':');
      sent(f.cuerpo, ctx);
      pon('NUM 0');                      // si se acaba sin `vuelve`, devuelve 0
      pon('VUELVE');
    });

    return { texto: out.join('\n'), errores: errores, huecos: Object.keys(huecos) };
  };

  /* ---------------- 5. optimizar ----------------
     Dos mejoras que se entienden de un vistazo y se notan en la cuenta:
     plegar lo que ya se sabe, y tirar lo que no se ejecuta nunca. */
  LEN.optimiza = function (nodo, cuenta) {
    cuenta = cuenta || { plegadas: 0, muertas: 0 };
    if (!nodo || typeof nodo !== 'object') return nodo;

    if (nodo.t === 'bin') {
      nodo.i = LEN.optimiza(nodo.i, cuenta);
      nodo.d = LEN.optimiza(nodo.d, cuenta);
      if (nodo.i.t === 'num' && nodo.d.t === 'num') {
        var a = nodo.i.v, b = nodo.d.v, v = null;
        switch (nodo.op) {
          case '+': v = ocho(a + b); break;
          case '-': v = ocho(a - b); break;
          case '*': v = ocho(a * b); break;
          case '/': v = (b === 0) ? null : ocho(Math.trunc(a / b)); break;
          case '<': v = a < b ? 1 : 0; break;
          case '>': v = a > b ? 1 : 0; break;
          case '<=': v = a <= b ? 1 : 0; break;
          case '>=': v = a >= b ? 1 : 0; break;
          case '==': v = a === b ? 1 : 0; break;
          case '!=': v = a !== b ? 1 : 0; break;
        }
        if (v !== null) { cuenta.plegadas++; return { t: 'num', v: v }; }
      }
      return nodo;
    }
    if (nodo.t === 'neg') {
      nodo.e = LEN.optimiza(nodo.e, cuenta);
      if (nodo.e.t === 'num') { cuenta.plegadas++; return { t: 'num', v: ocho(-nodo.e.v) }; }
      return nodo;
    }
    if (nodo.t === 'si') {
      nodo.c = LEN.optimiza(nodo.c, cuenta);
      nodo.ent = LEN.optimiza(nodo.ent, cuenta);
      if (nodo.sino) nodo.sino = LEN.optimiza(nodo.sino, cuenta);
      /* Una condición que ya se sabe convierte el `si` en una de sus
         ramas, y la otra desaparece: eso es código muerto. */
      if (nodo.c.t === 'num') {
        cuenta.muertas++;
        return nodo.c.v ? nodo.ent : (nodo.sino || { t: 'bloque', ss: [] });
      }
      return nodo;
    }
    if (nodo.t === 'mientras') {
      nodo.c = LEN.optimiza(nodo.c, cuenta);
      nodo.cuerpo = LEN.optimiza(nodo.cuerpo, cuenta);
      if (nodo.c.t === 'num' && !nodo.c.v) { cuenta.muertas++; return { t: 'bloque', ss: [] }; }
      return nodo;
    }
    ['ss', 'args'].forEach(function (k) {
      if (nodo[k]) nodo[k] = nodo[k].map(function (x) { return LEN.optimiza(x, cuenta); });
    });
    ['e', 'cuerpo'].forEach(function (k) {
      if (nodo[k]) nodo[k] = LEN.optimiza(nodo[k], cuenta);
    });
    return nodo;
  };

  /* Copia profunda, para poder optimizar sin estropear el original. */
  LEN.copia = function (n) {
    if (!n || typeof n !== 'object') return n;
    if (Array.isArray(n)) return n.map(LEN.copia);
    var o = {};
    Object.keys(n).forEach(function (k) { if (k.slice(0, 2) !== '__') o[k] = LEN.copia(n[k]); });
    return o;
  };

  /* ---------------- 6. el árbol, escrito ---------------- */
  var SIGNO = { sea: '=', asig: '=', muestra: 'muestra', vuelve: 'vuelve' };
  LEN.arbolTexto = function (nodo, sangria) {
    var s = sangria || '';
    if (!nodo) return '';
    var hijos = [], cab = '';
    switch (nodo.t) {
      case 'programa': cab = 'programa'; hijos = nodo.ss; break;
      case 'bloque': cab = 'bloque'; hijos = nodo.ss; break;
      case 'num': return s + nodo.v + '\n';
      case 'var': return s + nodo.n + '\n';
      case 'neg': cab = 'negar'; hijos = [nodo.e]; break;
      case 'bin': cab = nodo.op; hijos = [nodo.i, nodo.d]; break;
      case 'llamada': cab = 'llamar ' + nodo.n; hijos = nodo.args; break;
      case 'sea': cab = 'sea ' + nodo.n + ' ' + SIGNO.sea; hijos = [nodo.e]; break;
      case 'asig': cab = nodo.n + ' ' + SIGNO.asig; hijos = [nodo.e]; break;
      case 'muestra': cab = 'muestra'; hijos = [nodo.e]; break;
      case 'tirar': cab = 'hacer y tirar'; hijos = [nodo.e]; break;
      case 'vuelve': cab = 'vuelve'; hijos = [nodo.e]; break;
      case 'si': cab = 'si'; hijos = nodo.sino ? [nodo.c, nodo.ent, nodo.sino] : [nodo.c, nodo.ent]; break;
      case 'mientras': cab = 'mientras'; hijos = [nodo.c, nodo.cuerpo]; break;
      case 'fun': cab = 'fun ' + nodo.n + '(' + nodo.params.join(', ') + ')'; hijos = [nodo.cuerpo]; break;
      default: cab = nodo.t;
    }
    var txt = s + cab + '\n';
    hijos.forEach(function (h) { txt += LEN.arbolTexto(h, s + '  '); });
    return txt;
  };

  /* ---------------- 7. correr, de las dos maneras ---------------- */
  LEN.corre = function (texto, o) {
    o = o || {};
    var r = LEN.analiza(texto);
    if (r.errores.length) return { errores: r.errores, salida: [] };
    if (o.optimiza) r.ast = LEN.optimiza(LEN.copia(r.ast));
    if (o.compilado) {
      var c = LEN.compila(r.ast);
      if (c.errores.length) return { errores: c.errores, salida: [], asm: c.texto };
      var m = MAQ.ejecuta(c.texto, null, o.tope);
      return {
        errores: m.errores, salida: m.salida, porQue: m.porQue,
        asm: c.texto, pasos: m.pasos, desbordo: m.desbordo
      };
    }
    var e = LEN.evalua(r.ast, o);
    return { errores: [], salida: e.salida, porQue: e.porQue, pasos: e.pasos };
  };

  /** La prueba que sostiene el tramo B: interpretar y compilar tienen
      que dar lo mismo. Devuelve las dos salidas para poder enseñarlas. */
  LEN.diferencial = function (texto, o) {
    var i = LEN.corre(texto, o);
    var c = LEN.corre(texto, { compilado: true, tope: (o && o.tope) || 8000, optimiza: o && o.optimiza });
    return {
      interpretado: i.salida, compilado: c.salida,
      iguales: !i.errores.length && !c.errores.length &&
        i.salida.length === c.salida.length &&
        i.salida.every(function (v, k) { return v === c.salida[k]; }),
      errores: i.errores.concat(c.errores), asm: c.asm,
      porQueI: i.porQue, porQueC: c.porQue
    };
  };

  /** Corrección por comportamiento, como en los otros dos instrumentos. */
  LEN.iguales = function (texto, casos, o) {
    o = o || {};
    var r = LEN.analiza(texto);
    if (r.errores.length) {
      var e = r.errores[0];
      return { ok: false, porQue: 'Línea ' + e.linea + ': ' + e.msg };
    }
    for (var i = 0; i < casos.length; i++) {
      var c = casos[i];
      var pre = (c.antes || '') + texto;
      var res = LEN.corre(pre, { tope: o.tope });
      if (res.errores.length) return { ok: false, porQue: 'Línea ' + res.errores[0].linea + ': ' + res.errores[0].msg };
      var esp = c.salida || [];
      if (res.salida.length !== esp.length || res.salida.some(function (v, k) { return v !== esp[k]; })) {
        return {
          ok: false,
          porQue: (c.antes ? 'Empezando con «' + c.antes.trim() + '», esperaba ' : 'Esperaba ') +
            'que escribiera ' + (esp.length ? esp.join(', ') : 'nada') + ' y ha escrito ' +
            (res.salida.length ? res.salida.join(', ') : 'nada') + '.'
        };
      }
    }
    return { ok: true, porQue: '' };
  };

  /* ---------------- 8. coloreado ---------------- */
  function escapa(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var RE_TOK = /#[^\n]*|\/\/[^\n]*|\b\d+\b|[A-Za-z_][A-Za-z0-9_]*|[^\sA-Za-z0-9_]+|\s+/g;

  LEN.pinta = function (texto) {
    var src = String(texto == null ? '' : texto), out = '', m;
    RE_TOK.lastIndex = 0;
    while ((m = RE_TOK.exec(src))) {
      var t = m[0], c = null, ch = t.charAt(0);
      if (ch === '#' || t.slice(0, 2) === '//') c = 'com';
      else if (/^\d+$/.test(t)) c = 'num';
      else if (LEN.PALABRAS.indexOf(t) >= 0) c = 'key';
      else if (/^[A-Za-z_]/.test(t)) c = 'uni';
      else if (/^\s+$/.test(t)) c = null;
      else c = 'pun';
      out += c ? '<span class="cod-' + c + '">' + escapa(t) + '</span>' : escapa(t);
    }
    return out;
  };

  /* ---------------- 9. la batería ----------------
     Programas que cubren cada pieza del lenguaje, y que en tests.html
     se corren por los dos caminos para comprobar que dan lo mismo. */
  LEN.EJEMPLOS = {
    cuentas: { t: 'cuentas y precedencia', texto: 'muestra 2 + 3 * 4;\nmuestra (2 + 3) * 4;\nmuestra 20 / 6;\nmuestra -3 + 10;' },
    variables: { t: 'variables', texto: 'sea x = 7;\nsea y = x * 2;\nx = x + 1;\nmuestra x;\nmuestra y;' },
    decision: { t: 'decidir', texto: 'sea x = 9;\nsi x > 5 { muestra 1; } sino { muestra 0; }\nsi x == 9 { muestra 99; }' },
    bucle: { t: 'repetir', texto: 'sea i = 1;\nmientras i <= 5 {\n  muestra i;\n  i = i + 1;\n}' },
    funcion: { t: 'una función', texto: 'fun doble(n) { vuelve n * 2; }\nmuestra doble(4);\nmuestra doble(doble(3));' },
    recursion: { t: 'recursión', texto: 'fun fact(n) {\n  si n < 2 { vuelve 1; }\n  vuelve n * fact(n - 1);\n}\nmuestra fact(5);' },
    fib: { t: 'fibonacci, con dos llamadas', texto: 'fun fib(n) {\n  si n < 2 { vuelve n; }\n  vuelve fib(n - 1) + fib(n - 2);\n}\nmuestra fib(7);' },
    comparar: { t: 'las seis comparaciones', texto: 'sea a = 3;\nsea b = 5;\nmuestra a < b;\nmuestra a > b;\nmuestra a <= b;\nmuestra a >= b;\nmuestra a == b;\nmuestra a != b;' },
    dosArgs: { t: 'dos parámetros', texto: 'fun suma(a, b) { vuelve a + b; }\nmuestra suma(3, 4);\nmuestra suma(suma(1, 2), 10);' },
    procedimiento: { t: 'una función que solo muestra', texto: 'fun cuenta(n) {\n  sea i = 1;\n  mientras i <= n {\n    muestra i;\n    i = i + 1;\n  }\n}\ncuenta(3);\nmuestra 0;' },
    anidado: { t: 'bucle con decisión dentro', texto: 'sea i = 1;\nsea s = 0;\nmientras i <= 6 {\n  si i * 2 > 6 { s = s + i; }\n  i = i + 1;\n}\nmuestra s;' }
  };

  /* ================================================================
     EL WIDGET: cuatro paneles del mismo texto
     ================================================================ */
  /* `value` y no `v`: es el nombre que espera W.chips, y con otro se queda
     con la etiqueta visible, que lleva tilde y no casa con el codigo. */
  var PANELES = [
    { value: 'tokens', label: 'tokens' },
    { value: 'arbol', label: 'árbol' },
    { value: 'asm', label: 'ensamblador' },
    { value: 'maquina', label: 'máquina' }
  ];

  function Taller(host, o) {
    o = o || {};
    this.o = o;
    this.original = (o.texto || '').replace(/^\n/, '');
    this.panel = o.panel || 'tokens';
    this.build(host);
  }

  Taller.prototype.build = function (host) {
    var self = this, o = this.o;
    this.el = U.el('div.len');
    this.el.__len = this;

    this.caja = U.el('div.shd__caja.shd__caja--prog');
    this.capa = U.el('pre.shd__pinta', { 'aria-hidden': 'true' });
    this.caja.appendChild(this.capa);
    this.ed = U.el('textarea.shd__ed', {
      spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off',
      'aria-label': 'Programa en ' + LEN.NOMBRE,
      rows: String(Math.max(4, this.original.split('\n').length + 1))
    });
    this.ed.value = this.original;
    this.caja.appendChild(this.ed);
    this.el.appendChild(this.caja);
    this.ed.addEventListener('input', function () { self.repinta(); self.recalcula(); self.guarda(); });
    this.ed.addEventListener('scroll', function () {
      self.capa.scrollTop = self.ed.scrollTop; self.capa.scrollLeft = self.ed.scrollLeft;
    });

    this.aviso = U.el('div.len__aviso', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(this.aviso);

    var lista = PANELES.filter(function (x) { return !o.paneles || o.paneles.indexOf(x.value) >= 0; });
    this.chips = W.chips(W.row(this.el), lista, {
      value: this.panel,
      on: function (v) { self.panel = v; self.pintaPanel(); }
    });

    this.cuerpo = U.el('pre.len__panel', { tabindex: '0', role: 'region', 'aria-label': 'Panel del traductor' });
    this.el.appendChild(this.cuerpo);

    if (o.nota) this.el.appendChild(U.el('p.len__nota', { html: MathX.inline(o.nota) }));

    host.appendChild(this.el);

    if (o.id && global.Progress) {
      var g = Progress.pref('len:' + o.id);
      if (g) this.ed.value = g;
    }
    this.repinta();
    this.recalcula();
  };

  Taller.prototype.guarda = function () {
    if (this.o.id && global.Progress) Progress.pref('len:' + this.o.id, this.ed.value);
  };

  Taller.prototype.repinta = function () {
    this.capa.innerHTML = LEN.pinta(this.ed.value) + '\n';
    this.capa.scrollTop = this.ed.scrollTop;
    this.capa.scrollLeft = this.ed.scrollLeft;
  };

  Taller.prototype.recalcula = function () {
    var texto = this.ed.value;
    this.r = LEN.analiza(texto);
    if (this.o.optimiza && this.r.ast) {
      this.cuenta = { plegadas: 0, muertas: 0 };
      this.r.ast = LEN.optimiza(LEN.copia(this.r.ast), this.cuenta);
    }
    this.el.classList.toggle('len--roto', this.r.errores.length > 0);

    if (this.r.errores.length) {
      var e = this.r.errores[0];
      this.aviso.textContent = 'Línea ' + e.linea + ': ' + e.msg;
      this.cuerpo.textContent = '';
      return;
    }

    /* Con `avisa: 'poco'` el taller no corre nada: solo dice si el texto se
       entiende. Hace falta en los primeros temas del tramo, donde el alumno
       todavia no ha visto ni el interprete ni la maquina y cantarle las dos
       salidas seria contarle el final. */
    if (this.o.avisa === 'poco') {
      var ts = this.r.tokens.length - 1;
      this.aviso.textContent = 'Se entiende. ' + ts + ' ' + (ts === 1 ? 'pieza' : 'piezas') +
        ' y un árbol de ' + this.r.ast.ss.length + ' ' +
        (this.r.ast.ss.length === 1 ? 'sentencia' : 'sentencias') + '.';
      this.el.classList.remove('len--difiere');
      this.asm = LEN.compila(this.r.ast);
      this.salidaC = [];
      this.pintaPanel();
      return;
    }

    var i = LEN.evalua(this.r.ast, { tope: this.o.tope || 20000 });
    this.asm = LEN.compila(this.r.ast);
    var c = this.asm.errores.length
      ? { salida: [], porQue: 'línea ' + this.asm.errores[0].linea + ': ' + this.asm.errores[0].msg }
      : MAQ.ejecuta(this.asm.texto, null, this.o.tope || 8000);
    this.salidaI = i.salida;
    this.salidaC = c.salida || [];
    this.porQueI = i.porQue;
    this.porQueC = c.porQue;
    var mismas = this.salidaI.length === this.salidaC.length &&
      this.salidaI.every(function (v, k) { return v === c.salida[k]; });

    this.aviso.textContent =
      'Interpretado escribe: ' + (this.salidaI.length ? this.salidaI.join(', ') : 'nada') +
      ' · compilado y ejecutado en la máquina escribe: ' + (this.salidaC.length ? this.salidaC.join(', ') : 'nada') +
      (mismas ? ' · son lo mismo ✓' : ' · ¡NO coinciden!') +
      (i.porQue && i.porQue.indexOf('terminado') < 0 ? ' · ' + i.porQue : '');
    this.el.classList.toggle('len--difiere', !mismas);
    this.pintaPanel();
  };

  Taller.prototype.pintaPanel = function () {
    if (!this.r || this.r.errores.length) return;
    var txt = '';
    if (this.panel === 'tokens') {
      txt = this.r.tokens.filter(function (t) { return t.t !== 'fin'; })
        .map(function (t) { return t.t + '  ' + t.texto; }).join('\n');
    } else if (this.panel === 'arbol') {
      txt = LEN.arbolTexto(this.r.ast);
    } else if (this.panel === 'asm') {
      txt = this.asm.errores.length
        ? 'Línea ' + this.asm.errores[0].linea + ': ' + this.asm.errores[0].msg
        : this.asm.texto;
    } else {
      txt = 'Lo que escribe la máquina: ' + (this.salidaC.length ? this.salidaC.join(', ') : 'nada') +
        '\nInstrucciones generadas: ' + (this.asm.errores.length ? '—' : MAQ.ensambla(this.asm.texto).instrucciones) +
        (this.porQueC ? '\nCómo acabó: ' + this.porQueC : '') +
        (this.porQueI ? '\nInterpretándolo: ' + this.porQueI : '') +
        (this.cuenta ? '\nCuentas plegadas: ' + this.cuenta.plegadas + ' · trozos muertos quitados: ' + this.cuenta.muertas : '');
    }
    this.cuerpo.textContent = txt;
  };

  /* ================================================================
     EL ARBOL DIBUJADO, Y LA PILA
     El tramo del lenguaje se contaba entero con texto y sangrias, y hay dos
     cosas que se entienden mucho antes viendolas: la FORMA del arbol -que
     es donde vive la prioridad- y como sube y baja la PILA al recorrerlo.
     Las dos son el mismo paseo, asi que van en el mismo instrumento y
     avanzan a la vez.
     ================================================================ */

  /** Coloca el arbol: x por recorrido en orden, y por profundidad. */
  function coloca(nodo, estado) {
    estado = estado || { x: 0, nodos: [], hondo: 0 };
    function baja(n, prof) {
      if (!n) return null;
      var hijos = [];
      if (n.t === 'bin') hijos = [n.i, n.d];
      else if (n.t === 'neg') hijos = [n.e];
      else if (n.t === 'llamada') hijos = n.args;
      var izq = hijos.length ? baja(hijos[0], prof + 1) : null;
      var mio = { nodo: n, prof: prof, x: 0, hijos: [] };
      if (izq) mio.hijos.push(izq);
      if (!hijos.length) { mio.x = estado.x++; }
      else {
        for (var k = 1; k < hijos.length; k++) {
          var otro = baja(hijos[k], prof + 1);
          if (otro) mio.hijos.push(otro);
        }
        var xs = mio.hijos.map(function (h) { return h.x; });
        mio.x = xs.length ? (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2 : estado.x++;
      }
      estado.hondo = Math.max(estado.hondo, prof);
      estado.nodos.push(mio);
      return mio;
    }
    /* El recorrido de arriba ya visita los hijos antes que el padre, asi que
       `nodos` sale en POSTORDEN: el mismo orden en que se evalua y en que se
       compila. No es una casualidad aprovechada, es de lo que va el tema. */
    var raiz = baja(nodo, 0);
    return { raiz: raiz, nodos: estado.nodos, ancho: estado.x, hondo: estado.hondo };
  }

  /** Que escribe cada nudo. */
  function etiquetaDe(n) {
    if (n.t === 'num') return String(n.v);
    if (n.t === 'var') return n.n;
    if (n.t === 'bin') return n.op;
    if (n.t === 'neg') return '−';
    if (n.t === 'llamada') return n.n + '()';
    return n.t;
  }
  function esHoja(n) { return n.t === 'num' || n.t === 'var'; }

  function Arbol(host, o) {
    o = o || {};
    this.o = o;
    this.texto = o.texto || '2 + 3 * 4';
    this.paso = 0;
    this.build(host);
  }

  Arbol.prototype.build = function (host) {
    var self = this;
    this.el = U.el('div.arb');
    this.el.__arb = this;

    this.ed = U.el('input.card__url.arb__ed', {
      type: 'text', value: this.texto, spellcheck: 'false',
      'aria-label': 'Expresión que se dibuja'
    });
    this.ed.addEventListener('input', function () {
      self.texto = self.ed.value; self.paso = 0; self.recalcula();
    });
    this.el.appendChild(this.ed);

    this.aviso = U.el('div.arb__aviso', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(this.aviso);

    this.plot = W.plot(this.el, {
      xmin: 0, xmax: 10, ymin: 0, ymax: 6, height: this.o.alto || 240,
      axes: false, grid: false,
      /* `ariaFija` porque aqui no hay ejes: describir un eje horizontal de
         0 a 3 en un arbol no ayuda a nadie, y el aviso de arriba ya dice en
         texto por que paso va y como esta la pila. */
      ariaFija: {
        role: 'img',
        label: this.o.aria || 'Árbol de la expresión: las operaciones en los nudos y los números en las hojas, dibujado de abajo arriba.'
      },
      draw: function (g) { self.dibuja(g); }
    });

    this.pila = U.el('div.arb__pila');
    this.el.appendChild(this.pila);

    W.buttons(this.el, [
      { t: 'Un paso', on: function () { self.paso++; self.recalcula(); } },
      { t: '↦ Hasta el final', on: function () { self.paso = 999; self.recalcula(); } },
      { t: '↺ Volver al principio', on: function () { self.paso = 0; self.recalcula(); } }
    ]);

    if (this.o.nota) this.el.appendChild(U.el('p.arb__nota', { html: MathX.inline(this.o.nota) }));
    host.appendChild(this.el);
    this.recalcula();
  };

  Arbol.prototype.recalcula = function () {
    var r = LEN.analiza('muestra ' + this.texto + ';');
    this.el.classList.toggle('arb--roto', r.errores.length > 0);
    if (r.errores.length || !r.ast.ss.length) {
      this.disp = null;
      this.aviso.textContent = r.errores.length
        ? 'Línea ' + r.errores[0].linea + ': ' + r.errores[0].msg
        : 'Escribe una expresión, como «2 + 3 * 4».';
      U.clear(this.pila);
      this.plot.render();
      return;
    }
    this.disp = coloca(r.ast.ss[0].e);
    this.paso = Math.max(0, Math.min(this.paso, this.disp.nodos.length));
    /* Los limites se fijan AQUI, antes de pintar. Hacerlo dentro de `draw`
       llegaba tarde: la transformacion de coordenadas ya estaba hecha y el
       primer dibujo salia con los limites de antes. */
    var ancho = Math.max(1, this.disp.ancho), hondo = this.disp.hondo;
    this.plot.o.xmin = -0.7; this.plot.o.xmax = ancho - 0.3;
    this.plot.o.ymin = -0.6; this.plot.o.ymax = hondo + 0.6;
    this.simula();
    this.pintaPila();
    this.plot.render();
  };

  /** Recorre el postorden hasta `paso` llevando la pila, como en len-pila. */
  Arbol.prototype.simula = function () {
    var pila = [], rpn = [], alto = 0, roto = '';
    for (var i = 0; i < this.paso && i < this.disp.nodos.length; i++) {
      var n = this.disp.nodos[i].nodo;
      rpn.push(etiquetaDe(n));
      if (esHoja(n)) {
        pila.push(n.t === 'num' ? ocho(n.v) : NaN);
      } else if (n.t === 'neg') {
        var a = pila.pop();
        pila.push(isNaN(a) ? NaN : ocho(-a));
      } else if (n.t === 'bin') {
        var d = pila.pop(), z = pila.pop();
        if (isNaN(d) || isNaN(z)) pila.push(NaN);
        else {
          var v = { '+': z + d, '-': z - d, '*': z * d, '/': d === 0 ? NaN : Math.trunc(z / d) }[n.op];
          if (v === undefined) v = ({ '<': z < d, '>': z > d, '<=': z <= d, '>=': z >= d, '==': z === d, '!=': z !== d }[n.op]) ? 1 : 0;
          pila.push(isNaN(v) ? NaN : ocho(v));
        }
      } else { pila.push(NaN); roto = 'aquí no se evalúa'; }
      alto = Math.max(alto, pila.length);
    }
    this.estado = { pila: pila, rpn: rpn, alto: alto };
    var total = this.disp.nodos.length;
    this.aviso.textContent = this.paso === 0
      ? 'Sin empezar. ' + total + ' ' + U.plural(total, 'nudo', 'nudos') + ' que visitar, las hojas primero.'
      : 'Paso ' + this.paso + ' de ' + total + ' · en polaca inversa: ' + rpn.join(' ') +
        ' · altura máxima de la pila: ' + alto +
        (this.paso >= total && pila.length === 1 && !isNaN(pila[0]) ? ' · vale ' + pila[0] : '');
  };

  Arbol.prototype.pintaPila = function () {
    U.clear(this.pila);
    this.pila.appendChild(U.el('span.arb__et', { text: 'la pila' }));
    if (!this.estado.pila.length) {
      this.pila.appendChild(U.el('span.arb__vacia', { text: 'vacía' }));
      return;
    }
    /* Se dibuja de abajo arriba, como una pila de verdad: lo ultimo en
       entrar queda a la derecha, que es de donde se saca. */
    this.estado.pila.forEach(function (v, i, l) {
      this.pila.appendChild(U.el('span.arb__caja' + (i === l.length - 1 ? '.is-cima' : ''), {
        text: isNaN(v) ? '?' : String(v)
      }));
    }, this);
  };

  Arbol.prototype.dibuja = function (g) {
    if (!this.disp) return;
    var d = this.disp, hondo = d.hondo;
    function py(prof) { return hondo - prof; }
    var hechos = {};
    for (var i = 0; i < this.paso && i < d.nodos.length; i++) hechos[i] = 1;
    var actual = this.paso > 0 ? d.nodos[this.paso - 1] : null;

    /* Primero las ramas, para que los nudos las tapen. */
    d.nodos.forEach(function (m) {
      m.hijos.forEach(function (h) {
        g.seg(m.x, py(m.prof), h.x, py(h.prof), { color: 'axis', w: 1.4 });
      });
    });
    d.nodos.forEach(function (m, k) {
      var visto = hechos[k];
      var esActual = actual === m;
      var col = esActual ? 2 : (visto ? 'ok' : 'axis');
      var r = esHoja(m.nodo) ? 0.30 : 0.36;
      g.circle(m.x, py(m.prof), r, {
        fill: col, fillAlpha: esActual ? 0.35 : (visto ? 0.22 : 0.08),
        color: col, w: esActual ? 2.4 : 1.6
      });
      g.text(m.x, py(m.prof), etiquetaDe(m.nodo), {
        align: 'center', size: 13, bold: !esHoja(m.nodo),
        color: visto || esActual ? 'ink' : 'axis'
      });
    });
  };

  W.arbol = function (host, o) { return new Arbol(host, o); };

  W.lenguaje = function (host, o) { return new Taller(host, o); };
  W.programaPizcaIguales = LEN.iguales;
  W.pizcaPinta = LEN.pinta;

  global.LEN = LEN;
})(window);
