/* Tema: Contar con dos símbolos: binario, hexadecimal y complemento a dos */
Course.topic('maq-bits', function (p) {

  p.puente('Aquí empieza un bloque que construye un ordenador entero y, encima de él, un lenguaje de ' +
    'programación. Lo primero es lo único que una máquina sabe hacer: distinguir dos estados. De ' +
    '[[ar-naturales|el valor posicional]] viene todo lo que hace falta, porque contar con dos símbolos ' +
    'es exactamente lo mismo que contar con diez, y de [[ar-enteros|los enteros]], la pregunta ' +
    'incómoda: cómo se escribe un número negativo cuando no hay sitio para el signo.',
    'Por dónde empezamos');

  p.text('Un cable está a tensión o no lo está. No hay más. Todo lo que hace un ordenador —sumar, ' +
    'guardar una foto, traducir un texto— se construye encima de esa única distinción, repetida muchas ' +
    'veces. A esa distinción se le llama <strong>bit</strong>, y este tema trata de cómo se escriben ' +
    'números con ella.');

  /* ---------------------------------------------------------------- */
  p.section('Contar con dos dedos');

  p.text('En el sistema decimal, el 407 no significa «cuatro, cero, siete»: significa ' +
    '$4\\cdot10^2 + 0\\cdot10^1 + 7\\cdot10^0$. Cada posición vale diez veces más que la de su derecha, ' +
    'y hacen falta diez símbolos. <strong>Si solo hay dos símbolos, cada posición vale el doble que la ' +
    'de su derecha</strong>, y ya está: no hay ninguna idea nueva.');

  p.formula('1011_2 = 1\\cdot 8 + 0\\cdot 4 + 1\\cdot 2 + 1\\cdot 1 = 11',
    'el mismo valor posicional, con dos símbolos',
    'Se lee: <em>«uno cero uno uno en base dos»</em>. El subíndice dice en qué base está escrito, ' +
    'porque $1011$ a secas podría ser mil once.<br><br>Las potencias de dos que hay que tener en la ' +
    'cabeza son pocas: 1, 2, 4, 8, 16, 32, 64, 128. Con ocho bits se llega hasta $255$, que es ' +
    '$2^8 - 1$: <strong>uno menos que la potencia siguiente</strong>, igual que con tres cifras ' +
    'decimales se llega a 999.');

  p.demo({
    title: 'Ocho interruptores',
    intro: 'Pulsa cada bit para encenderlo o apagarlo. Debajo, lo que vale en decimal y en hexadecimal. Fíjate en el peso de cada posición: el de la izquierda vale 128 y el de la derecha 1.',
    predice: 'Con ocho bits, ¿cuál crees que es el número más grande que se puede escribir?',
    build: function (host) {
      var bits = [0, 0, 0, 0, 1, 0, 1, 1];
      var out = W.readout(host, '');
      var fila = W.row(host);
      function valor() {
        var v = 0;
        bits.forEach(function (b, i) { v += b * Math.pow(2, 7 - i); });
        return v;
      }
      function pinta() {
        var v = valor();
        var hx = v.toString(16).toUpperCase();
        if (hx.length < 2) hx = '0' + hx;
        out.set('Binario <strong>' + bits.join('') + '</strong><br>' +
          'Decimal <strong>' + v + '</strong> &nbsp;·&nbsp; hexadecimal <strong>0x' + hx + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          bits.map(function (b, i) { return b ? Math.pow(2, 7 - i) : null; })
            .filter(function (x) { return x !== null; }).join(' + ') +
          (v ? ' = ' + v : 'Todo apagado: el cero.') + '</span>');
        [].slice.call(fila.querySelectorAll('.cir__sw')).forEach(function (b, i) {
          b.setAttribute('aria-pressed', bits[i] ? 'true' : 'false');
          b.textContent = String(bits[i]);
        });
      }
      bits.forEach(function (_, i) {
        var b = U.el('button.cir__sw', { type: 'button', 'aria-label': 'bit de peso ' + Math.pow(2, 7 - i) });
        b.addEventListener('click', function () { bits[i] = bits[i] ? 0 : 1; pinta(); });
        fila.appendChild(b);
      });
      pinta();
    }
  });

  p.note('Los pesos van de izquierda a derecha: 128, 64, 32, 16, 8, 4, 2, 1. Sumar los que estén ' +
    'encendidos da el número, y esa suma <strong>es</strong> la definición: no hay ningún paso oculto.',
    'ok', 'Cómo se lee un byte de un vistazo');

  /* ---------------------------------------------------------------- */
  p.section('Hexadecimal: taquigrafía, no otro sistema');

  p.text('Ocho bits escritos a mano son insoportables. Como $16 = 2^4$, <strong>cada cuatro bits son ' +
    'exactamente un símbolo hexadecimal</strong>, y la conversión se hace de un vistazo, sin cuentas. ' +
    'Por eso se usa: no aporta nada nuevo, solo acorta.');

  p.table(['Binario', 'Hex', 'Decimal', 'Binario', 'Hex', 'Decimal'],
    [['0000', '0', '0', '1000', '8', '8'],
     ['0001', '1', '1', '1001', '9', '9'],
     ['0010', '2', '2', '1010', 'A', '10'],
     ['0011', '3', '3', '1011', 'B', '11'],
     ['0100', '4', '4', '1100', 'C', '12'],
     ['0101', '5', '5', '1101', 'D', '13'],
     ['0110', '6', '6', '1110', 'E', '14'],
     ['0111', '7', '7', '1111', 'F', '15']]);

  p.note('El prefijo <code>0x</code> avisa de que lo que viene está en hexadecimal: <code>0x1F</code> ' +
    'se lee <em>«cero equis uno efe»</em> y vale $1\\cdot16 + 15 = 31$. Sin el prefijo, ' +
    '<code>1F</code> no sería un número y <code>31</code> sería ambiguo.',
    'ok', 'Cómo se lee 0x1F');

  /* ---------------------------------------------------------------- */
  p.section('Los negativos: complemento a dos');

  p.text('Ahora el problema de verdad. En un cable no hay sitio para un signo: hay ocho bits y nada ' +
    'más. Se podría reservar el primero para el signo, y se probó; pero entonces hay dos ceros ' +
    '—$+0$ y $-0$— y, sobre todo, <strong>la suma deja de funcionar</strong> y hace falta un circuito ' +
    'aparte para restar.');

  p.text('La solución que se impuso es más lista: elegir la escritura de los negativos ' +
    '<strong>para que la suma de siempre siga valiendo</strong>.');

  p.formula('-n \\quad \\text{se escribe como} \\quad 2^k - n',
    'complemento a dos, con $k$ bits',
    'Con 8 bits, $-5$ se escribe como $256 - 5 = 251$, que en binario es $11111011$.<br><br>' +
    'La receta rápida para hacerlo a mano: <strong>se invierte cada bit y se suma uno</strong>. Del ' +
    '$5 = 00000101$ se pasa a $11111010$ invirtiendo, y sumando uno queda $11111011$. Sale lo mismo, ' +
    'porque invertir es restar de $11111111 = 2^k - 1$.<br><br>El primer bit acaba funcionando como ' +
    'signo —vale 1 en todos los negativos— pero no es una regla aparte: <em>sale solo</em>.');

  p.demo({
    title: 'La rueda de los números',
    intro: 'Los 256 valores de un byte, puestos en círculo. En azul, cómo se leen sin signo; en naranja, cómo se leen en complemento a dos. Mueve el número y mira dónde está el corte.',
    predice: 'Sumar uno al 127 debería dar 128. En complemento a dos, ¿qué crees que sale?',
    build: function (host) {
      var n = 5;
      function c2(x) { return ((x < 0 ? 256 + x : x) & 255); }
      function leeC2(b) { return b >= 128 ? b - 256 : b; }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, height: 280, equal: true,
        axes: false, grid: false,
        aria: 'Los 256 valores de un byte en círculo, con la mitad de arriba positiva y la de abajo negativa en complemento a dos',
        draw: function (g) {
          var i;
          for (i = 0; i < 256; i += 1) {
            var a = Math.PI / 2 - i / 256 * 2 * Math.PI;
            var neg = i >= 128;
            g.point(Math.cos(a), Math.sin(a), { color: neg ? 2 : 0, r: 1.6 });
          }
          var b = c2(n), ang = Math.PI / 2 - b / 256 * 2 * Math.PI;
          g.seg(0, 0, Math.cos(ang), Math.sin(ang), { color: 3, w: 2.4 });
          g.point(Math.cos(ang), Math.sin(ang), { color: 3, r: 6 });
          g.text(0, 1.32, '0', { align: 'center', size: 12, color: 'ink' });
          g.text(0, -1.34, '128 / −128', { align: 'center', size: 12, color: 'ink' });
          g.text(1.34, 0, '64', { align: 'left', size: 12, color: 'ink' });
          g.text(-1.34, 0, '192 / −64', { align: 'right', size: 12, color: 'ink' });
        }
      });
      W.legend(host, [{ c: 0, t: 'sin signo: 0 a 255' }, { c: 2, t: 'con signo: −128 a 127' }]);
      function pinta() {
        var b = c2(n);
        var bin = b.toString(2);
        while (bin.length < 8) bin = '0' + bin;
        out.set('Valor con signo <strong>' + n + '</strong> &nbsp;·&nbsp; bits <strong>' + bin + '</strong><br>' +
          'Esos mismos bits, leídos sin signo, son <strong>' + b + '</strong>.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (n === 127 ? 'Uno más y se cae al otro lado del círculo: 127 + 1 da −128, que es el desbordamiento.'
            : (n < 0 ? 'Los negativos ocupan la mitad de abajo, y todos empiezan por 1.'
              : 'Los positivos ocupan la mitad de arriba, y todos empiezan por 0.')) +
          '</span>');
        plot.render();
      }
      W.slider(host, { label: 'número', min: -128, max: 127, step: 1, value: 5, dec: 0, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  p.note('La gracia del invento está en una comprobación de cinco segundos: ' +
    '$00000101 + 11111011 = 100000000$, y como el noveno bit no cabe en el byte, se cae y queda ' +
    '$00000000$. Es decir, <strong>$5 + (-5) = 0$ con el circuito de sumar de siempre</strong>. Restar ' +
    'deja de necesitar un circuito propio: se niega y se suma.',
    'ok', 'Por qué se eligió justo esta escritura');

  /* ---------------------------------------------------------------- */
  p.section('Lo que no cabe');

  p.text('Con ocho bits hay 256 valores y ni uno más. Si una cuenta se sale, no hay aviso: los bits que ' +
    'sobran <strong>se caen</strong>. A eso se le llama <strong>desbordamiento</strong>, y con signo ' +
    'tiene una forma llamativa: $127 + 1$ da $-128$, porque la rueda da la vuelta.');

  p.text('Y hay un segundo sitio donde no cabe lo que uno espera, que sorprende más. Los números con ' +
    'decimales se guardan también en binario, y <strong>en binario solo son exactas las fracciones ' +
    'cuyo denominador es una potencia de dos</strong>. Un medio es $0{,}1_2$, un cuarto es $0{,}01_2$; ' +
    'pero un décimo no es ninguna de esas, y su desarrollo no se acaba nunca.');

  p.demo({
    title: 'Un décimo no cabe',
    intro: 'El desarrollo binario de una fracción, cifra a cifra. Elige el número y mira si el desarrollo se acaba o se repite para siempre.',
    predice: 'En decimal, un tercio da 0,333… sin acabarse. ¿Qué fracciones crees que harán eso en binario?',
    build: function (host) {
      var casos = [
        { t: '1/2', n: 1, d: 2 }, { t: '1/4', n: 1, d: 4 }, { t: '3/8', n: 3, d: 8 },
        { t: '1/10', n: 1, d: 10 }, { t: '3/10', n: 3, d: 10 }, { t: '1/3', n: 1, d: 3 }
      ];
      var sel = casos[3];
      /* División larga en base 2 con ENTEROS, igual que la de toda la vida
         pero multiplicando por 2 en vez de por 10. Se hace así y no con
         coma flotante a propósito: el 0,1 de un número en coma flotante no
         es un décimo, sino un racional cuyo denominador ya es potencia de
         dos, y entonces su desarrollo sí se acaba. Lo que hay que ver aquí
         es el desarrollo de la FRACCIÓN, y para eso hace falta el entero.
         Cuando un resto se repite, de ahí en adelante todo se repite. */
      function desarrollo(num, den, tope) {
        var s = '', restos = {}, r = num % den, i = 0;
        while (r !== 0 && i < tope) {
          if (restos[r] !== undefined) {
            return { s: s, exacto: false, desde: restos[r], periodo: s.slice(restos[r]) };
          }
          restos[r] = i;
          r *= 2;
          var cifra = Math.floor(r / den);
          s += cifra; r -= cifra * den; i++;
        }
        return { s: s, exacto: r === 0, cifras: s.length };
      }
      var out = W.readout(host, '');
      function pinta() {
        var r = desarrollo(sel.n, sel.d, 40);
        var texto;
        if (r.exacto) {
          texto = '<code>0,' + r.s + '</code>';
        } else {
          texto = '<code>0,' + r.s.slice(0, r.desde) + '<strong>' + r.periodo + '</strong>' +
            r.periodo + r.periodo + '…</code>';
        }
        out.set('<strong>' + sel.t + '</strong> en binario: ' + texto + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (r.exacto
            ? 'Se acaba en ' + r.cifras + ' ' + U.plural(r.cifras, 'cifra', 'cifras') + ': el denominador es una potencia de dos, así que cabe exacto.'
            : 'No se acaba: a partir de ahí se repite «' + r.periodo + '» para siempre, porque el resto vuelve a ser el mismo. El ordenador corta por algún sitio, y ahí nace el error de redondeo que arrastran los cálculos con decimales.') +
          '</span>');
      }
      W.chips(host, casos.map(function (c) { return { label: c.t, value: c.t }; }), {
        value: '1/10',
        on: function (v) { sel = casos.filter(function (c) { return c.t === v; })[0]; pinta(); }
      });
      pinta();
    }
  });

  p.ejemplo({
    title: 'De un lado a otro',
    enunciado: 'Escribir $-20$ en complemento a dos con 8 bits, comprobar que sumado a $20$ da cero, y pasar el resultado a hexadecimal.',
    pasos: [
      { t: '<strong>El positivo.</strong> $20 = 16 + 4$, así que $20 = 00010100$.', antes: '¿Qué potencias de dos suman 20?' },
      { t: '<strong>Invertir.</strong> Cambiando cada bit: $11101011$.', antes: 'Cambia cada 0 por 1 y cada 1 por 0.' },
      { t: '<strong>Sumar uno.</strong> $11101011 + 1 = 11101100$. Ese es el $-20$.', antes: 'Suma uno en binario, con sus acarreos.' },
      { t: '<strong>La comprobación.</strong> $00010100 + 11101100 = 100000000$. El noveno bit no cabe en el byte y se cae, así que queda $00000000$: cero, como tenía que ser.' },
      { t: '<strong>A hexadecimal.</strong> Se parte en dos grupos de cuatro: $1110$ y $1100$, o sea $E$ y $C$. Luego $-20$ se escribe <code>0xEC</code>.', antes: 'Cada cuatro bits son un símbolo hexadecimal.' }
    ],
    cierre: 'Fíjate en que en ningún paso ha hecho falta un circuito de restar: el negativo se ha construido con una inversión y una suma, y a partir de ahí todo es sumar.'
  });

  p.comprueba('En complemento a dos con 8 bits, ¿por qué el rango va de $-128$ a $127$ y no de $-127$ a $127$?', [
    { t: 'Porque el cero ocupa un sitio del lado positivo, y queda uno más para los negativos', ok: true, por: 'Hay 256 escrituras posibles. Una es el cero, y si se repartieran a partes iguales sobrarían 255 para repartir entre positivos y negativos. Al contar el cero con los positivos, quedan 127 positivos y 128 negativos.' },
    { t: 'Porque el $-128$ se necesita para marcar el desbordamiento', ok: false, por: 'No hay ninguna marca: el desbordamiento no avisa. El $-128$ es un valor normal y corriente, $10000000$.' },
    { t: 'Porque hay dos ceros y uno de ellos se usa como $-128$', ok: false, por: 'Eso pasaba con la escritura de signo y magnitud, que tenía $+0$ y $-0$. Precisamente el complemento a dos se eligió porque <em>no</em> tiene dos ceros.' }
  ]);

  p.util('El desbordamiento no es una curiosidad de examen. El 4 de junio de 1996, el primer vuelo del ' +
    'cohete <strong>Ariane 5</strong> se destruyó cuarenta segundos después de despegar. La causa ' +
    'estaba en una conversión: una medida de velocidad horizontal guardada en coma flotante de 64 bits ' +
    'se pasó a un entero de 16 bits, y no cabía. El programa era correcto y venía probado del Ariane 4, ' +
    'donde esa velocidad nunca llegaba a tanto; el Ariane 5 era más rápido. Nadie había comprobado qué ' +
    'pasaba si el número no cabía, porque en el cohete anterior no podía pasar.');

  p.hist('La aritmética binaria la publicó <strong>Gottfried Leibniz</strong> en 1703, en un artículo ' +
    'de la Academia de Ciencias de París, y le entusiasmó descubrir que los hexagramas del ' +
    '<em>I Ching</em> chino, que le había hecho llegar el jesuita Joachim Bouvet, se podían leer como ' +
    'números en base dos. Leibniz no tenía ninguna máquina en la que usarlo. La palabra ' +
    '<strong>bit</strong> es mucho posterior: la propuso el estadístico John Tukey como contracción de ' +
    '<em>binary digit</em>, y quien la puso en circulación fue Claude Shannon al citarlo en su ' +
    'artículo de 1948, el mismo que fundó [[av-informacion|la teoría de la información]].');

  p.trampas([
    { e: 'Leer $1011$ como mil once', por: 'En base dos vale 11. Por eso se escribe el subíndice, o el prefijo <code>0x</code> para el hexadecimal.' },
    { e: 'Creer que el primer bit «es» el signo', por: 'En complemento a dos acaba valiendo 1 en todos los negativos, pero no es una regla aparte: sale de escribir $-n$ como $2^k - n$. Tratarlo como un signo suelto lleva a restar mal.' },
    { e: 'Invertir y olvidar el uno', por: 'Invertir los bits da el complemento a uno, que tiene dos ceros. El complemento a dos es invertir <em>y sumar uno</em>.' },
    { e: 'Esperar que $0{,}1 + 0{,}2$ dé exactamente $0{,}3$', por: 'Ninguno de los tres cabe exacto en binario. La suma da algo muy cercano pero distinto, y por eso los importes de dinero no se guardan en coma flotante.' },
    { e: 'Suponer que el desbordamiento avisa', por: 'Los bits que sobran se caen sin más. Si nadie comprueba el rango, la cuenta sigue con un número equivocado.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'De binario a decimal',
    level: 'basico',
    gen: function (r) {
      var n = r.int(1, 255);
      var b = n.toString(2);
      while (b.length < 8) b = '0' + b;
      return { n: n, b: b };
    },
    ask: function (d) { return 'El byte <code>' + d.b + '</code>, leído sin signo, ¿qué número es?'; },
    fields: [{ name: 'n', label: 'decimal', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    tol: 0.5,
    errores: [{ si: function (v, d) { var alReves = parseInt(d.b.split('').reverse().join(''), 2); return alReves !== d.n && Math.abs(v.n - alReves) < 0.5; }, msg: 'Has leído los bits al revés. El de más a la izquierda es el que más pesa, igual que en decimal.' }],
    hint: function () { return 'Los pesos son 128, 64, 32, 16, 8, 4, 2 y 1. Suma los que estén a 1.'; },
    steps: function (d) {
      var trozos = [];
      d.b.split('').forEach(function (c, i) { if (c === '1') trozos.push(String(Math.pow(2, 7 - i))); });
      return ['Pesos encendidos: $' + trozos.join(' + ') + '$.',
        'Suma: $' + d.n + '$.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: 'De decimal a hexadecimal',
    level: 'basico',
    gen: function (r) {
      var n = r.int(16, 255);
      return { n: n, hex: n.toString(16).toUpperCase(), alto: n >> 4, bajo: n & 15 };
    },
    ask: function (d) { return 'Escribe $' + d.n + '$ en hexadecimal, con dos símbolos.'; },
    fields: [{ name: 'h', label: 'hex', w: 'tiny' }],
    sol: function (d) { return { h: d.hex }; },
    check: function (v, d) {
      var t = String(v.raw.h || '').toUpperCase().replace(/^0X/, '').replace(/\s/g, '');
      return { ok: t === d.hex };
    },
    hint: function (d) { return 'Divide entre 16: el cociente es el primer símbolo y el resto el segundo. $' + d.n + ' = 16\\cdot' + d.alto + ' + ' + d.bajo + '$.'; },
    steps: function (d) {
      var s = '0123456789ABCDEF';
      return ['$' + d.n + ' = 16\\cdot' + d.alto + ' + ' + d.bajo + '$.',
        'El ' + d.alto + ' se escribe <code>' + s.charAt(d.alto) + '</code> y el ' + d.bajo + ' se escribe <code>' + s.charAt(d.bajo) + '</code>.',
        'Queda <code>0x' + d.hex + '</code>.'];
    },
    answer: function (d) { return '0x' + d.hex; }
  });

  p.exercise({
    title: 'Escribir un negativo',
    level: 'medio',
    gen: function (r) {
      var n = r.int(1, 127);
      var b = ((256 - n) & 255).toString(2);
      while (b.length < 8) b = '0' + b;
      var pos = n.toString(2);
      while (pos.length < 8) pos = '0' + pos;
      return { n: n, bits: b, pos: pos };
    },
    ask: function (d) { return 'Escribe $-' + d.n + '$ en complemento a dos con 8 bits.'; },
    fields: [{ name: 'b', label: 'ocho bits', w: 'small' }],
    sol: function (d) { return { b: d.bits }; },
    check: function (v, d) {
      var t = String(v.raw.b || '').replace(/[^01]/g, '');
      if (t.length !== 8) return { ok: false, msg: 'Tienen que ser exactamente 8 bits.' };
      if (t === d.pos) return { ok: false, msg: 'Eso es el $+' + d.n + '$. Falta invertir y sumar uno.' };
      var inv = d.pos.split('').map(function (c) { return c === '0' ? '1' : '0'; }).join('');
      if (t === inv) return { ok: false, msg: 'Has invertido pero falta sumar uno: eso es el complemento a <em>uno</em>.' };
      return { ok: t === d.bits };
    },
    hint: function (d) { return 'Escribe el $+' + d.n + '$, invierte cada bit y suma uno.'; },
    steps: function (d) {
      var inv = d.pos.split('').map(function (c) { return c === '0' ? '1' : '0'; }).join('');
      return ['$+' + d.n + '$ es <code>' + d.pos + '</code>.',
        'Invertido: <code>' + inv + '</code>.',
        'Y sumando uno: <code>' + d.bits + '</code>.',
        'Comprobación: <code>' + d.pos + ' + ' + d.bits + '</code> da un uno seguido de ocho ceros, y el uno se cae del byte.'];
    },
    answer: function (d) { return d.bits; }
  });

  p.exercise({
    title: 'Cuánto cabe y qué se desborda',
    level: 'medio',
    gen: function (r) {
      var k = r.pick([4, 8, 12, 16]);
      return { k: k, sinSigno: Math.pow(2, k) - 1, min: -Math.pow(2, k - 1), max: Math.pow(2, k - 1) - 1 };
    },
    ask: function (d) {
      return 'Con $' + d.k + '$ bits: ¿cuál es el mayor número sin signo, y cuál es el mayor en ' +
        'complemento a dos?';
    },
    fields: [{ name: 'a', label: 'máximo sin signo', w: 'tiny' }, { name: 'b', label: 'máximo con signo', w: 'tiny' }],
    sol: function (d) { return { a: d.sinSigno, b: d.max }; },
    tol: 0.5,
    errores: [{ si: function (v, d) { return Math.abs(v.a - (d.sinSigno + 1)) < 0.5; }, msg: 'Te has pasado por uno: con $k$ bits hay $2^k$ valores, pero el mayor es $2^k - 1$, porque uno de ellos es el cero.' }],
    hint: function (d) { return 'Sin signo van de 0 a $2^{' + d.k + '} - 1$. Con signo, la mitad de las escrituras se van a los negativos.'; },
    steps: function (d) {
      return ['Sin signo: $2^{' + d.k + '} - 1 = ' + U.miles(d.sinSigno) + '$.',
        'Con signo, la mitad de arriba es positiva: hasta $2^{' + (d.k - 1) + '} - 1 = ' + U.miles(d.max) + '$.',
        'Y por abajo llega hasta $' + U.miles(d.min) + '$, uno más de margen porque el cero cuenta con los positivos.'];
    },
    answer: function (d) { return U.miles(d.sinSigno) + ' y ' + U.miles(d.max); }
  });

  p.exercise({
    title: 'Qué se puede escribir exacto',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: '1/4', v: 'exacto', por: 'El denominador es $4 = 2^2$, una potencia de dos: se escribe $0{,}01$ y se acaba ahí.' },
        { t: '5/8', v: 'exacto', por: 'El denominador es $8 = 2^3$: se escribe $0{,}101$ exacto.' },
        { t: '1/10', v: 'periodico', por: 'El 10 tiene un factor 5, que no es potencia de dos, así que el desarrollo se repite para siempre. Es la razón de que los importes de dinero no se guarden en coma flotante.' },
        { t: '1/3', v: 'periodico', por: 'El 3 no es potencia de dos: el desarrollo es periódico, igual que en decimal.' },
        { t: '7/100', v: 'periodico', por: 'El 100 tiene factores 5, así que no cabe exacto en binario aunque en decimal parezca un número redondo.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿El número $' + d.c.t + '$ se puede escribir exacto en binario, o su desarrollo es periódico?'; },
    fields: [{ name: 'q', label: 'En binario', opts: [
      { t: 'se escribe exacto y se acaba', v: 'exacto' },
      { t: 'es periódico y no se acaba', v: 'periodico' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Mira el denominador: solo son exactas las fracciones cuyo denominador es una potencia de dos.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'exacto' ? 'exacto' : 'periódico'; }
  });

  p.keys([
    'Un bit es una distinción entre dos estados, y con valor posicional en base dos se escribe cualquier número: los pesos son 1, 2, 4, 8, 16…',
    'El hexadecimal no es otro sistema: como $16 = 2^4$, cada cuatro bits son un símbolo, y solo sirve para acortar.',
    'Los negativos se escriben en <strong>complemento a dos</strong>, $-n$ como $2^k - n$, y a mano es invertir cada bit y sumar uno.',
    'Se eligió esa escritura porque hace que la suma de siempre siga valiendo: $5 + (-5)$ da cero con el mismo circuito, y restar deja de necesitar uno propio.',
    'Con $k$ bits hay $2^k$ valores y ni uno más: lo que se sale se desborda sin avisar, y $127 + 1$ da $-128$.',
    'En binario solo son exactas las fracciones con denominador potencia de dos: un décimo no cabe, y de ahí vienen los errores de redondeo.'
  ]);
});
