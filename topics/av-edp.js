/* Tema: Ecuaciones en derivadas parciales */
Course.topic('av-edp', function (p) {

  p.text('En una ecuación diferencial ordinaria la incógnita es una función de <strong>una</strong> ' +
    'variable: $y(x)$. Pero casi todo lo interesante de la física depende de varias a la vez: la ' +
    'temperatura de una barra depende del punto <em>y</em> del instante, $T(x,t)$.');

  p.text('Cuando la ecuación relaciona <strong>derivadas parciales</strong> de una función de varias ' +
    'variables, se llama <strong>ecuación en derivadas parciales</strong>. Y ahí es donde vive la ' +
    'física de verdad.');

  p.table(['Ecuación', 'Fórmula', 'Describe'],
    [['Del <strong>calor</strong>', '$\\dfrac{\\partial u}{\\partial t} = k\\dfrac{\\partial^2 u}{\\partial x^2}$', 'cómo se difunde la temperatura'],
     ['De <strong>ondas</strong>', '$\\dfrac{\\partial^2 u}{\\partial t^2} = c^2\\dfrac{\\partial^2 u}{\\partial x^2}$', 'una cuerda vibrando, el sonido, la luz'],
     ['De <strong>Laplace</strong>', '$\\dfrac{\\partial^2 u}{\\partial x^2} + \\dfrac{\\partial^2 u}{\\partial y^2} = 0$', 'estados de equilibrio: potenciales'],
     ['De <strong>Schrödinger</strong>', '$i\\hbar\\dfrac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi$', 'la mecánica cuántica entera']]);

  p.note('Fíjate en la ecuación del calor: dice que la temperatura de un punto sube si es más fría que ' +
    'sus vecinos y baja si es más caliente, porque la segunda derivada mide precisamente la curvatura, ' +
    'es decir, cuánto se aparta un punto del promedio de su entorno. La ecuación es una frase de ' +
    'sentido común escrita en símbolos.', 'ok', 'Qué dice de verdad la ecuación del calor');

  p.demo({
    title: 'El calor difundiéndose',
    intro: 'Una barra metálica con los extremos fríos y un pico de calor en medio. Avanza el tiempo y verás cómo la ecuación alisa el perfil.',
    build: function (host, d) {
      var N = 120;
      var u = new Array(N).fill(0);
      var k = 0.35, t = 0;
      var perfil = 'pico';
      var out = W.readout(host, '');
      function reiniciar() {
        u = new Array(N).fill(0);
        for (var i = 0; i < N; i++) {
          var x = i / (N - 1);
          if (perfil === 'pico') u[i] = (x > 0.42 && x < 0.58) ? 1 : 0;
          else if (perfil === 'escalon') u[i] = x < 0.5 ? 1 : 0;
          else u[i] = (x > 0.15 && x < 0.3) || (x > 0.6 && x < 0.8) ? 1 : 0;
        }
        u[0] = 0; u[N - 1] = 0;
        t = 0;
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 1, ymin: -0.15, ymax: 1.2, height: 260,
        xlabel: 'posición en la barra', ylabel: 'temperatura', ystep: 0.25,
        draw: function (g) {
          var pts = [];
          for (var i = 0; i < N; i++) pts.push([i / (N - 1), u[i]]);
          g.path(pts, { color: 0, w: 2.8 });
          g.area(function (x) {
            var i = Math.round(x * (N - 1));
            return u[Math.max(0, Math.min(N - 1, i))];
          }, 0, 1, { fill: 0, fillAlpha: .2 });
        }
      });
      function paso(n) {
        for (var s = 0; s < n; s++) {
          var nu = u.slice();
          for (var i = 1; i < N - 1; i++) {
            nu[i] = u[i] + k * (u[i - 1] - 2 * u[i] + u[i + 1]);
          }
          nu[0] = 0; nu[N - 1] = 0;
          u = nu; t++;
        }
        paint();
      }
      function paint() {
        var maxT = Math.max.apply(null, u);
        var total = U.sum(u) / N;
        out.set('Instante <strong>' + t + '</strong> &nbsp;·&nbsp; temperatura máxima: $' + U.fmt(maxT, 5) + '$ ' +
          '&nbsp;·&nbsp; media: $' + U.fmt(total, 5) + '$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">' +
          (t === 0 ? 'Perfil inicial. Pulsa para avanzar el tiempo.'
            : (t < 60 ? 'Los picos se aplanan y los valles se rellenan: la difusión <em>promedia</em>.'
              : 'A la larga todo tiende al equilibrio impuesto por los extremos fríos. La ecuación del calor ' +
                'destruye información: por eso no se puede «rebobinar» y reconstruir el pasado.')) +
          '</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'pico central', value: 'pico' }, { label: 'escalón', value: 'escalon' },
        { label: 'dos focos', value: 'dos' }
      ], { value: 'pico', on: function (v) { perfil = v; reiniciar(); paint(); } });
      W.buttons(host, [
        { t: '+1 paso', on: function () { paso(1); } },
        { t: '+20 pasos', cls: 'btn--main', on: function () { paso(20); } },
        { t: '↺ Reiniciar', on: function () { reiniciar(); paint(); } }
      ]);
      reiniciar();
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Separación de variables');

  p.text('El método clásico para resolverlas es una apuesta descarada: <strong>suponer que la solución ' +
    'se puede escribir como un producto</strong> de una función que solo depende de $x$ por otra que ' +
    'solo depende de $t$.');

  p.formula('u(x,t) = X(x)\\,T(t)', 'la apuesta');

  p.text('Al sustituir en la ecuación del calor y reordenar, ocurre algo notable:');

  p.formula('\\frac{T\'(t)}{k\\,T(t)} = \\frac{X\'\'(x)}{X(x)} = -\\lambda');

  p.text('El lado izquierdo depende solo de $t$ y el derecho solo de $x$. Si son iguales para todos los ' +
    'valores, la única posibilidad es que <strong>los dos sean una constante</strong>. Y así una EDP ' +
    'se parte en <strong>dos EDO</strong>, que sí sabemos resolver.');

  p.formulas([
    'T\'(t) = -\\lambda k\\,T(t) \\ \\Rightarrow\\ T = e^{-\\lambda k t}',
    'X\'\'(x) = -\\lambda X(x) \\ \\Rightarrow\\ X = \\operatorname{sen}(\\sqrt{\\lambda}\\,x)'
  ]);

  p.note('Las condiciones de contorno (extremos a temperatura cero) obligan a que $\\sqrt{\\lambda}$ ' +
    'solo pueda tomar ciertos valores discretos: $\\lambda_n = (n\\pi/L)^2$. La ecuación ' +
    '<strong>cuantiza</strong> las soluciones posibles, y de ahí salen los <em>modos</em>: los armónicos ' +
    'de una cuerda de guitarra son literalmente esto.', 'ok', 'Por qué una cuerda solo suena en ciertas notas');

  /* ---------------------------------------------------------------- */
  p.section('Y aquí es donde nace Fourier');

  p.text('Cada modo por separado es una solución. Pero el perfil inicial real no tiene por qué ser un ' +
    'seno: puede ser cualquier cosa. ¿Qué se hace entonces?');

  p.text('Como la ecuación es <strong>lineal</strong>, la suma de soluciones también es solución. Así ' +
    'que basta con escribir el perfil inicial como <strong>suma de senos</strong>, y dejar que cada uno ' +
    'evolucione por su cuenta:');

  p.formula('u(x,t) = \\sum_{n=1}^{\\infty} b_n \\operatorname{sen}\\left(\\frac{n\\pi x}{L}\\right) e^{-k(n\\pi/L)^2 t}');

  p.note('<strong>Ese es exactamente el problema que llevó a Fourier a inventar sus series en 1807.</strong> ' +
    'No se preguntó por capricho si toda función es suma de senos: lo <em>necesitaba</em> para resolver ' +
    'la ecuación del calor. Y en esa fórmula se ve además por qué el calor alisa los perfiles: el ' +
    'armónico $n$ decae como $e^{-kn^2t}$, así que los detalles finos (los $n$ grandes) se apagan ' +
    'muchísimo más rápido que la forma general.', 'ok', 'La motivación histórica de las series de Fourier');

  p.demo({
    title: 'Modos que se apagan a distinta velocidad',
    intro: 'Tres armónicos de una barra. Avanza el tiempo y observa que los de frecuencia alta desaparecen primero: por eso el calor borra los detalles antes que la forma general.',
    build: function (host, d) {
      var t = 0, k = 0.02;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 1, ymin: -1.2, ymax: 1.2, height: 280,
        xlabel: 'x', ystep: 0.5,
        draw: function (g) {
          [1, 3, 6].forEach(function (n, i) {
            var amp = Math.exp(-k * n * n * Math.PI * Math.PI * t);
            g.fn(function (x) { return amp * Math.sin(n * Math.PI * x); }, { color: i, w: 2.6 });
          });
        }
      });
      function paint() {
        var a1 = Math.exp(-k * 1 * Math.PI * Math.PI * t);
        var a3 = Math.exp(-k * 9 * Math.PI * Math.PI * t);
        var a6 = Math.exp(-k * 36 * Math.PI * Math.PI * t);
        out.set('Instante $t = ' + U.fmt(t, 2) + '$<br>' +
          '<span style="color:var(--c1)">modo 1</span>: amplitud $' + U.fmt(a1, 6) + '$ &nbsp;·&nbsp; ' +
          '<span style="color:var(--c2)">modo 3</span>: $' + U.fmt(a3, 6) + '$ &nbsp;·&nbsp; ' +
          '<span style="color:var(--c3)">modo 6</span>: $' + U.fmt(a6, 6) + '$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">El modo $n$ decae como $e^{-kn^2\\pi^2 t}$: ' +
          'el exponente lleva $n$ <strong>al cuadrado</strong>, así que el modo 6 se apaga 36 veces más ' +
          'rápido que el modo 1. Eso es el desenfoque.</span>');
        plot.render();
      }
      W.slider(W.row(host), { label: 'tiempo', min: 0, max: 3, step: 0.02, value: 0, dec: 2, on: function (v) { t = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Ondas: la otra gran ecuación');

  p.formula('\\frac{\\partial^2 u}{\\partial t^2} = c^2\\frac{\\partial^2 u}{\\partial x^2}',
    'ecuación de ondas, con c la velocidad de propagación');

  p.text('Se parece a la del calor pero cambia una cosa decisiva: hay <strong>dos</strong> derivadas ' +
    'respecto al tiempo en vez de una. Y eso lo cambia todo.');

  p.table(['', 'Calor', 'Ondas'],
    [['Derivadas en $t$', 'una', 'dos'],
     ['Comportamiento', 'alisa, difunde', 'transporta, oscila'],
     ['¿Se puede rebobinar?', 'no: destruye información', 'sí: es reversible'],
     ['A largo plazo', 'todo tiende al equilibrio', 'oscila indefinidamente']]);

  p.text('D\'Alembert encontró en 1747 una solución preciosa: cualquier solución de la ecuación de ondas ' +
    'es la suma de dos perfiles que viajan, uno hacia la derecha y otro hacia la izquierda, sin ' +
    'deformarse.');

  p.formula('u(x,t) = f(x - ct) + g(x + ct)', 'solución de d\'Alembert');

  p.hist('La ecuación de ondas desató la primera gran polémica del análisis, entre 1747 y 1780. ' +
    'D\'Alembert, Euler, Daniel Bernoulli y Lagrange discutieron durante décadas qué funciones podían ' +
    'ser el perfil inicial de una cuerda: ¿tenía que ser suave, o valía una cuerda pellizcada con un ' +
    'pico? Bernoulli sostuvo que toda forma inicial se podía escribir como suma de senos, y Euler lo ' +
    'rechazó por absurdo. Bernoulli tenía razón, pero hicieron falta Fourier y otros cien años de ' +
    'análisis para demostrarlo.');

  /* ================= EJERCICIOS ================= */
  p.util('Las ecuaciones en derivadas parciales son las que simulan la realidad continua, y hoy ' +
    'sustituyen a buena parte de los ensayos físicos. Un coche se choca miles de veces en un ' +
    'ordenador antes de estrellar el primer prototipo real; el ala de un avión se prueba en un túnel ' +
    'de viento virtual; la previsión meteorológica es una EDP resuelta sobre una malla del planeta. ' +
    'La ecuación del calor gobierna además la difusión de un contaminante, y con otro nombre, el ' +
    'modelo de Black-Scholes con el que se ponen precio a las opciones financieras.');

  p.section('Practica');

  p.exercise({
    title: 'Clasifica la ecuación',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { f: 'u_t = k\\,u_{xx}', t: 1, n: 'una derivada en el tiempo y dos en el espacio: es la ecuación del calor' },
        { f: 'u_{tt} = c^2 u_{xx}', t: 2, n: 'dos derivadas en el tiempo: es la ecuación de ondas' },
        { f: 'u_{xx} + u_{yy} = 0', t: 3, n: 'no aparece el tiempo: describe un equilibrio, es la ecuación de Laplace' },
        { f: '\\dfrac{\\partial u}{\\partial t} = 0{,}5\\dfrac{\\partial^2 u}{\\partial x^2}', t: 1, n: 'es la del calor con $k = 0{,}5$' },
        { f: '\\dfrac{\\partial^2 u}{\\partial t^2} = 9\\dfrac{\\partial^2 u}{\\partial x^2}', t: 2, n: 'es la de ondas con $c = 3$' },
        { f: '\\nabla^2 u = 0', t: 3, n: 'el laplaciano igualado a cero es justamente la ecuación de Laplace' }
      ];
      var c = r.pick(casos);
      return { f: c.f, t: c.t, n: c.n };
    },
    ask: function (d) {
      return '¿Qué ecuación es $' + d.f + '$?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)"><code>1</code> del calor · ' +
        '<code>2</code> de ondas · <code>3</code> de Laplace</span>';
    },
    fields: [{ name: 't', label: 'Tipo', w: 'tiny' }],
    sol: function (d) { return { t: d.t }; },
    hint: function () { return 'Cuenta las derivadas respecto al tiempo: una es calor, dos es ondas, ninguna es Laplace.'; },
    steps: function (d) {
      return ['La clave está en cuántas veces se deriva respecto al tiempo.',
        'Una vez → difusión (calor). Dos veces → propagación (ondas). Ninguna → equilibrio (Laplace).',
        'Aquí: ' + d.n + '.'];
    },
    answer: function (d) { return ['', 'Ecuación del calor', 'Ecuación de ondas', 'Ecuación de Laplace'][d.t]; }
  });

  p.exercise({
    title: 'Decaimiento de un modo',
    level: 'medio',
    gen: function (r) {
      var n = r.int(1, 6);
      var k = r.pick([0.01, 0.02, 0.05, 0.1]);
      var t = r.int(1, 10);
      var amp = Math.exp(-k * n * n * Math.PI * Math.PI * t);
      if (amp < 1e-9) return null;
      return { n: n, k: k, t: t, amp: amp };
    },
    ask: function (d) {
      return 'En la ecuación del calor, el modo $n$ decae como $e^{-k n^2 \\pi^2 t}$. Con $n = ' + d.n +
        '$, $k = ' + U.fmt(d.k, 2) + '$ y $t = ' + d.t + '$, ¿qué fracción de su amplitud inicial queda? ' +
        '(seis decimales)';
    },
    fields: [{ name: 'a', label: 'Amplitud', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.amp, 8) }; },
    tol: 3e-4,
    hint: function (d) { return 'Calcula el exponente: $-' + U.fmt(d.k, 2) + ' \\cdot ' + d.n + '^2 \\cdot \\pi^2 \\cdot ' + d.t + '$.'; },
    steps: function (d) {
      var exp = -d.k * d.n * d.n * Math.PI * Math.PI * d.t;
      return ['Exponente: $-' + U.fmt(d.k, 2) + ' \\cdot ' + (d.n * d.n) + ' \\cdot \\pi^2 \\cdot ' + d.t +
        ' = ' + U.fmt(exp, 5) + '$',
        '$e^{' + U.fmt(exp, 5) + '} = ' + U.fmt(d.amp, 8) + '$',
        'Como el exponente lleva $n^2$, doblar la frecuencia del modo lo apaga <strong>cuatro veces más ' +
        'rápido</strong>. Por eso el calor borra primero los detalles finos.'];
    },
    answer: function (d) { return U.fmt(d.amp, 6); }
  });

  p.exercise({
    title: 'Separación de variables',
    level: 'medio',
    gen: function (r) {
      var L = r.int(1, 6);
      var n = r.int(1, 5);
      var lam = Math.pow(n * Math.PI / L, 2);
      return { L: L, n: n, lam: lam };
    },
    ask: function (d) {
      return 'Al separar variables en una barra de longitud $L = ' + d.L + '$ con los extremos a ' +
        'temperatura cero, las constantes admisibles son $\\lambda_n = \\left(\\frac{n\\pi}{L}\\right)^2$. ' +
        'Calcula $\\lambda_{' + d.n + '}$ (cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'l', label: 'λ' + d.n, w: 'wide' }]; },
    sol: function (d) { return { l: U.round(d.lam, 6) }; },
    tol: 3e-5,
    hint: function (d) { return 'Sustituye $n = ' + d.n + '$ y $L = ' + d.L + '$ y eleva al cuadrado.'; },
    steps: function (d) {
      return ['$\\lambda_{' + d.n + '} = \\left(\\dfrac{' + d.n + '\\pi}{' + d.L + '}\\right)^2$',
        '$= \\dfrac{' + (d.n * d.n) + '\\pi^2}{' + (d.L * d.L) + '} = ' + U.fmt(d.lam, 4) + '$',
        'Las condiciones de contorno solo permiten estos valores discretos: la ecuación <strong>cuantiza</strong> ' +
        'los modos posibles. Es el mismo fenómeno que hace que una cuerda de guitarra tenga armónicos.'];
    },
    answer: function (d) { return U.fmt(d.lam, 4); }
  });

  p.exercise({
    title: 'Onda viajera',
    level: 'avanzado',
    gen: function (r) {
      var c = r.int(2, 12);
      var t = r.int(1, 8);
      var x0 = r.int(0, 10);
      return { c: c, t: t, x0: x0, res: x0 + c * t };
    },
    ask: function (d) {
      return 'Una onda cumple $u(x,t) = f(x - ' + d.c + 't)$. Si en $t=0$ el pico de la onda está en ' +
        '$x = ' + d.x0 + '$, ¿dónde está en $t = ' + d.t + '$?';
    },
    fields: [{ name: 'x', label: 'Posición', w: 'tiny' }],
    sol: function (d) { return { x: d.res }; },
    hint: function (d) { return 'El pico se mantiene donde el argumento $x - ' + d.c + 't$ vale lo mismo que al principio.'; },
    steps: function (d) {
      return ['El perfil solo depende de la combinación $x - ct$: el pico está donde ese argumento vale $' + d.x0 + '$.',
        'En $t = ' + d.t + '$: $x - ' + d.c + ' \\cdot ' + d.t + ' = ' + d.x0 + '$',
        '$x = ' + d.x0 + ' + ' + (d.c * d.t) + ' = ' + d.res + '$',
        'La onda se ha desplazado sin deformarse: eso es lo que dice la solución de d\'Alembert. ' +
        'El término $g(x+ct)$ describiría otra onda viajando en sentido contrario.'];
    },
    answer: function (d) { return 'x = ' + d.res; }
  });

  p.keys([
    'Una EDP relaciona derivadas parciales de una función de varias variables.',
    'Calor ($u_t = ku_{xx}$): alisa y destruye información. Ondas ($u_{tt} = c^2u_{xx}$): transporta y es reversible.',
    'La segunda derivada mide cuánto se aparta un punto del promedio de sus vecinos.',
    'Separación de variables: se apuesta por $u = X(x)T(t)$ y la EDP se parte en dos EDO.',
    'Las condiciones de contorno <strong>cuantizan</strong> los modos posibles: de ahí los armónicos.',
    'Para un perfil inicial cualquiera hay que escribirlo como suma de senos: <strong>ese es el problema que hizo nacer las series de Fourier</strong>.',
    'El modo $n$ decae como $e^{-kn^2t}$: los detalles finos se borran mucho antes que la forma general.'
  ]);
});
