/* Tema: Homeostasis y ultraestabilidad */
Course.topic('cib-homeostasis', function (p) {

  p.text('Tu temperatura interna es de unos 37 °C. Puedes estar en la nieve o en el desierto, correr o ' +
    'dormir, y sigue siendo 37. Si baja de 35 o sube de 41, te mueres. Es decir: <strong>hay una ' +
    'cantidad que tiene que permanecer dentro de un margen estrecho, y todo lo demás está al servicio ' +
    'de eso</strong>.');

  p.text('Ashby llamó <strong>variables esenciales</strong> a esas cantidades y ' +
    '<strong>homeostasis</strong> al hecho de mantenerlas dentro de sus límites. La palabra la había ' +
    'acuñado el fisiólogo Walter Cannon en 1926, y significa literalmente «permanecer igual»; lo que ' +
    'aportó Ashby fue convertirla en matemáticas.');

  p.text('Y aquí viene el giro que hace interesante el tema. Un termostato mantiene una variable dentro ' +
    'de sus límites, sí, pero solo mientras el mundo se porte como el termostato espera. Si le cambias ' +
    'las reglas —si le inviertes los cables, por ejemplo— seguirá corrigiendo alegremente en la ' +
    'dirección equivocada hasta quemar la casa. <em>No sabe adaptarse, solo sabe corregir.</em>');

  p.text('La pregunta de Ashby era precisamente esa: <strong>¿cómo sería una máquina que, al cambiarle ' +
    'las reglas, encontrara sola una manera nueva de sobrevivir?</strong> No una que corrigiera mejor, ' +
    'sino una que se reorganizara. A esa propiedad la llamó <strong>ultraestabilidad</strong>, y es el ' +
    'concepto central de su libro de 1952, <em>Design for a Brain</em>.');

  /* ---------------------------------------------------------------- */
  p.section('Variables esenciales');

  p.text('Lo primero es distinguir dos cosas que suelen confundirse. Un sistema tiene muchas variables, ' +
    'pero solo unas pocas son <strong>esenciales</strong>: las que tienen que mantenerse dentro de un ' +
    'rango o se acaba el juego. Las demás son medios.');

  p.text('En un cuerpo, las esenciales son la temperatura, el pH de la sangre, la glucosa, el oxígeno; ' +
    'el ritmo cardíaco, la respiración o el sudor <em>no</em> lo son, y precisamente por eso pueden ' +
    'variar muchísimo: son las palancas con las que se mantienen las otras. Un corredor de maratón ' +
    'triplica su frecuencia cardíaca para que su temperatura no suba dos grados.');

  p.note('Esa asimetría es una herramienta de análisis muy práctica fuera de la biología. Ante ' +
    'cualquier sistema, la pregunta útil no es «¿qué variables tiene?» sino <strong>«¿cuáles no puede ' +
    'permitirse perder, y cuáles está dispuesto a sacrificar para conservarlas?»</strong>. Una ' +
    'empresa sacrifica margen para no perder liquidez; un ecosistema sacrifica individuos para ' +
    'conservar la población; un sistema operativo cierra programas para no quedarse sin memoria.',
    'ok', 'La pregunta que conviene hacerse');

  p.formula('a \\le x(t) \\le b \\quad \\text{para todo } t',
    'la condición de supervivencia',
    'Se lee: <em>«a menor o igual que equis de te, menor o igual que be, para todo te»</em>.<br><br>' +
    'Dicho de otro modo: la variable esencial $x$ tiene que estar dentro del intervalo $[a, b]$ ' +
    '<strong>en todo momento</strong>, no de media. Eso es más exigente de lo que parece: un sistema ' +
    'que cumple el promedio pero se sale una vez, ha fracasado. Un cuerpo cuya temperatura media es ' +
    'estupenda pero que pasó por 43 °C durante un minuto está muerto igual.');

  /* ---------------------------------------------------------------- */
  p.section('El homeostato de Ashby');

  p.text('En 1948, con material sobrante de la guerra, Ashby construyó un aparato para demostrar que ' +
    'la ultraestabilidad se podía fabricar. Lo llamó <strong>homeostato</strong> y consistía en cuatro ' +
    'unidades idénticas conectadas entre sí, cada una con una aguja que podía moverse en un canal de ' +
    'agua.');

  p.text('El diseño tiene dos niveles, y ese es todo el truco. En el primero, las cuatro agujas se ' +
    'influyen mutuamente según unos coeficientes: es un sistema realimentado corriente, y puede ' +
    'resultar estable o no según cómo estén puestos esos coeficientes.');

  p.text('El segundo nivel es la idea genial. Si alguna aguja se sale de su rango —si una variable ' +
    'esencial se pasa de los límites— se dispara un mecanismo llamado <em>uniselector</em> que ' +
    '<strong>cambia los coeficientes al azar</strong>. Y vuelve a probar. Y si tampoco vale, otra ' +
    'vez. Hasta dar con una configuración que aguante.');

  p.note('Merece la pena apreciar lo raro de esa solución: la máquina <strong>no calcula</strong> qué ' +
    'configuración le conviene. No razona, no optimiza, no aprende en el sentido habitual. Solo hace ' +
    'dos cosas: detectar que se está muriendo y barajar de nuevo. Y con eso basta para encontrar ' +
    'sola la manera de sobrevivir a situaciones que su constructor no había previsto. Ashby invirtió ' +
    'los cables delante de sus colegas y el aparato, tras varios barajeos, volvió a estabilizarse.',
    null, 'Adaptación sin inteligencia');

  p.demo({
    title: 'Un homeostato de cuatro unidades',
    intro: 'Cuatro variables se influyen entre sí con coeficientes al azar. Las líneas de puntos son los límites de supervivencia: si alguna se sale, el sistema baraja de nuevo los coeficientes y vuelve a intentarlo. Pulsa «perturbar» para sacarlo de su sitio, o «invertir los cables» para cambiarle las reglas del mundo, como hizo Ashby.',
    build: function (host, d) {
      var N = 4, LIM = 1;
      var rng = U.rng(4242);
      var x = [0.2, -0.1, 0.15, -0.05];
      var W4 = [], barajeos = 0, pasos = 0, hist = [];
      var invertido = 1;

      function barajar() {
        W4 = [];
        for (var i = 0; i < N; i++) {
          var f = [];
          for (var j = 0; j < N; j++) f.push(rng.real(-1, 1, 3));
          W4.push(f);
        }
        barajeos++;
      }
      barajar();

      function paso() {
        var nx = [];
        for (var i = 0; i < N; i++) {
          var s = 0;
          for (var j = 0; j < N; j++) s += W4[i][j] * x[j];
          nx.push(x[i] + 0.16 * (invertido * s - x[i]));
        }
        x = nx;
        pasos++;
        var fuera = x.some(function (v) { return !isFinite(v) || Math.abs(v) > LIM; });
        if (fuera) {
          barajar();
          x = x.map(function (v) { return isFinite(v) ? U.clamp(v, -LIM * 0.6, LIM * 0.6) : 0; });
        }
        hist.push(x.slice());
        if (hist.length > 160) hist.shift();
      }

      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 160, ymin: -1.35, ymax: 1.35, height: 300,
        xlabel: 'tiempo', ylabel: 'variables esenciales',
        draw: function (g) {
          g.hline(LIM, { color: 'bad', dash: true, w: 1.6 });
          g.hline(-LIM, { color: 'bad', dash: true, w: 1.6 });
          for (var k = 0; k < N; k++) {
            var serie = hist.map(function (h, i) { return [i, h[k]]; });
            if (serie.length > 1) g.path(serie, { color: k, w: 2 });
          }
        }
      });

      function paint() {
        var dentro = x.every(function (v) { return isFinite(v) && Math.abs(v) <= LIM; });
        out.set('Pasos simulados: ' + pasos + ' &nbsp;·&nbsp; veces que ha tenido que barajar: <strong>' +
          barajeos + '</strong><br>' +
          (dentro
            ? '<span style="color:var(--ok)">Las cuatro variables están dentro de sus límites: el sistema sobrevive con la configuración actual.</span>'
            : '<span style="color:var(--warn)">Alguna variable se ha salido: reconfigurando…</span>') +
          '<br><span style="font-size:12.5px;color:var(--ink-faint)">Cada barajeo es un sorteo nuevo de los dieciséis coeficientes. La máquina no sabe cuál es bueno: prueba hasta que uno aguanta.</span>');
        plot.render();
      }

      function correr(n) { for (var i = 0; i < n; i++) paso(); paint(); }

      W.buttons(W.row(host), [
        { t: 'Avanzar 40 pasos', cls: 'btn--main', on: function () { correr(40); } },
        { t: 'Perturbar', on: function () {
          x = x.map(function () { return rng.real(-0.95, 0.95, 3); }); correr(1);
        } },
        { t: 'Invertir los cables', on: function () { invertido = -invertido; correr(1); } },
        { t: 'Empezar de nuevo', cls: 'btn--ghost', on: function () {
          x = [0.2, -0.1, 0.15, -0.05]; hist = []; pasos = 0; barajeos = 0; invertido = 1; barajar(); paint();
        } }
      ]);
      W.hint(host, 'Prueba a invertir los cables varias veces seguidas. El aparato no entiende lo que ha pasado, pero acaba encontrando una configuración que aguanta el mundo nuevo.');
      correr(30);
    }
  });

  p.util('La estrategia del homeostato —probar al azar y quedarse con lo que sobreviva— es exactamente ' +
    'la de la evolución biológica, y también la de varios algoritmos de optimización que se usan hoy ' +
    'cuando el problema es tan enrevesado que no se puede derivar: recocido simulado, algoritmos ' +
    'genéticos, búsqueda aleatoria. Todos comparten la moraleja de Ashby: <strong>cuando no sabes qué ' +
    'hacer, basta con saber reconocer cuándo va mal y tener manera de volver a intentarlo</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('Adaptación por reconfiguración');

  p.text('Conviene separar bien los dos niveles, porque es la aportación conceptual del tema.');

  p.table(['Nivel', 'Qué hace', 'Con qué velocidad', 'Ejemplo en un cuerpo'],
    [['<strong>Primero</strong>', 'corregir dentro de las reglas actuales', 'rápido, continuo', 'sudar, tiritar, acelerar el pulso'],
     ['<strong>Segundo</strong>', 'cambiar las reglas cuando el primero fracasa', 'lento, a saltos', 'aclimatarse a la altitud en semanas']]);

  p.text('Lo esencial es que el segundo nivel <strong>solo se activa cuando el primero ha fracasado</strong>. ' +
    'Mientras las variables esenciales estén dentro de sus límites, no pasa nada; el sistema no anda ' +
    'cambiando de estrategia porque sí. La señal que dispara la reorganización no es «esto se puede ' +
    'mejorar» sino «esto me está matando».');

  p.util('Ese diseño en dos niveles se copia a menudo, aunque no se le llame así. Un sistema ' +
    'informático con reinicio automático tiene exactamente esa arquitectura: mientras las métricas ' +
    'están dentro de rango, el servicio corrige solo; cuando se salen, un supervisor lo reinicia con ' +
    'otra configuración. En gestión se llama «gestión por excepción»: no tocar lo que funciona y ' +
    'reservar la atención para lo que se sale de los límites, que es la única manera de que un ' +
    'regulador con poca variedad gobierne algo grande.');

  p.hist('Ashby presentó el homeostato en 1952 y provocó una discusión notable. Grey Walter, otro ' +
    'pionero británico que por entonces construía tortugas robot que buscaban la luz, lo elogió; ' +
    'otros lo despacharon diciendo que aquello no era inteligencia sino un aparato que sorteaba ' +
    'números al azar. Ashby respondió con una pregunta que sigue siendo buena: si un mecanismo ' +
    'sobrevive a un mundo que no fue diseñado para él, <em>¿qué más se le está pidiendo para llamarlo ' +
    'adaptativo?</em> La discusión, con otras palabras, sigue viva hoy en cada debate sobre qué ' +
    'cuenta como inteligencia en una máquina.');

  p.sub('¿Cuánto tarda en acertar barajando al azar?');

  p.text('El homeostato prueba configuraciones hasta dar con una buena, así que conviene saber cuánto ' +
    'se tarda en eso. La respuesta es más sencilla de lo que parece y no hace falta ninguna fórmula ' +
    'nueva: basta con pensarlo al derecho.');

  p.text('Supón que de cada cinco configuraciones hay una que aguanta, es decir, que la probabilidad ' +
    'de acertar en un sorteo es $p = 1/5$. Si haces cien sorteos, esperas unos veinte aciertos, ' +
    'repartidos más o menos por igual a lo largo de los cien. Entre acierto y acierto hay, por tanto, ' +
    'unos cinco sorteos. <strong>Ese es el número medio de intentos hasta el primer acierto: ' +
    'cinco</strong>, que es justamente $1/p$.');

  p.formula('\\text{intentos de media} = \\frac{1}{p}',
    'cuántos sorteos hasta el primer acierto',
    'Se lee: <em>«los intentos de media son uno partido por pe»</em>, donde $p$ es la probabilidad de ' +
    'acertar en cada intento.<br><br>Con un ejemplo cotidiano: si un dado acierta el 6 con ' +
    'probabilidad $1/6$, hay que tirarlo <strong>seis veces de media</strong> para sacar el primer 6. ' +
    'No seis exactas —puede salir a la primera o tardar veinte— pero seis de promedio si repites el ' +
    'experimento muchas veces.<br><br>A esta situación, contar intentos hasta el primer éxito, los ' +
    'libros la llaman <em>distribución geométrica</em>; aquí no hace falta el nombre, solo el ' +
    'razonamiento de arriba.');

  p.note('Este cálculo pone número al punto débil del método. Cuantas menos configuraciones sirvan, ' +
    'más se tarda, y la cuenta empeora deprisa: con doce variables acopladas de dos en dos hay ' +
    'billones de combinaciones posibles, y sortear a ciegas dejaría de ser viable. Por eso el ' +
    'homeostato de Ashby tenía cuatro unidades y no cuarenta, y por eso los métodos actuales que ' +
    'heredan su idea —algoritmos genéticos, recocido simulado— no sortean del todo a ciegas: ' +
    'conservan lo que funcionaba y solo alteran una parte.', 'warn', 'Dónde deja de funcionar el azar');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Esencial o instrumental?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'la temperatura interna del cuerpo humano', e: true },
        { t: 'la frecuencia cardíaca durante el ejercicio', e: false },
        { t: 'el pH de la sangre', e: true },
        { t: 'la cantidad de sudor producido', e: false },
        { t: 'el nivel de oxígeno en sangre', e: true },
        { t: 'el ritmo de la respiración', e: false },
        { t: 'la liquidez de una empresa para pagar nóminas', e: true },
        { t: 'el margen de beneficio de un pedido concreto', e: false },
        { t: 'la presión en el interior de una caldera', e: true },
        { t: 'la apertura de la válvula de una caldera', e: false }
      ];
      var c = r.pick(casos);
      return { texto: c.t, esencial: c.e };
    },
    ask: function (d) {
      return 'Clasifica esta variable:<br><br><em>«' + d.texto + '»</em><br><br>' +
        '¿Es <strong>esencial</strong> —tiene que mantenerse dentro de unos límites o el sistema no ' +
        'sobrevive— o <strong>instrumental</strong> —puede variar mucho, y de hecho varía para ' +
        'proteger a las esenciales—?';
    },
    fields: [{ name: 'q', label: 'es una variable', w: 'wide' }],
    sol: function (d) { return { q: d.esencial ? 'esencial' : 'instrumental' }; },
    check: function (v, d) {
      var s = String(v.raw.q || '').toLowerCase();
      var es = /esencial|cr[ií]tic|vital|imprescind/.test(s);
      var ins = /instrument|medio|palanca|no esencial|auxiliar|secundar/.test(s);
      if (es === ins) return { ok: false, msg: 'Responde «esencial» o «instrumental».' };
      return { ok: d.esencial ? es : ins };
    },
    hint: function () { return 'Pregúntate si el sistema puede permitirse que esa variable se dispare durante un rato. Si puede, es instrumental.'; },
    steps: function (d) {
      return d.esencial
        ? ['Si esta variable se sale de su rango, el sistema deja de funcionar o muere.',
           'No hay margen para dejarla variar: todo lo demás se moviliza para sostenerla.',
           'Es una variable <strong>esencial</strong>.']
        : ['Esta variable puede cambiar muchísimo sin que pase nada malo.',
           'De hecho cambia <em>a propósito</em>, y ese cambio es lo que protege a las esenciales.',
           'Es una variable <strong>instrumental</strong>: un medio, no un fin.'];
    },
    answer: function (d) { return d.esencial ? 'esencial' : 'instrumental'; }
  });

  p.exercise({
    title: 'Cuánto tarda en encontrar una configuración buena',
    level: 'medio',
    gen: function (r) {
      var total = r.pick([8, 10, 12, 16, 20, 25]);
      var buenas = r.int(1, Math.max(1, Math.floor(total / 3)));
      return { total: total, buenas: buenas };
    },
    ask: function (d) {
      return 'Un homeostato sortea al azar entre <strong>' + d.total + ' configuraciones</strong> ' +
        'posibles, de las cuales <strong>' + d.buenas + '</strong> son estables. Cada vez que se sale ' +
        'de los límites vuelve a sortear, con la misma probabilidad para todas.<br><br>' +
        '¿Cuál es la probabilidad de acertar en un sorteo, y cuántos sorteos hacen falta por término ' +
        'medio hasta dar con una buena?';
    },
    fields: [
      { name: 'p', label: 'probabilidad', w: 'tiny' },
      { name: 'n', label: 'sorteos de media', w: 'tiny' }
    ],
    sol: function (d) { return { p: d.buenas / d.total, n: d.total / d.buenas }; },
    tol: 1e-6,
    hint: function () {
      return 'Para la segunda parte, usa el razonamiento de arriba: si aciertas una de cada tantas ' +
        'veces, de media necesitas justamente esas tantas.';
    },
    steps: function (d) {
      return [
        'Probabilidad de acertar en un sorteo: $\\dfrac{' + d.buenas + '}{' + d.total + '} = ' + U.fmt(d.buenas / d.total, 4) + '$.',
        'Si aciertas esa fracción de las veces, entre acierto y acierto pasan de media tantos sorteos como indica su inverso: $1/p$.',
        'Media de sorteos: $\\dfrac{' + d.total + '}{' + d.buenas + '} = ' + U.fmt(d.total / d.buenas, 3) + '$.',
        'Ahí está el precio de este método: es sencillísimo de construir y no necesita entender nada, pero cuantas menos configuraciones sirvan, más se tarda. Con muchas variables el número de combinaciones crece tan deprisa que el azar puro deja de ser viable.'
      ];
    }
  });

  p.keys([
    'Las <strong>variables esenciales</strong> son las que deben permanecer dentro de unos límites; las demás son medios para conseguirlo.',
    '<strong>Homeostasis</strong> es mantenerlas dentro de ese rango pese a las perturbaciones.',
    'Un sistema es <strong>ultraestable</strong> si además sabe reconfigurarse cuando las reglas del mundo cambian.',
    'El homeostato tiene dos niveles: corregir dentro de las reglas, y cambiar las reglas cuando lo primero fracasa.',
    'La reorganización se dispara al salirse de los límites, no al detectar que algo mejorable: la señal es «esto me mata», no «esto se puede mejorar».',
    'Probar al azar y conservar lo que sobrevive es la estrategia de la evolución y la de varios algoritmos de optimización actuales.'
  ]);

});
