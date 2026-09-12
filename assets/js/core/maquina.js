/* ===================================================================
   Matebase · maquina.js
   LA MÁQUINA DE JUGUETE. Una CPU de 8 bits con dieciséis instrucciones,
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

   · NADA SE CUELGA. Todo se ejecuta con un tope de pasos; al llegar, se
     para y se dice por qué. Un bucle infinito es un programa posible, y
     el alumno tiene que poder escribirlo sin romper la página.
   =================================================================== */
(function (global) {
  'use strict';

  var MAQ = {};

  /* ---------------- el juego de instrucciones ----------------
     Dieciséis, que es lo que cabe en cuatro bits. `arg` dice si la
     instrucción ocupa una celda o dos, y `tipo` para qué sirve el
     argumento, que es lo que permite distinguir una etiqueta mal
     escrita de una variable nueva. */
  var OPS = [
    { n: 'PARA', arg: false, q: 'detiene la máquina' },
    { n: 'NUM', arg: true, tipo: 'valor', q: 'pone ese número en el acumulador' },
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
    { n: 'MUESTRA', arg: false, q: 'escribe el acumulador en la salida' }
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
    var errores = [], celdas = [], etiquetas = {}, vars = {}, pendientes = [];
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
        if (etiquetas[me[1]] !== undefined) errores.push({ linea: num, msg: 'la etiqueta «' + me[1] + '» ya estaba puesta más arriba' });
        else etiquetas[me[1]] = dir;
        linea = me[2].trim();
        if (!linea) return;
      }

      var trozos = linea.split(/\s+/);
      var nom = trozos[0].toUpperCase();
      var op = POR_NOMBRE[nom];
      if (!op) {
        errores.push({ linea: num, msg: 'no existe la instrucción «' + trozos[0] + '». Hay: ' + MAQ.NOMBRES.join(', ') });
        return;
      }
      if (!op.arg && trozos.length > 1) {
        errores.push({ linea: num, msg: '«' + nom + '» no lleva nada detrás' });
        return;
      }
      if (op.arg && trozos.length < 2) {
        errores.push({ linea: num, msg: '«' + nom + '» necesita un ' + (op.tipo === 'sitio' ? 'sitio al que ir' : (op.tipo === 'dato' ? 'nombre de celda' : 'número')) });
        return;
      }
      if (trozos.length > 2) {
        errores.push({ linea: num, msg: '«' + nom + '» lleva una sola cosa detrás, no ' + (trozos.length - 1) });
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
    pendientes.forEach(function (p) {
      if (p.op.tipo === 'dato' && !/^-?\d+$/.test(p.texto) && RE_NOM.test(p.texto) && vars[p.texto] === undefined) {
        vars[p.texto] = libre++;
      }
    });

    /* --- segunda pasada: resolver --- */
    pendientes.forEach(function (p) {
      var t = p.texto, v;
      if (/^-?\d+$/.test(t)) {
        v = parseInt(t, 10);
        if (p.op.tipo !== 'valor' && (v < 0 || v >= MAQ.CELDAS)) {
          errores.push({ linea: p.linea, msg: 'la celda ' + v + ' no existe: van de 0 a ' + (MAQ.CELDAS - 1) });
          v = 0;
        }
        if (p.op.tipo === 'valor' && desborda(v)) {
          errores.push({ linea: p.linea, msg: 'el número ' + v + ' no cabe en ocho bits con signo: van de -128 a 127' });
          v = ocho(v);
        }
      } else if (!RE_NOM.test(t)) {
        errores.push({ linea: p.linea, msg: '«' + t + '» no es ni un número ni un nombre' });
        v = 0;
      } else if (p.op.tipo === 'sitio') {
        if (etiquetas[t] === undefined) {
          errores.push({ linea: p.linea, msg: 'no hay ninguna etiqueta que se llame «' + t + '». Se pone escribiendo «' + t + ':» en su línea' });
          v = 0;
        } else v = etiquetas[t];
      } else if (p.op.tipo === 'dato') {
        v = vars[t];
      } else {
        errores.push({ linea: p.linea, msg: '«' + p.op.n + '» necesita un número, no el nombre «' + t + '»' });
        v = 0;
      }
      celdas[p.idx].valor = v;
    });

    if (libre >= MAQ.CELDAS) errores.push({ linea: lineas.length, msg: 'el programa y sus variables no caben en las ' + MAQ.CELDAS + ' celdas de memoria' });

    var imagen = [];
    celdas.forEach(function (c) { imagen[c.dir] = (c.argDe === undefined) ? c.cod : ocho(c.valor || 0); });

    return {
      celdas: celdas, imagen: imagen, etiquetas: etiquetas, vars: vars,
      fin: dir, libre: libre, errores: errores,
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

  function para(m, porQue) { m.parada = true; m.porQue = porQue; return m; }

  /** Un paso: buscar, decodificar, ejecutar. Los tres tiempos están
      separados a propósito, porque maq-cpu los cuenta así. */
  MAQ.paso = function (m) {
    if (m.parada) return m;
    if (m.pc < 0 || m.pc >= MAQ.CELDAS) return para(m, 'el contador se ha ido fuera de la memoria');

    var cod = m.mem[m.pc];                       // BUSCAR
    var op = OPS[cod];                           // DECODIFICAR
    if (!op) return para(m, 'en la celda ' + m.pc + ' hay un ' + cod + ', que no es ninguna instrucción');

    var arg = null, sig = m.pc + 1;
    if (op.arg) { arg = m.mem[m.pc + 1]; sig = m.pc + 2; }
    m.ultima = { dir: m.pc, op: op, arg: arg };
    m.pasos++;

    function saca() {                            // EJECUTAR
      if (!m.pila.length) { para(m, 'se ha intentado sacar de la pila estando vacía'); return 0; }
      return m.pila.pop();
    }
    function pon(v) {
      if (desborda(v)) m.desbordo = true;
      m.a = ocho(v);
    }

    switch (op.n) {
      /* PARA no mueve el contador: asi la flecha se queda senalando la
         instruccion donde se detuvo, que es la informacion util. */
      case 'PARA': return para(m, 'el programa ha terminado');
      case 'NUM': m.a = ocho(arg); break;
      case 'CARGA': m.a = m.mem[((arg % MAQ.CELDAS) + MAQ.CELDAS) % MAQ.CELDAS]; break;
      case 'GUARDA': m.mem[((arg % MAQ.CELDAS) + MAQ.CELDAS) % MAQ.CELDAS] = m.a; break;
      case 'METE':
        if (m.pila.length >= 64) return para(m, 'la pila se ha llenado: son 64 sitios, y suele pasar cuando una llamada no vuelve nunca');
        m.pila.push(m.a); break;
      case 'SACA': m.a = saca(); break;
      case 'SUMA': pon(saca() + m.a); break;
      case 'RESTA': pon(saca() - m.a); break;
      case 'MULT': pon(saca() * m.a); break;
      case 'DIV':
        if (m.a === 0) { saca(); return para(m, 'se ha intentado dividir entre cero'); }
        pon(Math.trunc(saca() / m.a)); break;
      case 'MENOR': m.a = (saca() < m.a) ? 1 : 0; break;
      case 'SALTA': m.pc = arg; return m;
      case 'SICERO': if (m.a === 0) { m.pc = arg; return m; } break;
      case 'LLAMA':
        if (m.pila.length >= 64) return para(m, 'la pila se ha llenado: son 64 sitios, y suele pasar cuando una llamada no vuelve nunca');
        m.pila.push(sig); m.pc = arg; return m;
      case 'VUELVE': m.pc = saca(); return m;
      case 'MUESTRA':
        if (m.salida.length >= 200) return para(m, 'el programa ha escrito más de 200 números: seguramente es un bucle sin fin');
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
    if (!m.parada && m.pasos >= t) para(m, 'se han dado ' + t + ' pasos sin terminar: o es un bucle sin fin, o hace falta más cuerda');
    return m;
  };

  /** Atajo: ensambla, corre y devuelve lo que salió. */
  MAQ.ejecuta = function (texto, datos, tope) {
    var asm = MAQ.ensambla(texto);
    if (asm.errores.length) return { errores: asm.errores, salida: [], asm: asm };
    var m = MAQ.corre(MAQ.nueva(asm, datos), tope);
    return {
      errores: [], salida: m.salida, a: m.a, mem: m.mem, pasos: m.pasos,
      porQue: m.porQue, desbordo: m.desbordo, asm: asm, maquina: m
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
      return { ok: false, porQue: 'Línea ' + e.linea + ': ' + e.msg, instrucciones: 0, pasos: 0 };
    }
    var pasos = 0;
    for (var i = 0; i < casos.length; i++) {
      var c = casos[i];
      var falta = Object.keys(c.datos || {}).filter(function (n) { return asm.vars[n] === undefined; });
      if (falta.length) {
        return {
          ok: false, instrucciones: asm.instrucciones, pasos: pasos,
          porQue: 'El programa no usa ninguna celda llamada «' + falta[0] + '», y es donde llega el dato. ' +
            'Los nombres del enunciado hay que usarlos tal cual.'
        };
      }
      var r = MAQ.corre(MAQ.nueva(asm, c.datos), o.tope);
      pasos = Math.max(pasos, r.pasos);
      if (r.porQue.indexOf('terminado') < 0) {
        return { ok: false, porQue: 'Con ' + describe(c.datos) + ' el programa no llegó a PARA: ' + r.porQue + '.', instrucciones: asm.instrucciones, pasos: pasos };
      }
      var esperado = c.salida || [];
      var visto = r.salida;
      if (visto.length !== esperado.length || visto.some(function (v, k) { return v !== esperado[k]; })) {
        return {
          ok: false,
          porQue: 'Con ' + describe(c.datos) + ' esperaba que escribiera ' + lista(esperado) +
            ' y ha escrito ' + (visto.length ? lista(visto) : 'nada') + '.',
          instrucciones: asm.instrucciones, pasos: pasos
        };
      }
    }
    return { ok: true, porQue: '', instrucciones: asm.instrucciones, pasos: pasos };
  };

  function describe(d) {
    if (!d) return 'los valores de partida';
    var ks = Object.keys(d);
    if (!ks.length) return 'los valores de partida';
    return ks.map(function (k) { return k + ' = ' + d[k]; }).join(', ');
  }
  function lista(v) { return v.length ? v.join(', ') : 'nada'; }
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
      'aria-label': 'Programa en ensamblador, una instrucción por línea',
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
      { t: 'Un paso', on: function () { self.paso(); } },
      { t: '▶ Corre', on: function () { self.corre(); } },
      { t: '↺ Reinicia', on: function () { self.reinicia(); } },
      { t: '↺ Volver al original', on: function () { self.ed.value = self.original; self.repinta(); self.reinicia(); self.guarda(); } }
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
      this.aviso.textContent = 'Línea ' + e.linea + ': ' + e.msg;
      this.regs.innerHTML = '';
      this.memCaja.innerHTML = '';
      return;
    }

    var u = m.ultima;
    this.aviso.textContent = m.parada
      ? 'Parada: ' + m.porQue + (m.desbordo ? ' · ojo, alguna cuenta se salió de los ocho bits y dio la vuelta' : '')
      : (u ? 'Acaba de hacer ' + u.op.n + (u.op.arg ? ' ' + u.arg : '') + ': ' + u.op.q
        : 'Lista. El contador está en la celda 0, que es por donde empieza todo.');

    this.regs.innerHTML = '';
    var self = this;
    [['contador', m.pc], ['acumulador', m.a]].forEach(function (par) {
      self.regs.appendChild(U.el('span.maq__reg', { html: '<b>' + par[0] + '</b> ' + par[1] }));
    });
    this.regs.appendChild(U.el('span.maq__reg', {
      html: '<b>pila</b> ' + (m.pila.length ? m.pila.join(' · ') : '—')
    }));
    this.regs.appendChild(U.el('span.maq__reg.maq__reg--sal', {
      html: '<b>salida</b> ' + (m.salida.length ? m.salida.join(', ') : '—')
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
      U.el('th', { text: '' }), U.el('th', { text: 'celda' }),
      U.el('th.num', { text: 'valor' }), U.el('th', { text: 'qué es' })
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
      if (nombres[d]) que = '<span class="maq__var">' + nombres[d] + '</span> <span class="maq__libre">(dato)</span>';
      else if (!c) que = '<span class="maq__libre">libre</span>';
      else if (c.argDe === undefined) que = '<span class="maq__op">' + c.op.n + '</span>';
      else que = '<span class="maq__libre">lo que lleva ' + asm.celdas[c.argDe].op.n + ' detrás</span>';
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
