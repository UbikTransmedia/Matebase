/* Tema: Ecuaciones de primer grado */
Course.topic('al-ec1', function (p) {

  p.puente('Traducir frases a álgebra ya lo sabes. Cuando la frase incluye un «vale», un «es igual a», ' +
    'aparece un signo $=$ con una incógnita dentro, y eso es una ecuación. Resolverla es el camino de ' +
    'vuelta: partir de la igualdad y recuperar el número escondido. Toda la técnica cabe en una ' +
    'imagen, la balanza.');

  p.text('Una <strong>ecuación</strong> es una igualdad en la que aparece una letra desconocida. ' +
    'Resolverla es encontrar el valor (o los valores) que hacen que la igualdad sea cierta.');

  p.formula('3x - 5 = 7 \\quad\\longrightarrow\\quad x = 4', 'porque 3·4 − 5 = 7');

  p.text('Es de <strong>primer grado</strong> cuando la incógnita aparece elevada solo a 1: nada de ' +
    '$x^2$, ni $x$ dentro de una raíz o de un denominador.');

  p.section('La balanza');

  p.text('Una ecuación es una balanza en equilibrio. El signo $=$ es el fiel. Puedes hacer lo que ' +
    'quieras con ella <strong>siempre que hagas exactamente lo mismo en los dos platos</strong>: sumar, ' +
    'restar, multiplicar o dividir por un número (distinto de cero). El equilibrio se mantiene.');

  p.demo({
    title: 'Resolver pesando',
    intro: 'Quita y reparte peso en los dos lados hasta dejar la x sola. Cada botón hace lo mismo a la izquierda y a la derecha.',
    predice: 'La balanza dice $3x - 5 = 7$. Si sumas 5 en los dos platos, ¿qué queda en cada lado? ¿Y después de dividir entre 3?',
    build: function (host, d) {
      var A0 = 3, B0 = -5, C0 = 7;           // Ax + B = C
      var A = A0, B = B0, C = C0, hist = [];
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1, xmax: 11, ymin: -1, ymax: 5.6, height: 260,
        grid: false, axes: false,
        draw: function (g) {
          // fiel de la balanza
          g.seg(0.4, 3.1, 9.6, 3.1, { color: 'axis', w: 2.4 });
          g.seg(5, 3.1, 5, 0.5, { color: 'axis', w: 2 });
          g.path([[4.2, 0.5], [5.8, 0.5]], { color: 'axis', w: 2.4 });
          g.text(5, 3.55, '=', { align: 'center', size: 20, color: 'ink' });
          caja(g, 2.6, A, B, true);
          caja(g, 7.4, 0, C, false);
        }
      });
      function caja(g, cx, a, b, izq) {
        var y = 3.3;
        g.text(cx, y + 0.75, izq ? 'lado izquierdo' : 'lado derecho',
          { align: 'center', size: 11.5, color: 'ink', serif: false });
        var txt = (a ? ML.termTex(a, 'x', 1, true) : '') + (b || !a ? ML.termTex(b, '', 0, !a) : '');
        g.text(cx, 1.9, (txt || '0').replace(/\\cdot/g, '·'),
          { align: 'center', size: 22, color: izq ? 0 : 1, bold: true });
        g.rect(cx - 1.7, 1.15, 3.4, 1.5, { color: izq ? 0 : 1, fill: izq ? 0 : 1, fillAlpha: .1, w: 1.6 });
      }
      function paint(msg) {
        out.set('Ecuación actual: $' + ML.termTex(A, 'x', 1, true) + ML.termTex(B, '', 0, false) + ' = ' + C + '$' +
          (msg ? '<br><span style="font-size:0.8125rem;color:var(--ink-faint)">' + msg + '</span>' : '') +
          (A === 1 && B === 0 ? '<br><strong style="color:var(--ok)">¡Resuelto! x = ' + C + '</strong>' : ''));
        plot.render();
      }
      W.buttons(host, [
        {
          t: 'Quitar el término independiente', cls: 'btn--main', on: function () {
            if (B === 0) return paint('Ya no hay término independiente a la izquierda.');
            var k = -B;
            C += k; B = 0;
            paint('Hemos ' + (k > 0 ? 'sumado ' + k : 'restado ' + (-k)) + ' en los dos lados.');
          }
        },
        {
          t: 'Dividir entre el coeficiente', on: function () {
            if (B !== 0) return paint('Primero deja sola la parte con x quitando el término independiente.');
            if (A === 1) return paint('El coeficiente ya es 1.');
            C = C / A; A = 1;
            paint('Hemos dividido los dos lados entre el coeficiente de la x.');
          }
        },
        { t: '↺ Empezar de nuevo', on: function () { A = A0; B = B0; C = C0; paint(''); } }
      ]);
      paint('Objetivo: dejar la x sola en un plato.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('La imagen de la balanza no es una metáfora escolar: es cómo funciona cualquier ajuste real. Un ' +
    'anestesista que calcula la dosis según el peso, un cocinero que reduce una receta de 8 a 5 ' +
    'comensales y un contable que reparte un gasto entre departamentos están despejando incógnitas. ' +
    'La regla es siempre la misma: lo que haces a un lado, lo haces al otro.');

  p.section('El método, paso a paso');
  p.text('Con la imagen de la balanza en la cabeza, resolver es siempre la misma secuencia. Conviene ' +
    'hacerla en este orden, porque cada paso deja el terreno preparado para el siguiente y ' +
    'saltárselos suele acabar en un lío de signos.');


  p.list([
    'Quitar <strong>denominadores</strong>: multiplicar toda la ecuación por el m.c.m. de los denominadores.',
    'Quitar <strong>paréntesis</strong> aplicando la distributiva (ojo al menos delante de un paréntesis).',
    '<strong>Transponer</strong>: las $x$ a un lado, los números al otro. Lo que suma pasa restando; lo que multiplica, dividiendo.',
    '<strong>Reducir</strong> términos semejantes: queda $ax = b$.',
    '<strong>Despejar</strong>: $x = \\dfrac{b}{a}$.',
    '<strong>Comprobar</strong> sustituyendo en la ecuación original. Este paso no es opcional.'
  ], true);

  p.note('«Pasar al otro lado» no es magia ni un truco: es restar lo mismo a los dos lados, ' +
    'abreviado. Si lo entiendes así, nunca te confundirás con los signos.', null, 'Qué significa transponer');

  p.ejemplo({
    title: 'El método entero, con denominadores y paréntesis',
    enunciado: 'Resolver $\\dfrac{x+1}{2} - \\dfrac{x-2}{3} = 1$.',
    pasos: [
      { t: '<strong>Denominadores.</strong> El m.c.m. de 2 y 3 es 6. Se multiplica <em>toda</em> la ecuación por 6, también el 1 de la derecha: $3(x+1) - 2(x-2) = 6$.', antes: '¿Por qué número hay que multiplicar? ¿Y hay que multiplicar también el 1?' },
      { t: '<strong>Paréntesis.</strong> $3x + 3 - 2x + 4 = 6$. El menos delante de $(x-2)$ cambia los dos signos de dentro: $-2\\cdot(-2) = +4$.', antes: 'Al quitar $-2(x-2)$, ¿qué signo lleva el 4?' },
      { t: '<strong>Reducir y transponer.</strong> $x + 7 = 6$, y pasando el 7: $x = 6 - 7 = -1$.' },
      { t: '<strong>Comprobar en la original.</strong> $\\dfrac{-1+1}{2} - \\dfrac{-1-2}{3} = 0 - (-1) = 1$ ✓.', antes: 'Sustituye $x = -1$ en la ecuación de partida, no en una intermedia. ¿Sale 1?' }
    ],
    cierre: 'Los dos sitios donde se pierden puntos son el 1 sin multiplicar por 6 y el signo del 4. La comprobación final los habría detectado a los dos.'
  });

  p.section('Casos especiales');

  p.text('Al reducir puede desaparecer la $x$. Entonces hay dos posibilidades:');

  p.table(['Queda', 'Significa', 'Ejemplo'],
    [['$0 = 0$ (o algo cierto)', 'Cualquier número vale: <strong>identidad</strong>', '$2(x+1) = 2x+2$'],
     ['$0 = 5$ (algo falso)', 'Ningún número vale: <strong>incompatible</strong>', '$x+1 = x+3$']]);

  p.comprueba('Al resolver $3(x + 2) = 3x + 6$, ¿qué ocurre?', [
    { t: 'Sale $x = 0$', ok: false, por: 'Al quitar el paréntesis queda $3x + 6 = 3x + 6$; las $x$ se van y queda $0 = 0$, no $x = 0$. Son cosas distintas.' },
    { t: 'Es una identidad: vale cualquier $x$', ok: true, por: 'Los dos lados son la misma expresión escrita de dos formas. Cualquier número la cumple.' },
    { t: 'No tiene solución', ok: false, por: 'Sin solución sería llegar a algo falso, como $0 = 5$. Aquí se llega a $0 = 0$, que es cierto siempre.' }
  ]);

  p.trampas([
    { e: '$\\dfrac{x}{2} + 3 = 5 \\;\\Rightarrow\\; x + 3 = 10$', por: 'Se ha multiplicado por 2 el $\\frac{x}{2}$ y el 5, pero no el 3. O se multiplica <em>todo</em>, o nada: $x + 6 = 10$.' },
    { e: '$2x = 8 \\;\\Rightarrow\\; x = 8 - 2$', por: 'El 2 está multiplicando, así que pasa dividiendo: $x = 4$. Solo lo que suma pasa restando.' },
    { e: '$-(x - 3) = -x - 3$', por: 'El menos cambia los dos signos: $-x + 3$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('Que una ecuación salga «sin solución» o «con infinitas» no es un fallo, es información valiosa. ' +
    'Cuando un programa de rutas te dice «no hay camino» está resolviendo un sistema incompatible; ' +
    'cuando un ingeniero encuentra infinitas soluciones sabe que le falta una condición por imponer ' +
    'y que la pieza aún no está determinada. Aprender a leer esos dos finales es tan importante como ' +
    'saber despejar.');

  p.hist('Durante siglos las ecuaciones se enunciaban con palabras, y resolver una era un ejercicio de ' +
    'literatura. Al-Juarismi, en Bagdad hacia el 820, escribía cosas como «un cuadrado y diez raíces ' +
    'son iguales a treinta y nueve dirhams». La palabra <em>álgebra</em> viene del título de aquel ' +
    'libro, <em>al-yabr</em>, que significa «recomponer»: justamente lo que haces al pasar un ' +
    'término al otro lado. Y <em>algoritmo</em> viene de su nombre.');

  p.section('Practica');

  p.exercise({
    title: 'Ecuación sencilla',
    level: 'basico',
    gen: function (r) {
      var x = r.pm(1, 12);
      var a = r.nz(-9, 9), b = r.pm(1, 15);
      return { a: a, b: b, c: a * x + b, x: x };
    },
    ask: function (d) {
      return 'Resuelve: $' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + ' = ' + d.c + '$';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }],
    sol: function (d) { return { x: d.x }; },
    hint: function (d) { return 'Pasa el $' + d.b + '$ al otro lado y después divide entre $' + d.a + '$.'; },
    steps: function (d) {
      return ['Restamos $' + d.b + '$ en los dos lados: $' + ML.termTex(d.a, 'x', 1, true) + ' = ' + (d.c - d.b) + '$.',
        'Dividimos entre $' + d.a + '$: $x = \\dfrac{' + (d.c - d.b) + '}{' + d.a + '} = ' + d.x + '$.',
        'Comprobación: $' + d.a + '\\cdot(' + d.x + ')' + ML.termTex(d.b, '', 0, false) + ' = ' + d.c + '$ ✓'];
    },
    answer: function (d) { return 'x = ' + d.x; }
  });

  p.exercise({
    title: 'Con incógnita en los dos lados',
    level: 'medio',
    gen: function (r) {
      var x = r.pm(1, 10);
      var a = r.nz(-8, 8), c = r.nz(-8, 8);
      if (a === c) return null;
      var b = r.pm(1, 12);
      var dd = (a - c) * x + b;
      return { a: a, b: b, c: c, d: dd, x: x };
    },
    ask: function (d) {
      return 'Resuelve: $' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + ' = ' +
        ML.termTex(d.c, 'x', 1, true) + ML.termTex(d.d, '', 0, false) + '$';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }],
    sol: function (d) { return { x: d.x }; },
    hint: function () { return 'Junta todas las x a un lado y todos los números al otro.'; },
    steps: function (d) {
      return ['Pasamos las $x$ a la izquierda y los números a la derecha.',
        '$' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(-d.c, 'x', 1, false) + ' = ' + (d.d - d.b) + '$',
        'Reducimos: $' + ML.termTex(d.a - d.c, 'x', 1, true) + ' = ' + (d.d - d.b) + '$',
        '$x = \\dfrac{' + (d.d - d.b) + '}{' + (d.a - d.c) + '} = ' + d.x + '$'];
    },
    answer: function (d) { return 'x = ' + d.x; }
  });

  p.exercise({
    title: 'Con paréntesis y denominadores',
    level: 'avanzado',
    gen: function (r) {
      var x = r.pm(1, 9);
      var m = r.pick([2, 3, 4, 6]);
      var a = r.nz(-5, 5), b = r.pm(1, 8), c = r.nz(-5, 5);
      // (a x + b)/m + c x = k
      var k = (a * x + b) / m + c * x;
      if (!Number.isInteger(k)) return null;
      return { x: x, m: m, a: a, b: b, c: c, k: k };
    },
    ask: function (d) {
      return 'Resuelve: $\\dfrac{' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + '}{' + d.m + '}' +
        ML.termTex(d.c, 'x', 1, false) + ' = ' + d.k + '$';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }],
    sol: function (d) { return { x: d.x }; },
    hint: function (d) { return 'Multiplica toda la ecuación por $' + d.m + '$ para quitar el denominador.'; },
    steps: function (d) {
      var A = d.a + d.m * d.c, B = d.b, K = d.m * d.k;
      return ['Multiplicamos los <strong>tres</strong> términos por $' + d.m + '$:',
        '$' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) +
        ML.termTex(d.m * d.c, 'x', 1, false) + ' = ' + K + '$',
        'Reducimos: $' + ML.termTex(A, 'x', 1, true) + ' = ' + (K - B) + '$',
        '$x = \\dfrac{' + (K - B) + '}{' + A + '} = ' + d.x + '$'];
    },
    answer: function (d) { return 'x = ' + d.x; }
  });

  p.exercise({
    title: 'Problema con enunciado',
    level: 'avanzado',
    gen: function (r) {
      var t = r.int(0, 2);
      if (t === 0) {
        var edadHijo = r.int(6, 18), k = r.pick([2, 3, 4]);
        var edadPadre = edadHijo * k;
        var anios = r.int(3, 15);
        return { t: 0, hijo: edadHijo, padre: edadPadre, k: k, res: edadHijo };
      }
      if (t === 1) {
        var n = r.int(10, 60), d2 = r.int(3, 25);
        return { t: 1, suma: 2 * n + d2, dif: d2, res: n };
      }
      var precio = r.int(3, 40), cant = r.int(3, 12), extra = r.int(2, 20);
      return { t: 2, total: precio * cant + extra, cant: cant, extra: extra, res: precio };
    },
    ask: function (d) {
      if (d.t === 0) {
        return 'Un padre tiene $' + d.padre + '$ años y su hijo, $' + d.k + '$ veces menos. ' +
          '¿Cuántos años tiene el hijo? <em>(Plantéalo con una x, aunque se vea a ojo.)</em>';
      }
      if (d.t === 1) {
        return 'Dos números suman $' + d.suma + '$ y se diferencian en $' + d.dif + '$. ' +
          '¿Cuál es el <strong>menor</strong> de los dos?';
      }
      return 'He comprado $' + d.cant + '$ camisetas iguales y un cinturón de $' + d.extra + '$ €. ' +
        'En total he pagado $' + d.total + '$ €. ¿Cuánto cuesta cada camiseta?';
    },
    fields: [{ name: 'v', label: 'Respuesta', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    hint: function (d) {
      if (d.t === 0) return 'Llama $x$ a la edad del hijo. Entonces el padre tiene $' + d.k + 'x$.';
      if (d.t === 1) return 'Llama $x$ al menor. El mayor será $x + ' + d.dif + '$.';
      return 'Llama $x$ al precio de una camiseta. El total es $' + d.cant + 'x + ' + d.extra + '$.';
    },
    steps: function (d) {
      if (d.t === 0) {
        return ['Llamamos $x$ a la edad del hijo.',
          'El padre tiene $' + d.k + 'x$, y sabemos que son $' + d.padre + '$ años.',
          '$' + d.k + 'x = ' + d.padre + ' \\Rightarrow x = ' + d.res + '$.'];
      }
      if (d.t === 1) {
        return ['Llamamos $x$ al número menor; el mayor es $x + ' + d.dif + '$.',
          'Su suma: $x + (x + ' + d.dif + ') = ' + d.suma + '$.',
          '$2x + ' + d.dif + ' = ' + d.suma + ' \\Rightarrow 2x = ' + (d.suma - d.dif) + '$',
          '$x = ' + d.res + '$ (y el otro es $' + (d.res + d.dif) + '$).'];
      }
      return ['Llamamos $x$ al precio de una camiseta.',
        'Gasto total: $' + d.cant + 'x + ' + d.extra + ' = ' + d.total + '$.',
        '$' + d.cant + 'x = ' + (d.total - d.extra) + ' \\Rightarrow x = ' + d.res + '$ €.'];
    },
    answer: function (d) { return String(d.res); }
  });

  p.keys([
    'Resolver es aislar la incógnita haciendo <strong>lo mismo en los dos lados</strong>.',
    'Transponer es un atajo de sumar o dividir a los dos lados: no es un truco aparte.',
    'Orden: denominadores → paréntesis → transponer → reducir → despejar → <strong>comprobar</strong>.',
    'Si desaparece la $x$: identidad (siempre cierta) o ecuación incompatible (sin solución).',
    'En los problemas, lo difícil es plantear. Escribe primero «llamo $x$ a...» y no te saltes ese paso.'
  ]);
});
