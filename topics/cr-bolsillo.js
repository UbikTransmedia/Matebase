/* Tema: La criptografia en tu bolsillo */
Course.topic('cr-bolsillo', function (p) {

  p.puente('El bloque entero cabe en un mensaje de móvil. Este último tema junta las piezas: el ' +
    '[[cr-certificados|apretón de manos]] y su secreto hacia delante, las [[cr-hash|funciones hash]] ' +
    'que avanzan las claves, el [[cr-mac|cifrado autenticado]] que protege cada mensaje, y las reglas ' +
    'que se han ido repitiendo, convertidas en una lista para el que no es criptógrafo.');

  p.text('Cuando envías un mensaje por una aplicación cifrada de extremo a extremo, ocurre casi todo lo ' +
    'de este bloque en unos milisegundos: un acuerdo de claves con curvas, firmas para saber con ' +
    'quién hablas, cifrado autenticado para cada mensaje, y una maquinaria que cambia la clave a cada ' +
    'paso para que robar el teléfono hoy no descifre lo de ayer ni lo de mañana. Se llama el doble ' +
    'trinquete, y es la joya de la corona de la criptografía cotidiana.');

  /* ---------------------------------------------------------------- */
  p.section('El trinquete: una clave nueva por mensaje');

  p.text('Un <strong>trinquete</strong> es una rueda que solo gira hacia delante. Aquí, cada mensaje usa ' +
    'una clave distinta, y de la clave de un mensaje sale la del siguiente con una función hash, ' +
    'pero <strong>no al revés</strong>: quien conozca la clave de hoy no puede calcular la de ayer, ' +
    'porque tendría que invertir el hash. Así, aunque un atacante robe el estado actual del teléfono, ' +
    'los mensajes anteriores ya están fuera de su alcance.');

  p.formula('k_{i+1} = H(k_i), \\qquad H \\text{ no se invierte} \\Rightarrow k_i \\text{ a salvo de quien tiene } k_{i+1}',
    'el trinquete de claves',
    'Se lee: <em>«la clave siguiente es el hash de la actual»</em>. Cada clave se usa para un mensaje y ' +
    'se borra; queda solo la siguiente. Esto da el <strong>secreto hacia delante</strong>: el pasado ' +
    'se protege solo, borrando lo que ya no hace falta.');

  p.text('El <strong>doble</strong> trinquete añade una segunda rueda: cada vez que llega una respuesta, ' +
    'se hace además un nuevo intercambio Diffie-Hellman con curvas y se mezcla en las claves. Eso da ' +
    'la propiedad complementaria, la <strong>recuperación</strong>: si un atacante llegó a conocer el ' +
    'estado, en cuanto las dos partes intercambian un mensaje nuevo vuelve a quedar fuera, porque el ' +
    'nuevo Diffie-Hellman aporta secreto que él no tiene.');

  p.demo({
    title: 'El trinquete hacia delante',
    intro: 'Una clave raíz genera la clave de cada mensaje aplicando un hash una y otra vez. Ponte en la piel de un atacante que roba el estado en el mensaje que elijas: puede calcular ese mensaje y los siguientes, pero los anteriores no, porque tendría que invertir el hash.',
    predice: 'Si el atacante roba la clave del mensaje 5, ¿qué mensajes puede descifrar: del 1 al 5, del 5 en adelante, o todos?',
    build: function (host) {
      var n = 8, robo = 5;
      var out = W.mono(host, '');
      function pinta() {
        var k = 'raíz-secreta', claves = [];
        for (var i = 0; i < n; i++) { k = CR.sha256(k).slice(0, 12); claves.push(k); }
        var h = '';
        for (i = 0; i < n; i++) {
          var accesible = (i + 1) >= robo;
          h += '<b>mensaje ' + (i + 1) + '</b>  clave ' + claves[i] + '  ' + (i + 1 === robo ? '<span class="cr-dif">← el atacante roba aquí</span>' : (accesible ? '<span class="cr-dif">expuesto (sale de la robada)</span>' : '<span class="cr-ok">a salvo (habría que invertir el hash)</span>')) + '\n';
        }
        h += '\nRobando la clave del mensaje ' + robo + ', el atacante calcula del ' + robo + ' al ' + n + ' aplicando el hash hacia delante, pero no puede retroceder al ' + (robo - 1) + ' ni antes.';
        out.set(h);
      }
      W.slider(W.row(host), { label: 'mensaje en que roba el atacante', min: 1, max: 8, step: 1, value: robo, on: function (v) { robo = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('En una app con doble trinquete, un atacante consigue las claves del teléfono en cierto momento. ¿Qué queda protegido?', [
    { t: 'Los mensajes anteriores (secreto hacia delante) y, tras el siguiente intercambio, también los futuros (recuperación)', ok: true, por: 'El trinquete de hash protege el pasado borrando claves viejas; el trinquete Diffie-Hellman recupera el futuro metiendo secreto nuevo en cuanto hay un mensaje de vuelta. El atacante solo lee la ventana en la que tuvo el estado.' },
    { t: 'Nada: con las claves lo descifra todo', ok: false, por: 'Solo podría si las claves no cambiaran. El doble trinquete hace que cada mensaje tenga la suya, derivada hacia delante y refrescada con Diffie-Hellman.' },
    { t: 'Solo los mensajes futuros', ok: false, por: 'Los futuros se recuperan tras un intercambio nuevo, sí, pero los pasados también están protegidos, por el hash que no se invierte.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Un mensaje, de punta a punta');

  p.text('Poniéndolo junto, esto es lo que pasa cuando pulsas «enviar»:');

  p.table(['Paso', 'Qué ocurre', 'Tema'], [
    ['1. Antes de nada', 'las dos apps acordaron claves con Diffie-Hellman de curvas, y comprobaron su identidad con firmas o con un código que se verifica', '[[cr-curvas|curvas]], [[cr-firmas|firmas]]'],
    ['2. Al escribir', 'el trinquete deriva una clave nueva para este mensaje y borra la anterior', '[[cr-hash|hash]]'],
    ['3. Al enviar', 'el mensaje se cifra con AES-GCM o ChaCha20-Poly1305: cifrado y sello en uno', '[[cr-modos|modos]], [[cr-mac|autenticación]]'],
    ['4. Al recibir', 'la otra app comprueba el sello, descifra, y hace girar su trinquete', '[[cr-mac|MAC]]'],
    ['5. Guardado', 'en reposo, el teléfono cifra todo con una clave derivada de tu PIN con un hash lento', '[[cr-contrasenas|contraseñas]]']
  ]);

  p.text('Ninguna pieza es nueva a estas alturas del bloque. Lo que hace segura la mensajería no es un ' +
    'invento, sino <strong>combinar bien</strong> las piezas conocidas: acordar, autenticar, cifrar ' +
    'con sello, y cambiar la clave todo el rato. Y que el código lo haya escrito gente que conoce las ' +
    'trampas del tema de canales laterales.');

  /* ---------------------------------------------------------------- */
  p.section('Las diez reglas del que no es criptógrafo');

  p.text('El bloque entero se puede resumir en unas reglas que valen para cualquiera que use, monte o ' +
    'programe algo con criptografía sin ser especialista. Casi todas han aparecido como una trampa en ' +
    'algún tema.');

  p.list([
    '<strong>No inventes tu propio cifrado.</strong> Ni tu propio protocolo. Los que funcionan llevan décadas siendo atacados en público.',
    '<strong>No implementes los algoritmos a mano.</strong> Usa una biblioteca revisada y mantenla al día: los canales laterales viven en los detalles.',
    '<strong>El secreto está en la clave</strong>, nunca en ocultar el método (Kerckhoffs).',
    '<strong>Cifrar no es autenticar.</strong> Usa siempre cifrado autenticado, o cifra y luego sella.',
    '<strong>No reutilices un nonce</strong> con la misma clave, ni un $k$ en una firma. Es el error que más claves ha regalado.',
    '<strong>El azar debe ser criptográfico</strong> y venir de una fuente física del sistema, no de una fórmula ni de la hora.',
    '<strong>Las contraseñas se guardan con hash lento y sal</strong>, nunca cifradas ni en claro.',
    '<strong>Tamaños de hoy:</strong> 128 bits simétricos, 256 de curva, 3072 de RSA, hash de 256. Y mira ya lo poscuántico.',
    '<strong>Comprueba con quién hablas.</strong> Diffie-Hellman sin autenticar deja pasar al hombre en el medio.',
    '<strong>Piensa en el futuro:</strong> lo que grabe hoy un adversario, lo descifrará el día que tenga un ordenador cuántico.'
  ], true);

  p.demo({
    title: 'Encuentra el fallo',
    intro: 'Cada tarjeta describe un sistema real o verosímil con exactamente un error de diseño. Léelo, decide cuál de las diez reglas incumple, y comprueba.',
    predice: 'Antes de mirar, ¿cuál de las diez reglas crees que se incumple más a menudo en la vida real?',
    build: function (host) {
      var casos = [
        { t: 'Una empresa cifra las contraseñas de sus usuarios con AES y guarda la clave en el servidor.', r: 'Las contraseñas se guardan con hash lento y sal, no cifradas: la clave está en el mismo sitio que roban.' },
        { t: 'Una app de chat presume de usar un algoritmo de cifrado propio y secreto, «más seguro por no publicarlo».', r: 'Kerckhoffs: el secreto va en la clave. Un método sin escrutinio público es una mala señal, no una buena.' },
        { t: 'Un programador genera las claves con el generador de números aleatorios normal del lenguaje, sembrado con la hora.', r: 'El azar debe ser criptográfico y de fuente física: con la hora, dos aparatos generan claves iguales o predecibles.' },
        { t: 'Un servicio cifra los mensajes con AES en modo CTR y no añade ningún sello de autenticación.', r: 'Cifrar no autentica: en CTR, cambiar un bit del cifrado cambia un bit del mensaje sin que nadie lo note.' },
        { t: 'Una firma de una consola usa siempre el mismo número aleatorio $k$ para ahorrar cálculo.', r: 'No reutilices el $k$ de una firma: dos firmas con el mismo $k$ revelan la clave privada entera.' },
        { t: 'Un banco establece una conexión con Diffie-Hellman y no verifica ningún certificado del otro lado.', r: 'Comprueba con quién hablas: sin autenticar, Mallory se pone en medio y acuerda una clave con cada uno.' },
        { t: 'Un sistema nuevo usa RSA de 1024 bits «porque va más rápido».', r: 'Tamaños de hoy: 1024 bits de RSA están retirados; el mínimo es 2048, y mejor 3072 o curvas.' },
        { t: 'Un desarrollador escribe su propia rutina de AES copiándola de un libro, para no depender de bibliotecas.', r: 'No implementes los algoritmos a mano: una comparación o una tabla mal hechas abren un canal lateral.' }
      ];
      var reglas = ['No inventes tu cifrado', 'No lo implementes a mano', 'El secreto en la clave (Kerckhoffs)', 'Cifrar no es autenticar', 'No reutilices nonce ni k', 'Azar criptográfico y físico', 'Contraseñas con hash lento y sal', 'Tamaños de clave actuales', 'Comprueba con quién hablas', 'Piensa en lo poscuántico'];
      var out = W.mono(host, ''), idx = 0, r = U.rng(2), orden = r.shuffle(casos.slice());
      function pinta(mostrar) {
        var c = orden[idx % orden.length];
        out.set('<b>Caso ' + ((idx % orden.length) + 1) + ':</b> ' + U.escape(c.t) + (mostrar ? '\n\n<span class="cr-dif">Regla que incumple:</span> ' + c.r : '\n\n<span class="cr-tenue">Piensa cuál de las diez reglas incumple, y pulsa «Ver la regla».</span>'));
      }
      W.buttons(host, [{ t: 'Ver la regla', cls: 'btn--main', on: function () { pinta(true); } }, { t: 'Otro caso', on: function () { idx++; pinta(false); } }]);
      pinta(false);
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Y adónde ir después');

  p.text('Este bloque ha ido del disco de César a lo que resistirá a un ordenador cuántico, y en el ' +
    'camino ha puesto a trabajar casi todo el curso: la [[av-numeros|aritmética modular]], las ' +
    '[[al-matrices|matrices]], los [[al-polinomios|polinomios]], la [[pe-probabilidad|probabilidad]], ' +
    'los [[fn-exp-log|logaritmos]], las [[av-cripto-curvas|curvas]] y hasta la ' +
    '[[av-fourier|transformada de Fourier]]. La criptografía no es una rama aparte: es lo que pasa ' +
    'cuando esas herramientas se apuntan a un adversario.');

  p.util('Si esto te ha enganchado, lo que sigue son las competiciones de tipo «captura la bandera», ' +
    'donde se rompen versiones debilitadas de estos sistemas por deporte; las bibliotecas abiertas ' +
    'como libsodium, hechas para que sea difícil usarlas mal; los cursos y libros de Dan Boneh y de ' +
    'Serge Vaudenay; y el propio proceso poscuántico del NIST, que sigue abierto y publica todo. La ' +
    'criptografía es de las pocas ramas de las matemáticas en las que un aficionado con un ordenador ' +
    'puede tocar, romper y entender de verdad lo que estudia.');

  p.hist('La criptografía fue durante siglos cosa de diplomáticos y militares, secreta por definición. ' +
    'Cambió en los años setenta con dos revoluciones civiles y públicas: la clave pública de Diffie, ' +
    'Hellman y Merkle, y el estándar abierto DES. Desde entonces la mejor criptografía es la que se ' +
    'publica y se ataca a la luz, y hoy la investigan universidades y empresas de todo el mundo. Que ' +
    'un curso de matemáticas de instituto pueda llegar hasta aquí, y que puedas ejecutar en tu ' +
    'navegador el mismo AES que protege tu banco, es la mejor prueba de esa apertura.');

  p.trampas([
    { e: 'Creer que la mensajería cifrada es magia nueva', por: 'Es la combinación de piezas conocidas: curvas para acordar, firmas para autenticar, cifrado autenticado, y hash para el trinquete.' },
    { e: 'Pensar que el secreto hacia delante protege el futuro', por: 'Protege el pasado: borra las claves viejas. El futuro lo recupera el segundo trinquete, con Diffie-Hellman nuevo.' },
    { e: 'Fiarse de una app «cifrada» sin saber cómo verifica identidades', por: 'El cifrado sin autenticación deja pasar al hombre en el medio. Las apps serias ofrecen comparar un código de seguridad.' },
    { e: 'Aplicar las reglas a medias', por: 'Cada gran fallo real incumplió una sola de las diez: un nonce repetido, un azar malo, un cifrado sin sello. Basta con saltarse una.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Qué protege el trinquete',
    level: 'basico',
    gen: function (r) { var n = r.int(6, 12), robo = r.int(2, n - 1); return { n: n, robo: robo, antes: robo - 1, desde: n - robo + 1 }; },
    ask: function (d) { return 'Una conversación de ' + d.n + ' mensajes con trinquete de hash (cada clave sale de la anterior). Un atacante roba el estado justo en el mensaje ' + d.robo + '. ¿Cuántos mensajes anteriores quedan a salvo, y cuántos (del ' + d.robo + ' en adelante) puede descifrar?'; },
    fields: [{ name: 'a', label: 'a salvo', w: 'tiny' }, { name: 'e', label: 'expuestos', w: 'tiny' }],
    sol: function (d) { return { a: d.antes, e: d.desde }; },
    hint: function () { return 'Hacia atrás no se puede (habría que invertir el hash); hacia delante sí.'; },
    steps: function (d) { return ['A salvo: del 1 al ' + (d.robo - 1) + ', son ' + d.antes + '.', 'Expuestos: del ' + d.robo + ' al ' + d.n + ', son ' + d.desde + '.', 'El segundo trinquete, con Diffie-Hellman nuevo, recuperaría también los futuros tras el próximo mensaje de vuelta.']; },
    answer: function (d) { return d.antes + ' a salvo, ' + d.desde + ' expuestos'; }
  });

  p.exercise({
    title: 'Cada paso, su tema',
    level: 'basico',
    gen: function (r) { var casos = [{ t: 'acordar una clave común hablando en público', v: 'dh' }, { t: 'comprobar que hablas con quien crees', v: 'firma' }, { t: 'que nadie altere el mensaje sin que se note', v: 'mac' }, { t: 'que un mismo texto no dé siempre el mismo cifrado', v: 'modo' }, { t: 'guardar la contraseña del teléfono sin poder recuperarla', v: 'hash' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return 'Para «' + d.c.t + '», ¿qué herramienta se usa?'; },
    fields: [{ name: 'q', label: 'Herramienta', opts: [{ t: 'Diffie-Hellman', v: 'dh' }, { t: 'firma o certificado', v: 'firma' }, { t: 'código de autenticación (MAC)', v: 'mac' }, { t: 'un modo con nonce o IV', v: 'modo' }, { t: 'hash lento con sal', v: 'hash' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Acordar → DH; identidad → firma; integridad → MAC; que no se repita el cifrado → modo; guardar contraseñas → hash lento.'; },
    steps: function (d) { var por = { dh: 'Acordar una clave en público es Diffie-Hellman.', firma: 'Comprobar la identidad es una firma o un certificado.', mac: 'Detectar alteraciones es un MAC (o cifrado autenticado).', modo: 'Que el cifrado no se repita lo da un modo con nonce/IV.', hash: 'Guardar contraseñas irreversibles: hash lento con sal.' }; return [por[d.c.v]]; },
    answer: function (d) { return { dh: 'Diffie-Hellman', firma: 'firma', mac: 'MAC', modo: 'modo con nonce', hash: 'hash lento' }[d.c.v]; }
  });

  p.exercise({
    title: 'Qué regla se incumple',
    level: 'medio',
    gen: function (r) { var casos = [{ t: 'Guardar contraseñas cifradas con una clave en el mismo servidor', v: 'pass' }, { t: 'Inventar un cifrado propio y no publicarlo', v: 'kerck' }, { t: 'Reutilizar el mismo nonce con la misma clave', v: 'nonce' }, { t: 'Cifrar sin ningún sello de autenticación', v: 'auth' }, { t: 'Establecer Diffie-Hellman sin verificar certificados', v: 'mitm' }, { t: 'Sembrar el generador de claves con el identificador del aparato', v: 'azar' }, { t: 'Usar RSA de 512 bits en un sistema nuevo', v: 'tam' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return 'Un sistema hace esto: «' + d.c.t + '». ¿Qué regla incumple?'; },
    fields: [{ name: 'q', label: 'Regla', opts: [{ t: 'contraseñas con hash lento y sal', v: 'pass' }, { t: 'el secreto en la clave (Kerckhoffs)', v: 'kerck' }, { t: 'no reutilizar nonce ni k', v: 'nonce' }, { t: 'cifrar no es autenticar', v: 'auth' }, { t: 'comprobar con quién hablas', v: 'mitm' }, { t: 'azar criptográfico y físico', v: 'azar' }, { t: 'tamaños de clave actuales', v: 'tam' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Cada caso es una de las trampas del bloque, convertida en regla.'; },
    steps: function (d) { var por = { pass: 'Las contraseñas nunca se cifran: hash lento y sal.', kerck: 'El método puede ser público; el secreto va en la clave.', nonce: 'Un nonce (o un k de firma) repetido rompe el cifrado o revela la clave.', auth: 'Hace falta autenticar además de cifrar.', mitm: 'Sin verificar identidad, entra el hombre en el medio.', azar: 'El azar debe ser impredecible y de fuente física.', tam: '512 bits de RSA se factorizan; el mínimo es 2048.' }; return [por[d.c.v]]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Cosechar ahora, descifrar después',
    level: 'medio',
    gen: function (r) { var casos = [{ t: 'Un documento de Estado que debe seguir secreto 40 años, cifrado hoy con RSA-2048', v: 'si', por: 'Un adversario graba el tráfico hoy y lo descifra con Shor cuando tenga el ordenador cuántico, dentro de esos 40 años. Debe usar ya criptografía poscuántica.' }, { t: 'Un mensaje de chat sin ningún valor pasados cinco minutos, cifrado con curvas', v: 'no', por: 'Aunque se grabe, cuando exista la máquina el contenido hará mucho que no importa. El riesgo cuántico depende de cuánto tiene que durar el secreto.' }, { t: 'Historiales médicos que deben protegerse décadas, cifrados con curva elíptica clásica', v: 'si', por: 'Su vida útil supera la llegada esperada del ordenador cuántico: hay que migrar a poscuántico o a un esquema híbrido.' }, { t: 'Una clave de sesión que se borra al colgar la llamada', v: 'no', por: 'No queda nada grabado que descifrar después; el secreto hacia delante ya lo protege.' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return '«' + d.c.t + '» ¿Le afecta la amenaza de «cosechar ahora, descifrar después»?'; },
    fields: [{ name: 'q', label: 'Afecta', opts: [{ t: 'sí: migrar a poscuántico', v: 'si' }, { t: 'no: el secreto no dura tanto', v: 'no' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return '¿Cuánto tiene que seguir secreto el dato, comparado con cuándo llegará el ordenador cuántico?'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'si' ? 'sí' : 'no'; }
  });

  p.exercise({
    title: 'El fallo de cada desastre',
    level: 'avanzado',
    gen: function (r) { var casos = [{ t: 'La PlayStation 3 firmó con ECDSA usando siempre el mismo número aleatorio k', v: 'nonce', por: 'Nonce/k repetido: dos firmas dieron la clave privada de la consola.' }, { t: 'Miles de claves RSA de aparatos de red resultaron tener factores comunes', v: 'azar', por: 'Azar malo: arrancaban con casi la misma semilla y compartían primos, factorizables con un mcd.' }, { t: 'El cifrado WEP de las primeras redes wifi reutilizaba el flujo de clave', v: 'nonce', por: 'Nonce corto y repetido: dos mensajes con el mismo flujo, la libreta reutilizada.' }, { t: 'Una empresa filtró millones de contraseñas cifradas en modo ECB con la misma clave', v: 'ecb', por: 'ECB y contraseñas no hasheadas: los cifrados iguales delataban contraseñas iguales.' }, { t: 'Servidores TLS descifrables por el mensaje de error del relleno (POODLE, Lucky13)', v: 'auth', por: 'Oráculo de relleno: distinguir «relleno mal» de «autenticación mal» descifra el mensaje.' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return 'Desastre real: «' + d.c.t + '» ¿Cuál fue la causa?'; },
    fields: [{ name: 'q', label: 'Causa', opts: [{ t: 'nonce o k repetido', v: 'nonce' }, { t: 'azar predecible', v: 'azar' }, { t: 'modo ECB / sin hash', v: 'ecb' }, { t: 'oráculo de relleno / sin autenticar bien', v: 'auth' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Todos son casos que salieron en el bloque: repasa las trampas de firmas, canales laterales, flujo, modos y MAC.'; },
    steps: function (d) { return [d.c.por, 'La matemática estaba bien en todos: cayeron por incumplir una regla de uso.']; },
    answer: function (d) { return { nonce: 'nonce/k repetido', azar: 'azar predecible', ecb: 'ECB', auth: 'oráculo de relleno' }[d.c.v]; }
  });

  p.keys([
    'El trinquete deriva una clave nueva por mensaje con un hash: como no se invierte, protege el pasado (secreto hacia delante).',
    'El doble trinquete añade un Diffie-Hellman nuevo en cada respuesta: recupera el futuro si el estado llegó a filtrarse.',
    'Enviar un mensaje seguro es combinar piezas conocidas: acordar con curvas, autenticar con firmas, cifrar con sello, girar el trinquete.',
    'Diez reglas: no inventes ni implementes a mano, el secreto en la clave, cifra y autentica, no repitas nonce ni k, azar físico, contraseñas con hash lento, tamaños de hoy, verifica identidades, piensa en lo poscuántico.',
    'Casi todos los desastres reales incumplieron una sola regla, con la matemática intacta.'
  ]);
});
