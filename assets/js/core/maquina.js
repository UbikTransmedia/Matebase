/* ===================================================================
   Matebase · maquina.js
   LA MÁQUINA DE JUGUETE. Una CPU de 8 bits con dieciocho instrucciones,
   que es lo que hace falta para que el tramo B del bloque tenga dónde
   aterrizar: el compilador del lenguaje genera exactamente esto.

       NUM 3
       METE
       NUM 4
       SUMA        ; el acumulador vale 7
       MUESTRA
       PARA

   DECISIONES, Y POR QUÉ:

   · MNEMÓNICOS EN CASTELLANO. El curso entero está en castellano y el
     alumno va a leer estos programas letra a letra. `CARGA` se entiende
     y `LDA` hay que memorizarlo.

   · CELDAS DE 8 BITS CON SIGNO, en complemento a dos: -128 a 127, y lo
     que se sale da la vuelta. No es una limitación que haya que
     disculpar, es el tema de maq-bits hecho carne; la máquina AVISA
     cuando desborda, para que se vea en vez de sospecharse.

   · PROGRAMA Y DATOS EN LA MISMA MEMORIA, como en la máquina de von
     Neumann. Un programa aquí no es otra cosa que números en celdas, y
     eso se ve: la tabla de memoria los enseña todos iguales. Las
     instrucciones ocupan una celda, o dos si llevan argumento, que es
     también lo que hacen las de verdad.

   · ACUMULADOR MÁS PILA. Las operaciones toman el operando izquierdo de
     la pila y el derecho del acumulador. Con eso, compilar un árbol es
     un recorrido en postorden y nada más: `izquierda, METE, derecha,
     operación`. El tramo B se apoya entero en esa frase.

   · UNA DIRECCIÓN ES UN DATO. `CARGAI` y `GUARDAI` leen y escriben en la
     celda cuya dirección está guardada en otra celda. Es la diferencia
     entre poder nombrar un sitio y poder calcularlo, y es lo que separa
     «tengo veinte variables» de «tengo una lista».

   · NADA SE CUELGA. Todo se ejecuta con un tope de pasos; al llegar, se
     para y se dice por qué. Un bucle infinito es un programa posible, y
     el alumno tiene que poder escribirlo sin romper la página.
   =================================================================== */
(function (global) {
  'use strict';

  /* Rotulos, ayudas y mensajes de error de la maquina: los lee una
     persona y pasan por el diccionario, en frases enteras con huecos.
     Lo que NO pasa es el ensamblador: los nemonicos (CARGA, GUARDA,
     SUMA) y los programas de ejemplo son el lenguaje de la maquina y se
     quedan como estan, igual que el codigo de cualquier otro lenguaje. */
  function UI(s) { return global.I18N ? I18N.ui(s) : s; }
  function con(s, vals) {
    var t = UI(s);
    for (var k in vals) t = t.split('{' + k + '}').join(vals[k]);
    return t;
  }

  var MAQ = {};

  /* ---------------- el juego de instrucciones ----------------
     Dieciocho. Las dieciséis primeras cabían en cuatro bits, que quedaba
     muy redondo; las dos últimas rompen esa cuenta y hacen falta cinco.
     Se rompió a sabiendas: con dieciséis no se podía calcular una
     dirección, y sin eso no hay listas, ni marcos de pila, ni quines.
     Un bit de más a cambio de todo eso es un buen cambio, y además es
     exactamente el tipo de decisión que se toma al diseñar un procesador.

     `arg` dice si la instrucción ocupa una celda o dos, y `tipo` para qué
     sirve el argumento, que es lo que permite distinguir una etiqueta mal
     escrita de una variable nueva. */
  var OPS = [
    { n: 'PARA', arg: false, q: 'detiene la máquina' },
    { n: 'NUM', arg: true, tipo: 'valor', q: 'pone ese número en el acumulador; con un nombre, pone la dirección de esa celda' },
    { n: 'CARGA', arg: true, tipo: 'dato', q: 'copia al acumulador lo que hay en esa celda' },
    { n: 'GUARDA', arg: true, tipo: 'dato', q: 'copia el acumulador a esa celda' },
    { n: 'METE', arg: false, q: 'mete el acumulador en la pila' },
    { n: 'SACA', arg: false, q: 'saca de la pila al acumulador' },
    { n: 'SUMA', arg: false, q: 'saca de la pila y le suma el acumulador' },
    { n: 'RESTA', arg: false, q: 'saca de la pila y le resta el acumulador' },
    { n: 'MULT', arg: false, q: 'saca de la pila y lo multiplica por el acumulador' },
    { n: 'DIV', arg: false, q: 'saca de la pila y lo divide por el acumulador, tirando los decimales' },
    { n: 'MENOR', arg: false, q: 'saca de la pila: deja 1 si era menor que el acumulador, y 0 si no' },
    { n: 'SALTA', arg: true, tipo: 'sitio', q: 'sigue por esa etiqueta' },
    { n: 'SICERO', arg: true, tipo: 'sitio', q: 'sigue por esa etiqueta solo si el acumulador vale 0' },
    { n: 'LLAMA', arg: true, tipo: 'sitio', q: 'guarda dónde estaba en la pila y salta ahí' },
    { n: 'VUELVE', arg: false, q: 'vuelve a donde dijo la última llamada' },
    { n: 'MUESTRA', arg: false, q: 'escribe el acumulador en la salida' },
    /* Las dos ultimas llegaron despues, y cambian lo que la maquina PUEDE
       hacer, no solo lo comoda que es. Sin ellas, una direccion no se puede
       calcular: hay que escribirla en el programa. Con ellas, una direccion
       es un dato como otro cualquiera, y de ahi salen las listas, los marcos
       de pila de verdad y los programas que se escriben a si mismos. */
    { n: 'CARGAI', arg: true, tipo: 'dato', q: 'mira qué dirección hay en esa celda y carga lo que haya ahí' },
    { n: 'GUARDAI', arg: true, tipo: 'dato', q: 'mira qué dirección hay en esa celda y guarda el acumulador ahí' }
  ];
  var POR_NOMBRE = {};
  OPS.forEach(function (o, i) { o.cod = i; POR_NOMBRE[o.n] = o; });
  MAQ.OPS = OPS;
  MAQ.NOMBRES = OPS.map(function (o) { return o.n; });

  MAQ.CELDAS = 256;          // la memoria entera
  MAQ.TOPE = 4000;           // pasos máximos por tirada

  /** Mete un entero en ocho bits con signo, dando la vuelta como haría
      el circuito de maq-bits. Devuelve también si se salió. */
  function ocho(v) {
    var w = ((v % 256) + 256) % 256;          // 0..255
    return w > 127 ? w - 256 : w;             // complemento a dos
  }
  MAQ.ocho = ocho;
  function desborda(v) { return v < -128 || v > 127; }

  /* ---------------- el ensamblador ----------------
     Dos pasadas: la primera coloca cada instrucción y apunta dónde cae
     cada etiqueta; la segunda resuelve los nombres. Hace falta que sean
     dos porque un salto hacia delante nombra una etiqueta que todavía
     no se ha visto, y ése es justamente el motivo por el que los
     ensambladores de verdad también hacen dos. */
  var RE_ETIQ = /^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/;
  var RE_NOM = /^[A-Za-z_][A-Za-z0-9_]*$/;

  MAQ.ensambla = function (texto) {
    var lineas = String(texto == null ? '' : texto).split('\n');
    var errores = [], celdas = [], etiquetas = {}, vars = {}, pendientes = [], tablas = {};
    var dir = 0;

    /* --- primera pasada: colocar --- */
    lineas.forEach(function (cruda, i) {
      var num = i + 1;
      var linea = cruda.replace(/[;#].*$/, '').replace(/\/\/.*$/, '').trim();
      if (!linea) return;

      /* Una etiqueta marca el sitio donde cae la siguiente instruccion.
         Puede ir sola en su linea o delante de una instruccion. */
      var me = RE_ETIQ.exec(linea);
      if (me) {
        if (etiquetas[me[1]] !== undefined) errores.push({ linea: num, msg: con('la etiqueta «{x}» ya estaba puesta más arriba', { x: me[1] }) });
        else etiquetas[me[1]] = dir;
        linea = me[2].trim();
        if (!linea) return;
      }

      var trozos = linea.split(/\s+/);
      var nom = trozos[0].toUpperCase();

      /* TABLA no es una instruccion: no se ejecuta y no ocupa sitio en el
         programa. Solo dice «resérvame n celdas seguidas y llámalas asi».
         Hace falta porque las celdas de datos se reparten de una en una, y
         sin esto no habria forma de pedir un trozo de memoria continuo,
         que es lo unico que distingue una lista de veinte variables. */
      if (nom === 'TABLA') {
        if (trozos.length !== 3) {
          errores.push({ linea: num, msg: UI('«TABLA» se escribe «TABLA nombre tamaño»') });
          return;
        }
        if (!RE_NOM.test(trozos[1])) {
          errores.push({ linea: num, msg: con('«{x}» no es un nombre válido para una tabla', { x: trozos[1] }) });
          return;
        }
        var tam = parseInt(trozos[2], 10);
        if (!/^\d+$/.test(trozos[2]) || tam < 1 || tam > MAQ.CELDAS) {
          errores.push({ linea: num, msg: con('el tamaño de una tabla es un número entre 1 y {n}', { n: MAQ.CELDAS }) });
          return;
        }
        if (tablas[trozos[1]] !== undefined) {
          errores.push({ linea: num, msg: con('la tabla «{x}» ya estaba declarada', { x: trozos[1] }) });
          return;
        }
        tablas[trozos[1]] = tam;
        return;
      }

      var op = POR_NOMBRE[nom];
      if (!op) {
        errores.push({ linea: num, msg: con('no existe la instrucción «{x}». Hay: {l}', { x: trozos[0], l: MAQ.NOMBRES.join(', ') }) });
        return;
      }
      if (!op.arg && trozos.length > 1) {
        errores.push({ linea: num, msg: con('«{x}» no lleva nada detrás', { x: nom }) });
        return;
      }
      if (op.arg && trozos.length < 2) {
        errores.push({ linea: num, msg: con(op.tipo === 'sitio' ? '«{x}» necesita un sitio al que ir'
            : (op.tipo === 'dato' ? '«{x}» necesita un nombre de celda' : '«{x}» necesita un número'), { x: nom }) });
        return;
      }
      if (trozos.length > 2) {
        errores.push({ linea: num, msg: con('«{x}» lleva una sola cosa detrás, no {n}', { x: nom, n: trozos.length - 1 }) });
        return;
      }
      celdas.push({ cod: op.cod, dir: dir, linea: num, op: op });
      dir++;
      if (op.arg) {
        celdas.push({ argDe: celdas.length - 1, dir: dir, linea: num, texto: trozos[1] });
        pendientes.push({ idx: celdas.length - 1, op: op, texto: trozos[1], linea: num });
        dir++;
      }
    });

    /* --- las variables van detrás del programa, por orden de aparición --- */
    var libre = dir;
    /* Las tablas van primero, para que sus celdas queden seguidas y no se
       mezclen con las variables sueltas. */
    Object.keys(tablas).forEach(function (n) {
      vars[n] = libre;
      libre += tablas[n];
    });
    pendientes.forEach(function (p) {
      /* `dato` reserva celda, y `valor` tambien cuando lo que trae es un
         nombre: `NUM tabla` significa «la DIRECCION de tabla», no su
         contenido. Sin eso no habria forma de meter una direccion en el
         acumulador, y las instrucciones indirectas no servirian de nada. */
      var esNombre = !/^-?\d+$/.test(p.texto) && RE_NOM.test(p.texto);
      if ((p.op.tipo === 'dato' || p.op.tipo === 'valor') && esNombre && vars[p.texto] === undefined) {
        vars[p.texto] = libre++;
      }
    });

    /* --- segunda pasada: resolver --- */
    pendientes.forEach(function (p) {
      var t = p.texto, v;
      if (/^-?\d+$/.test(t)) {
        v = parseInt(t, 10);
        if (p.op.tipo !== 'valor' && (v < 0 || v >= MAQ.CELDAS)) {
          errores.push({ linea: p.linea, msg: con('la celda {v} no existe: van de 0 a {n}', { v: v, n: MAQ.CELDAS - 1 }) });
          v = 0;
        }
        if (p.op.tipo === 'valor' && desborda(v)) {
          errores.push({ linea: p.linea, msg: con('el número {v} no cabe en ocho bits con signo: van de -128 a 127', { v: v }) });
          v = ocho(v);
        }
      } else if (!RE_NOM.test(t)) {
        errores.push({ linea: p.linea, msg: con('«{x}» no es ni un número ni un nombre', { x: t }) });
        v = 0;
      } else if (p.op.tipo === 'sitio') {
        if (etiquetas[t] === undefined) {
          errores.push({ linea: p.linea, msg: con('no hay ninguna etiqueta que se llame «{x}». Se pone escribiendo «{x}:» en su línea', { x: t }) });
          v = 0;
        } else v = etiquetas[t];
      } else if (p.op.tipo === 'dato' || p.op.tipo === 'valor') {
        /* En los dos casos sale la direccion de la celda. La diferencia esta
           en que hace la instruccion con ella: `CARGA x` va a buscar lo que
           hay ahi; `NUM x` se queda con el numero de la celda. */
        v = vars[t];
      } else {
        errores.push({ linea: p.linea, msg: con('«{op}» necesita un número, no el nombre «{x}»', { op: p.op.n, x: t }) });
        v = 0;
      }
      celdas[p.idx].valor = v;
    });

    if (libre >= MAQ.CELDAS) errores.push({ linea: lineas.length, msg: con('el programa y sus variables no caben en las {n} celdas de memoria', { n: MAQ.CELDAS }) });

    var imagen = [];
    celdas.forEach(function (c) { imagen[c.dir] = (c.argDe === undefined) ? c.cod : ocho(c.valor || 0); });

    return {
      celdas: celdas, imagen: imagen, etiquetas: etiquetas, vars: vars,
      fin: dir, libre: libre, errores: errores, tablas: tablas,
      instrucciones: celdas.filter(function (c) { return c.argDe === undefined; }).length
    };
  };

  /* ---------------- la máquina ---------------- */

  /** Estado nuevo a partir de un programa ya ensamblado. `datos` pone
      valores iniciales en las variables, que es como se le dan entradas
      a un programa sin inventar una instrucción de leer. */
  MAQ.nueva = function (asm, datos) {
    var mem = [], i;
    for (i = 0; i < MAQ.CELDAS; i++) mem[i] = 0;
    asm.imagen.forEach(function (v, k) { if (v !== undefined) mem[k] = v; });
    var m = {
      asm: asm, mem: mem, pc: 0, a: 0, pila: [], salida: [],
      parada: false, porQue: '', pasos: 0, ultima: null, desbordo: false
    };
    if (datos) {
      Object.keys(datos).forEach(function (n) {
        var d = (typeof n === 'string' && asm.vars[n] !== undefined) ? asm.vars[n] : parseInt(n, 10);
        if (d >= 0 && d < MAQ.CELDAS) m.mem[d] = ocho(datos[n]);
      });
    }
    return m;
  };

  /* El codigo `fin` es lo que mira el corrector; `porQue` es lo que lee
     el alumno, y por eso se traduce. Separarlos evita que traducir la
     frase cambie lo que el corrector da por bueno. */
  function para(m, fin, porQue) { m.parada = true; m.fin = fin; m.porQue = porQue; return m; }

  /** Un paso: buscar, decodificar, ejecutar. Los tres tiempos están
      separados a propósito, porque maq-cpu los cuenta así. */
  MAQ.paso = function (m) {
    if (m.parada) return m;
    if (m.pc < 0 || m.pc >= MAQ.CELDAS) return para(m, 'fuera', UI('el contador se ha ido fuera de la memoria'));

    var cod = m.mem[m.pc];                       // BUSCAR
    var op = OPS[cod];                           // DECODIFICAR
    if (!op) return para(m, 'noop', con('en la celda {d} hay un {v}, que no es ninguna instrucción', { d: m.pc, v: cod }));

    var arg = null, sig = m.pc + 1;
    if (op.arg) { arg = m.mem[m.pc + 1]; sig = m.pc + 2; }
    m.ultima = { dir: m.pc, op: op, arg: arg };
    m.pasos++;

    /* Una direccion siempre cae dentro de la memoria: da la vuelta, como
       los numeros. Asi un programa mal escrito se porta raro pero no
       revienta nada, que es la regla de esta maquina. */
    function celda(v) { return ((v % MAQ.CELDAS) + MAQ.CELDAS) % MAQ.CELDAS; }

    function saca() {                            // EJECUTAR
      if (!m.pila.length) { para(m, 'pilaVacia', UI('se ha intentado sacar de la pila estando vacía')); return 0; }
      return m.pila.pop();
    }
    function pon(v) {
      if (desborda(v)) m.desbordo = true;
      m.a = ocho(v);
    }

    switch (op.n) {
      /* PARA no mueve el contador: asi la flecha se queda senalando la
         instruccion donde se detuvo, que es la informacion util. */
      case 'PARA': return para(m, 'fin', UI('el programa ha terminado'));
      case 'NUM': m.a = ocho(arg); break;
      case 'CARGA': m.a = m.mem[celda(arg)]; break;
      case 'GUARDA': m.mem[celda(arg)] = m.a; break;
      case 'CARGAI': m.a = m.mem[celda(m.mem[celda(arg)])]; break;
      case 'GUARDAI': m.mem[celda(m.mem[celda(arg)])] = m.a; break;
      case 'METE':
        if (m.pila.length >= 64) return para(m, 'pilaLlena', UI('la pila se ha llenado: son 64 sitios, y suele pasar cuando una llamada no vuelve nunca'));
        m.pila.push(m.a); break;
      case 'SACA': m.a = saca(); break;
      case 'SUMA': pon(saca() + m.a); break;
      case 'RESTA': pon(saca() - m.a); break;
      case 'MULT': pon(saca() * m.a); break;
      case 'DIV':
        if (m.a === 0) { saca(); return para(m, 'div0', UI('se ha intentado dividir entre cero')); }
        pon(Math.trunc(saca() / m.a)); break;
      case 'MENOR': m.a = (saca() < m.a) ? 1 : 0; break;
      case 'SALTA': m.pc = arg; return m;
      case 'SICERO': if (m.a === 0) { m.pc = arg; return m; } break;
      case 'LLAMA':
        if (m.pila.length >= 64) return para(m, 'pilaLlena', UI('la pila se ha llenado: son 64 sitios, y suele pasar cuando una llamada no vuelve nunca'));
        m.pila.push(sig); m.pc = arg; return m;
      case 'VUELVE': m.pc = saca(); return m;
      case 'MUESTRA':
        if (m.salida.length >= 200) return para(m, 'salida', UI('el programa ha escrito más de 200 números: seguramente es un bucle sin fin'));
        m.salida.push(m.a); break;
    }
    if (m.parada) return m;
    m.pc = sig;
    return m;
  };

  /** Hasta que pare o hasta el tope. Nunca se cuelga: el tope es parte
      del contrato, no una red de seguridad. */
  MAQ.corre = function (m, tope) {
    var t = tope || MAQ.TOPE;
    while (!m.parada && m.pasos < t) MAQ.paso(m);
    if (!m.parada && m.pasos >= t) para(m, 'tope', con('se han dado {n} pasos sin terminar: o es un bucle sin fin, o hace falta más cuerda', { n: t }));
    return m;
  };

  /** Atajo: ensambla, corre y devuelve lo que salió. */
  MAQ.ejecuta = function (texto, datos, tope) {
    var asm = MAQ.ensambla(texto);
    if (asm.errores.length) return { errores: asm.errores, salida: [], asm: asm };
    var m = MAQ.corre(MAQ.nueva(asm, datos), tope);
    return {
      errores: [], salida: m.salida, a: m.a, mem: m.mem, pasos: m.pasos,
      fin: m.fin, porQue: m.porQue, desbordo: m.desbordo, asm: asm, maquina: m
    };
  };

  /* ---------------- corrección por comportamiento ----------------
     Igual que con los circuitos: no se compara el texto del programa
     sino lo que hace con cada caso. Así vale cualquier programa que
     resuelva el problema, escrito como al alumno le salga. */
  MAQ.iguales = function (texto, casos, o) {
    o = o || {};
    var asm = MAQ.ensambla(texto);
    if (asm.errores.length) {
      var e = asm.errores[0];
      return { ok: false, porQue: con('Línea {n}: {m}', { n: e.linea, m: e.msg }), instrucciones: 0, pasos: 0 };
    }
    var pasos = 0;
    for (var i = 0; i < casos.length; i++) {
      var c = casos[i];
      var falta = Object.keys(c.datos || {}).filter(function (n) { return asm.vars[n] === undefined; });
      if (falta.length) {
        return {
          ok: false, instrucciones: asm.instrucciones, pasos: pasos,
          porQue: con('El programa no usa ninguna celda llamada «{x}», y es donde llega el dato. ' +
            'Los nombres del enunciado hay que usarlos tal cual.', { x: falta[0] })
        };
      }
      var r = MAQ.corre(MAQ.nueva(asm, c.datos), o.tope);
      pasos = Math.max(pasos, r.pasos);
      if (r.fin !== 'fin') {
        return { ok: false, porQue: con('Con {c} el programa no llegó a PARA: {m}.', { c: describe(c.datos), m: r.porQue }), instrucciones: asm.instrucciones, pasos: pasos };
      }
      var esperado = c.salida || [];
      var visto = r.salida;
      if (visto.length !== esperado.length || visto.some(function (v, k) { return v !== esperado[k]; })) {
        return {
          ok: false,
          porQue: con('Con {c} esperaba que escribiera {a} y ha escrito {b}.', {
            c: describe(c.datos), a: lista(esperado), b: visto.length ? lista(visto) : UI('nada')
          }),
          instrucciones: asm.instrucciones, pasos: pasos
        };
      }
    }
    return { ok: true, porQue: '', instrucciones: asm.instrucciones, pasos: pasos };
  };

  function describe(d) {
    if (!d) return UI('los valores de partida');
    var ks = Object.keys(d);
    if (!ks.length) return UI('los valores de partida');
    return ks.map(function (k) { return k + ' = ' + d[k]; }).join(', ');
  }
  function lista(v) { return v.length ? v.join(', ') : UI('nada'); }
  MAQ.lista = lista;

  /* ---------------- coloreado ----------------
     Los mismos ocho papeles del editor de shaders, con otro reparto:
     la instrucción es la palabra clave, la etiqueta es el nombre con
     el que se la llama y el número es un número. */
  function escapa(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var RE_TOK_ASM = /[;#][^\n]*|\/\/[^\n]*|\b-?\d+\b|[A-Za-z_][A-Za-z0-9_]*|[^\sA-Za-z0-9_]+|\s+/g;

  MAQ.pinta = function (texto) {
    var src = String(texto == null ? '' : texto), out = '', m;
    RE_TOK_ASM.lastIndex = 0;
    while ((m = RE_TOK_ASM.exec(src))) {
      var t = m[0], c = null;
      var ch = t.charAt(0);
      if (ch === ';' || ch === '#' || t.slice(0, 2) === '//') c = 'com';
      else if (/^-?\d+$/.test(t)) c = 'num';
      else if (POR_NOMBRE[t.toUpperCase()]) c = 'key';
      else if (/^[A-Za-z_]/.test(t)) c = 'fun';                  // etiquetas y variables
      else if (/^\s+$/.test(t)) c = null;
      else c = 'pun';
      out += c ? '<span class="cod-' + c + '">' + escapa(t) + '</span>' : escapa(t);
    }
    return out;
  };

  /* ---------------- la batería de programas ----------------
     Programas de referencia que valen para las demos y, sobre todo,
     para las pruebas: si alguno deja de dar lo que da, es que se ha
     roto la máquina. */
  MAQ.EJEMPLOS = {
    suma: {
      t: 'sumar dos números',
      texto: 'CARGA x\nMETE\nCARGA y\nSUMA\nMUESTRA\nPARA',
      datos: { x: 20, y: 22 }, salida: [42]
    },
    mayor: {
      t: 'el mayor de dos',
      texto: 'CARGA x\nMETE\nCARGA y\nMENOR        ; 1 si x < y\nSICERO esx   ; si no, el mayor es x\nCARGA y\nMUESTRA\nPARA\nesx:\nCARGA x\nMUESTRA\nPARA',
      datos: { x: 9, y: 4 }, salida: [9]
    },
    cuenta: {
      t: 'contar de 1 a n',
      texto: 'NUM 1\nGUARDA i\nbucle:\nCARGA i\nMUESTRA\nCARGA i\nMETE\nNUM 1\nSUMA\nGUARDA i     ; i = i + 1\nCARGA n\nMETE\nCARGA i\nMENOR        ; 1 cuando n < i, o sea, cuando ya nos hemos pasado\nSICERO bucle\nPARA',
      datos: { n: 5 }, salida: [1, 2, 3, 4, 5]
    },
    fact: {
      t: 'factorial',
      texto: 'NUM 1\nGUARDA r\nCARGA n\nGUARDA i\nbucle:\nCARGA i\nSICERO fin\nCARGA r\nMETE\nCARGA i\nMULT\nGUARDA r     ; r = r * i\nCARGA i\nMETE\nNUM 1\nRESTA\nGUARDA i     ; i = i - 1\nSALTA bucle\nfin:\nCARGA r\nMUESTRA\nPARA',
      datos: { n: 5 }, salida: [120]
    },
    tabla: {
      t: 'recorrer una lista',
      texto: 'TABLA t 4\nNUM t\nGUARDA p        ; p apunta al principio\nNUM 5\nGUARDAI p\n' +
             'CARGA p\nMETE\nNUM 1\nSUMA\nGUARDA p\nNUM 7\nGUARDAI p\n' +
             'CARGA p\nMETE\nNUM 1\nSUMA\nGUARDA p\nNUM 11\nGUARDAI p\n' +
             'CARGA p\nMETE\nNUM 1\nSUMA\nGUARDA p\nNUM 13\nGUARDAI p\n' +
             'NUM t\nGUARDA p\nNUM 0\nGUARDA s\nNUM 0\nGUARDA k\n' +
             'bucle:\nCARGA k\nMETE\nNUM 4\nMENOR\nSICERO fin\n' +
             'CARGA s\nMETE\nCARGAI p\nSUMA\nGUARDA s\n' +
             'CARGA p\nMETE\nNUM 1\nSUMA\nGUARDA p\n' +
             'CARGA k\nMETE\nNUM 1\nSUMA\nGUARDA k\nSALTA bucle\n' +
             'fin:\nCARGA s\nMUESTRA\nPARA',
      datos: null, salida: [36]
    },
    quine: {
      t: 'un programa que se escribe a sí mismo',
      /* 26 celdas, y escribe exactamente esas 26. El punto fijo se cierra
         porque el bucle no crece con lo que imprime: sin CARGAI habria que
         nombrar cada celda en el programa y nunca se alcanzaria. */
      texto: 'NUM 0\nGUARDA i\nbucle:\nCARGA i\nMETE\nNUM 26\nMENOR\nSICERO fin\n' +
             'CARGAI i\nMUESTRA\nCARGA i\nMETE\nNUM 1\nSUMA\nGUARDA i\nSALTA bucle\nfin:\nPARA',
      datos: null,
      salida: [1, 0, 3, 26, 2, 26, 4, 1, 26, 10, 12, 25, 16, 26, 15, 2, 26, 4, 1, 1, 6, 3, 26, 11, 4, 0]
    },
    doble: {
      t: 'una subrutina que duplica',
      texto: 'CARGA x\nLLAMA dup\nMUESTRA\nPARA\ndup:\nMETE         ; encima de la dirección de vuelta\nSUMA         ; la saca y le suma el acumulador\nVUELVE',
      datos: { x: 7 }, salida: [14]
    }
  };

  /* ================================================================
     EL WIDGET
     ================================================================ */
  function Consola(host, o) {
    o = o || {};
    this.o = o;
    this.original = (o.texto || '').replace(/^\n/, '');
    this.tope = o.tope || 2000;
    this.build(host);
  }

  Consola.prototype.build = function (host) {
    var self = this, o = this.o;
    this.el = U.el('div.maq');
    this.el.__maq = this;

    /* --- editor de dos capas, el mismo del bloque de gráficos --- */
    this.caja = U.el('div.shd__caja.shd__caja--prog');
    this.capa = U.el('pre.shd__pinta', { 'aria-hidden': 'true' });
    this.caja.appendChild(this.capa);
    this.ed = U.el('textarea.shd__ed', {
      spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off',
      'aria-label': UI('Programa en ensamblador, una instrucción por línea'),
      rows: String(Math.max(4, this.original.split('\n').length + 1))
    });
    this.ed.value = this.original;
    this.caja.appendChild(this.ed);
    this.el.appendChild(this.caja);
    this.ed.addEventListener('input', function () { self.repinta(); self.reinicia(); self.guarda(); });
    this.ed.addEventListener('scroll', function () {
      self.capa.scrollTop = self.ed.scrollTop; self.capa.scrollLeft = self.ed.scrollLeft;
    });

    this.aviso = U.el('div.maq__aviso', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(this.aviso);

    /* --- registros y pila --- */
    this.regs = U.el('div.maq__regs');
    this.el.appendChild(this.regs);

    W.buttons(this.el, [
      { t: UI('Un paso'), on: function () { self.paso(); } },
      { t: '▶ ' + UI('Corre'), on: function () { self.corre(); } },
      { t: '↺ ' + UI('Reinicia'), on: function () { self.reinicia(); } },
      { t: '↺ ' + UI('Volver al original'), on: function () { self.ed.value = self.original; self.repinta(); self.reinicia(); self.guarda(); } }
    ]);

    /* --- la memoria, que es donde se ve que todo son números --- */
    this.memCaja = U.el('div.maq__mem');
    this.el.appendChild(this.memCaja);

    if (o.nota) this.el.appendChild(U.el('p.maq__nota', { html: MathX.inline(o.nota) }));

    host.appendChild(this.el);

    if (o.id && global.Progress) {
      var g = Progress.pref('maq:' + o.id);
      if (g) this.ed.value = g;
    }
    this.repinta();
    this.reinicia();
  };

  Consola.prototype.guarda = function () {
    if (this.o.id && global.Progress) Progress.pref('maq:' + this.o.id, this.ed.value);
  };

  Consola.prototype.repinta = function () {
    this.capa.innerHTML = MAQ.pinta(this.ed.value) + '\n';
    this.capa.scrollTop = this.ed.scrollTop;
    this.capa.scrollLeft = this.ed.scrollLeft;
  };

  Consola.prototype.reinicia = function () {
    this.asm = MAQ.ensambla(this.ed.value);
    this.el.classList.toggle('maq--roto', this.asm.errores.length > 0);
    this.m = this.asm.errores.length ? null : MAQ.nueva(this.asm, this.o.datos);
    this.pinta();
  };

  Consola.prototype.paso = function () {
    if (!this.m) return;
    if (this.m.parada) this.reinicia();
    MAQ.paso(this.m);
    this.pinta();
  };

  Consola.prototype.corre = function () {
    if (!this.m) return;
    if (this.m.parada) this.reinicia();
    MAQ.corre(this.m, this.tope);
    this.pinta();
  };

  Consola.prototype.pinta = function () {
    var m = this.m, asm = this.asm;

    if (asm.errores.length) {
      var e = asm.errores[0];
      this.aviso.textContent = con('Línea {n}: {m}', { n: e.linea, m: e.msg });
      this.regs.innerHTML = '';
      this.memCaja.innerHTML = '';
      return;
    }

    var u = m.ultima;
    this.aviso.textContent = m.parada
      ? con('Parada: {m}', { m: m.porQue }) +
        (m.desbordo ? ' · ' + UI('ojo, alguna cuenta se salió de los ocho bits y dio la vuelta') : '')
      : (u ? con('Acaba de hacer {i}: {q}', {
          i: u.op.n + (u.op.arg ? ' ' + u.arg : ''), q: UI(u.op.q)
        })
        : UI('Lista. El contador está en la celda 0, que es por donde empieza todo.'));

    this.regs.innerHTML = '';
    var self = this;
    [['contador', m.pc], ['acumulador', m.a]].forEach(function (par) {
      self.regs.appendChild(U.el('span.maq__reg', { html: '<b>' + UI(par[0]) + '</b> ' + par[1] }));
    });
    this.regs.appendChild(U.el('span.maq__reg', {
      html: '<b>' + UI('pila') + '</b> ' + (m.pila.length ? m.pila.join(' · ') : '—')
    }));
    this.regs.appendChild(U.el('span.maq__reg.maq__reg--sal', {
      html: '<b>' + UI('salida') + '</b> ' + (m.salida.length ? m.salida.join(', ') : '—')
    }));

    /* La memoria: solo la parte que se usa, porque 256 celdas no se leen.
       Va con la misma tabla que el resto del curso, y la fila del contador
       lleva ademas una flecha, que no se distingue solo por el color. */
    var hasta = Math.max(asm.libre, 1);
    var etiq = {}, nombres = {}, mapa = {};
    Object.keys(asm.etiquetas).forEach(function (n) { etiq[asm.etiquetas[n]] = n; });
    Object.keys(asm.vars).forEach(function (n) { nombres[asm.vars[n]] = n; });
    asm.celdas.forEach(function (c) { mapa[c.dir] = c; });

    var wrap = U.el('div.tbl-wrap.maq__mem'), tb = U.el('table.tbl');
    tb.appendChild(U.el('thead', null, U.el('tr', null, [
      U.el('th', { text: '' }), U.el('th', { text: UI('celda') }),
      U.el('th.num', { text: UI('valor') }), U.el('th', { text: UI('qué es') })
    ])));
    var cuerpo = U.el('tbody');
    for (var d = 0; d < hasta; d++) {
      var tr = U.el('tr');
      var esPc = (d === m.pc);
      if (esPc) tr.classList.add('is-pc');
      tr.appendChild(U.el('td.maq__flecha', { text: esPc ? '▶' : '' }));
      tr.appendChild(U.el('td', { text: String(d) }));
      tr.appendChild(U.el('td.num', { text: String(m.mem[d]) }));
      var c = mapa[d], que;
      if (nombres[d]) que = '<span class="maq__var">' + nombres[d] + '</span> <span class="maq__libre">(' + UI('dato') + ')</span>';
      else if (!c) que = '<span class="maq__libre">' + UI('libre') + '</span>';
      else if (c.argDe === undefined) que = '<span class="maq__op">' + c.op.n + '</span>';
      else que = '<span class="maq__libre">' + con('lo que lleva {i} detrás', { i: asm.celdas[c.argDe].op.n }) + '</span>';
      tr.appendChild(U.el('td', { html: (etiq[d] ? '<span class="maq__et">' + etiq[d] + ':</span> ' : '') + que }));
      cuerpo.appendChild(tr);
    }
    tb.appendChild(cuerpo);
    wrap.appendChild(tb);
    this.memCaja.innerHTML = '';
    this.memCaja.appendChild(wrap);
  };

  W.maquina = function (host, o) { return new Consola(host, o); };
  W.programaIguales = MAQ.iguales;
  W.programaPinta = MAQ.pinta;

  global.MAQ = MAQ;
})(window);
