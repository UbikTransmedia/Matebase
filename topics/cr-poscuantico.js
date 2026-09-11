/* Tema: Criptografia poscuantica: reticulos y firmas con hash */
Course.topic('cr-poscuantico', function (p) {

  p.puente('El [[cr-cuantico|algoritmo de Shor]] rompe todo lo que se apoya en factorizar o en el ' +
    'logaritmo discreto. La respuesta es cambiar de problema difícil: uno que ni el ordenador ' +
    'cuántico sepa resolver. Los dos que se han impuesto usan [[al-sistemas|sistemas de ecuaciones]] ' +
    'con un poco de ruido, y [[cr-hash|funciones hash]], que ya son resistentes.');

  p.text('Poscuántico no significa cuántico: son algoritmos que corren en un ordenador normal, pero ' +
    'cuya seguridad no cae ante Shor. Hacían falta problemas difíciles distintos de la factorización, ' +
    'y los candidatos ganadores del concurso del NIST se basan en dos ideas: los <strong>retículos</strong>, ' +
    'que dan cifrado y firma, y las <strong>funciones hash</strong>, que dan firmas con una seguridad ' +
    'que no depende de ninguna conjetura nueva.');

  /* ---------------------------------------------------------------- */
  p.section('Aprender con errores');

  p.text('Resolver un sistema de ecuaciones lineales es fácil: eliminación gaussiana, como en álgebra. ' +
    'Pero si a cada ecuación se le suma un <strong>pequeño error</strong>, todo cambia: recuperar la ' +
    'solución se vuelve, hasta donde se sabe, tan difícil que ni un ordenador cuántico puede. Ese es ' +
    'el problema del <em>aprendizaje con errores</em>, LWE, y sobre él se construye el cifrado.');

  p.formula('b_i = \\langle \\vec a_i,\\ \\vec s \\rangle + e_i \\pmod q, \\qquad e_i \\text{ pequeño}',
    'aprendizaje con errores (LWE)',
    'Se lee: <em>«be sub i es el producto escalar de a sub i por la clave secreta s, más un error ' +
    'pequeño, módulo q»</em>. Se publican muchos pares $(\\vec a_i, b_i)$; la clave es $\\vec s$. Sin ' +
    'el error, con unas pocas ecuaciones se despejaría $\\vec s$ por Gauss. Con el error, cada ' +
    'ecuación es casi cierta y ninguna exacta, y no se conoce forma de recuperar $\\vec s$, ni ' +
    'clásica ni cuántica.');

  p.demo({
    title: 'El ruido lo cambia todo',
    intro: 'Un sistema con la clave secreta $s$ de dos componentes, módulo $q$. Sin ruido, con dos ecuaciones se despeja $s$ al instante. Añade ruido: las ecuaciones dejan de ser exactas y la solución «limpia» ya no encaja en ninguna.',
    predice: 'Sin ruido, dos ecuaciones bastan para dos incógnitas. Con ruido de $\\pm 1$, ¿seguirá encajando la clave verdadera exactamente en las ecuaciones?',
    build: function (host) {
      var q = 97, s = [15, 8], ruido = 1, r = U.rng(4);
      var out = W.mono(host, '');
      function pinta() {
        var filas = [], i;
        for (i = 0; i < 4; i++) { var a = [r.int(0, q - 1), r.int(0, q - 1)], e = ruido ? r.int(-ruido, ruido) : 0; filas.push({ a: a, b: CR.mod(a[0] * s[0] + a[1] * s[1] + e, q), e: e }); }
        var h = '<b>clave secreta s = (' + s.join(', ') + ')</b>, q = ' + q + (ruido ? ', ruido ±' + ruido : ', sin ruido') + '\n\n';
        filas.forEach(function (f) { h += f.a[0] + '·s₁ + ' + f.a[1] + '·s₂ ' + (ruido ? '(+ error ' + (f.e >= 0 ? '+' : '') + f.e + ') ' : '') + '≡ ' + f.b + ' mod ' + q + '\n'; });
        h += '\n<b>comprobación con la clave verdadera</b> (' + s.join(', ') + '):\n';
        filas.forEach(function (f) { var v = CR.mod(f.a[0] * s[0] + f.a[1] * s[1], q); h += f.a[0] + '·' + s[0] + ' + ' + f.a[1] + '·' + s[1] + ' ≡ ' + v + (v === f.b ? '  <span class="cr-ok">= b</span>' : '  <span class="cr-dif">≠ b (off por ' + f.e + ')</span>') + '\n'; });
        h += '\n' + (ruido ? '<span class="cr-dif">Con ruido, ni la clave verdadera cuadra exactamente: Gauss no sirve, hay que «adivinar» los errores, y son demasiadas combinaciones.</span>' : '<span class="cr-ok">Sin ruido, la clave cuadra exacta: dos ecuaciones y Gauss la dan.</span>');
        out.set(h);
      }
      W.chips(host, [{ label: 'sin ruido', value: 0 }, { label: 'ruido ±1', value: 1 }, { label: 'ruido ±2', value: 2 }], { value: ruido, on: function (v) { ruido = v; pinta(); } });
      W.buttons(host, [{ t: 'Otras ecuaciones', on: pinta }]);
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Cifrar un bit con ruido');

  p.text('El cifrado usa el ruido a su favor. La clave pública son muchos pares $(\\vec a_i, b_i)$. Para ' +
    'cifrar un bit, se suman unos cuantos al azar; el resultado es otro par «casi solución». Para ' +
    'enviar un 1 se le añade $q/2$. Al descifrar, quien tiene $\\vec s$ resta $\\langle \\vec a, ' +
    '\\vec s\\rangle$ y le queda una suma de errores pequeños, cerca de 0, o esa suma más $q/2$, ' +
    'cerca de $q/2$: mira si está cerca de 0 (bit 0) o cerca de $q/2$ (bit 1). El ruido, pequeño, no ' +
    'llega a confundir los dos casos.');

  p.formula('\\text{descifrar} = b - \\langle \\vec a, \\vec s\\rangle \\bmod q \\approx \\begin{cases} 0 & \\text{bit } 0 \\\\ q/2 & \\text{bit } 1 \\end{cases}',
    'descifrar por cercanía',
    'La suma de errores se mantiene pequeña frente a $q/2$, así que 0 y $q/2$ no se solapan. Es la ' +
    'misma idea de un código corrector: el ruido desplaza un poco, y se redondea al valor legal más ' +
    'cercano.');

  p.demo({
    title: 'Cifrar un bit con LWE',
    intro: 'Clave secreta $s$ y una clave pública de varios pares. Elige el bit; la demo suma unos pares al azar, añade $q/2$ si el bit es 1, y descifra restando el producto con $s$. Mira cómo el resultado cae cerca de 0 o cerca de $q/2$.',
    predice: 'Si el ruido total llegara a $q/4$, ¿seguiría el 0 distinguiéndose del 1? ¿Y si llegara a $q/2$?',
    build: function (host) {
      var q = 97, s = [15, 8], bit = 1, r = U.rng(7);
      var out = W.mono(host, '');
      function pinta() {
        var pub = [], i;
        for (i = 0; i < 6; i++) { var a = [r.int(0, q - 1), r.int(0, q - 1)], e = r.int(-2, 2); pub.push({ a: a, b: CR.mod(a[0] * s[0] + a[1] * s[1] + e, q), e: e }); }
        var sel = [], suma = [0, 0], sb = 0, errTotal = 0;
        for (i = 0; i < pub.length; i++) if (r.bool(0.5)) { sel.push(i); suma[0] = (suma[0] + pub[i].a[0]) % q; suma[1] = (suma[1] + pub[i].a[1]) % q; sb = (sb + pub[i].b) % q; errTotal += pub[i].e; }
        if (!sel.length) { sel.push(0); suma = pub[0].a.slice(); sb = pub[0].b; errTotal = pub[0].e; }
        var cb = CR.mod(sb + (bit ? Math.round(q / 2) : 0), q);
        var desc = CR.mod(cb - (suma[0] * s[0] + suma[1] * s[1]), q);
        var cerca0 = Math.min(desc, q - desc), cercaMitad = Math.abs(desc - Math.round(q / 2));
        out.set('<b>bit a enviar: ' + bit + '</b>   q/2 ≈ ' + Math.round(q / 2) + '\n<b>se suman los pares</b> ' + sel.join(', ') + ' de la clave pública\n  cifrado: a = (' + suma.join(', ') + '), b = ' + cb + '\n\n<b>descifrar:</b> b − a·s mod q = ' + desc + '\n  distancia a 0: ' + cerca0 + '   distancia a q/2: ' + cercaMitad + '\n  → más cerca de ' + (cerca0 < cercaMitad ? '<b>0: bit 0</b>' : '<b>q/2: bit 1</b>') + (((cerca0 < cercaMitad) ? 0 : 1) === bit ? '  <span class="cr-ok">correcto</span>' : '  <span class="cr-dif">error</span>') + '\n<span class="cr-tenue">suma de errores: ' + errTotal + ', muy por debajo de q/4 = ' + Math.round(q / 4) + ': por eso 0 y 1 no se confunden.</span>');
      }
      W.chips(host, [{ label: 'enviar 0', value: 0 }, { label: 'enviar 1', value: 1 }], { value: bit, on: function (v) { bit = v; pinta(); } });
      W.buttons(host, [{ t: 'Cifrar otra vez', cls: 'btn--main', on: pinta }]);
      pinta();
    }
  });

  p.comprueba('En el cifrado LWE, ¿por qué el error tiene que ser pequeño frente a $q/2$?', [
    { t: 'Porque al descifrar el resultado cae cerca de 0 o de $q/2$, y un error grande podría empujar un 0 hasta parecer un 1', ok: true, por: 'El bit se lee por cercanía. Si la suma de errores se acercara a $q/4$, las dos regiones se tocarían y el descifrado fallaría. Pequeño frente a $q/2$ mantiene 0 y 1 separados.' },
    { t: 'Porque si no, la clave se descifra', ok: false, por: 'Es al revés: el error es lo que hace difícil recuperar la clave. El límite de tamaño es para que el descifrado legítimo no se equivoque.' },
    { t: 'Para que la clave pública sea más corta', ok: false, por: 'El tamaño del error no cambia la longitud de la clave. Su papel es equilibrar seguridad (cuanto más ruido, más difícil) y corrección (poco ruido para no confundir bits).' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Firmar con una función hash');

  p.text('La otra familia no necesita ningún problema nuevo: le basta con que exista una función hash ' +
    'resistente, cosa que ya tenemos y que Shor no rompe. La firma de <strong>Lamport</strong>, de ' +
    '1979, firma un solo bit así: la clave privada son dos números secretos al azar, $x_0$ y $x_1$; ' +
    'la pública, sus hashes $H(x_0)$ y $H(x_1)$. Para firmar el bit 0 se revela $x_0$; para el 1, ' +
    '$x_1$. Cualquiera comprueba que su hash coincide con el publicado.');

  p.formula('\\text{privada: } x_0, x_1; \\quad \\text{pública: } H(x_0), H(x_1); \\quad \\text{firma del bit } b: x_b',
    'firma de Lamport de un bit',
    'Se lee: <em>«la clave privada son dos secretos; la pública, sus hashes; la firma del bit b es el ' +
    'secreto b»</em>. Falsificar exigiría, dado $H(x_b)$, encontrar $x_b$: una preimagen, que ni ' +
    'siquiera un ordenador cuántico halla mejor que en $2^{n/2}$ con Grover.<br><br>Para firmar un ' +
    'mensaje de 256 bits se hashea primero y se firman sus 256 bits, con 256 parejas. Y cada clave ' +
    'firma <strong>una sola vez</strong>: revelar dos bits de dos firmas distintas daría pistas. Las ' +
    'versiones modernas encadenan muchas claves de un uso en un árbol de Merkle para poder firmar ' +
    'muchas veces.');

  p.demo({
    title: 'Firmar tres bits con Lamport',
    intro: 'La clave privada son seis secretos (dos por bit); la pública, sus seis hashes. Elige el mensaje de 3 bits: la firma revela un secreto por bit, y el verificador comprueba los hashes. Fíjate en que los secretos no revelados siguen ocultos.',
    predice: 'Para firmar el bit b se revela uno de los dos secretos de esa posición. Si Eva ve la firma del mensaje 010, ¿puede fabricar la firma de 011?',
    build: function (host) {
      var msg = [0, 1, 0], r = U.rng(9), priv = [];
      for (var i = 0; i < 3; i++) priv.push([r.int(1e6, 9e6), r.int(1e6, 9e6)]);
      var out = W.mono(host, '');
      function H(x) { return CR.sha256('' + x).slice(0, 8); }
      function pinta() {
        var h = '<b>clave pública</b> (hashes):\n';
        for (var i = 0; i < 3; i++) h += '  bit ' + i + ':  H(x₀)=' + H(priv[i][0]) + '   H(x₁)=' + H(priv[i][1]) + '\n';
        h += '\n<b>mensaje: ' + msg.join('') + '</b>\n<b>firma</b> (un secreto por bit):\n';
        for (i = 0; i < 3; i++) h += '  bit ' + i + ' = ' + msg[i] + ':  revela x' + msg[i] + ' = ' + priv[i][msg[i]] + '   (x' + (1 - msg[i]) + ' sigue oculto)\n';
        h += '\n<b>verificación:</b>\n';
        for (i = 0; i < 3; i++) h += '  H(' + priv[i][msg[i]] + ') = ' + H(priv[i][msg[i]]) + ' = el hash publicado ✓\n';
        out.set(h);
      }
      var caja = U.el('div.chips'); host.appendChild(caja);
      msg.forEach(function (b, i) { (function (i) { var btn = U.el('button.chip' + (msg[i] ? '.is-on' : ''), { type: 'button', text: 'bit ' + i + ': ' + msg[i] }); btn.addEventListener('click', function () { msg[i] = msg[i] ? 0 : 1; btn.textContent = 'bit ' + i + ': ' + msg[i]; btn.classList.toggle('is-on'); pinta(); }); caja.appendChild(btn); })(i); });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Por qué Lamport resiste',
    enunciado: 'Con hashes de 256 bits, estimar el coste de falsificar una firma de Lamport de un bit para un atacante clásico y para uno cuántico, y explicar por qué una clave firma una sola vez.',
    pasos: [
      { t: '<strong>Clásico.</strong> Falsificar el bit 0 sin conocer $x_0$ exige, dado $H(x_0)$, hallar una preimagen: $2^{256}$ intentos. Inalcanzable.', antes: 'Falsificar es invertir el hash. ¿Cuánto cuesta?' },
      { t: '<strong>Cuántico.</strong> Grover da la raíz: $2^{128}$. Sigue siendo inalcanzable, y no hay ningún Shor para las funciones hash, porque no tienen estructura de periodo.', antes: '¿Qué le hace Grover a una preimagen de 256 bits?' },
      { t: '<strong>Una firma, un mensaje 0 y un mensaje 1.</strong> Si con una misma clave se firma un bit 0 (revela $x_0$) y luego un bit 1 (revela $x_1$), Eva conoce los dos secretos de esa posición y puede firmar ese bit como quiera.', antes: '¿Qué aprende Eva si ve las firmas de un 0 y de un 1 en la misma posición?' },
      { t: '<strong>La solución.</strong> Cada clave de un solo uso, y muchas colgando de un árbol de Merkle cuya raíz es la clave pública permanente: así se firman millones de mensajes, cada uno con una hoja distinta. Es lo que hacen los esquemas SPHINCS y XMSS.' }
    ],
    cierre: 'La seguridad no descansa en ninguna conjetura nueva, solo en que el hash resista. Por eso las firmas basadas en hash son las más conservadoras del catálogo poscuántico.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Lo que ya se está usando');

  p.table(['Nombre (NIST)', 'Basado en', 'Para qué', 'Precio'], [
    ['ML-KEM (Kyber)', 'retículos (LWE con estructura)', 'intercambio de claves', 'claves de ~1 KB, muy rápido'],
    ['ML-DSA (Dilithium)', 'retículos', 'firmas', 'firmas de ~2-4 KB'],
    ['SLH-DSA (SPHINCS+)', 'funciones hash', 'firmas conservadoras', 'firmas grandes, ~8-50 KB, pero mínima confianza'],
    ['(clásicos, a retirar)', 'factorización, log discreto', 'RSA, curvas', 'rotos por Shor']
  ]);

  p.text('El precio poscuántico es el tamaño: las claves y las firmas pasan de decenas de bytes a ' +
    'kilobytes. A cambio, resisten a Shor. Como nadie quiere apostarlo todo a un problema nuevo, la ' +
    'transición es <strong>híbrida</strong>: se combina un intercambio clásico de curva con uno ' +
    'poscuántico, y hace falta romper los dos para leer nada. Los navegadores lo activaron en 2023, ' +
    'y el NIST publicó los primeros estándares en 2024.');

  p.util('Cuando abres una web con un navegador reciente, el intercambio de claves ya suele ser híbrido: ' +
    'X25519 clásico combinado con ML-KEM poscuántico. Las mensajerías cifradas empezaron a añadir una ' +
    'capa poscuántica en 2023. Y los sistemas que tienen que proteger secretos durante décadas, ' +
    'documentos de Estado, historiales médicos, ya firman con esquemas basados en hash, porque son ' +
    'los que menos dependen de que una conjetura matemática siga en pie dentro de cuarenta años.');

  p.hist('Miklós Ajtai relacionó en 1996 la dificultad media de los retículos con la del peor caso, un ' +
    'resultado insólito, y Oded Regev definió LWE en 2005, lo que le valió el premio Gödel. Leslie ' +
    'Lamport describió las firmas con hash en 1979, y Ralph Merkle las hizo prácticas con su árbol. ' +
    'El NIST abrió el concurso poscuántico en 2016 con 82 candidatos; en 2022 anunció los ganadores, ' +
    'Kyber y Dilithium entre ellos, y en 2024 salieron como estándares ML-KEM, ML-DSA y SLH-DSA.');

  p.trampas([
    { e: 'Creer que «poscuántico» significa que corre en un ordenador cuántico', por: 'Corre en un ordenador normal. Lo poscuántico es que resiste a uno cuántico.' },
    { e: 'Quitar el error de LWE para que sea más limpio', por: 'Sin error es un sistema lineal: Gauss lo resuelve y la clave cae. El ruido es toda la seguridad.' },
    { e: 'Reutilizar una clave de Lamport', por: 'Firmar un 0 y un 1 en la misma posición revela los dos secretos. Una clave, una firma; para más, un árbol de claves.' },
    { e: 'Migrar de golpe a solo poscuántico', por: 'Los esquemas nuevos son jóvenes. La transición es híbrida: clásico más poscuántico, para no fiarlo todo a un problema sin décadas de ataques encima.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Comprobar una ecuación de LWE',
    level: 'basico',
    gen: function (r) { var q = 97, s = [r.int(2, 40), r.int(2, 40)], a = [r.int(0, q - 1), r.int(0, q - 1)], e = r.int(-2, 2); return { q: q, s: s, a: a, e: e, b: CR.mod(a[0] * s[0] + a[1] * s[1] + e, q), sinE: CR.mod(a[0] * s[0] + a[1] * s[1], q) }; },
    ask: function (d) { return 'En LWE módulo ' + d.q + ', la clave es $s = (' + d.s.join(', ') + ')$ y una ecuación tiene $a = (' + d.a.join(', ') + ')$ con error $e = ' + d.e + '$. Calcula $b = \\langle a, s\\rangle + e \\bmod ' + d.q + '$.'; },
    fields: [{ name: 'b', label: 'b', w: 'tiny' }],
    sol: function (d) { return { b: d.b }; },
    errores: [{ si: function (v, d) { return d.e !== 0 && v.b === d.sinE; }, msg: 'Falta sumar el error $e$ antes de reducir módulo $q$.' }],
    hint: function () { return 'Producto escalar, más el error, módulo q.'; },
    steps: function (d) { return ['$' + d.a[0] + '\\cdot ' + d.s[0] + ' + ' + d.a[1] + '\\cdot ' + d.s[1] + ' + (' + d.e + ') = ' + (d.a[0] * d.s[0] + d.a[1] * d.s[1] + d.e) + ' \\equiv ' + d.b + ' \\pmod{' + d.q + '}$.']; },
    answer: function (d) { return String(d.b); }
  });

  p.exercise({
    title: 'Leer el bit descifrado',
    level: 'basico',
    gen: function (r) { var q = 97, v = r.int(0, q - 1); var d0 = Math.min(v, q - v), dm = Math.abs(v - Math.round(q / 2)); return { q: q, v: v, d0: d0, dm: dm, bit: d0 < dm ? 0 : 1 }; },
    ask: function (d) { return 'Al descifrar un cifrado LWE con $q = 97$ (así que $q/2 \\approx 48$), queda el valor $' + d.v + '$. ¿Está más cerca de 0 o de $q/2$, y qué bit es?'; },
    fields: [{ name: 'b', label: 'bit', opts: [{ t: '0 (cerca de 0)', v: '0' }, { t: '1 (cerca de q/2)', v: '1' }] }],
    sol: function (d) { return { b: String(d.bit) }; },
    hint: function (d) { return 'Distancia a 0 (contando la vuelta): min(' + d.v + ', ' + (d.q - d.v) + '). Distancia a 48: |' + d.v + ' − 48|.'; },
    steps: function (d) { return ['Distancia a 0: ' + d.d0 + '. Distancia a 48: ' + d.dm + '.', 'Más cerca de ' + (d.bit ? 'q/2: <strong>bit 1</strong>' : '0: <strong>bit 0</strong>') + '.']; },
    answer: function (d) { return 'bit ' + d.bit; }
  });

  p.exercise({
    title: 'La clave pública de Lamport',
    level: 'medio',
    gen: function (r) { var n = r.pick([1, 8, 16, 32, 64, 256]); return { n: n, priv: 2 * n, pub: 2 * n }; },
    ask: function (d) { return 'Para firmar mensajes de ' + d.n + ' bit' + (d.n > 1 ? 's' : '') + ' con Lamport, ¿cuántos secretos tiene la clave privada, y cuántos hashes la pública?'; },
    fields: [{ name: 'a', label: 'secretos privados', w: 'tiny' }, { name: 'b', label: 'hashes públicos', w: 'tiny' }],
    sol: function (d) { return { a: d.priv, b: d.pub }; },
    hint: function () { return 'Dos secretos por bit (uno para el 0, otro para el 1), y su hash cada uno.'; },
    steps: function (d) { return ['$2\\cdot ' + d.n + ' = ' + d.priv + '$ secretos, y $' + d.pub + '$ hashes.', 'Un mensaje real se hashea a 256 bits y se firman esos 256: 512 secretos por firma, y la clave sirve una sola vez.']; },
    answer: function (d) { return d.priv + ' y ' + d.pub; }
  });

  p.exercise({
    title: 'Falsificar Lamport',
    level: 'medio',
    gen: function (r) { var bits = r.pick([128, 256]), cuant = r.bool(0.5); return { bits: bits, cuant: cuant, exp: cuant ? bits / 2 : bits }; },
    ask: function (d) { return 'La clave pública de Lamport revela $H(x_b)$ con un hash de ' + d.bits + ' bits. Para falsificar una firma, un atacante ' + (d.cuant ? 'cuántico (con Grover)' : 'clásico') + ' tiene que encontrar una preimagen. ¿Cuántas operaciones, como $2^{\\,?}$?'; },
    fields: [{ name: 'e', label: '2^', w: 'tiny' }],
    sol: function (d) { return { e: d.exp }; },
    hint: function (d) { return d.cuant ? 'Grover da la raíz cuadrada: la mitad de los bits.' : 'Una preimagen a fuerza bruta: todos los bits.'; },
    steps: function (d) { return [d.cuant ? 'Grover: $\\sqrt{2^{' + d.bits + '}} = 2^{' + d.exp + '}$.' : 'Preimagen clásica: $2^{' + d.bits + '}$.', 'No hay Shor contra un hash: no tiene periodo que explotar. Por eso las firmas con hash son poscuánticas «gratis».']; },
    answer: function (d) { return '2^' + d.exp; }
  });

  p.exercise({
    title: 'Clásico o poscuántico',
    level: 'avanzado',
    gen: function (r) { var casos = [{ t: 'La seguridad de RSA', v: 'roto', por: 'Se apoya en factorizar: Shor lo rompe.' }, { t: 'La seguridad de LWE (aprendizaje con errores)', v: 'pq', por: 'Recuperar la clave de un sistema con ruido: sin ataque cuántico conocido.' }, { t: 'La seguridad de una firma de Lamport', v: 'pq', por: 'Depende solo de que el hash resista la preimagen: poscuántica.' }, { t: 'La seguridad de Diffie-Hellman con curvas', v: 'roto', por: 'Logaritmo discreto en la curva: Shor lo rompe.' }, { t: 'La seguridad de ML-KEM (Kyber)', v: 'pq', por: 'Retículos con estructura: resistente a Shor.' }, { t: 'La seguridad de ElGamal', v: 'roto', por: 'Logaritmo discreto: Shor lo rompe.' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return '¿Sobrevive a un ordenador cuántico grande? «' + d.c.t + '»'; },
    fields: [{ name: 'q', label: 'Veredicto', opts: [{ t: 'sobrevive (poscuántico)', v: 'pq' }, { t: 'lo rompe Shor', v: 'roto' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Si se apoya en factorizar o en el logaritmo discreto, Shor lo rompe. Si se apoya en retículos con ruido o en funciones hash, sobrevive.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'pq' ? 'sobrevive' : 'roto'; }
  });

  p.keys([
    'Poscuántico = corre en un ordenador normal y resiste a Shor. Dos familias: retículos y funciones hash.',
    'LWE: un sistema lineal con un error pequeño en cada ecuación. Sin el error, Gauss lo resuelve; con él, ni un ordenador cuántico.',
    'Se cifra un bit sumando pares al azar y añadiendo $q/2$ para el 1; se descifra por cercanía a 0 o a $q/2$, y el error debe ser pequeño frente a $q/2$.',
    'Lamport firma un bit revelando uno de dos secretos cuyos hashes son públicos; su seguridad es solo la del hash, y cada clave firma una vez.',
    'El precio poscuántico es el tamaño; la transición es híbrida, clásico más poscuántico, y ya está en marcha.'
  ]);
});
