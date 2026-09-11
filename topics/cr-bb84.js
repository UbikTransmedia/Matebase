/* Tema: Distribucion cuantica de claves: BB84 */
Course.topic('cr-bb84', function (p) {

  p.puente('La [[cr-poscuantico|criptografía poscuántica]] resiste al ordenador cuántico con matemáticas. ' +
    'Este tema usa la física cuántica al revés: para <em>repartir</em> una clave de forma que espiar ' +
    'la destruya y se note. Todo es [[pe-binomial|probabilidad]]: bases al azar, medidas que ' +
    'coinciden la mitad de las veces, y una espía que deja un rastro medible.');

  p.text('Diffie-Hellman reparte una clave con matemáticas que un ordenador cuántico rompería. BB84 la ' +
    'reparte con fotones, y su seguridad no está en ningún problema difícil, sino en una ley física: ' +
    'medir un sistema cuántico lo altera. Si Eva mira los fotones para copiarlos, los cambia, y ' +
    'Alicia y Benito lo detectan comparando una parte de la clave. No hace falta que Eva sea débil; ' +
    'hace falta que la física sea como es.');

  /* ---------------------------------------------------------------- */
  p.section('Bits en dos bases');

  p.text('Alicia envía cada bit en un fotón polarizado, y elige al azar una de dos <strong>bases</strong>. ' +
    'En la base recta, el bit 0 es un fotón vertical y el 1 horizontal. En la base diagonal, el 0 es ' +
    'a 45° y el 1 a 135°. La regla física: si se mide un fotón en la <em>misma</em> base en que se ' +
    'envió, sale el bit correcto; si se mide en la <em>otra</em> base, sale <strong>0 o 1 al ' +
    'azar</strong>, y además el fotón queda cambiado a la base con que se midió.');

  p.formula('\\text{misma base} \\Rightarrow \\text{bit correcto}, \\qquad \\text{base distinta} \\Rightarrow \\text{bit aleatorio, y el fotón se altera}',
    'la regla de la medida',
    'No es una limitación técnica: es imposible medir un fotón en la base equivocada sin destruir la ' +
    'información que llevaba. Y tampoco se puede copiar un fotón desconocido, el llamado teorema de ' +
    'no clonación. Esas dos cosas son lo que hace segura la distribución.');

  /* ---------------------------------------------------------------- */
  p.section('Cribar: quedarse con la mitad');

  p.text('El protocolo, sin espía: Alicia manda muchos bits, cada uno con base al azar. Benito, que no ' +
    'sabe qué base usó Alicia, elige también al azar para medir cada uno. Después, por un canal ' +
    'público, se dicen las <strong>bases</strong> (no los bits) y se quedan solo con los fotones en ' +
    'que las bases coincidieron: la mitad, de media. En esos, sus bits son iguales. Es la ' +
    '<strong>clave cribada</strong>.');

  p.demo({
    title: 'BB84 sin espía',
    intro: 'Alicia envía bits con bases al azar; Benito mide con bases al azar. Se marcan los fotones en que las bases coinciden: en ellos los bits son iguales y forman la clave. En el resto, el bit de Benito es aleatorio y se tira.',
    predice: 'Con 16 fotones, ¿cuántos sobrevivirán a la criba, más o menos? ¿Y de esos, cuántos bits coincidirán entre Alicia y Benito?',
    build: function (host) {
      var n = 16, r = U.rng(3);
      var out = W.mono(host, '');
      function juega() {
        var ba = [], bb = [], va = [], vb = [], i;
        for (i = 0; i < n; i++) { ba.push(r.int(0, 1)); va.push(r.int(0, 1)); bb.push(r.int(0, 1)); vb.push(ba[i] === bb[i] ? va[i] : r.int(0, 1)); }
        function fila(et, arr, mapa) { return et + arr.map(function (x, i) { return mapa ? mapa(x, i) : x; }).join(' ') + '\n'; }
        var clave = [], iguales = 0;
        for (i = 0; i < n; i++) if (ba[i] === bb[i]) { clave.push(va[i]); if (va[i] === vb[i]) iguales++; }
        var h = fila('<b>bit de Alicia </b> ', va) + fila('<b>base de Alicia</b> ', ba, function (x) { return x ? '/' : '+'; }) + fila('<b>base de Benito</b> ', bb, function (x) { return x ? '/' : '+'; }) + fila('<b>mide Benito   </b> ', vb) + fila('<b>bases iguales </b> ', ba, function (x, i) { return ba[i] === bb[i] ? '<span class="cr-ok">↑</span>' : ' '; });
        h += '\n<b>clave cribada</b> (' + clave.length + ' de ' + n + '): ' + clave.join('') + '\nBits de Alicia y Benito iguales en la clave: ' + iguales + ' de ' + clave.length + (iguales === clave.length ? '  <span class="cr-ok">todos ✓</span>' : '') + '\n<span class="cr-tenue">Sin espía, en los fotones de base coincidente los bits siempre coinciden.</span>';
        out.set(h);
      }
      W.slider(W.row(host), { label: 'número de fotones', min: 8, max: 40, step: 1, value: n, on: function (v) { n = v; juega(); } });
      W.buttons(host, [{ t: 'Enviar otra tanda', cls: 'btn--main', on: juega }]);
      juega();
    }
  });

  p.formula('P(\\text{base coincide}) = \\tfrac12 \\Rightarrow \\text{clave cribada} \\approx \\tfrac{n}{2} \\text{ bits}',
    'la mitad sobrevive',
    'Benito acierta la base la mitad de las veces, así que de $n$ fotones quedan unos $n/2$. Es el ' +
    'precio de no saber la base: se tira la mitad, pero lo que queda es una clave secreta compartida.');

  /* ---------------------------------------------------------------- */
  p.section('La espía se delata');

  p.text('Ahora Eva, en medio del canal. No puede copiar los fotones (no clonación), así que su única ' +
    'opción es medirlos y reenviarlos. Pero no sabe la base de Alicia: elige al azar, y la mitad de ' +
    'las veces se equivoca. Cuando se equivoca, obtiene un bit aleatorio <strong>y altera el ' +
    'fotón</strong>. Ese fotón alterado, si Benito lo mide en la base buena, ya solo da el bit ' +
    'correcto la mitad de las veces. Resultado: en los fotones cribados, Alicia y Benito ya no ' +
    'coinciden siempre.');

  p.formula('P(\\text{error en un bit cribado} \\mid \\text{Eva mide y reenvía}) = \\tfrac14',
    'el rastro de la espía',
    'Se lee: <em>«la probabilidad de error en un bit cribado, si Eva espía, es un cuarto»</em>: Eva ' +
    'usa la base equivocada con probabilidad $1/2$, y en ese caso Benito recibe un bit erróneo con ' +
    'probabilidad $1/2$. Sin Eva, los bits cribados coinciden siempre. Así que Alicia y Benito ' +
    'sacrifican una parte de su clave, comparan esos bits en público, y si hay más de un ' +
    '<strong>25 %</strong> de discrepancias, saben que alguien escucha y tiran la clave entera.');

  p.demo({
    title: 'Detectar a Eva',
    intro: 'El mismo protocolo, ahora con Eva midiendo y reenviando cada fotón con una base al azar. Sobre la clave cribada se cuenta qué fracción de bits difieren entre Alicia y Benito. Enciende y apaga a Eva y compara: sin ella, 0 %; con ella, cerca del 25 %.',
    predice: 'Con Eva espiando, la teoría dice un 25 % de errores en la clave cribada. Con 200 fotones cribados, ¿esperarías exactamente 25 % o algo alrededor, por el azar?',
    build: function (host) {
      var espia = true, n = 400, r = U.rng(6);
      var out = W.readout(host, '');
      var plot = W.barChart(host, { labels: ['sin espía', 'con espía'], values: [0, 0], height: 220, ylabel: '% de errores', dec: 1, color: 0, extra: function (g) { g.hline(25, { color: 1, dash: [5, 4], w: 1.4, label: '25 %' }); } });
      function corre() {
        var res = { 0: 0, 1: 0 };
        [0, 1].forEach(function (conEva) {
          var crib = 0, err = 0;
          for (var i = 0; i < n; i++) {
            var ba = r.int(0, 1), va = r.int(0, 1), fotBit = va, fotBase = ba;
            if (conEva) { var be = r.int(0, 1); var ve = (be === fotBase) ? fotBit : r.int(0, 1); fotBit = ve; fotBase = be; }
            var bb = r.int(0, 1), vb = (bb === fotBase) ? fotBit : r.int(0, 1);
            if (bb === ba) { crib++; if (vb !== va) err++; }
          }
          res[conEva] = crib ? 100 * err / crib : 0;
        });
        plot.view(-0.7, 1.7, 0, 40); plot.render();
        // fuerza a mostrar los dos valores
        plot.o.draw = function (g) { g.bars([{ x: 0, h: res[0], color: 0, top: U.fmt(res[0], 1) }, { x: 1, h: res[1], color: 2, top: U.fmt(res[1], 1) }], { width: 0.5 }); g.hline(25, { color: 1, dash: [5, 4], w: 1.4 }); };
        plot.render();
        out.set('Errores en la clave cribada sobre ' + n + ' fotones: <b>sin espía ' + U.fmt(res[0], 1) + ' %</b>, <b>con espía ' + U.fmt(res[1], 1) + ' %</b>. Umbral de alarma: 25 % (en la práctica se abandona muy por debajo, porque el propio canal mete algo de ruido).');
      }
      W.slider(W.row(host), { label: 'fotones', min: 100, max: 2000, step: 100, value: n, on: function (v) { n = v; corre(); } });
      W.buttons(host, [{ t: 'Repetir el experimento', cls: 'btn--main', on: corre }]);
      corre();
    }
  });

  p.comprueba('BB84 no impide que Eva escuche: ¿qué garantiza entonces?', [
    { t: 'Que si Eva escucha, se nota: introduce errores que Alicia y Benito detectan comparando parte de la clave, y entonces la descartan', ok: true, por: 'La seguridad no es que Eva no pueda medir, sino que medir deja rastro. Se cambia «Eva no puede leer» por «si Eva lee, lo sabemos y no usamos esa clave».' },
    { t: 'Que Eva no puede medir los fotones', ok: false, por: 'Puede medirlos; lo que no puede es hacerlo sin alterarlos ni copiarlos primero. El rastro es inevitable, no la medición.' },
    { t: 'Que la clave viaja cifrada', ok: false, por: 'Los fotones no van cifrados: van en bases que Eva desconoce. La protección es física, no un cifrado encima.' }
  ]);

  p.ejemplo({
    title: 'Cribar y detectar a mano',
    enunciado: 'Alicia envía los bits 1,0,1,1 con bases +,×,×,+ (recta, diagonal, diagonal, recta). Benito mide con bases +,+,×,×. Determinar la clave cribada sin espía. Después, calcular la probabilidad de que Eva espíe cuatro fotones cribados sin producir ni un error.',
    pasos: [
      { t: '<strong>Comparar bases.</strong> Fotón 1: + y + coinciden. Fotón 2: × y + no. Fotón 3: × y × coinciden. Fotón 4: + y × no. Sobreviven el 1 y el 3.', antes: '¿En qué fotones coincide la base de Alicia con la de Benito?' },
      { t: '<strong>La clave.</strong> En los que coinciden, Benito lee el bit de Alicia: fotón 1 da 1, fotón 3 da 1. Clave cribada: <strong>11</strong>. Los otros dos Benito los midió en la base mala y su bit es aleatorio: se tiran.', antes: '¿Qué bits quedan en los fotones de base coincidente?' },
      { t: '<strong>Eva sin errores.</strong> En cada bit cribado, Eva produce un error con probabilidad $1/4$, así que <em>no</em> lo produce con probabilidad $3/4$. Para cuatro bits sin ningún error: $(3/4)^4 = 81/256 \\approx 0{,}32$.', antes: 'Probabilidad de no meter error en un bit, elevada a cuatro.' },
      { t: '<strong>Lo que enseña.</strong> Con solo cuatro bits comparados, Eva se escaparía un 32 % de las veces. Por eso se comparan cientos: $(3/4)^{100}$ es prácticamente cero, y la espía no tiene escapatoria.' }
    ],
    cierre: 'Cuantos más bits se sacrifican para comparar, menos margen tiene Eva. Es el mismo cálculo que las rondas de una prueba de conocimiento cero: la sospecha se hace certeza multiplicando probabilidades.'
  });

  p.util('BB84 no es teoría: hay redes comerciales de distribución cuántica de claves entre bancos y ' +
    'centros de datos, y enlaces por fibra de decenas de kilómetros. En 2017, el satélite chino ' +
    'Micius repartió claves cuánticas entre dos estaciones a 1200 km, y se hizo una videollamada ' +
    'cifrada Pekín-Viena con ellas. Sus límites son prácticos: necesita fibra o línea de visión, no ' +
    'atraviesa internet, y protege el reparto de la clave, no el mensaje, que después se cifra con ' +
    'AES. Por eso, para casi todo, la respuesta al ordenador cuántico es la criptografía poscuántica ' +
    'del tema anterior, que funciona sobre la red que ya existe.');

  p.hist('Stephen Wiesner tuvo la idea del «dinero cuántico» imposible de falsificar hacia 1970, y no se ' +
    'la publicaron. Charles Bennett y Gilles Brassard la convirtieron en un protocolo de reparto de ' +
    'claves en 1984, de ahí el nombre BB84, en un congreso en Bangalore; el artículo pasó ' +
    'desapercibido durante años. En 1991 Artur Ekert dio una versión basada en el entrelazamiento. ' +
    'La primera demostración, en 1989, cubría 32 centímetros de aire sobre una mesa; hoy son miles ' +
    'de kilómetros por satélite.');

  p.trampas([
    { e: 'Creer que BB84 impide escuchar', por: 'Eva puede medir; lo que no puede es hacerlo sin dejar un 25 % de errores. Garantiza detección, no imposibilidad de escucha.' },
    { e: 'Pensar que Eva copia los fotones y reenvía los originales', por: 'El teorema de no clonación lo prohíbe: no puede copiar un fotón en estado desconocido. Solo medir y reenviar, y ahí se delata.' },
    { e: 'Usar BB84 para cifrar el mensaje', por: 'BB84 reparte una clave; el mensaje se cifra aparte, con AES o una libreta si la clave es larga.' },
    { e: 'Confundir distribución cuántica con criptografía poscuántica', por: 'La primera usa física y hardware especial; la segunda usa matemáticas sobre ordenadores normales. Para la red actual, la poscuántica.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La criba',
    level: 'basico',
    gen: function (r) { var n = r.int(100, 4000); return { n: n, cribada: n / 2 }; },
    ask: function (d) { return 'Alicia envía ' + U.miles(d.n) + ' fotones, cada uno con base al azar, y Benito mide cada uno con base al azar. ¿Cuántos bits sobreviven a la criba de media?'; },
    fields: [{ name: 'c', label: 'bits', w: 'tiny' }],
    sol: function (d) { return { c: d.cribada }; },
    hint: function () { return 'Las bases coinciden la mitad de las veces.'; },
    steps: function (d) { return ['$' + U.miles(d.n) + ' / 2 = ' + U.miles(d.cribada) + '$ bits de media.', 'En ellos, sin espía, Alicia y Benito tienen el mismo bit.']; },
    answer: function (d) { return U.miles(d.cribada); }
  });

  p.exercise({
    title: 'Un bit medido',
    level: 'basico',
    gen: function (r) { var ba = r.int(0, 1), va = r.int(0, 1), bb = r.int(0, 1); return { ba: ba, va: va, bb: bb, coincide: ba === bb }; },
    ask: function (d) { return 'Alicia envía el bit ' + d.va + ' en la base ' + (d.ba ? 'diagonal (×)' : 'recta (+)') + '. Benito mide en la base ' + (d.bb ? 'diagonal (×)' : 'recta (+)') + '. ¿Qué bit obtiene Benito, y se queda este fotón tras la criba?'; },
    fields: [{ name: 'r', label: 'se queda', opts: [{ t: 'sí, en la clave', v: 'si' }, { t: 'no, se tira', v: 'no' }] }, { name: 'b', label: 'bit (si se queda)', opts: [{ t: '0', v: '0' }, { t: '1', v: '1' }, { t: 'aleatorio, da igual', v: 'x' }] }],
    sol: function (d) { return { r: d.coincide ? 'si' : 'no', b: d.coincide ? String(d.va) : 'x' }; },
    hint: function () { return 'Misma base: bit correcto y se queda. Base distinta: bit aleatorio y se descarta.'; },
    steps: function (d) { return [d.coincide ? 'Las bases coinciden: Benito obtiene ' + d.va + ', y el fotón <strong>se queda</strong> en la clave.' : 'Las bases no coinciden: el bit de Benito es <strong>aleatorio</strong> y el fotón <strong>se tira</strong> en la criba.']; },
    answer: function (d) { return d.coincide ? 'se queda, bit ' + d.va : 'se tira'; }
  });

  p.exercise({
    title: 'Eva sin dejar rastro',
    level: 'medio',
    gen: function (r) { var k = r.int(2, 12); return { k: k, p: Math.pow(0.75, k) }; },
    ask: function (d) { return 'Alicia y Benito comparan ' + d.k + ' bits de la clave cribada para ver si hay espía. Si Eva ha espiado midiendo y reenviando, cada bit comparado la delata con probabilidad $1/4$. ¿Qué probabilidad tiene Eva de que los ' + d.k + ' bits coincidan por casualidad y no se la detecte? (cuatro decimales)'; },
    fields: [{ name: 'p', label: 'probabilidad', w: 'tiny' }],
    sol: function (d) { return { p: d.p }; },
    dec: 4, tol: 2e-4,
    hint: function (d) { return 'No delatar en un bit: $3/4$. En los ' + d.k + ', $(3/4)^{' + d.k + '}$.'; },
    steps: function (d) { return ['$(3/4)^{' + d.k + '} = ' + U.fmt(d.p, 4) + '$.', d.k < 6 ? 'Todavía alta: hay que comparar más bits.' : 'Ya pequeña; con cien bits, $(3/4)^{100} \\approx 10^{-13}$: Eva no se escapa.']; },
    answer: function (d) { return U.fmt(d.p, 4); }
  });

  p.exercise({
    title: 'La tasa de error',
    level: 'medio',
    gen: function (r) { var espia = r.bool(0.5), ruido = r.int(0, 3); var base = espia ? 25 : 0; return { espia: espia, ruido: ruido, tasa: base + ruido }; },
    ask: function (d) { return 'Alicia y Benito comparan bits y encuentran un ' + d.tasa + ' % de discrepancias. El canal por sí solo mete hasta un 3 % de ruido. ¿Deben concluir que hay espía y descartar la clave?'; },
    fields: [{ name: 'q', label: 'Conclusión', opts: [{ t: 'hay espía: descartar', v: 'si' }, { t: 'es ruido del canal: seguir', v: 'no' }] }],
    sol: function (d) { return { q: d.espia ? 'si' : 'no' }; },
    hint: function () { return 'Un espía que mide y reenvía sube la tasa hacia el 25 %. Por debajo del ruido del canal (unos pocos %), es solo ruido.'; },
    steps: function (d) { return [d.espia ? 'Un ' + d.tasa + ' % está muy por encima del ruido del canal: es la firma del 25 % de un espía. <strong>Descartar.</strong>' : 'Un ' + d.tasa + ' % cabe dentro del ruido del canal: no hay señal de espía. <strong>Seguir</strong>, corrigiendo esos errores con técnicas de reconciliación.']; },
    answer: function (d) { return d.espia ? 'hay espía' : 'ruido'; }
  });

  p.exercise({
    title: 'Clave final tras todo',
    level: 'avanzado',
    gen: function (r) { var n = r.int(1000, 8000); var crib = n / 2, muestra = Math.round(crib * 0.5), final = crib - muestra; return { n: n, crib: crib, muestra: muestra, final: final }; },
    ask: function (d) { return 'Se envían ' + U.miles(d.n) + ' fotones. Sobrevive la mitad a la criba, y de esos se sacrifica la mitad para comprobar que no hay espía. ¿Cuántos bits de clave secreta quedan al final?'; },
    fields: [{ name: 'f', label: 'bits finales', w: 'tiny' }],
    sol: function (d) { return { f: d.final }; },
    hint: function () { return 'La mitad de la mitad: primero cribar, luego quitar los que se comparan.'; },
    steps: function (d) { return ['Criba: $' + U.miles(d.n) + ' / 2 = ' + U.miles(d.crib) + '$.', 'Se comparan y sacrifican la mitad: quedan $' + U.miles(d.crib) + ' - ' + U.miles(d.muestra) + ' = ' + U.miles(d.final) + '$.', 'De ' + U.miles(d.n) + ' fotones enviados, una cuarta parte acaba siendo clave secreta comprobada.']; },
    answer: function (d) { return U.miles(d.final); }
  });

  p.keys([
    'BB84 reparte una clave con fotones en dos bases al azar; medir en la base equivocada da un bit aleatorio y altera el fotón.',
    'Cribar: se comparan las bases en público y se quedan los fotones de base coincidente, la mitad, con bits iguales.',
    'Eva no puede clonar; medir y reenviar introduce un 25 % de errores en la clave cribada, que Alicia y Benito detectan.',
    'La garantía no es que Eva no escuche, sino que escuchar se nota: entonces se descarta la clave.',
    'Reparte la clave, no el mensaje, y necesita fibra o satélite: para la red actual, la respuesta es la criptografía poscuántica.'
  ]);
});
