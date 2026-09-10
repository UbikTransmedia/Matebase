/* Tema: Dinamica de sistemas: stocks y flujos */
Course.topic('cib-dinamica', function (p) {

  p.text('Una bañera es el sistema más sencillo que existe y, a la vez, uno de los más engañosos. El nivel ' +
    'del agua es un <strong>stock</strong>: algo que se acumula. El grifo y el desagüe son ' +
    '<strong>flujos</strong>: lo que entra y lo que sale por unidad de tiempo. El nivel no depende de ' +
    'cuánto entra ahora, sino de <em>todo</em> lo que ha entrado y salido desde el principio. Parece ' +
    'evidente, y sin embargo casi todo el mundo se equivoca en cuanto la bañera se complica un poco.');

  p.text('La <strong>dinámica de sistemas</strong> es el arte de describir el mundo con bañeras: la ' +
    'población de un país, el dinero de una cuenta, el CO₂ de la atmósfera, los enfermos de una epidemia, ' +
    'las existencias de un almacén. Unos pocos stocks, los flujos que los conectan y los bucles de ' +
    '[[cib-realimentacion|realimentación]] que hacen que los flujos dependan de los stocks bastan para ' +
    'explicar comportamientos sorprendentes: crecimientos que se frenan de golpe, oscilaciones que nadie ' +
    'busca y colapsos que nadie ve venir.');

  /* ---------------------------------------------------------------- */
  p.section('Stocks y flujos');

  p.formula('\\frac{dS}{dt} = \\text{entrada}(t) - \\text{salida}(t)', 'la ecuación de un stock',
    'Se lee: <em>«la derivada del stock respecto del tiempo es la entrada menos la salida»</em>.<br><br>' +
    'Dicho al revés: el stock es la [[fn-funcion-integral|integral]] del flujo neto. Por eso un stock tiene ' +
    '<strong>inercia</strong>: no puede saltar de un valor a otro, solo cambiar al ritmo que marcan los flujos.<br><br>' +
    'Y por eso sube mientras entre más de lo que sale, <em>aunque la entrada esté bajando</em>.');

  p.note('Si las emisiones de CO₂ empezaran a bajar mañana, la cantidad de CO₂ en la atmósfera seguiría ' +
    'subiendo mientras se emitiera más de lo que absorben los océanos y la vegetación: el stock solo baja ' +
    'cuando la salida supera a la entrada. En experimentos del MIT, estudiantes de posgrado con formación ' +
    'científica razonaban a menudo como si el stock tuviera que imitar la forma del flujo. Es el error más ' +
    'común de toda la dinámica de sistemas.', 'warn', 'El error de la bañera');

  p.sub('Simular con el método de Euler');

  p.text('Casi ningún sistema con varios stocks tiene una fórmula cerrada. Pero todos se pueden ' +
    '<strong>simular</strong> con la idea más sencilla posible: avanzar el tiempo a saltos pequeños de ' +
    'duración $\\Delta t$ y suponer que, durante cada salto, los flujos no cambian. Es el ' +
    '[[av-edo-numerico|método de Euler]], y es exactamente lo que hacen por dentro los programas de ' +
    'dinámica de sistemas.');

  p.formula('S_{n+1} = S_n + \\Delta t\\,\\bigl(\\text{entrada}_n - \\text{salida}_n\\bigr)', 'un paso de Euler',
    'Se lee: <em>«el stock en el paso siguiente es el de ahora más el paso de tiempo por el flujo neto de ahora»</em>.<br><br>' +
    'Cuanto más pequeño es $\\Delta t$, más se parece la simulación a la solución exacta; si es demasiado ' +
    'grande, la simulación puede pasarse de largo e incluso oscilar sin motivo.');

  p.demo({
    title: 'La bañera que busca su nivel',
    intro: 'Entra agua a caudal constante y sale más deprisa cuanto más llena está la bañera, porque la presión en el desagüe aumenta: la salida es k·S. Cambia el caudal y el desagüe: el nivel siempre acaba donde lo que sale iguala a lo que entra. Y prueba a cerrar el grifo a mitad.',
    build: function (host) {
      var e = 4, k = 0.1, S0 = 10, cierra = false, T = 60, dt = 0.1;
      var out = W.readout(host, '');
      function simula() {
        var S = S0, pts = [[0, S]];
        for (var i = 1; i * dt <= T + 1e-9; i++) {
          var t = i * dt, ent = (cierra && t > 30) ? 0 : e;
          S += dt * (ent - k * S);
          pts.push([t, S]);
        }
        return pts;
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: T, ymin: 0, ymax: 105, height: 280, xlabel: 'minutos', ylabel: 'litros',
        draw: function (g) {
          g.hline(e / k, { color: 1, dash: true, w: 1.6 });
          if (cierra) g.vline(30, { color: 'axis', dash: [3, 4], w: 1.2 });
          g.path(simula(), { color: 0, w: 2.8 });
        }
      });
      function pinta() {
        out.set('Equilibrio: $S^* = \\frac{e}{k} = ' + U.fmt(e / k, 1) + '$ litros &nbsp;·&nbsp; constante de tiempo $\\tau = \\frac{1}{k} = ' + U.fmt(1 / k, 1) +
          '$ min: a los $3\\tau = ' + U.fmt(3 / k, 1) + '$ min ha recorrido el 95 % del camino.' +
          (cierra ? '<br>Al cerrar el grifo el nivel no cae de golpe: se vacía con el mismo ritmo $\\tau$ con el que se llenaba.' : ''));
        plot.render();
      }
      W.chips(host, [{ label: 'grifo siempre abierto', value: false }, { label: 'se cierra a los 30 min', value: true }], { value: cierra, on: function (v) { cierra = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'entrada e (L/min)', min: 0, max: 10, step: 0.5, value: e, on: function (v) { e = v; pinta(); } });
      W.slider(fila, { label: 'desagüe k', min: 0.1, max: 0.5, step: 0.01, value: k, on: function (v) { k = v; pinta(); } });
      W.slider(fila, { label: 'nivel inicial', min: 0, max: 100, step: 1, value: S0, on: function (v) { S0 = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Bucles de refuerzo y de equilibrio');

  p.text('Lo interesante empieza cuando los flujos dependen de los stocks. Solo hay dos maneras de que eso ' +
    'ocurra, y todo lo demás son combinaciones de ellas:');

  p.list([
    '<strong>Bucle de refuerzo.</strong> Cuanto más stock, más flujo de entrada: más población, más nacimientos; más dinero, más intereses. El resultado es un crecimiento exponencial, que se duplica siempre en el mismo tiempo.',
    '<strong>Bucle de equilibrio.</strong> Cuanto más lejos está el stock de un objetivo, más flujo para acercarlo: la bañera de arriba, el café que se enfría, un termostato. El resultado es un acercamiento al objetivo cada vez más lento.'
  ]);

  p.formulas([
    '\\frac{dP}{dt} = r\\,P \\ \\Rightarrow\\ P(t) = P_0\\,e^{rt}',
    '\\frac{dS}{dt} = e - k\\,S \\ \\Rightarrow\\ S(t) \\to \\frac{e}{k}'
  ], 'refuerzo y equilibrio',
    'La primera es el bucle de refuerzo: el flujo es proporcional al stock y sale la [[fn-exp-log|exponencial]]. ' +
    'Su tiempo de duplicación es $\\frac{\\ln 2}{r}$: con un crecimiento del 7 % anual, unos 10 años.<br><br>' +
    'La segunda es el bucle de equilibrio: el stock se detiene donde el flujo neto se anula, en $S^* = \\frac{e}{k}$.');

  /* ---------------------------------------------------------------- */
  p.section('Límites al crecimiento');

  p.text('Ningún crecimiento exponencial dura siempre. Tarde o temprano se acaba la comida, el espacio o ' +
    'los clientes, y un bucle de equilibrio que al principio no se notaba toma el mando. La forma más ' +
    'sencilla de escribirlo es la ecuación logística:');

  p.formula('\\frac{dP}{dt} = r\\,P\\left(1 - \\frac{P}{K}\\right)', 'crecimiento logístico',
    'Se lee: <em>«la derivada de P es erre por P por uno menos P partido por K»</em>.<br><br>' +
    'Cuando $P$ es pequeña, el paréntesis vale casi 1 y la población crece como una exponencial: manda el ' +
    'bucle de refuerzo. Cuando se acerca a la <strong>capacidad</strong> $K$, el paréntesis se acerca a 0 y ' +
    'el crecimiento se frena: manda el de equilibrio.<br><br>El crecimiento es máximo con $P = \\frac{K}{2}$, ' +
    'donde se anula la derivada de $rP - \\frac{r}{K}P^2$ ([[fn-aplicaciones]]), y ese crecimiento máximo vale $\\frac{rK}{4}$.');

  p.text('Ese $\\frac{rK}{4}$ tiene un nombre en pesca y en explotación forestal: la <strong>captura máxima ' +
    'sostenible</strong>. Si cada año se captura menos que eso, la población se reajusta a un nivel más ' +
    'bajo y lo repone. Si se captura más, no hay nivel que lo aguante.');

  p.demo({
    title: 'Pescar sin acabar con los peces',
    intro: 'Una población de peces crece de forma logística hasta la capacidad K = 100, y cada año se pesca una cantidad fija h. Sube la captura poco a poco: hasta cierto valor la población se adapta a un nivel más bajo; un poco más allá, se hunde. La línea de puntos marca K/2.',
    build: function (host) {
      var rr = 0.4, K = 100, h = 5, T = 60, dt = 0.05;
      var out = W.readout(host, '');
      function simula() {
        var P = K, pts = [[0, P]], fin = null;
        for (var i = 1; i * dt <= T + 1e-9; i++) {
          P += dt * (rr * P * (1 - P / K) - h);
          if (P <= 0) { P = 0; if (fin === null) fin = i * dt; }
          if (i % 4 === 0) pts.push([i * dt, P]);
        }
        return { pts: pts, fin: fin };
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: T, ymin: 0, ymax: 110, height: 280, xlabel: 'años', ylabel: 'población',
        draw: function (g) {
          g.hline(K / 2, { color: 'axis', dash: [3, 4], w: 1.2 });
          g.path(simula().pts, { color: 0, w: 2.8 });
        }
      });
      function pinta() {
        var msy = rr * K / 4, s = simula();
        var txt = 'Captura máxima sostenible: $\\frac{rK}{4} = ' + U.fmt(msy, 2) + '$ &nbsp;·&nbsp; captura actual: $h = ' + U.fmt(h, 1) + '$<br>';
        if (h <= msy + 1e-9) {
          var eq = K / 2 * (1 + Math.sqrt(Math.max(0, 1 - 4 * h / (rr * K))));
          txt += '<strong style="color:var(--ok)">Sostenible:</strong> la población se estabiliza en unos $' + U.fmt(eq, 1) + '$ peces.';
        } else {
          txt += '<strong style="color:var(--bad)">Insostenible:</strong> se pesca más de lo que la población puede reponer' +
            (s.fin !== null ? ', y desaparece hacia el año ' + U.fmt(s.fin, 0) : '') + '.';
        }
        out.set(txt);
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'tasa de crecimiento r', min: 0.1, max: 1, step: 0.05, value: rr, on: function (v) { rr = v; pinta(); } });
      W.slider(fila, { label: 'captura anual h', min: 0, max: 30, step: 0.5, value: h, on: function (v) { h = v; pinta(); } });
      W.hint(host, 'Con r = 0,4 el umbral es 10. Prueba h = 9,5 y h = 10,5: la diferencia en la captura es pequeña; en el destino de la población, total.');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Arquetipos');

  p.text('Los practicantes de la dinámica de sistemas descubrieron que las mismas pocas estructuras se ' +
    'repiten en empresas, ecosistemas y países. Las llaman <strong>arquetipos</strong>, y reconocerlas ' +
    'ahorra mucho trabajo, porque cada una tiene su trampa y su salida conocidas.');

  p.list([
    '<strong>Límites al crecimiento.</strong> Un bucle de refuerzo crece hasta chocar con uno de equilibrio. La trampa es empujar más fuerte el crecimiento; la salida, actuar sobre el límite.',
    '<strong>La tragedia de los comunes.</strong> Muchos usuarios explotan un recurso compartido. A cada uno le conviene tomar un poco más, porque el beneficio es suyo y el daño se reparte; entre todos agotan el recurso.',
    '<strong>Soluciones que fallan.</strong> Un arreglo rápido alivia el síntoma, pero con retraso empeora el problema: pedir un préstamo para pagar otro.',
    '<strong>Escalada.</strong> Dos partes reaccionan cada una a lo que hace la otra, y cada respuesta provoca una respuesta mayor: carreras de armamento, guerras de precios.'
  ]);

  p.hist('La dinámica de sistemas nació en 1956, cuando Jay Forrester, un ingeniero del MIT que había ' +
    'inventado la memoria de núcleos magnéticos de los primeros ordenadores, se pasó a la escuela de ' +
    'negocios y empezó a simular empresas como si fueran circuitos. En 1972, un equipo formado en su grupo ' +
    'publicó <em>Los límites del crecimiento</em>, un informe para el Club de Roma que simulaba por ' +
    'ordenador la población, los recursos y la contaminación del planeta. Su autora principal fue ' +
    '<strong>Donella Meadows</strong>, doctora en biofísica, que dedicó el resto de su vida a enseñar a ' +
    'pensar en sistemas. Su ensayo sobre los «puntos de apalancamiento», los lugares donde un pequeño ' +
    'cambio transforma un sistema entero, sigue siendo una lectura de referencia. Y fue otra mujer, ' +
    '<strong>Elinor Ostrom</strong>, quien demostró estudiando pesquerías y regadíos de todo el mundo que ' +
    'la tragedia de los comunes no es inevitable: muchas comunidades se dan reglas que la evitan. Por ' +
    'ello recibió en 2009 el Premio Nobel de Economía, la primera mujer en conseguirlo.');

  p.util('Los modelos de epidemias que se usaron durante la pandemia de 2020 son modelos de stocks y ' +
    'flujos: sanos, infectados y recuperados, con flujos de contagio y de curación. La cadena de ' +
    'suministro de un supermercado, el nivel de un embalse o la deuda de un país se estudian igual. Y la ' +
    'oscilación de los inventarios que aparece en el tema de [[cib-retardos|retardos]] es un sistema de ' +
    'stocks con un flujo que llega tarde.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El nivel de equilibrio',
    level: 'basico',
    gen: function (r) {
      var e = r.int(1, 12), k = r.pick([0.05, 0.1, 0.2, 0.25, 0.5]);
      return { e: e, k: k, S: e / k, t: 3 / k };
    },
    ask: function (d) {
      return 'A un depósito entran $' + d.e + '$ litros por hora y salen $' + U.fmt(d.k, 2) + '\\cdot S$ litros por hora, donde $S$ son los litros que ' +
        'contiene. ¿En qué nivel se estabiliza? ¿Cuántas horas tarda, aproximadamente, en recorrer el 95 % del camino hacia ese nivel?';
    },
    fields: [{ name: 's', label: 'nivel (L)', w: 'tiny' }, { name: 't', label: 'tiempo (h)', w: 'tiny' }],
    sol: function (d) { return { s: d.S, t: d.t }; },
    tol: 1e-6,
    errores: [
      { si: function (v, d) { return Math.abs(v.s - d.e * d.k) < 1e-6; }, msg: 'En el equilibrio la salida iguala a la entrada: $k\\,S = e$, así que $S = \\frac{e}{k}$, no $e\\cdot k$.' },
      { si: function (v, d) { return Math.abs(v.t - 3 * d.k) < 1e-6; }, msg: 'La constante de tiempo es $\\tau = \\frac{1}{k}$, y el 95 % se alcanza hacia $3\\tau$.' }
    ],
    hint: function () { return ['Equilibrio: el flujo neto es cero, $e - kS = 0$.', 'El 95 % del camino se recorre en unas tres constantes de tiempo, $3\\tau = \\frac{3}{k}$.']; },
    steps: function (d) {
      return ['$e - kS = 0 \\Rightarrow S^* = \\dfrac{' + d.e + '}{' + U.fmt(d.k, 2) + '} = ' + U.fmt(d.S, 2) + '$ litros.',
        '$\\tau = \\dfrac{1}{' + U.fmt(d.k, 2) + '} = ' + U.fmt(1 / d.k, 2) + '$ h, y $3\\tau = ' + U.fmt(d.t, 2) + '$ h (porque $e^{-3} \\approx 0{,}05$).'];
    },
    answer: function (d) { return U.fmt(d.S, 2) + ' L, ' + U.fmt(d.t, 2) + ' h'; }
  });

  p.exercise({
    title: '¿Qué estructura es?',
    level: 'basico',
    gen: function (r) {
      return r.pick([
        { t: 'Una aplicación nueva crece muy deprisa porque cada usuario invita a sus amigos, pero al llegar a buena parte de su público posible el crecimiento se frena casi de golpe.', q: 'limites' },
        { t: 'Varios pueblos sacan agua del mismo acuífero. A cada uno le conviene sacar un poco más, y entre todos lo agotan.', q: 'comunes' },
        { t: 'Un café que se deja en la mesa se enfría cada vez más despacio hasta quedarse a la temperatura de la habitación.', q: 'equilibrio' },
        { t: 'Una deuda que no se paga genera intereses, que se suman a la deuda y generan todavía más intereses.', q: 'refuerzo' },
        { t: 'Las empresas que faenan en un mismo caladero aumentan cada una su flota para no quedarse atrás, hasta que el caladero se agota.', q: 'comunes' },
        { t: 'Una plaga de insectos se multiplica en un campo hasta que la comida empieza a escasear, y la población se estanca.', q: 'limites' },
        { t: 'El cuerpo suda cuando la temperatura sube, y el sudor, al evaporarse, la hace bajar.', q: 'equilibrio' },
        { t: 'Un rumor se extiende porque cada persona que lo conoce se lo cuenta a otras dos.', q: 'refuerzo' }
      ]);
    },
    ask: function (d) { return '<em>«' + d.t + '»</em><br>¿Qué estructura de dinámica de sistemas describe mejor la situación?'; },
    fields: [{
      name: 'q', label: 'Estructura', opts: [
        { t: 'Bucle de refuerzo: crecimiento que se acelera', v: 'refuerzo' },
        { t: 'Bucle de equilibrio: acercamiento a un objetivo', v: 'equilibrio' },
        { t: 'Límites al crecimiento', v: 'limites' },
        { t: 'Tragedia de los comunes', v: 'comunes' }
      ]
    }],
    sol: function (d) { return { q: d.q }; },
    hint: function () { return ['¿Hay un solo bucle o dos que se turnan el mando?', '¿El recurso es de uno o de muchos?']; },
    steps: function (d) {
      return [{
        refuerzo: 'Cuanto más stock, más flujo de entrada, y nada lo frena: <strong>bucle de refuerzo</strong>.',
        equilibrio: 'El sistema se acerca a un valor objetivo cada vez más despacio: <strong>bucle de equilibrio</strong>.',
        limites: 'Primero manda un bucle de refuerzo y después uno de equilibrio que se hace más fuerte al crecer: <strong>límites al crecimiento</strong>.',
        comunes: 'Muchos usuarios de un recurso compartido, cada uno con incentivo a tomar un poco más: <strong>tragedia de los comunes</strong>.'
      }[d.q]];
    },
    answer: function (d) { return { refuerzo: 'Refuerzo', equilibrio: 'Equilibrio', limites: 'Límites al crecimiento', comunes: 'Tragedia de los comunes' }[d.q]; }
  });

  p.exercise({
    title: 'Dos pasos de Euler',
    level: 'medio',
    gen: function (r) {
      var S0 = r.int(2, 8) * 10, e = r.int(2, 10), k = r.pick([0.1, 0.2, 0.5]), dt = r.pick([1, 0.5, 2]);
      if (k * dt > 0.5 || e === k * S0) return null;
      var S1 = S0 + dt * (e - k * S0), S2 = S1 + dt * (e - k * S1);
      return { S0: S0, e: e, k: k, dt: dt, S1: S1, S2: S2, sinDt: S0 + (e - k * S0), signo: S0 - dt * (e - k * S0) };
    },
    ask: function (d) {
      return 'Una bañera tiene $S_0 = ' + d.S0 + '$ litros. Entran $' + d.e + '$ litros por minuto y salen $' + U.fmt(d.k, 1) +
        '\\cdot S$ litros por minuto. Con el método de Euler y un paso $\\Delta t = ' + U.fmt(d.dt, 1) + '$ minutos, calcula $S_1$ y $S_2$.';
    },
    fields: [{ name: 'a', label: '$S_1$', w: 'tiny' }, { name: 'b', label: '$S_2$', w: 'tiny' }],
    sol: function (d) { return { a: d.S1, b: d.S2 }; },
    tol: 1e-6,
    errores: [
      { si: function (v, d) { return d.dt !== 1 && Math.abs(v.a - d.sinDt) < 1e-6; }, msg: 'Falta multiplicar el flujo neto por el paso: el flujo se da por minuto y cada paso dura $\\Delta t$ minutos.' },
      { si: function (v, d) { return Math.abs(v.a - d.signo) < 1e-6; }, msg: 'El stock sube cuando entra más de lo que sale: se <strong>suma</strong> el flujo neto, entrada menos salida.' }
    ],
    hint: function () { return ['Flujo neto al principio: entrada menos salida, con $S = S_0$.', '$S_1 = S_0 + \\Delta t\\cdot(\\text{flujo neto})$. Para $S_2$, repite con $S_1$.']; },
    steps: function (d) {
      var f0 = d.e - d.k * d.S0, f1 = d.e - d.k * d.S1;
      return ['Flujo neto inicial: $' + d.e + ' - ' + U.fmt(d.k, 1) + '\\cdot ' + d.S0 + ' = ' + U.fmt(f0, 3) + '$',
        '$S_1 = ' + d.S0 + ' + ' + U.fmt(d.dt, 1) + '\\cdot(' + U.fmt(f0, 3) + ') = ' + U.fmt(d.S1, 4) + '$',
        'Flujo neto con $S_1$: $' + d.e + ' - ' + U.fmt(d.k, 1) + '\\cdot ' + U.fmt(d.S1, 4) + ' = ' + U.fmt(f1, 4) + '$',
        '$S_2 = ' + U.fmt(d.S1, 4) + ' + ' + U.fmt(d.dt, 1) + '\\cdot(' + U.fmt(f1, 4) + ') = ' + U.fmt(d.S2, 4) + '$'];
    },
    answer: function (d) { return 'S₁ = ' + U.fmt(d.S1, 4) + ', S₂ = ' + U.fmt(d.S2, 4); }
  });

  p.problem({
    title: 'La captura máxima sostenible',
    level: 'avanzado',
    gen: function (r) {
      var rr = r.pick([0.2, 0.3, 0.4, 0.5, 0.8]), K = r.pick([200, 500, 1000, 2000]), f = r.pick([0.5, 0.8, 1.2, 1.5]);
      var msy = rr * K / 4;
      return { r: rr, K: K, msy: msy, h: msy * f, ok: f < 1 ? 'si' : 'no' };
    },
    intro: function (d) {
      return 'La población de una especie de peces en un lago sigue el modelo logístico $\\dfrac{dP}{dt} = ' + U.fmt(d.r, 1) + '\\,P\\left(1 - \\dfrac{P}{' + d.K + '}\\right)$, con $t$ en años.';
    },
    partes: [
      {
        ask: function () { return '¿Con qué población crece más deprisa?'; },
        fields: [{ name: 'p', label: 'P =', w: 'tiny' }],
        sol: function (d) { return { p: d.K / 2 }; },
        tol: 1e-6,
        errores: [{ si: function (v, d) { return v.p === d.K; }, msg: 'Con $P = K$ el crecimiento es cero: la población ya no cabe. El máximo está a mitad de camino.' }],
        hint: function () { return 'El crecimiento $rP - \\frac{r}{K}P^2$ es una parábola en $P$: busca su vértice, o deriva e iguala a cero.'; },
        steps: function (d) { return ['$\\dfrac{d}{dP}\\left(rP - \\dfrac{r}{K}P^2\\right) = r - \\dfrac{2r}{K}P = 0 \\Rightarrow P = \\dfrac{K}{2} = ' + (d.K / 2) + '$']; },
        answer: function (d) { return String(d.K / 2); }
      },
      {
        ask: function () { return '¿Cuál es la captura máxima sostenible, en peces por año?'; },
        fields: [{ name: 'm', label: 'captura', w: 'tiny' }],
        sol: function (d) { return { m: d.msy }; },
        tol: 1e-6,
        errores: [{ si: function (v, d) { return Math.abs(v.m - d.r * d.K / 2) < 1e-6; }, msg: 'Has sustituido $P = \\frac{K}{2}$ en $rP$, pero falta el paréntesis: $\\left(1 - \\frac{1}{2}\\right) = \\frac{1}{2}$.' }],
        hint: function () { return 'Sustituye $P = \\frac{K}{2}$ en $rP\\left(1 - \\frac{P}{K}\\right)$.'; },
        steps: function (d) { return ['$' + U.fmt(d.r, 1) + '\\cdot ' + (d.K / 2) + '\\cdot\\left(1 - \\frac{1}{2}\\right) = \\dfrac{rK}{4} = ' + U.fmt(d.msy, 1) + '$ peces al año.']; },
        answer: function (d) { return U.fmt(d.msy, 1); }
      },
      {
        ask: function (d) { return 'Si se pescan $' + U.fmt(d.h, 1) + '$ peces al año, ¿puede mantenerse la población indefinidamente?'; },
        fields: [{ name: 't', label: 'La población', opts: [{ t: 'Sí: se estabiliza en un nivel más bajo', v: 'si' }, { t: 'No: acaba desapareciendo', v: 'no' }] }],
        sol: function (d) { return { t: d.ok }; },
        hint: function () { return 'Compara la captura con el crecimiento máximo posible.'; },
        steps: function (d) {
          return [d.ok === 'si'
            ? 'La captura es menor que $' + U.fmt(d.msy, 1) + '$: hay un nivel de población cuyo crecimiento la compensa, y la población se queda ahí.'
            : 'La captura supera $' + U.fmt(d.msy, 1) + '$, el mayor crecimiento posible: ningún nivel lo repone y la población se hunde.'];
        },
        answer: function (d) { return d.ok === 'si' ? 'Sí' : 'No'; }
      }
    ]
  });

  p.keys([
    'Un stock es la integral de su flujo neto: tiene inercia y sube mientras entre más de lo que sale, aunque la entrada baje.',
    'Se simula con Euler: $S_{n+1} = S_n + \\Delta t\\,(\\text{entrada} - \\text{salida})$.',
    'Bucle de refuerzo: crecimiento exponencial. Bucle de equilibrio: acercamiento a $S^* = \\frac{e}{k}$ con constante de tiempo $\\frac{1}{k}$.',
    'Logística: crecimiento máximo con $P = \\frac{K}{2}$; la captura máxima sostenible es $\\frac{rK}{4}$.',
    'Los arquetipos —límites al crecimiento, tragedia de los comunes, soluciones que fallan, escalada— se repiten en empresas, ecosistemas y países.'
  ]);
});
