/* Tema: Matemática financiera */
Course.topic('fn-finanzas', function (p) {

  p.text('Este tema no introduce ninguna matemática nueva. Usa la progresión geométrica que acabas ' +
    'de ver y poco más. Lo que sí hace es contestar preguntas que te vas a encontrar de verdad: por ' +
    'qué dos préstamos con el mismo interés cuestan distinto, qué significa exactamente el número ' +
    'grande del anuncio, y por qué alargar la hipoteca cinco años parece buena idea y cuesta ' +
    'veinte mil euros.');

  p.text('Merece la pena decirlo sin rodeos: la asimetría entre quien firma un préstamo y quien lo ' +
    'concede es sobre todo <strong>una asimetría de cálculo</strong>. El banco sabe hacer estas ' +
    'cuentas y casi nadie más. No son difíciles.');

  p.section('El dinero tiene fecha');

  p.text('Mil euros hoy y mil euros dentro de un año no son la misma cantidad, y no por la inflación ' +
    '—que también—, sino por algo más básico: los mil de hoy se pueden colocar y convertirse en más. ' +
    'Por eso <strong>toda cantidad de dinero lleva una fecha pegada</strong>, y comparar dos ' +
    'cantidades sin mirar la fecha es como sumar metros y segundos.');

  p.text('Si el interés anual es $i$, un capital $C$ colocado hoy vale dentro de $n$ años:');

  p.formula('C_n = C\\,(1+i)^n', 'capitalización compuesta',
    'Se dice: <em>«ce sub ene es igual a ce por uno más i, elevado a ene»</em>.<br><br>Aquí $i$ va en ' +
      '<strong>tanto por uno</strong>, no en tanto por ciento: un 3 % se escribe $0{,}03$. Es el error ' +
      'más frecuente de todo el tema.<br><br>Que la fórmula sea una potencia y no un producto es toda ' +
      'la diferencia entre el interés simple y el compuesto: en el compuesto, los intereses del ' +
      'primer año también generan intereses el segundo.');

  p.text('Y al revés, que es lo que de verdad se usa: si alguien te promete $C_n$ euros dentro de $n$ ' +
    'años, ¿cuánto vale <em>hoy</em> esa promesa? Se despeja y se obtiene el <strong>valor ' +
    'actual</strong>:');

  p.formula('VA = \\frac{C_n}{(1+i)^n}', 'valor actual (descuento)',
    'Se dice: <em>«uve a es igual a ce sub ene partido por uno más i elevado a ene»</em>.<br><br>La ' +
      'operación se llama <strong>descontar</strong>: quitarle a una cantidad futura los intereses ' +
      'que habría generado si la tuvieras ya. Es la capitalización al revés.<br><br>Ejemplo con ' +
      'números: al 4 %, mil euros dentro de diez años valen hoy $1000/1{,}04^{10} = 675{,}56$ €. Si ' +
      'te ofrecen 650 € ahora o 1000 € en diez años, lo segundo es mejor trato.');

  p.util('El valor actual es la herramienta con la que se decide si una inversión merece la pena, y ' +
    'se usa exactamente igual en una empresa que en tu casa. Una placa solar que ahorra 400 € al año ' +
    'durante 20 años no «vale 8000 €»: vale la suma de los valores actuales de esos 400 €, que al ' +
    '4 % son unos 5435. Si la instalación cuesta 6000, pierdes dinero aunque el total parezca ' +
    'favorable. Sumar euros de años distintos sin descontarlos es el error que arruina presupuestos.');

  p.section('TIN y TAE: por qué el banco anuncia uno y te cobra el otro');

  p.text('Un préstamo al «12 % anual» que se paga mensualmente no cuesta un 12 %. Cada mes se aplica ' +
    'un 1 %, y esos intereses se acumulan y generan a su vez intereses. Al cabo del año lo pagado no ' +
    'es el 12 %:');

  p.formula('\\left(1 + \\frac{0{,}12}{12}\\right)^{12} - 1 = 1{,}01^{12} - 1 = 0{,}1268\\ \\to\\ 12{,}68\\,\\%',
    'de TIN a TAE');

  p.list([
    'El <strong>TIN</strong> (tipo de interés nominal) es el número de la letra grande. No tiene en cuenta cada cuánto se cobra, así que <em>no sirve para comparar</em>.',
    'La <strong>TAE</strong> (tasa anual equivalente) es lo que realmente cuesta el dinero en un año, incluyendo la frecuencia de cobro y las comisiones obligatorias. Es la que hay que mirar.'
  ]);

  p.formula('\\text{TAE} = \\left(1 + \\frac{\\text{TIN}}{m}\\right)^{m} - 1', 'con m pagos al año',
    'Se dice: <em>«la tae es igual a, abro paréntesis, uno más tin partido por eme, cierro ' +
      'paréntesis, elevado a eme, menos uno»</em>.<br><br>$m$ es el número de veces al año que se ' +
      'liquidan los intereses: 12 si es mensual, 4 si es trimestral, 2 si es ' +
      'semestral.<br><br>Fíjate en la lógica: $\\text{TIN}/m$ es lo que se aplica en cada periodo, ' +
      'y elevar a $m$ es encadenar los $m$ periodos del año. El $-1$ del final quita el capital ' +
      'inicial para quedarse solo con lo que ha crecido.');

  p.note('La ley obliga a publicar la TAE precisamente porque el TIN se presta a engaño. Cuando dos ' +
    'ofertas tienen el mismo TIN y distinta TAE, la diferencia está en las comisiones o en la ' +
    'frecuencia de pago. <strong>Compara siempre TAE con TAE</strong>, y desconfía de cualquier ' +
    'anuncio que solo enseñe el TIN.', 'warn', 'La regla práctica');

  p.demo({
    title: 'El mismo tipo, distinta frecuencia',
    intro: 'Un mismo tipo nominal cuesta más cuanto más a menudo se liquide. Mueve la frecuencia y mira separarse la TAE del TIN. Al final la curva se aplana: hay un límite, y es e.',
    build: function (host) {
      var tin = 12, m = 1;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 13, ymin: 11.5, ymax: 13.5, height: 240,
        xlabel: 'pagos al año', ylabel: 'TAE (%)', xstep: 1,
        draw: function (g) {
          var pts = [];
          for (var k = 1; k <= 12; k++) {
            pts.push([k, (Math.pow(1 + tin / 100 / k, k) - 1) * 100]);
          }
          g.path(pts, { color: 0, w: 2.2 });
          for (var i = 0; i < pts.length; i++) g.point(pts[i][0], pts[i][1], { color: 0, r: 3.6 });
          g.hline(tin, { color: 'axis', w: 1.4, dash: true });
          g.hline((Math.exp(tin / 100) - 1) * 100, { color: 2, w: 1.4, dash: true });
          g.point(m, (Math.pow(1 + tin / 100 / m, m) - 1) * 100, { color: 1, r: 6.5 });
        }
      });
      function paint() {
        var tae = (Math.pow(1 + tin / 100 / m, m) - 1) * 100;
        var tope = (Math.exp(tin / 100) - 1) * 100;
        plot.view(0, 13, tin - 0.4, tope + 0.5);
        out.set('TIN <strong>' + U.fmt(tin, 2) + ' %</strong> con <strong>' + m + '</strong> pago' +
          (m > 1 ? 's' : '') + ' al año<br>' +
          'TAE real: <strong>' + U.fmt(tae, 4) + ' %</strong> · sobrecoste sobre el anuncio: ' +
          U.fmt(tae - tin, 4) + ' puntos<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">Por 10 000 € prestados un año, ' +
          'son ' + U.fmt((tae - tin) * 100, 2) + ' € que no aparecen en el cartel. Si se cobrara a ' +
          'cada instante, el tope sería $e^{' + U.fmt(tin / 100, 2) + '}-1 = ' + U.fmt(tope, 4) +
          '\\%$: ahí está el número $e$, otra vez.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'TIN (%)', min: 1, max: 25, step: 0.5, value: 12, dec: 2, on: function (v) { tin = v; paint(); } });
      W.slider(row, { label: 'pagos al año', min: 1, max: 12, step: 1, value: 1, dec: 0, on: function (v) { m = v; paint(); } });
      W.legend(host, [
        { c: 0, t: 'TAE según la frecuencia' },
        { c: 'axis', t: 'el TIN anunciado' },
        { c: 2, t: 'el tope: capitalización continua' }
      ]);
      paint();
    }
  });

  p.hist('La capitalización continua —el límite de arriba— es exactamente el problema con el que ' +
    'Jacob Bernoulli tropezó con el número $e$ en 1683. Se preguntó cuánto puede llegar a rendir un ' +
    'capital al 100 % anual si los intereses se liquidan cada vez más a menudo, y descubrió que no ' +
    'crece sin límite: se para en 2,718… Que la constante más importante del análisis apareciera ' +
    'estudiando un préstamo dice bastante de por dónde entran las matemáticas en el mundo.');

  p.section('La cuota de una hipoteca, deducida');

  p.text('Aquí es donde la progresión geométrica se gana el sueldo. Pides prestado $P$, con interés ' +
    'periódico $i$, y devuelves $n$ cuotas <strong>iguales</strong> de importe $c$. La pregunta es ' +
    'cuánto vale $c$.');

  p.text('El razonamiento es de una sola línea: <em>el dinero que te prestan hoy tiene que valer lo ' +
    'mismo que todas las cuotas que vas a pagar, traídas a hoy</em>. Cada cuota se descuenta con la ' +
    'fórmula del valor actual, según en qué periodo caiga:');

  p.formula('P = \\frac{c}{1+i} + \\frac{c}{(1+i)^2} + \\frac{c}{(1+i)^3} + \\dots + \\frac{c}{(1+i)^n}',
    'el préstamo es la suma de sus cuotas descontadas');

  p.text('Mira lo que hay a la derecha: cada sumando es el anterior multiplicado por $\\frac{1}{1+i}$. ' +
    'Es una progresión geométrica de razón $r = \\frac{1}{1+i}$ y $n$ términos, y su suma la sabes ' +
    'desde [[fn-sucesiones|el tema de sucesiones]]. Aplicando la fórmula y despejando $c$:');

  p.formula('c = P\\,\\frac{i}{1 - (1+i)^{-n}}', 'la cuota (sistema francés)',
    'Se dice: <em>«ce es igual a pe por i, partido por uno menos, abro paréntesis, uno más i, cierro ' +
      'paréntesis, elevado a menos ene»</em>.<br><br>El exponente negativo es solo una forma corta de ' +
      'escribir un denominador: $(1+i)^{-n} = \\frac{1}{(1+i)^n}$.<br><br>Cuidado con las unidades: ' +
      'si las cuotas son mensuales, $i$ es el interés <strong>mensual</strong> (el anual dividido ' +
      'entre 12) y $n$ es el <strong>número de meses</strong>. Una hipoteca a 30 años son 360 cuotas.');

  p.note('Esta fórmula es literalmente la que usa el banco, y no hay nada más en ella que la suma de ' +
    'una progresión geométrica. Si alguna vez has tenido la sensación de que el cálculo de una ' +
    'hipoteca es cosa de iniciados, ya no: cabe en un renglón y la acabas de deducir.',
    'ok', 'Lo que hay dentro de la calculadora del banco');

  p.demo({
    title: 'Una hipoteca por dentro',
    intro: 'Mueve el capital, el tipo y el plazo. Fíjate sobre todo en la barra de abajo: la parte de cada cuota que se va en intereses es enorme al principio y casi nula al final. Por eso amortizar pronto compensa tanto.',
    build: function (host) {
      var P = 150000, tae = 3, anios = 25;
      var out = W.readout(host, '');
      function cuota() {
        var i = tae / 100 / 12, n = anios * 12;
        if (i === 0) return P / n;
        return P * i / (1 - Math.pow(1 + i, -n));
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 25, ymin: 0, ymax: 1000, height: 260,
        xlabel: 'año', ylabel: '€ al mes',
        draw: function (g) {
          var i = tae / 100 / 12, n = anios * 12, c = cuota();
          var saldo = P, ptsInt = [], ptsAmo = [];
          for (var k = 1; k <= n; k++) {
            var inte = saldo * i;
            ptsInt.push([k / 12, inte]);
            ptsAmo.push([k / 12, c - inte]);
            saldo -= (c - inte);
          }
          g.path(ptsInt, { color: 1, w: 2.4 });
          g.path(ptsAmo, { color: 'ok', w: 2.4 });
          g.hline(c, { color: 'axis', w: 1.4, dash: true });
        }
      });
      function paint() {
        var i = tae / 100 / 12, n = anios * 12, c = cuota();
        var total = c * n;
        var saldo = P, primerInt = P * i;
        plot.view(0, anios, 0, c * 1.15);
        out.set('Cuota mensual: <strong>' + U.miles(Math.round(c)) + ' €</strong> durante ' + n +
          ' meses<br>' +
          'Total devuelto: <strong>' + U.miles(Math.round(total)) + ' €</strong> por ' +
          U.miles(P) + ' € prestados<br>' +
          'Intereses pagados: <strong>' + U.miles(Math.round(total - P)) + ' €</strong> (' +
          U.fmt((total - P) / P * 100, 1) + ' % del capital)<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">De la primera cuota, ' +
          U.miles(Math.round(primerInt)) + ' € son intereses y solo ' +
          U.miles(Math.round(c - primerInt)) + ' € amortizan deuda. En la última es al revés.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'capital (€)', min: 30000, max: 400000, step: 5000, value: 150000, dec: 0, on: function (v) { P = v; paint(); } });
      W.slider(row, { label: 'interés anual (%)', min: 0.5, max: 10, step: 0.25, value: 3, dec: 2, on: function (v) { tae = v; paint(); } });
      W.slider(row, { label: 'plazo (años)', min: 5, max: 40, step: 1, value: 25, dec: 0, on: function (v) { anios = v; paint(); } });
      W.legend(host, [
        { c: 1, t: 'parte de la cuota que son intereses' },
        { c: 'ok', t: 'parte que amortiza deuda' },
        { c: 'axis', t: 'la cuota, que es constante' }
      ]);
      W.hint(host, 'Prueba a mover solo el plazo, de 20 a 30 años: la cuota baja poco y el total ' +
        'pagado sube mucho. Ese es el negocio.');
      paint();
    }
  });

  p.section('Por qué alargar el plazo sale caro');

  p.text('Cuando la cuota aprieta, la salida que todo el mundo propone es alargar el plazo. Funciona ' +
    '—la cuota baja— pero conviene saber lo que cuesta, y la fórmula lo dice sin sentimentalismos.');

  p.text('Al alargar, cada cuota es menor, pero el capital pendiente tarda más en bajar, y sobre ese ' +
    'capital pendiente se cobran intereses todos los meses. En la cuenta total, lo segundo pesa mucho ' +
    'más que lo primero. En la demostración de arriba, 150 000 € al 3 %:');

  p.table(['Plazo', 'Cuota', 'Total devuelto', 'Intereses'], [
    ['20 años', '832 €', '199 700 €', '49 700 €'],
    ['25 años', '711 €', '213 400 €', '63 400 €'],
    ['30 años', '632 €', '227 600 €', '77 600 €'],
    ['40 años', '537 €', '257 800 €', '107 800 €']
  ], { num: [1, 2, 3] });

  p.text('Pasar de 20 a 40 años ahorra 295 € al mes y cuesta 58 000 € más. Puede ser una decisión ' +
    'razonable —si esos 295 € al mes son la diferencia entre llegar a fin de mes o no, lo es— pero ' +
    'tiene que ser una decisión informada, no una sorpresa.');

  p.util('La otra cara de la misma fórmula es la <strong>amortización anticipada</strong>. Cuando ' +
    'metes dinero extra al principio, ese dinero no «adelanta cuotas»: borra capital pendiente, y con ' +
    'él borra todos los intereses que ese capital iba a generar durante los años que quedan. Por eso ' +
    'amortizar 10 000 € en el año 3 de una hipoteca a 30 puede ahorrar más de 15 000 € en intereses, ' +
    'y amortizar esa misma cantidad en el año 27 apenas ahorra nada. Es la misma exponencial de ' +
    'siempre, trabajando a tu favor por una vez.');

  p.section('La inflación es la misma fórmula, en tu contra');

  p.text('Si los precios suben un $f$ por uno al año, lo que hoy cuesta 100 € costará dentro de $n$ ' +
    'años $100(1+f)^n$. Es exactamente la fórmula de la capitalización compuesta, aplicada a algo que ' +
    'no te conviene que crezca.');

  p.text('De ahí sale la distinción entre rentabilidad <strong>nominal</strong> y <strong>real</strong>. ' +
    'Un depósito al 3 % con una inflación del 4 % no te hace ganar dinero: te hace perder poder ' +
    'adquisitivo, aunque el número de la cuenta suba.');

  p.formula('r_{\\text{real}} \\approx r_{\\text{nominal}} - f', 'aproximación cómoda');

  p.note('Esa resta es una aproximación, no una igualdad. La exacta es ' +
    '$r_{\\text{real}} = \\frac{1+r}{1+f}-1$, pero para tipos pequeños las dos coinciden casi ' +
    'perfectamente —y por una razón que ya conoces: es el polinomio de Taylor de grado 1 de la ' +
    'expresión exacta.', null, 'De dónde sale esa resta');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Valor actual',
    level: 'basico',
    gen: function (r) {
      var C = r.int(2, 40) * 500;
      var i = r.pick([2, 2.5, 3, 4, 5, 6]) / 100;
      var n = r.int(3, 20);
      return { C: C, i: i, n: n, VA: C / Math.pow(1 + i, n) };
    },
    ask: function (d) {
      return 'Te prometen <strong>' + U.miles(d.C) + ' €</strong> dentro de ' + d.n + ' años. Si el ' +
        'interés es del ' + U.fmt(d.i * 100, 1) + ' % anual, ¿cuánto vale esa promesa hoy? ' +
        '(dos decimales)';
    },
    fields: [{ name: 'v', label: 'Valor actual (€)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.VA, 4) }; },
    tol: 2e-4,
    hint: function () { return 'Descontar es dividir: $VA = \\dfrac{C_n}{(1+i)^n}$, con $i$ en tanto por uno.'; },
    steps: function (d) {
      return ['El interés en tanto por uno es $i = ' + U.fmt(d.i, 4) + '$.',
        '$VA = \\dfrac{' + d.C + '}{(1+' + U.fmt(d.i, 4) + ')^{' + d.n + '}} = \\dfrac{' + d.C + '}{' +
        U.fmt(Math.pow(1 + d.i, d.n), 6) + '}$',
        '$VA = ' + U.fmt(d.VA, 2) + '$ €',
        'Dicho de otro modo: colocando hoy esos ' + U.fmt(d.VA, 2) + ' € al ' + U.fmt(d.i * 100, 1) +
        ' % tendrías exactamente ' + U.miles(d.C) + ' € dentro de ' + d.n + ' años.'];
    },
    answer: function (d) { return U.fmt(d.VA, 2) + ' €'; }
  });

  p.exercise({
    title: 'Del TIN a la TAE',
    level: 'basico',
    gen: function (r) {
      var tin = r.pick([6, 8, 9, 10, 12, 15, 18, 24]) / 100;
      var m = r.pick([2, 4, 12]);
      return { tin: tin, m: m, tae: Math.pow(1 + tin / m, m) - 1 };
    },
    ask: function (d) {
      var cada = { 2: 'semestralmente', 4: 'trimestralmente', 12: 'mensualmente' }[d.m];
      return 'Un préstamo tiene un TIN del <strong>' + U.fmt(d.tin * 100, 1) + ' %</strong> y los ' +
        'intereses se liquidan ' + cada + ' (' + d.m + ' veces al año). ¿Cuál es la TAE, en tanto ' +
        'por ciento con tres decimales?';
    },
    fields: [{ name: 'v', label: 'TAE (%)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.tae * 100, 6) }; },
    tol: 5e-5,
    hint: function () {
      return '$\\text{TAE} = \\left(1+\\frac{\\text{TIN}}{m}\\right)^m - 1$. Acuérdate de multiplicar ' +
        'el resultado por 100 para darlo en porcentaje.';
    },
    steps: function (d) {
      return ['El tipo de cada periodo es $\\frac{' + U.fmt(d.tin, 4) + '}{' + d.m + '} = ' +
        U.fmt(d.tin / d.m, 6) + '$.',
        '$\\text{TAE} = (1 + ' + U.fmt(d.tin / d.m, 6) + ')^{' + d.m + '} - 1 = ' +
        U.fmt(d.tae, 6) + '$',
        'En porcentaje: <strong>' + U.fmt(d.tae * 100, 3) + ' %</strong>.',
        'Son ' + U.fmt((d.tae - d.tin) * 100, 3) + ' puntos por encima del TIN anunciado, solo por ' +
        'la frecuencia de cobro.'];
    },
    answer: function (d) { return U.fmt(d.tae * 100, 3) + ' %'; }
  });

  p.exercise({
    title: 'La cuota de un préstamo',
    level: 'medio',
    gen: function (r) {
      var P = r.int(20, 60) * 5000;
      var anual = r.pick([2, 2.5, 3, 3.5, 4, 5]) / 100;
      var anios = r.pick([10, 15, 20, 25, 30]);
      var i = anual / 12, n = anios * 12;
      return { P: P, anual: anual, anios: anios, i: i, n: n, c: P * i / (1 - Math.pow(1 + i, -n)) };
    },
    ask: function (d) {
      return 'Pides <strong>' + U.miles(d.P) + ' €</strong> a ' + d.anios + ' años, con un interés ' +
        'del ' + U.fmt(d.anual * 100, 1) + ' % anual y cuotas mensuales. Calcula la cuota (dos ' +
        'decimales).<br><span style="font-size:0.875rem;color:var(--ink-faint)">Recuerda pasar el ' +
        'interés a mensual y el plazo a meses.</span>';
    },
    fields: [{ name: 'c', label: 'Cuota (€)', w: 'wide' }],
    sol: function (d) { return { c: U.round(d.c, 4) }; },
    tol: 2e-4,
    hint: function () {
      return '$c = P\\dfrac{i}{1-(1+i)^{-n}}$ con $i$ = interés anual entre 12 y $n$ = años por 12.';
    },
    steps: function (d) {
      return ['Interés mensual: $i = \\dfrac{' + U.fmt(d.anual, 4) + '}{12} = ' + U.fmt(d.i, 8) + '$',
        'Número de cuotas: $n = ' + d.anios + '\\cdot 12 = ' + d.n + '$',
        '$c = ' + d.P + '\\cdot\\dfrac{' + U.fmt(d.i, 8) + '}{1 - (1+' + U.fmt(d.i, 8) + ')^{-' + d.n + '}}$',
        '$c = ' + U.fmt(d.c, 2) + '$ €',
        'En total devolverás ' + U.miles(Math.round(d.c * d.n)) + ' €, o sea ' +
        U.miles(Math.round(d.c * d.n - d.P)) + ' € de intereses.'];
    },
    answer: function (d) { return U.fmt(d.c, 2) + ' € al mes'; }
  });

  p.exercise({
    title: 'Lo que cuesta alargar el plazo',
    level: 'avanzado',
    gen: function (r) {
      var P = r.int(20, 50) * 5000;
      var anual = r.pick([2.5, 3, 3.5, 4]) / 100;
      var a1 = r.pick([15, 20]), a2 = a1 + r.pick([5, 10, 15]);
      var i = anual / 12;
      function cuo(an) { var n = an * 12; return P * i / (1 - Math.pow(1 + i, -n)); }
      var t1 = cuo(a1) * a1 * 12, t2 = cuo(a2) * a2 * 12;
      return { P: P, anual: anual, a1: a1, a2: a2, c1: cuo(a1), c2: cuo(a2), extra: t2 - t1 };
    },
    ask: function (d) {
      return 'Una hipoteca de <strong>' + U.miles(d.P) + ' €</strong> al ' + U.fmt(d.anual * 100, 1) +
        ' % anual. ¿Cuánto <strong>más</strong> se acaba pagando en total si se firma a ' + d.a2 +
        ' años en vez de a ' + d.a1 + '? (al euro)';
    },
    fields: [{ name: 'e', label: 'Diferencia (€)', w: 'wide' }],
    sol: function (d) { return { e: U.round(d.extra, 2) }; },
    tol: 5e-4,
    hint: function () {
      return 'Calcula las dos cuotas, multiplica cada una por su número de meses y resta los dos ' +
        'totales. La diferencia de cuota es pequeña; la de total, no.';
    },
    steps: function (d) {
      return ['Cuota a ' + d.a1 + ' años: $' + U.fmt(d.c1, 2) + '$ € · total $' +
        U.miles(Math.round(d.c1 * d.a1 * 12)) + '$ €',
        'Cuota a ' + d.a2 + ' años: $' + U.fmt(d.c2, 2) + '$ € · total $' +
        U.miles(Math.round(d.c2 * d.a2 * 12)) + '$ €',
        'Diferencia de cuota: solo ' + U.fmt(d.c1 - d.c2, 2) + ' € al mes menos.',
        'Diferencia de total: <strong>' + U.miles(Math.round(d.extra)) + ' €</strong> más.',
        'Ese es el precio de respirar ' + U.fmt(d.c1 - d.c2, 2) + ' € cada mes.'];
    },
    answer: function (d) { return U.miles(Math.round(d.extra)) + ' € más'; }
  });

  p.keys([
    'Todo importe lleva fecha. Para comparar dinero de años distintos hay que traerlo a la misma fecha: $VA = \\frac{C_n}{(1+i)^n}$.',
    'El TIN no sirve para comparar; la <strong>TAE</strong> sí, porque incorpora la frecuencia de cobro y las comisiones.',
    'La cuota de un préstamo sale de igualar el capital a la suma de las cuotas descontadas, que es una <strong>progresión geométrica</strong>.',
    '$c = P\\frac{i}{1-(1+i)^{-n}}$, con $i$ y $n$ en la misma unidad de tiempo que las cuotas.',
    'Alargar el plazo baja poco la cuota y sube mucho el total. Amortizar pronto ahorra mucho más que amortizar tarde.',
    'La inflación es la misma exponencial en tu contra: lo que cuenta es la rentabilidad real, no la nominal.'
  ]);
});
