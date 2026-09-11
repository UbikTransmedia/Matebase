/* Tema: El logaritmo discreto a fondo: ElGamal y el hombre en el medio */
Course.topic('cr-logdiscreto', function (p) {

  p.puente('[[av-cripto-curvas|Diffie-Hellman]] dejó el logaritmo discreto como un problema «sin atajo». ' +
    'Este tema mira qué atajos hay, con el lenguaje de los [[av-grupos|grupos]]: órdenes y ' +
    'generadores, un ataque de raíz cuadrada, otro que aprovecha los factores de $p - 1$ con el ' +
    '[[cr-modular|teorema chino]], y el cifrado que se construye encima. Y un ataque que no toca la ' +
    'matemática y lo rompe todo.');

  p.text('El logaritmo discreto no tiene atajo <em>en general</em>, pero sí tiene métodos mucho mejores ' +
    'que probar exponentes uno a uno, y tiene casos en los que se hunde por completo. Elegir bien ' +
    'el primo $p$ y la base $g$ es lo que separa un Diffie-Hellman seguro de uno que se rompe en un ' +
    'portátil, y en 2015 se descubrió que una parte de internet usaba los malos.');

  /* ---------------------------------------------------------------- */
  p.section('Órdenes y generadores');

  p.text('Módulo un primo $p$, las potencias de $g$ no recorren cualquier cosa: $g^1, g^2, g^3, \\dots$ ' +
    'vuelven al 1 tras un número de pasos que se llama el <strong>orden</strong> de $g$, y ese orden ' +
    'divide siempre a $p - 1$. Si el orden es exactamente $p - 1$, las potencias de $g$ dan todos ' +
    'los números del 1 al $p - 1$ y $g$ es un <strong>generador</strong>. Para Diffie-Hellman se ' +
    'quiere que el orden sea grande: si $g$ tuviera orden 10, solo habría 10 claves posibles.');

  p.formula('\\operatorname{ord}(g) \\mid p - 1, \\qquad p = 2q + 1 \\text{ con } q \\text{ primo} \\Rightarrow \\operatorname{ord}(g) \\in \\{1, 2, q, 2q\\}',
    'órdenes en un primo seguro',
    'Se lee: <em>«el orden de ge divide a pe menos uno»</em>. Con un <strong>primo seguro</strong>, ' +
    '$p = 2q + 1$, los únicos órdenes posibles son 1, 2, $q$ y $2q$: cualquier $g$ que no sea $\\pm 1$ ' +
    'tiene orden enorme. Por eso los primos de Diffie-Hellman se eligen así.');

  p.demo({
    title: 'Las potencias de g',
    intro: 'Módulo el primo elegido, las potencias de $g$ hasta volver al 1. El orden es cuántas hay; si son $p - 1$, $g$ es generador. Prueba varios $g$ con $p = 23 = 2\\cdot 11 + 1$, primo seguro, y con $p = 31$, que no lo es.',
    predice: 'Con $p = 23$, ¿qué órdenes pueden salir? ¿Y con $p = 31$, cuyo $p - 1 = 30 = 2\\cdot 3\\cdot 5$?',
    build: function (host) {
      var P = 23, g = 5;
      var out = W.mono(host, '');
      function pinta() {
        g = Math.min(g, P - 1);
        var v = 1, l = [], orden = CR.orden(g, P);
        for (var k = 1; k <= orden; k++) { v = v * g % P; l.push(v); }
        var gens = [];
        for (var x = 2; x < P; x++) if (CR.orden(x, P) === P - 1) gens.push(x);
        out.set('<b>p = ' + P + '</b>, p − 1 = ' + (P - 1) + ' = ' + ML.factorTex(P - 1).replace(/\\cdot/g, '·').replace(/\^\{(\d+)\}/g, '^$1') + '\n<b>g = ' + g + ':</b> ' + l.join(', ') + '\n<b>orden ' + orden + '</b>' + (orden === P - 1 ? '  <span class="cr-ok">generador: recorre los ' + (P - 1) + ' restos</span>' : '  <span class="cr-tenue">solo ' + orden + ' valores posibles para g^a</span>') + '\n\n<span class="cr-tenue">generadores módulo ' + P + ': ' + gens.join(', ') + ' (' + gens.length + ' de ' + (P - 2) + ')</span>');
      }
      W.chips(host, [{ label: 'p = 23 (seguro)', value: 23 }, { label: 'p = 31', value: 31 }, { label: 'p = 47 (seguro)', value: 47 }, { label: 'p = 61', value: 61 }], { value: P, on: function (v) { P = v; pinta(); } });
      W.slider(W.row(host), { label: 'g', min: 2, max: 60, step: 1, value: g, on: function (v) { g = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Paso de bebé, paso de gigante');

  p.text('Para hallar $x$ con $g^x = h$, probar $x = 1, 2, 3, \\dots$ cuesta hasta $p$ pasos. Shanks ' +
    'observó que se puede cambiar tiempo por memoria: escribir $x = im + j$ con $m = \\lceil\\sqrt{p}\\rceil$, ' +
    'y buscar la coincidencia entre dos listas de $m$ elementos.');

  p.formulas([
    'x = i\\,m + j, \\qquad g^{j} = h\\,(g^{-m})^{i}',
    '\\text{bebés: } g^0, g^1, \\dots, g^{m-1} \\qquad \\text{gigantes: } h,\\ h g^{-m},\\ h g^{-2m}, \\dots'
  ], 'paso de bebé, paso de gigante',
    'Se lee: <em>«ge a la jota es igual a hache por ge a la menos eme, elevado a i»</em>. Los pasos de ' +
    'bebé avanzan de uno en uno y se guardan en una tabla; los de gigante retroceden de $m$ en $m$ ' +
    'desde $h$. Cuando un gigante cae sobre un bebé, $x = im + j$.<br><br>Coste: $2\\sqrt{p}$ ' +
    'operaciones y $\\sqrt{p}$ de memoria. Con $p$ de 2048 bits, $2^{1024}$: sigue sin servir, igual ' +
    'que Pollard rho contra RSA. Pero fija la regla: la seguridad de un grupo es la raíz cuadrada de ' +
    'su orden, y por eso las curvas elípticas de 256 bits dan 128 bits.');

  p.demo({
    title: 'Las dos listas',
    intro: 'Con $p$, $g$ y el valor $h = g^x$ elegido, la demo construye los pasos de bebé y va dando pasos de gigante hasta la coincidencia. Compara el número de operaciones con probar exponentes uno a uno.',
    predice: 'Con $p = 1009$, $m = 32$. ¿Cuántas operaciones como mucho hará el método: unas 64, unas 1000 o unas 32 000?',
    build: function (host) {
      var P = 1009, g = 11, x = 700;
      var out = W.mono(host, '');
      function pinta() {
        var h = CR.potMod(g, x, P), m = Math.ceil(Math.sqrt(P)), bebes = {}, v = 1, txt = '<b>p = ' + P + ', g = ' + g + ', h = g^x = ' + h + '</b>   m = ⌈√p⌉ = ' + m + '\n\n';
        for (var j = 0; j < m; j++) { if (bebes[v] === undefined) bebes[v] = j; v = v * g % P; }
        txt += '<b>bebés:</b> g^0…g^' + (m - 1) + ' = ' + Object.keys(bebes).sort(function (a, b) { return bebes[a] - bebes[b]; }).slice(0, 8).join(', ') + '…\n';
        var gm = CR.inv(CR.potMod(g, m, P), P), cur = h, hallado = null;
        for (var i = 0; i < m; i++) {
          if (i < 5) txt += 'gigante ' + i + ': h·g^(−' + (i * m) + ') = ' + cur + (bebes[cur] !== undefined ? '  <span class="cr-ok">está entre los bebés, j = ' + bebes[cur] + '</span>' : '') + '\n';
          if (bebes[cur] !== undefined) { hallado = { i: i, j: bebes[cur] }; break; }
          cur = cur * gm % P;
        }
        if (hallado) txt += (hallado.i >= 5 ? '…\ngigante ' + hallado.i + ': ' + cur + '  <span class="cr-ok">coincide con el bebé j = ' + hallado.j + '</span>\n' : '') + '\n<b>x = ' + hallado.i + '·' + m + ' + ' + hallado.j + ' = ' + (hallado.i * m + hallado.j) + '</b>   <span class="cr-tenue">' + (m + hallado.i + 1) + ' operaciones frente a ' + x + ' probando uno a uno</span>';
        out.set(txt);
      }
      W.chips(host, [{ label: 'p = 1009, g = 11', value: 1009 }, { label: 'p = 10 007, g = 5', value: 10007 }, { label: 'p = 100 003, g = 2', value: 100003 }], { value: P, on: function (v) { P = v; g = v === 1009 ? 11 : (v === 10007 ? 5 : 2); x = Math.min(x, P - 2); pinta(); } });
      W.slider(W.row(host), { label: 'el exponente secreto x', min: 1, max: 99999, step: 1, value: x, on: function (v) { x = Math.min(v, P - 2); pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Bebés y gigantes con p = 23',
    enunciado: 'Resolver $5^x \\equiv 8 \\pmod{23}$ con el método de Shanks.',
    pasos: [
      { t: '<strong>Los bebés.</strong> $m = \\lceil\\sqrt{23}\\rceil = 5$. $5^0 = 1$, $5^1 = 5$, $5^2 = 25 \\equiv 2$, $5^3 = 10$, $5^4 = 50 \\equiv 4$. Tabla: $\\{1{:}0,\\ 5{:}1,\\ 2{:}2,\\ 10{:}3,\\ 4{:}4\\}$.', antes: '¿Cuánto vale $m$, y cuáles son las cinco primeras potencias de 5?' },
      { t: '<strong>El paso de gigante.</strong> $g^{-m} = (5^5)^{-1}$. $5^5 = 4\\cdot 5 = 20$, y el inverso de 20 módulo 23 es 15, porque $20\\cdot 15 = 300 = 13\\cdot 23 + 1$.', antes: 'Calcula $5^5$ y su inverso.' },
      { t: '<strong>Los gigantes.</strong> $i = 0$: $h = 8$, no está en la tabla. $i = 1$: $8\\cdot 15 = 120 \\equiv 5$, que sí está, con $j = 1$.', antes: 'Multiplica $h$ por 15 y busca en la tabla.' },
      { t: '<strong>La solución.</strong> $x = im + j = 1\\cdot 5 + 1 = 6$. Comprobación: $5^6 = 15\\,625 = 679\\cdot 23 + 8$ ✓. Siete operaciones en vez de seis… con $p$ de seis cifras serían mil en vez de cientos de miles.' }
    ],
    cierre: 'El método es exacto y general: solo depende de que el grupo sea grande. Para un grupo de $2^{256}$ elementos cuesta $2^{128}$, que es justo lo que se pide.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Pohlig y Hellman: cuando p − 1 se descompone en trozos pequeños');

  p.text('Hay un ataque que no depende del tamaño de $p$ sino de la factorización de $p - 1$. Si ' +
    '$p - 1 = q_1 q_2 \\cdots q_k$ con todos los $q_i$ pequeños, el logaritmo módulo $p - 1$ se puede ' +
    'calcular módulo cada $q_i$ por separado, elevando $g$ y $h$ a $(p-1)/q_i$ para caer en un ' +
    'subgrupo de orden $q_i$, donde bebés y gigantes cuestan $\\sqrt{q_i}$, y recomponer con el ' +
    'teorema chino del resto. El coste lo fija el <strong>mayor factor primo de $p - 1$</strong>, no ' +
    '$p$. Un primo de 2048 bits con $p - 1$ hecho de factores de 40 bits se rompe en un momento.');

  p.comprueba('Un servidor usa Diffie-Hellman con un primo $p$ de 2048 bits tal que $p - 1 = 2\\cdot 3\\cdot 5\\cdots$, producto de muchos primos pequeños. ¿Es seguro?', [
    { t: 'No: Pohlig-Hellman resuelve el logaritmo en cada factor pequeño y los junta con el teorema chino. El tamaño de $p$ no importa', ok: true, por: 'Lo que cuenta es el mayor factor primo de $p - 1$. Por eso se usan primos seguros, $p = 2q + 1$, en los que ese factor es $q$, del tamaño de $p$.' },
    { t: 'Sí: 2048 bits son suficientes contra bebés y gigantes', ok: false, por: 'Bebés y gigantes sobre todo el grupo costaría $2^{1024}$, pero nadie lo haría así: se ataca cada subgrupo pequeño, y ahí cuesta nada.' },
    { t: 'Depende de $g$', ok: false, por: 'Ningún $g$ salva un $p - 1$ así: el orden de $g$ divide a $p - 1$ y hereda sus factores pequeños.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('ElGamal: cifrar con el logaritmo discreto');

  p.text('Diffie-Hellman acuerda una clave; ElGamal la convierte en un cifrado de clave pública. Benito ' +
    'publica $y = g^x$ y guarda $x$. Para enviarle $m$, Alicia elige un número al azar $k$, nuevo ' +
    'cada vez, y envía dos números:');

  p.formulas([
    'c_1 = g^{k}, \\qquad c_2 = m\\cdot y^{k} \\pmod p',
    'm = c_2 \\cdot (c_1^{x})^{-1} \\pmod p'
  ], 'cifrado de ElGamal',
    'Se lee: <em>«ce uno es ge a la ka, y ce dos es eme por y a la ka»</em>. Es Diffie-Hellman de un ' +
    'solo uso: $c_1$ es la mitad de Alicia, $y^k = g^{xk}$ es la clave compartida, y el mensaje va ' +
    'multiplicado por ella. Benito recupera $g^{xk}$ como $c_1^x$ y divide.<br><br>Gracias al $k$ ' +
    'aleatorio, el mismo mensaje da cifrados distintos cada vez: ElGamal no tiene el defecto del RSA ' +
    'de libro. Sigue siendo maleable, y el cifrado ocupa el doble que el mensaje.');

  p.demo({
    title: 'ElGamal, con k nuevo cada vez',
    intro: 'Benito tiene $x$; su clave pública es $y = g^x$. Alicia cifra el mismo mensaje varias veces con distintos $k$: los cifrados no se parecen, y Benito los descifra todos.',
    predice: 'Si Alicia reutilizara el mismo $k$ para dos mensajes $m_1$ y $m_2$, ¿qué podría calcular Eva a partir de los dos $c_2$?',
    build: function (host) {
      var P = 1019, g = 2, x = 347, m = 500, k = 77;
      var out = W.mono(host, '');
      function pinta() {
        var y = CR.potMod(g, x, P), c1 = CR.potMod(g, k, P), c2 = CR.mulMod(m, CR.potMod(y, k, P), P), s = CR.potMod(c1, x, P), md = CR.mulMod(c2, CR.inv(s, P), P);
        out.set('<b>público:</b> p = ' + P + ', g = ' + g + ', y = g^x = ' + y + '   <b>secreto de Benito:</b> x = ' + x + '\n\n<b>Alicia</b> elige k = ' + k + ':\n  c₁ = g^k = ' + c1 + '\n  c₂ = m · y^k = ' + m + ' · ' + CR.potMod(y, k, P) + ' mod p = ' + c2 + '\n\n<b>Benito:</b> c₁^x = ' + s + ', inverso ' + CR.inv(s, P) + ', m = c₂ · ' + CR.inv(s, P) + ' mod p = <b>' + md + '</b>' + (md === m ? ' <span class="cr-ok">✓</span>' : ''));
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'mensaje m', min: 1, max: 1018, step: 1, value: m, on: function (v) { m = v; pinta(); } });
      W.slider(fila, { label: 'k de Alicia', min: 1, max: 1017, step: 1, value: k, on: function (v) { k = v; pinta(); } });
      W.slider(W.row(host), { label: 'x de Benito', min: 1, max: 1017, step: 1, value: x, on: function (v) { x = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El hombre en el medio');

  p.text('Y ahora el ataque que no toca la matemática. Diffie-Hellman acuerda una clave con ' +
    '<em>alguien</em>, pero no dice con quién. Si Mallory está en medio del canal, intercepta el $A$ ' +
    'de Alicia, envía a Benito su propio $M$, intercepta el $B$ de Benito y envía a Alicia otro $M$. ' +
    'Alicia acuerda una clave con Mallory creyendo que es Benito; Benito, otra con Mallory creyendo ' +
    'que es Alicia. Mallory descifra, lee, vuelve a cifrar y reenvía. Nadie nota nada.');

  p.demo({
    title: 'Mallory en el canal',
    intro: 'Un intercambio de Diffie-Hellman con Mallory en medio. Alicia y Benito calculan cada uno «su» clave, y las dos son distintas: cada una la comparte con Mallory. Sin algo que autentique a la otra parte, el intercambio no protege contra esto.',
    predice: 'Alicia y Benito creen tener la misma clave. ¿Coincidirán las dos claves que calculan? ¿Quién conoce cada una?',
    build: function (host) {
      var P = 1019, g = 2, a = 123, b = 456, m1 = 77, m2 = 91;
      var out = W.mono(host, '');
      function pinta() {
        var A = CR.potMod(g, a, P), B = CR.potMod(g, b, P), M1 = CR.potMod(g, m1, P), M2 = CR.potMod(g, m2, P);
        var kA = CR.potMod(M2, a, P), kB = CR.potMod(M1, b, P), kMA = CR.potMod(A, m2, P), kMB = CR.potMod(B, m1, P);
        out.set('<b>Alicia</b> envía A = g^a = ' + A + '  →  <b>Mallory</b> lo guarda y envía a Benito M₁ = g^m₁ = ' + M1 + '\n<b>Benito</b> envía B = g^b = ' + B + '  →  <b>Mallory</b> lo guarda y envía a Alicia M₂ = g^m₂ = ' + M2 + '\n\n<b>Alicia</b> calcula M₂^a = ' + kA + '        <b>Mallory</b> calcula A^m₂ = ' + kMA + (kA === kMA ? '  <span class="cr-dif">la misma</span>' : '') + '\n<b>Benito</b> calcula M₁^b = ' + kB + '        <b>Mallory</b> calcula B^m₁ = ' + kMB + (kB === kMB ? '  <span class="cr-dif">la misma</span>' : '') + '\n\nAlicia y Benito tienen claves <b>distintas</b> (' + kA + ' y ' + kB + '), cada una compartida con Mallory, que traduce entre las dos y lo lee todo.');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'secreto de Alicia', min: 2, max: 1000, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'secreto de Benito', min: 2, max: 1000, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      W.slider(W.row(host), { label: 'secreto de Mallory', min: 2, max: 1000, step: 1, value: m1, on: function (v) { m1 = v; m2 = v + 14; pinta(); } });
      pinta();
    }
  });

  p.text('La defensa no es matemática: hace falta que Alicia pueda comprobar que el $B$ que recibe es ' +
    'de Benito. Eso es una <strong>firma</strong>, y es el tema siguiente. Diffie-Hellman con firmas ' +
    'es lo que hace tu navegador; Diffie-Hellman a secas solo protege contra quien escucha, no ' +
    'contra quien se pone en medio.');

  p.util('En 2015, el ataque Logjam mostró que muchos servidores aceptaban Diffie-Hellman con primos de ' +
    '512 bits, y que el 8 % de la web usaba <em>el mismo</em> primo de 1024 bits: un cálculo de ' +
    'criba de unos meses sobre ese primo permitiría después resolver cada logaritmo en minutos, ' +
    'para todos los servidores a la vez. Desde entonces los navegadores exigen 2048 bits o curvas ' +
    'elípticas. Y el hombre en el medio es el ataque cotidiano de las redes wifi públicas: por eso ' +
    'existe el candado, que es una firma sobre el intercambio.');

  p.hist('Daniel Shanks publicó los pasos de bebé y gigante en 1971, para calcular números de clase, ' +
    'sin pensar en cifrados. Stephen Pohlig y Martin Hellman publicaron su reducción en 1978, y ' +
    'Taher ElGamal, egipcio, entonces estudiante de Hellman en Stanford, propuso su cifrado y su ' +
    'firma en 1985. El «hombre en el medio» se describió en el mismo artículo de Diffie y Hellman de ' +
    '1976, que ya advertía de la necesidad de autenticar; tardó veinte años en resolverse en la ' +
    'práctica con los certificados.');

  p.trampas([
    { e: 'Elegir un $g$ de orden pequeño', por: 'Si $g$ tiene orden 10, solo hay 10 claves posibles y Eva las prueba. Con un primo seguro, cualquier $g \\ne \\pm 1$ tiene orden $q$ o $2q$.' },
    { e: 'Elegir $p$ sin mirar $p - 1$', por: 'Pohlig-Hellman rompe el logaritmo en el tiempo que marca el mayor factor primo de $p - 1$. Primos seguros: $p = 2q + 1$.' },
    { e: 'Reutilizar $k$ en ElGamal', por: 'Con el mismo $k$, $c_2 / c_2^{*} = m / m^{*}$: conocido un mensaje, se lee el otro. $k$ es de un solo uso, como una libreta.' },
    { e: 'Creer que Diffie-Hellman identifica a la otra parte', por: 'Acuerda una clave con quien esté al otro lado del cable. Sin firmas, Mallory se pone en medio y no se nota.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El orden de un número',
    level: 'basico',
    gen: function (r) { var P = r.pick([11, 13, 17, 19, 23]), g = r.int(2, P - 2); return { P: P, g: g, o: CR.orden(g, P), gen: CR.orden(g, P) === P - 1 }; },
    ask: function (d) { return 'Módulo $p = ' + d.P + '$, calcula las potencias de $' + d.g + '$ hasta que vuelva a salir 1. ¿Cuál es su orden? ¿Es $' + d.g + '$ un generador?'; },
    fields: [{ name: 'o', label: 'orden', w: 'tiny' }, { name: 'q', label: 'generador', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { o: d.o, q: d.gen ? 'si' : 'no' }; },
    hint: function (d) { return 'El orden divide a $p - 1 = ' + (d.P - 1) + '$: solo puede ser uno de sus divisores, ' + ML.divisors(d.P - 1).join(', ') + '.'; },
    steps: function (d) { var v = 1, l = []; for (var k = 1; k <= d.o; k++) { v = v * d.g % d.P; l.push(d.g + '^' + k + ' ≡ ' + v); } return [l.join(', ') + '.', 'Orden <strong>' + d.o + '</strong>' + (d.gen ? ' $= p - 1$: es generador.' : ' $\\ne ' + (d.P - 1) + '$: no es generador; sus potencias solo toman ' + d.o + ' valores.')]; },
    answer: function (d) { return d.o + (d.gen ? ', generador' : ', no'); }
  });

  p.exercise({
    title: 'Primos seguros',
    level: 'basico',
    gen: function (r) { var P = r.pick([23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 83]); var q = (P - 1) / 2; return { P: P, q: q, seguro: CR.esPrimo(q), fac: ML.factorTex(P - 1), mayor: ML.factorize ? null : null }; },
    ask: function (d) { return '¿Es $p = ' + d.P + '$ un primo seguro, es decir, de la forma $2q + 1$ con $q$ primo? ¿Cuánto vale $(p - 1)/2$?'; },
    fields: [{ name: 'q', label: '(p−1)/2', w: 'tiny' }, { name: 's', label: 'seguro', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { q: d.q, s: d.seguro ? 'si' : 'no' }; },
    hint: function () { return 'Resta 1, divide entre 2, y mira si lo que sale es primo.'; },
    steps: function (d) { return ['$(p - 1)/2 = ' + d.q + '$.', d.seguro ? '$' + d.q + '$ es primo: $' + d.P + '$ es un primo seguro, y todo $g \\ne \\pm 1$ tiene orden ' + d.q + ' o ' + (2 * d.q) + '.' : '$' + d.q + '$ no es primo ($p - 1 = ' + d.fac + '$): no es seguro, y hay elementos de orden pequeño.']; },
    answer: function (d) { return d.q + (d.seguro ? ', sí' : ', no'); }
  });

  p.exercise({
    title: 'Bebés y gigantes',
    level: 'medio',
    gen: function (r) { var P = r.pick([23, 29, 31, 37]), g = r.pick([2, 3, 5]); if (CR.orden(g, P) < P - 1) return null; var m = Math.ceil(Math.sqrt(P)), x = r.int(m, P - 2), h = CR.potMod(g, x, P); var bebes = []; var v = 1; for (var j = 0; j < m; j++) { bebes.push(v); v = v * g % P; } var gm = CR.inv(CR.potMod(g, m, P), P); return { P: P, g: g, m: m, x: x, h: h, bebes: bebes, gm: gm, i: Math.floor(x / m), j: x % m }; },
    ask: function (d) { return 'Resuelve $' + d.g + '^x \\equiv ' + d.h + ' \\pmod{' + d.P + '}$ con bebés y gigantes. Datos: $m = ' + d.m + '$, los bebés $g^0, \\dots, g^{' + (d.m - 1) + '}$ son $' + d.bebes.join(', ') + '$, y $g^{-m} \\equiv ' + d.gm + '$. ¿En qué paso de gigante $i$ aparece la coincidencia, con qué bebé $j$, y cuánto vale $x$?'; },
    fields: [{ name: 'i', label: 'i', w: 'tiny' }, { name: 'j', label: 'j', w: 'tiny' }, { name: 'x', label: 'x', w: 'tiny' }],
    sol: function (d) { return { i: d.i, j: d.j, x: d.x }; },
    check: function (v, d) { if (v.x === d.x && v.i === d.i && v.j === d.j) return { ok: true }; if (v.x === d.x) return { ok: true }; if (Number.isInteger(v.x) && CR.potMod(d.g, v.x, d.P) === d.h) return { ok: true }; return { ok: false, msg: 'Multiplica $h$ por $g^{-m}$ una y otra vez hasta que el resultado esté en la lista de bebés; $x = im + j$.', fields: { i: v.i === d.i, j: v.j === d.j, x: false } }; },
    hint: function (d) { return ['Gigante 0: $h = ' + d.h + '$. ¿Está entre los bebés?', 'Si no, gigante 1: $' + d.h + '\\cdot ' + d.gm + ' \\bmod ' + d.P + '$, y así.']; },
    steps: function (d) { var l = [], cur = d.h; for (var i = 0; i <= d.i; i++) { l.push('gigante ' + i + ': $' + cur + '$' + (i === d.i ? ' $= g^{' + d.j + '}$ ✓' : ', no está')); cur = cur * d.gm % d.P; } return [l.join('; ') + '.', '$x = ' + d.i + '\\cdot ' + d.m + ' + ' + d.j + ' = ' + d.x + '$. Comprobación: $' + d.g + '^{' + d.x + '} \\bmod ' + d.P + ' = ' + CR.potMod(d.g, d.x, d.P) + '$ ✓']; },
    answer: function (d) { return 'i = ' + d.i + ', j = ' + d.j + ', x = ' + d.x; }
  });

  p.exercise({
    title: 'Descifrar con ElGamal',
    level: 'avanzado',
    gen: function (r) { var P = r.pick([23, 29, 31, 37, 41]), g = r.pick([2, 3, 5]); if (CR.orden(g, P) < P - 1) return null; var x = r.int(2, P - 2), k = r.int(2, P - 2), m = r.int(2, P - 1); var y = CR.potMod(g, x, P), c1 = CR.potMod(g, k, P), c2 = CR.mulMod(m, CR.potMod(y, k, P), P); var s = CR.potMod(c1, x, P); return { P: P, g: g, x: x, y: y, c1: c1, c2: c2, s: s, inv: CR.inv(s, P), m: m }; },
    ask: function (d) { return 'ElGamal con $p = ' + d.P + '$, $g = ' + d.g + '$; Benito tiene $x = ' + d.x + '$. Recibe $(c_1, c_2) = (' + d.c1 + ', ' + d.c2 + ')$. Calcula $s = c_1^x$, su inverso y el mensaje $m$.'; },
    fields: [{ name: 's', label: 'c₁^x', w: 'tiny' }, { name: 'i', label: 'inverso', w: 'tiny' }, { name: 'm', label: 'm', w: 'tiny' }],
    sol: function (d) { return { s: d.s, i: d.inv, m: d.m }; },
    hint: function () { return ['$s = c_1^x \\bmod p$ por cuadrados sucesivos.', 'Inverso con Euclides, y $m = c_2\\cdot s^{-1} \\bmod p$.']; },
    steps: function (d) { return ['$s = ' + d.c1 + '^{' + d.x + '} \\bmod ' + d.P + ' = ' + d.s + '$.', 'Inverso de $' + d.s + '$: $' + d.inv + '$, porque $' + d.s + '\\cdot ' + d.inv + ' \\equiv 1$.', '$m = ' + d.c2 + '\\cdot ' + d.inv + ' \\bmod ' + d.P + ' = ' + d.m + '$.']; },
    answer: function (d) { return 's = ' + d.s + ', inverso ' + d.inv + ', m = ' + d.m; }
  });

  p.exercise({
    title: 'Lo que ve Mallory',
    level: 'avanzado',
    gen: function (r) { var P = r.pick([23, 29, 31, 37]), g = r.pick([2, 3, 5]); if (CR.orden(g, P) < P - 1) return null; var a = r.int(2, P - 2), b = r.int(2, P - 2), m = r.int(2, P - 2); var A = CR.potMod(g, a, P), B = CR.potMod(g, b, P), M = CR.potMod(g, m, P); return { P: P, g: g, a: a, b: b, m: m, A: A, B: B, M: M, kA: CR.potMod(M, a, P), kB: CR.potMod(M, b, P), real: CR.potMod(B, a, P) }; },
    ask: function (d) { return 'Diffie-Hellman con $p = ' + d.P + '$, $g = ' + d.g + '$. Alicia tiene $a = ' + d.a + '$ y Benito $b = ' + d.b + '$. Mallory intercepta los dos envíos y sustituye ambos por $M = g^{' + d.m + '} = ' + d.M + '$. ¿Qué clave calcula Alicia, cuál calcula Benito, y cuál habrían calculado sin Mallory?'; },
    fields: [{ name: 'ka', label: 'clave de Alicia', w: 'tiny' }, { name: 'kb', label: 'clave de Benito', w: 'tiny' }, { name: 'k', label: 'sin Mallory', w: 'tiny' }],
    sol: function (d) { return { ka: d.kA, kb: d.kB, k: d.real }; },
    hint: function () { return ['Alicia eleva lo que recibe, $M$, a su secreto $a$. Benito, a $b$.', 'Sin Mallory, $B^a = A^b = g^{ab}$.']; },
    steps: function (d) { return ['Alicia: $M^a = ' + d.M + '^{' + d.a + '} \\bmod ' + d.P + ' = ' + d.kA + '$. Mallory la obtiene como $A^m$.', 'Benito: $M^b = ' + d.kB + '$. Mallory la obtiene como $B^m$.', 'Sin Mallory: $g^{ab} = ' + d.real + '$.', 'Alicia y Benito tienen claves distintas y no lo saben; Mallory conoce las dos. Solo una firma sobre $A$ y $B$ lo impediría.']; },
    answer: function (d) { return d.kA + ', ' + d.kB + ', ' + d.real; }
  });

  p.keys([
    'El orden de $g$ divide a $p - 1$; con un primo seguro $p = 2q + 1$ todo $g \\ne \\pm 1$ tiene orden grande.',
    'Bebés y gigantes resuelven el logaritmo en $2\\sqrt{p}$ operaciones: la seguridad de un grupo es la raíz cuadrada de su orden.',
    'Pohlig-Hellman reduce el problema a los factores de $p - 1$: el mayor factor primo de $p - 1$ manda, no $p$.',
    'ElGamal: $(g^k, m\\,y^k)$ con $k$ al azar de un solo uso; es Diffie-Hellman convertido en cifrado, y aleatorio.',
    'Diffie-Hellman sin firmas no identifica a nadie: Mallory en el medio acuerda una clave con cada uno y lo lee todo.'
  ]);
});
