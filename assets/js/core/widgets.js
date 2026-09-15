/* ===================================================================
   Matebase · widgets.js
   Un unico motor grafico (Plot2D) del que cuelga TODO lo interactivo:
   graficas de funciones, geometria con puntos arrastrables, vectores,
   recta real, circunferencia goniometrica, diagramas de barras,
   histogramas, campos de pendientes, retratos de fase...

   Reutilizar este motor es el motivo de que un tema de trigonometria y
   uno de geometria compartan el mismo codigo de dibujo.
   =================================================================== */
(function (global) {
  'use strict';

  /* Lo que lee en voz alta un lector de pantalla y las ayudas de teclado:
     son texto para una persona, asi que pasan por el diccionario. */
  function UI(s) { return global.I18N ? I18N.ui(s) : s; }
  function con(s, vals) {
    var t = UI(s);
    for (var k in vals) t = t.split('{' + k + '}').join(vals[k]);
    return t;
  }

  var W = {};
  var LIVE = [];   // graficas vivas, para repintar al cambiar de tema

  /* ================= contenedores y controles ================= */

  W.stage = function (host, cls) {
    return U.add(host, U.el('div.stage' + (cls ? '.' + cls : ''))).lastChild;
  };

  W.row = function (host, cls) {
    var d = U.el('div.' + (cls || 'ctrls'));
    host.appendChild(d);
    return d;
  };

  /* Un paso fraccionario significa que el deslizador mide una magnitud
     continua, no que cuente unidades. En ese caso no hay ninguna razón para
     saltar de 0,5 en 0,5: se afina hasta unas 400 posiciones (redondeando a
     un 1, 2 o 5 por potencia de diez) y se muestran al menos dos decimales.
     Los pasos enteros se respetan tal cual: ahí sí se está contando. */
  function pasoFino(min, max, paso) {
    var rango = max - min;
    if (!isFinite(rango) || rango <= 0) return paso;
    var objetivo = rango / 400;
    var mag = Math.pow(10, Math.floor(Math.log(objetivo) / Math.LN10));
    var n = objetivo / mag;
    var fino = (n >= 5 ? 5 : (n >= 2 ? 2 : 1)) * mag;
    return Math.min(paso, fino);
  }
  function decimalesDe(paso) {
    if (Number.isInteger(paso)) return 0;
    var s = paso.toFixed(10).replace(/0+$/, '');
    var pto = s.indexOf('.');
    return pto < 0 ? 0 : Math.min(6, s.length - pto - 1);
  }

  /** Deslizador con etiqueta y lectura del valor. */
  W.slider = function (host, o) {
    o = o || {};
    var paso = (o.step === undefined) ? 0.01 : o.step;
    var dec = o.dec;
    if (!Number.isInteger(paso)) {
      paso = pasoFino(o.min, o.max, paso);
      dec = Math.max(dec === undefined ? 0 : dec, decimalesDe(paso), 2);
    } else if (dec === undefined) {
      dec = 0;
    }
    var box = U.el('div.ctrl');
    var val = U.el('span.ctrl__val');
    var top = U.el('div.ctrl__top', null, [U.el('span.ctrl__lab', { html: MathX.inline(o.label || '') }), val]);
    var inp = U.el('input', {
      type: 'range', min: o.min, max: o.max, step: paso, value: o.value
    });
    var fmt = o.format || function (v) { return U.fmt(v, dec); };
    var api = { el: box, input: inp, value: parseFloat(o.value) };
    function upd(fire) {
      api.value = parseFloat(inp.value);
      val.innerHTML = MathX.inline(fmt(api.value));
      if (fire && o.on) o.on(api.value);
    }
    inp.addEventListener('input', function () { upd(true); });
    box.appendChild(top); box.appendChild(inp);
    host.appendChild(box);
    api.set = function (v, fire) { inp.value = v; upd(!!fire); };
    upd(false);
    return api;
  };

  /** Fila de botones-pastilla con seleccion (o simples acciones). */
  W.chips = function (host, items, o) {
    o = o || {};
    var box = U.el('div.chips');
    var api = { el: box, value: o.value, items: [] };
    items.forEach(function (it, i) {
      var label = (typeof it === 'string') ? it : it.label;
      var value = (typeof it === 'string') ? it : (it.value !== undefined ? it.value : it.label);
      var b = U.el('button.chip', { type: 'button', html: MathX.inline(label) });
      b.addEventListener('click', function () {
        if (o.toggle === false) { if (o.on) o.on(value, i); return; }
        api.value = value;
        api.items.forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        if (o.on) o.on(value, i);
      });
      if (value === o.value) b.classList.add('is-on');
      api.items.push(b);
      box.appendChild(b);
    });
    host.appendChild(box);
    return api;
  };

  W.buttons = function (host, list) {
    var box = U.el('div.chips');
    list.forEach(function (b) {
      var el = U.el('button.btn.btn--sm' + (b.cls ? '.' + b.cls : ''), { type: 'button', html: MathX.inline(b.t) });
      el.addEventListener('click', b.on);
      box.appendChild(el);
    });
    host.appendChild(box);
    return box;
  };

  /** Panel monoespaciado para mostrar resultados. */
  /* El marcador es donde aterriza el resultado de cada cosa que toca el
     alumno. Cambiaba en silencio: quien no ve la pantalla movia el punto y
     no se enteraba de nada. Con aria-live el lector lo canta al parar. */
  W.readout = function (host, html) {
    var d = U.el('div.readout', {
      html: MathX.inline(html || ''),
      role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true'
    });
    host.appendChild(d);
    d.set = function (h) { d.innerHTML = MathX.inline(h); };
    return d;
  };

  W.legend = function (host, items) {
    var p = U.palette();
    var d = U.el('div.legend');
    items.forEach(function (it) {
      var c = (typeof it.c === 'number') ? p.c[it.c] : (it.c || p.accent);
      d.appendChild(U.el('span', { html: '<i style="background:' + c + '"></i>' + MathX.inline(it.t) }));
    });
    host.appendChild(d);
    return d;
  };

  W.hint = function (host, text) {
    host.appendChild(U.el('div.hintline', { html: MathX.inline(text) }));
  };

  /* Dentro de un <canvas> los pixeles son pixeles: el texto que se dibuja
     ahi no obedece ni al navegador ni al control de lectura. Se mira cuanto
     ha crecido la letra de la pagina y se aplica el mismo aumento, con tope
     para que las etiquetas no se coman el dibujo. */
  function aumento() {
    var raiz = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Math.min(1.6, Math.max(1, raiz / 16));
  }
  W.aumento = aumento;

  /* ========================= Plot2D ========================= */

  function Plot(host, o) {
    o = o || {};
    this.o = o;
    this.xmin = o.xmin === undefined ? -10 : o.xmin;
    this.xmax = o.xmax === undefined ? 10 : o.xmax;
    this.ymin = o.ymin === undefined ? -6 : o.ymin;
    this.ymax = o.ymax === undefined ? 6 : o.ymax;
    this.height = o.height || 330;
    this.equal = !!o.equal;
    this.showGrid = o.grid !== false;
    this.showAxes = o.axes !== false;
    this.pad = o.pad || 0;
    this.handles = [];
    this._drag = null;
    this.k = aumento();          // cuanto ha crecido la letra de la pagina
    // Puntos arrastrables declarados de entrada: existen ya en el primer
    // pintado, asi que `draw` puede usarlos sin comprobar nada.
    if (o.handles) {
      for (var k in o.handles) {
        var hh = o.handles[k];
        this.handles.push({ id: k, x: hh.x, y: hh.y, o: hh });
      }
    }

    this.el = U.el('div.stage');
    this.canvas = U.el('canvas');
    this.el.appendChild(this.canvas);
    host.appendChild(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.__plot = this;      // para inspeccionar el encuadre desde tests.html

    var self = this;
    this._onResize = function () { self.resize(); };
    if (global.ResizeObserver) {
      this._ro = new ResizeObserver(this._onResize);
      this._ro.observe(this.el);
    } else {
      global.addEventListener('resize', this._onResize);
    }
    // Ventana pedida por el autor. Se guarda aparte porque `equal` la
    // recalcula en cada resize, y si se partiera de la ya ajustada el
    // encuadre se iría acumulando redimensionado tras redimensionado.
    this._req = [this.xmin, this.xmax, this.ymin, this.ymax];

    this._bindPointer();
    this._bindKeys();
    LIVE.push(this);
    this.resize();
  }

  /* Un <canvas> sin nombre es, para un lector de pantalla, un agujero: no
     dice ni que hay un dibujo. Se le pone nombre a partir del titulo del
     ejemplo y del encuadre, que es lo poco que la maquina sabe de verdad. */
  Plot.prototype._nombra = function () {
    var c = this.canvas;
    // Un envoltorio que sabe mejor que nadie lo que dibuja (el visor 3D) da
    // su propio nombre y su propio papel.
    if (this.o.ariaFija) {
      c.setAttribute('role', this.o.ariaFija.role || 'img');
      c.setAttribute('aria-label', this.o.ariaFija.label);
      return;
    }
    var txt = this.o.aria;
    if (!txt) {
      var card = this.el.closest ? this.el.closest('.card') : null;
      var t = card && card.querySelector('.card__title');
      txt = t ? con('Gráfica del ejemplo «{t}»', { t: t.textContent.trim() })
              : UI('Gráfica');
    }
    txt += '. ' + con('Eje horizontal de {a} a {b}', { a: U.fmt(this.xmin, 2), b: U.fmt(this.xmax, 2) });
    if (this.o.yaxis !== false) {
      txt += '; ' + con('eje vertical de {a} a {b}', { a: U.fmt(this.ymin, 2), b: U.fmt(this.ymax, 2) });
    }
    txt += '.';
    if (c.tabIndex === 0) {
      // Si tiene puntos que se mueven es un control, no una ilustracion,
      // y hay que decir ademas como se maneja.
      var n = this._movibles().length;
      c.setAttribute('role', 'application');
      c.setAttribute('aria-label', txt + ' ' +
        (n === 1
          ? UI('Tiene un punto que se puede mover. Muévelo con las flechas; con Mayúsculas se mueve más despacio.')
          : con('Tiene {n} puntos que se pueden mover. Muévelos con las flechas; ' +
              'con Mayúsculas se mueven más despacio; la barra espaciadora pasa al punto siguiente.', { n: n })));
    } else {
      c.setAttribute('role', 'img');
      c.setAttribute('aria-label', txt);
    }
  };

  Plot.prototype.resize = function () {
    var cssW = this.el.clientWidth || 600;
    var cssH = this.height;
    var dpr = global.devicePixelRatio || 1;
    this.W = cssW; this.H = cssH;
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.canvas.style.height = cssH + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.k = aumento();
    if (this.equal) this._equalize();
    this._nombra();
    this.render();
  };

  /* Escala 1:1 en los dos ejes SIN recortar lo que se pidió dibujar: se
     elige la escala que hace caber por completo la ventana solicitada y se
     ensancha el eje que sobre. Derivando y a partir de x (que es lo que se
     hacía antes) un lienzo ancho aplastaba el rango vertical y cortaba por
     arriba y por abajo todo lo circular. */
  Plot.prototype._equalize = function () {
    var r = this._req;
    var w = r[1] - r[0], h = r[3] - r[2];
    if (!(w > 0) || !(h > 0) || !this.W || !this.H) return;
    var xc = (r[0] + r[1]) / 2, yc = (r[2] + r[3]) / 2;
    var esc = Math.min(this.W / w, this.H / h);     // pixeles por unidad
    var nw = this.W / esc / 2, nh = this.H / esc / 2;
    this.xmin = xc - nw; this.xmax = xc + nw;
    this.ymin = yc - nh; this.ymax = yc + nh;
  };

  /** Cambia la ventana visible. */
  Plot.prototype.view = function (xmin, xmax, ymin, ymax) {
    this.xmin = xmin; this.xmax = xmax;
    if (ymin !== undefined) { this.ymin = ymin; this.ymax = ymax; }
    this._req = [this.xmin, this.xmax, this.ymin, this.ymax];
    if (this.equal) this._equalize();
    this.render();
    return this;
  };

  /* --- transformaciones --- */
  Plot.prototype.X = function (x) { return (x - this.xmin) / (this.xmax - this.xmin) * this.W; };
  Plot.prototype.Y = function (y) { return this.H - (y - this.ymin) / (this.ymax - this.ymin) * this.H; };
  Plot.prototype.iX = function (px) { return this.xmin + px / this.W * (this.xmax - this.xmin); };
  Plot.prototype.iY = function (py) { return this.ymin + (this.H - py) / this.H * (this.ymax - this.ymin); };
  Plot.prototype.uX = function (dx) { return dx / (this.xmax - this.xmin) * this.W; };  // longitud
  Plot.prototype.uY = function (dy) { return dy / (this.ymax - this.ymin) * this.H; };

  Plot.prototype.color = function (c) {
    var p = this.p;
    if (c === undefined || c === null) return p.accent;
    if (typeof c === 'number') return p.c[c % p.c.length];
    if (p[c]) return p[c];
    return c;
  };

  /* --- ciclo de pintado --- */
  Plot.prototype.render = function () {
    if (!this.canvas.isConnected) return;
    this.p = U.palette();
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);
    ctx.fillStyle = this.p.bg;
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (this.showGrid) this.grid();
    if (this.showAxes) this.axes();
    if (this.o.draw) this.o.draw(this);
    this._drawHandles();
  };
  Plot.prototype.redraw = Plot.prototype.render;

  /* --- rejilla y ejes --- */
  function niceStep(range, target) {
    var raw = range / (target || 10);
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var n = raw / mag;
    var s = n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10;
    return s * mag;
  }
  Plot.prototype.step = function (axis) {
    if (axis === 'x') return this.o.xstep || niceStep(this.xmax - this.xmin, this.W / 78);
    return this.o.ystep || niceStep(this.ymax - this.ymin, this.H / 52);
  };

  Plot.prototype.grid = function () {
    var ctx = this.ctx, sx = this.step('x'), sy = this.step('y'), i;
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.p.grid2;
    ctx.beginPath();
    for (i = Math.ceil(this.xmin / (sx / 2)) * (sx / 2); i <= this.xmax; i += sx / 2) {
      var px = Math.round(this.X(i)) + .5; ctx.moveTo(px, 0); ctx.lineTo(px, this.H);
    }
    for (i = Math.ceil(this.ymin / (sy / 2)) * (sy / 2); i <= this.ymax; i += sy / 2) {
      var py = Math.round(this.Y(i)) + .5; ctx.moveTo(0, py); ctx.lineTo(this.W, py);
    }
    ctx.stroke();
    ctx.strokeStyle = this.p.grid;
    ctx.beginPath();
    for (i = Math.ceil(this.xmin / sx) * sx; i <= this.xmax; i += sx) {
      var px2 = Math.round(this.X(i)) + .5; ctx.moveTo(px2, 0); ctx.lineTo(px2, this.H);
    }
    for (i = Math.ceil(this.ymin / sy) * sy; i <= this.ymax; i += sy) {
      var py2 = Math.round(this.Y(i)) + .5; ctx.moveTo(0, py2); ctx.lineTo(this.W, py2);
    }
    ctx.stroke();
  };

  Plot.prototype.axes = function () {
    var ctx = this.ctx, p = this.p;
    var x0 = U.clamp(this.X(0), 0, this.W), y0 = U.clamp(this.Y(0), 0, this.H);
    ctx.strokeStyle = p.axis; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y0) + .5); ctx.lineTo(this.W, Math.round(y0) + .5);
    if (this.o.yaxis !== false) { ctx.moveTo(Math.round(x0) + .5, 0); ctx.lineTo(Math.round(x0) + .5, this.H); }
    ctx.stroke();

    // flechas
    this._arrowHead(this.W - 1, y0, 0, p.axis);
    if (this.o.yaxis !== false) this._arrowHead(x0, 1, -Math.PI / 2, p.axis);

    // numeros
    ctx.fillStyle = p.ink;
    ctx.font = U.fmt2(11 * this.k) + 'px system-ui, sans-serif';
    var sx = this.step('x'), sy = this.step('y'), i, d;
    d = Math.max(0, -Math.floor(Math.log(sx) / Math.LN10));
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    if (this.o.xticks !== false) {
      for (i = Math.ceil(this.xmin / sx) * sx; i <= this.xmax; i += sx) {
        if (Math.abs(i) < sx / 1e6) continue;
        var lab = this.o.xtickLabel ? this.o.xtickLabel(i) : U.fmt(i, d);
        var px = this.X(i);
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(px, y0 - 3.5); ctx.lineTo(px, y0 + 3.5); ctx.stroke();
        this._boxedText(lab, px, U.clamp(y0 + 6, 0, this.H - 15));
      }
    }
    if (this.o.yaxis !== false && this.o.yticks !== false) {
      d = Math.max(0, -Math.floor(Math.log(sy) / Math.LN10));
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (i = Math.ceil(this.ymin / sy) * sy; i <= this.ymax; i += sy) {
        if (Math.abs(i) < sy / 1e6) continue;
        var py = this.Y(i);
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x0 - 3.5, py); ctx.lineTo(x0 + 3.5, py); ctx.stroke();
        this._boxedText(this.o.ytickLabel ? this.o.ytickLabel(i) : U.fmt(i, d), U.clamp(x0 - 6, 16, this.W), py, 'right');
      }
    }
    // nombres de los ejes
    ctx.fillStyle = p.ink;
    ctx.font = 'italic ' + U.fmt2(13 * this.k) + 'px Georgia, serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    if (this.o.xlabel !== null) ctx.fillText(this.o.xlabel || 'x', this.W - 6, y0 - 5);
    if (this.o.yaxis !== false && this.o.ylabel !== null) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(this.o.ylabel || 'y', x0 + 7, 4);
    }
  };

  Plot.prototype._boxedText = function (txt, px, py, align) {
    var ctx = this.ctx, p = this.p;
    ctx.font = U.fmt2(11 * this.k) + 'px system-ui, sans-serif';
    ctx.textAlign = align || 'center';
    ctx.textBaseline = align ? 'middle' : 'top';
    var w = ctx.measureText(txt).width;
    ctx.fillStyle = p.bg; ctx.globalAlpha = .82;
    var bx = align === 'right' ? px - w - 2 : px - w / 2 - 2;
    var by = align ? py - 7 : py - 1;
    ctx.fillRect(bx, by, w + 4, 14);
    ctx.globalAlpha = 1;
    ctx.fillStyle = p.ink;
    ctx.fillText(txt, px, py);
  };

  Plot.prototype._arrowHead = function (px, py, ang, color, size) {
    var ctx = this.ctx, s = size || 7;
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s, -s * 0.42); ctx.lineTo(-s, s * 0.42);
    ctx.closePath(); ctx.fill(); ctx.restore();
  };

  /* --- primitivas de dibujo (coordenadas matematicas) --- */

  Plot.prototype._stroke = function (o) {
    var ctx = this.ctx;
    o = o || {};
    ctx.strokeStyle = this.color(o.color !== undefined ? o.color : o.c);
    ctx.lineWidth = o.w || 2.2;
    ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;
    ctx.setLineDash(o.dash ? (Array.isArray(o.dash) ? o.dash : [6, 5]) : []);
    ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
  };
  Plot.prototype._fill = function (o) {
    var ctx = this.ctx;
    ctx.fillStyle = this.color(o.fill === true ? (o.color !== undefined ? o.color : o.c) : o.fill);
    ctx.globalAlpha = o.fillAlpha === undefined ? 0.18 : o.fillAlpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  /** Grafica de y = f(x). Corta el trazo en las discontinuidades. */
  Plot.prototype.fn = function (f, o) {
    o = o || {};
    var ctx = this.ctx, started = false, prev = null;
    var x0 = o.from === undefined ? this.xmin : Math.max(o.from, this.xmin);
    var x1 = o.to === undefined ? this.xmax : Math.min(o.to, this.xmax);
    var n = o.samples || Math.max(60, Math.round(this.uX(x1 - x0)));
    ctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var x = x0 + (x1 - x0) * i / n;
      var y = f(x);
      if (!isFinite(y) || isNaN(y)) { started = false; prev = null; continue; }
      var py = this.Y(y), px = this.X(x);
      var jump = prev !== null && Math.abs(py - prev) > this.H * 1.6;
      if (!started || jump) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
      prev = py;
    }
    this._stroke(o);
    return this;
  };

  /** Curva parametrica. */
  Plot.prototype.param = function (fx, fy, t0, t1, o) {
    o = o || {};
    var ctx = this.ctx, n = o.samples || 400;
    ctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var t = t0 + (t1 - t0) * i / n;
      var px = this.X(fx(t)), py = this.Y(fy(t));
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    if (o.close) ctx.closePath();
    if (o.fill) this._fill(o);
    this._stroke(o);
    return this;
  };

  /** Polilinea a partir de [[x,y],...] */
  Plot.prototype.path = function (pts, o) {
    o = o || {};
    if (!pts.length) return this;
    var ctx = this.ctx;
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var px = this.X(pts[i][0]), py = this.Y(pts[i][1]);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    if (o.close) ctx.closePath();
    if (o.fill) this._fill(o);
    if (o.stroke !== false) this._stroke(o);
    return this;
  };
  Plot.prototype.poly = function (pts, o) {
    o = o || {}; o.close = true;
    if (o.fill === undefined) o.fill = true;
    return this.path(pts, o);
  };

  Plot.prototype.seg = function (x1, y1, x2, y2, o) {
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(this.X(x1), this.Y(y1)); ctx.lineTo(this.X(x2), this.Y(y2));
    this._stroke(o || {});
    if (o && o.label) this.text((x1 + x2) / 2, (y1 + y2) / 2, o.label, { color: o.color, dy: o.labelDy || -10, box: true });
    return this;
  };
  Plot.prototype.hline = function (y, o) { return this.seg(this.xmin, y, this.xmax, y, o); };
  Plot.prototype.vline = function (x, o) { return this.seg(x, this.ymin, x, this.ymax, o); };

  /** Vector con punta de flecha. */
  Plot.prototype.vec = function (x1, y1, x2, y2, o) {
    o = o || {};
    var ctx = this.ctx;
    var px1 = this.X(x1), py1 = this.Y(y1), px2 = this.X(x2), py2 = this.Y(y2);
    var ang = Math.atan2(py2 - py1, px2 - px1);
    var len = Math.hypot(px2 - px1, py2 - py1);
    var head = Math.min(11, len * 0.35);
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2 - Math.cos(ang) * head * 0.75, py2 - Math.sin(ang) * head * 0.75);
    this._stroke({ color: o.color !== undefined ? o.color : o.c, w: o.w || 2.6, dash: o.dash, alpha: o.alpha });
    this._arrowHead(px2, py2, ang, this.color(o.color !== undefined ? o.color : o.c), head);
    if (o.label) this.text(x2, y2, o.label, { color: o.color, dx: o.labelDx || 10, dy: o.labelDy || -8, box: true });
    return this;
  };

  Plot.prototype.point = function (x, y, o) {
    o = o || {};
    var ctx = this.ctx, r = o.r || 5;
    ctx.beginPath();
    ctx.arc(this.X(x), this.Y(y), r, 0, 6.284);
    ctx.fillStyle = o.hollow ? this.p.bg : this.color(o.color !== undefined ? o.color : o.c);
    ctx.fill();
    ctx.lineWidth = o.w || 2;
    ctx.strokeStyle = this.color(o.color !== undefined ? o.color : o.c);
    ctx.stroke();
    if (o.label) this.text(x, y, o.label, {
      color: o.color, dx: o.labelDx === undefined ? 9 : o.labelDx,
      dy: o.labelDy === undefined ? -9 : o.labelDy, box: o.box !== false, align: o.labelAlign || 'left'
    });
    return this;
  };

  Plot.prototype.circle = function (cx, cy, r, o) {
    o = o || {};
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.ellipse(this.X(cx), this.Y(cy), Math.abs(this.uX(r)), Math.abs(this.uY(r)), 0, 0, 6.2832);
    if (o.fill) this._fill(o);
    if (o.stroke !== false) this._stroke(o);
    return this;
  };

  /** Arco (angulos en radianes, sentido matematico). */
  Plot.prototype.arc = function (cx, cy, r, a0, a1, o) {
    o = o || {};
    var ctx = this.ctx, n = 90;
    ctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var a = a0 + (a1 - a0) * i / n;
      var px = this.X(cx + r * Math.cos(a)), py = this.Y(cy + r * Math.sin(a));
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    if (o.fill) { ctx.lineTo(this.X(cx), this.Y(cy)); ctx.closePath(); this._fill(o); }
    if (o.stroke !== false) this._stroke(o);
    return this;
  };

  /** Marca de angulo recto en el vertice (vx,vy) entre dos direcciones. */
  Plot.prototype.rightAngle = function (vx, vy, a1, a2, size, o) {
    var s = size || 0.35;
    var p1 = [vx + s * Math.cos(a1), vy + s * Math.sin(a1)];
    var p3 = [vx + s * Math.cos(a2), vy + s * Math.sin(a2)];
    var p2 = [p1[0] + p3[0] - vx, p1[1] + p3[1] - vy];
    return this.path([p1, p2, p3], o || { w: 1.5, color: 'axis' });
  };

  /** Area bajo la curva entre a y b. */
  Plot.prototype.area = function (f, a, b, o) {
    o = o || {};
    var ctx = this.ctx, n = o.samples || 220;
    ctx.beginPath();
    ctx.moveTo(this.X(a), this.Y(0));
    for (var i = 0; i <= n; i++) {
      var x = a + (b - a) * i / n;
      ctx.lineTo(this.X(x), this.Y(f(x)));
    }
    ctx.lineTo(this.X(b), this.Y(0));
    ctx.closePath();
    this._fill({ fill: o.fill === undefined ? (o.color !== undefined ? o.color : 0) : o.fill, fillAlpha: o.fillAlpha });
    if (o.stroke) this._stroke(o);
    return this;
  };

  /** Rectangulo en coordenadas matematicas. */
  Plot.prototype.rect = function (x, y, w, h, o) {
    o = o || {};
    var ctx = this.ctx;
    var px = this.X(Math.min(x, x + w)), py = this.Y(Math.max(y, y + h));
    ctx.beginPath();
    ctx.rect(px, py, Math.abs(this.uX(w)), Math.abs(this.uY(h)));
    if (o.fill) this._fill(o);
    if (o.stroke !== false) this._stroke(o);
    return this;
  };

  Plot.prototype.text = function (x, y, txt, o) {
    o = o || {};
    var ctx = this.ctx;
    var px = this.X(x) + (o.dx || 0), py = this.Y(y) + (o.dy || 0);
    ctx.font = (o.italic ? 'italic ' : '') + (o.bold ? '600 ' : '') +
      U.fmt2((o.size || 13) * this.k) + 'px ' +
      (o.serif === false ? 'system-ui, sans-serif' : 'Georgia, serif');
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.baseline || 'middle';
    if (o.box) {
      var w = ctx.measureText(txt).width;
      var bx = o.align === 'center' ? px - w / 2 : (o.align === 'right' ? px - w : px);
      ctx.fillStyle = this.p.bg; ctx.globalAlpha = .8;
      ctx.fillRect(bx - 3, py - 8, w + 6, 16);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = this.color(o.color !== undefined ? o.color : 'ink');
    ctx.fillText(txt, px, py);
    return this;
  };

  /** Barras verticales: datos [{x, h, label, color}] con ancho en unidades. */
  Plot.prototype.bars = function (data, o) {
    o = o || {};
    var wdt = o.width === undefined ? 0.7 : o.width;
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var c = d.color !== undefined ? d.color : (o.color !== undefined ? o.color : 0);
      this.rect(d.x - wdt / 2, 0, wdt, d.h, { fill: c, color: c, fillAlpha: o.fillAlpha === undefined ? .55 : o.fillAlpha, w: 1.6 });
      if (d.top !== undefined || o.showValues) {
        this.text(d.x, d.h, d.top !== undefined ? d.top : U.fmt(d.h, 2),
          { align: 'center', dy: d.h >= 0 ? -12 : 14, size: 12, color: 'ink' });
      }
    }
    return this;
  };

  /* --- puntos arrastrables --- */

  /** Recupera un punto arrastrable por su nombre. */
  Plot.prototype.h = function (id) {
    for (var i = 0; i < this.handles.length; i++) if (this.handles[i].id === id) return this.handles[i];
    return null;
  };
  /** Declara (o recupera) un punto que el alumno puede mover. */
  Plot.prototype.handle = function (id, x, y, o) {
    for (var i = 0; i < this.handles.length; i++) if (this.handles[i].id === id) return this.handles[i];
    var h = { id: id, x: x, y: y, o: o || {} };
    this.handles.push(h);
    return h;
  };
  Plot.prototype._drawHandles = function () {
    var activo = this._foco ? this._movibles()[this._act || 0] : null;
    for (var i = 0; i < this.handles.length; i++) {
      var h = this.handles[i];
      if (h.o.hidden) continue;
      var col = h.o.color !== undefined ? h.o.color : 0;
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.arc(this.X(h.x), this.Y(h.y), 11, 0, 6.284);
      ctx.fillStyle = this.color(col); ctx.globalAlpha = .16; ctx.fill(); ctx.globalAlpha = 1;
      // Aro a trazos: cuando se maneja con el teclado hay que ver cual de
      // los puntos es el que van a mover las flechas.
      if (h === activo) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.X(h.x), this.Y(h.y), 15, 0, 6.284);
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = this.color('accent'); ctx.lineWidth = 2.2; ctx.stroke();
        ctx.restore();
      }
      this.point(h.x, h.y, {
        color: col, r: 6, label: h.o.label,
        labelDx: h.o.labelDx, labelDy: h.o.labelDy
      });
    }
  };
  /* --- manejo por teclado ---------------------------------------------
     Arrastrar con el raton no esta al alcance de todo el mundo: hay quien
     navega solo con teclado, quien usa un conmutador y quien simplemente
     no tiene el pulso para acertar un punto de once pixeles. Toda grafica
     con puntos moviles se enfoca con el tabulador y se maneja con las
     flechas; el aro a trazos dice cual se esta moviendo. */
  Plot.prototype._movibles = function () {
    var r = [];
    for (var i = 0; i < this.handles.length; i++) {
      var h = this.handles[i];
      if (!h.o.hidden && !h.o.fixed) r.push(h);
    }
    return r;
  };

  Plot.prototype._mueve = function (h, dx, dy) {
    h.x += dx; h.y += dy;
    if (h.o.constrain) h.o.constrain(h, this);
    if (h.o.snap) {
      h.x = Math.round(h.x / h.o.snap) * h.o.snap;
      h.y = Math.round(h.y / h.o.snap) * h.o.snap;
    }
    if (this.o.onDrag) this.o.onDrag(h, this);
    this.render();
    this._digo(h);
  };

  /** Dice en voz alta (para el lector de pantalla) donde ha quedado. */
  Plot.prototype._digo = function (h) {
    if (!this._voz) return;
    var nom = (h.o.label || h.id || UI('punto')).replace(/[$\\{}]/g, '');
    this._voz.textContent = nom + ': x = ' + U.fmt(h.x, 3) + ', y = ' + U.fmt(h.y, 3);
  };

  Plot.prototype._bindKeys = function () {
    var self = this, c = this.canvas;
    if (!this._movibles().length) return;      // nada que mover, nada que enfocar

    c.tabIndex = 0;                            // el nombre lo pone _nombra()

    // Fuera de .stage: ese recuadro recorta lo que sobresale y tiene fondo propio.
    this._voz = U.el('div.sr-solo', { 'aria-live': 'polite', 'aria-atomic': 'true' });
    var pie = U.el('div.stage__teclas', {
      html: UI('También con el teclado: <kbd>Tab</kbd> hasta el dibujo y ' +
        '<kbd>&#8592;</kbd><kbd>&#8593;</kbd><kbd>&#8595;</kbd><kbd>&#8594;</kbd> para mover el punto.')
    });
    var tras = this.el.nextSibling, padre = this.el.parentNode;
    if (padre) { padre.insertBefore(pie, tras); padre.insertBefore(this._voz, pie); }

    U.on(c, 'focus', function () { self._foco = true; self.render(); self._digo(self._movibles()[self._act || 0]); });
    U.on(c, 'blur', function () { self._foco = false; self.render(); });

    U.on(c, 'keydown', function (ev) {
      var libres = self._movibles();
      if (!libres.length) return;
      if (self._act === undefined || self._act >= libres.length) self._act = 0;
      var h = libres[self._act];
      var paso = ev.shiftKey ? 200 : 40;   // Mayusculas = paso fino
      var px = (self.xmax - self.xmin) / paso;
      var py = (self.ymax - self.ymin) / paso;
      if (h.o.snap) { px = h.o.snap; py = h.o.snap; }
      switch (ev.key) {
        case 'ArrowLeft': self._mueve(h, -px, 0); break;
        case 'ArrowRight': self._mueve(h, px, 0); break;
        case 'ArrowUp': self._mueve(h, 0, py); break;
        case 'ArrowDown': self._mueve(h, 0, -py); break;
        case ' ': case 'Spacebar': case 'Enter':
          self._act = (self._act + 1) % libres.length;
          self.render(); self._digo(libres[self._act]);
          break;
        default: return;
      }
      ev.preventDefault();
    });
  };

  Plot.prototype._bindPointer = function () {
    var self = this, c = this.canvas;
    function pos(ev) {
      var r = c.getBoundingClientRect();
      var t = ev.touches ? ev.touches[0] : ev;
      return { px: t.clientX - r.left, py: t.clientY - r.top };
    }
    function hit(pt) {
      for (var i = self.handles.length - 1; i >= 0; i--) {
        var h = self.handles[i];
        if (h.o.hidden || h.o.fixed) continue;
        if (Math.hypot(self.X(h.x) - pt.px, self.Y(h.y) - pt.py) < 16) return h;
      }
      return null;
    }
    function down(ev) {
      var pt = pos(ev);
      var h = hit(pt);
      if (h) { self._drag = h; c.style.cursor = 'grabbing'; ev.preventDefault(); }
      else if (self.o.onClick) { self.o.onClick(self.iX(pt.px), self.iY(pt.py), self); }
    }
    function move(ev) {
      var pt = pos(ev);
      if (self._drag) {
        var h = self._drag;
        h.x = self.iX(pt.px); h.y = self.iY(pt.py);
        if (h.o.constrain) h.o.constrain(h, self);
        if (h.o.snap) { h.x = Math.round(h.x / h.o.snap) * h.o.snap; h.y = Math.round(h.y / h.o.snap) * h.o.snap; }
        if (self.o.onDrag) self.o.onDrag(h, self);
        self.render();
        ev.preventDefault();
        return;
      }
      c.style.cursor = hit(pt) ? 'grab' : (self.o.onClick ? 'pointer' : (self.o.cursor || 'default'));
      if (self.o.onHover) { self.o.onHover(self.iX(pt.px), self.iY(pt.py), self); }
    }
    function up() { if (self._drag) { self._drag = null; c.style.cursor = 'default'; } }
    U.on(c, 'mousedown', down); U.on(c, 'touchstart', down, { passive: false });
    U.on(global, 'mousemove', move); U.on(c, 'touchmove', move, { passive: false });
    U.on(global, 'mouseup', up); U.on(global, 'touchend', up);
  };

  /** Vuelve a medir y a pintar todo lo vivo: cambio el tamano de la letra. */
  W.redibuja = function () {
    for (var i = 0; i < LIVE.length; i++) {
      if (LIVE[i].canvas.isConnected) LIVE[i].resize();
    }
  };

  W.Plot = Plot;
  W.plot = function (host, o) { return new Plot(host, o); };

  /* ============ envoltorios especializados ============ */

  /** Recta real: solo eje X, con etiquetas. */
  W.numberLine = function (host, o) {
    o = o || {};
    var c = {};
    for (var k in o) c[k] = o[k];
    c.xmin = o.min === undefined ? -10 : o.min;
    c.xmax = o.max === undefined ? 10 : o.max;
    c.ymin = -1; c.ymax = 1;
    c.height = o.height || 110;
    c.grid = false; c.yaxis = false; c.ylabel = null;
    if (o.xlabel === undefined) c.xlabel = null;
    c.xstep = o.step;
    c.xtickLabel = o.tickLabel;
    return new Plot(host, c);
  };

  /** Lienzo con la misma escala en los dos ejes (geometria). */
  W.board = function (host, o) {
    o = o || {};
    o.equal = true;
    return new Plot(host, o);
  };

  /** Diagrama de barras / histograma a partir de etiquetas y valores. */
  W.barChart = function (host, o) {
    var vals = o.values, labels = o.labels || vals.map(function (_, i) { return String(i + 1); });
    var maxv = Math.max.apply(null, vals.concat([0]));
    var minv = Math.min.apply(null, vals.concat([0]));
    var pad = (maxv - minv) * 0.16 + 0.001;
    var plot = new Plot(host, {
      xmin: -0.7, xmax: vals.length - 0.3,
      ymin: minv < 0 ? minv - pad : 0, ymax: maxv + pad,
      height: o.height || 300,
      xlabel: o.xlabel || null, ylabel: o.ylabel || null,
      xstep: 1,
      xtickLabel: function (i) { return labels[Math.round(i)] !== undefined ? labels[Math.round(i)] : ''; },
      draw: function (g) {
        g.bars(vals.map(function (v, i) {
          return { x: i, h: v, color: o.color === undefined ? 0 : o.color, top: o.showValues === false ? undefined : U.fmt(v, o.dec === undefined ? 2 : o.dec) };
        }), { width: o.width === undefined ? 0.66 : o.width });
        if (o.extra) o.extra(g);
      }
    });
    return plot;
  };

  /* ========================= VISOR 3D =========================
     La geometria del espacio no se aprende en un dibujo plano: en el papel
     dos rectas que se cruzan parecen cortarse, y un plano es un
     paralelogramo cualquiera. Este visor pinta en perspectiva sobre el mismo
     Plot2D de siempre -proyectar un punto es un producto de matrices, no
     hace falta ninguna libreria- y se gira arrastrando o con el teclado.

       var v = W.space3d(host, {
         rango: 5,                  // el dibujo abarca el cubo [-5, 5]³
         height: 340, aria: 'Qué se ve, para quien no lo ve',
         draw: function (g) {       // g es el propio visor
           g.plano([1, 1, 1], -3, { color: 0 });       // x + y + z - 3 = 0
           g.linea([0, 0, 0], [1, 2, 0], { color: 1 }); // punto y vector
           g.punto([1, 1, 1], { label: 'P' });
           g.vec([0, 0, 0], [2, 1, 3], { color: 2, label: 'u' });
         }
       });
       v.render();

     Convenio de ejes: z hacia arriba, sistema dextrógiro, como en los libros. */

  function resta3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function prodVec3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function esc3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norma3(a) { var m = Math.sqrt(esc3(a, a)) || 1; return [a[0] / m, a[1] / m, a[2] / m]; }

  /** Tramo de la recta P + t·v que queda dentro del cubo [-R, R]³, o null. */
  function recorta3(P, v, R) {
    var t0 = -Infinity, t1 = Infinity;
    for (var i = 0; i < 3; i++) {
      if (Math.abs(v[i]) < 1e-12) {
        if (P[i] < -R - 1e-9 || P[i] > R + 1e-9) return null;
      } else {
        var a = (-R - P[i]) / v[i], b = (R - P[i]) / v[i];
        if (a > b) { var tt = a; a = b; b = tt; }
        if (a > t0) t0 = a;
        if (b < t1) t1 = b;
      }
    }
    if (!(t0 <= t1) || !isFinite(t0) || !isFinite(t1)) return null;
    return [[P[0] + t0 * v[0], P[1] + t0 * v[1], P[2] + t0 * v[2]],
            [P[0] + t1 * v[0], P[1] + t1 * v[1], P[2] + t1 * v[2]]];
  }

  /** Poligono que corta el plano n·x + D = 0 en el cubo [-R, R]³, ordenado. */
  function planoCubo(n, D, R) {
    var pts = [];
    var V = [];
    for (var i = 0; i < 8; i++) V.push([(i & 1) ? R : -R, (i & 2) ? R : -R, (i & 4) ? R : -R]);
    for (var a = 0; a < 8; a++) {
      for (var bit = 1; bit <= 4; bit *= 2) {
        var b = a | bit;
        if (b === a) continue;
        var fa = esc3(n, V[a]) + D, fb = esc3(n, V[b]) + D;
        if ((fa < 0 && fb < 0) || (fa > 0 && fb > 0) || fa === fb) continue;
        var t = fa / (fa - fb);
        var q = [V[a][0] + t * (V[b][0] - V[a][0]), V[a][1] + t * (V[b][1] - V[a][1]), V[a][2] + t * (V[b][2] - V[a][2])];
        var repe = pts.some(function (p) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < 1e-7; });
        if (!repe) pts.push(q);
      }
    }
    if (pts.length < 3) return [];
    var c = [0, 0, 0];
    pts.forEach(function (p) { c[0] += p[0] / pts.length; c[1] += p[1] / pts.length; c[2] += p[2] / pts.length; });
    var nn = norma3(n);
    var eje = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    var u = norma3(prodVec3(nn, eje)), w = prodVec3(nn, u);
    pts.sort(function (p, q) {
      var dp = resta3(p, c), dq = resta3(q, c);
      return Math.atan2(esc3(dp, w), esc3(dp, u)) - Math.atan2(esc3(dq, w), esc3(dq, u));
    });
    return pts;
  }
  W.recorta3 = recorta3;
  W.planoCubo = planoCubo;
  W.v3 = { resta: resta3, cruz: prodVec3, punto: esc3, unitario: norma3 };

  function Space3D(host, o) {
    o = o || {};
    var self = this;
    this.o = o;
    this.R = o.rango || 5;
    this.yaw0 = o.yaw === undefined ? -2.25 : o.yaw;
    this.pitch0 = o.pitch === undefined ? 0.38 : o.pitch;
    this.yaw = this.yaw0;
    this.pitch = this.pitch0;
    this.zoom = 1;
    var lim = 1.02;
    this.plot = new Plot(host, {
      xmin: -lim, xmax: lim, ymin: -lim, ymax: lim, height: o.height || 340,
      equal: true, grid: false, axes: false, cursor: 'grab',
      ariaFija: {
        role: 'application',
        label: (o.aria || UI('Dibujo en tres dimensiones')) + '. ' +
          UI('Se puede girar para verlo desde otro sitio: arrastrándolo, o con las flechas del ' +
            'teclado; más y menos acercan, y la tecla R vuelve a la vista inicial.')
      },
      draw: function (g) { self.g = g; self._pinta(); }
    });
    this.plot.el.classList.add('stage--3d');
    this._teclas();
    this._arrastre();
  }

  /** Proyeccion de un punto del espacio al lienzo (perspectiva suave). */
  Space3D.prototype.proyecta = function (p) {
    var R = this.R;
    var cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    var cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    var x = p[0] / R, y = p[1] / R, z = p[2] / R;
    var x1 = x * cy - y * sy;
    var y1 = x * sy + y * cy;             // hacia dentro de la pantalla
    var alto = z * cp + y1 * sp;
    var fondo = y1 * cp - z * sp;
    var f = 4 / (4 + fondo) * 0.8 * this.zoom;
    return { x: x1 * f, y: alto * f, fondo: fondo };
  };

  Space3D.prototype.render = function () { this.plot.render(); };

  Space3D.prototype._pinta = function () {
    var g = this.g, R = this.R, o = this.o, i;
    if (o.rejilla !== false) {
      var paso = o.paso || 1;
      for (i = -R; i <= R + 1e-9; i += paso) {
        this.seg([i, -R, 0], [i, R, 0], { color: 'grid', w: 1 });
        this.seg([-R, i, 0], [R, i, 0], { color: 'grid', w: 1 });
      }
    }
    if (o.ejes !== false) {
      var nombres = ['x', 'y', 'z'];
      for (i = 0; i < 3; i++) {
        var a = [0, 0, 0], b = [0, 0, 0];
        a[i] = -R; b[i] = R;
        this.seg(a, [0, 0, 0], { color: 'axis', w: 1.2, dash: [4, 4] });
        this.vec([0, 0, 0], b, { color: 'axis', w: 1.6 });
        var et = [0, 0, 0]; et[i] = R * 1.07;
        this.texto(et, nombres[i], { color: 'ink', italic: true, size: 14, align: 'center' });
        if (o.numeros !== false && R <= 8) {
          for (var k = 1; k < R; k++) {
            var m = [0, 0, 0]; m[i] = k;
            var pm = this.proyecta(m);
            g.point(pm.x, pm.y, { r: 1.8, color: 'axis', w: 1 });
            if (k % (R > 5 ? 2 : 1) === 0) {
              this.texto(m, String(k), { color: 'axis', size: 10, serif: false, dx: 5, dy: 8 });
            }
          }
        }
      }
    }
    if (o.draw) o.draw(this);
  };

  /* --- primitivas en coordenadas del espacio --- */
  Space3D.prototype.punto = function (p, op) {
    var q = this.proyecta(p);
    this.g.point(q.x, q.y, op || {});
    return this;
  };
  Space3D.prototype.seg = function (a, b, op) {
    var p = this.proyecta(a), q = this.proyecta(b);
    this.g.seg(p.x, p.y, q.x, q.y, op || {});
    return this;
  };
  Space3D.prototype.vec = function (a, b, op) {
    var p = this.proyecta(a), q = this.proyecta(b);
    this.g.vec(p.x, p.y, q.x, q.y, op || {});
    return this;
  };
  Space3D.prototype.camino = function (pts, op) {
    var self = this;
    this.g.path(pts.map(function (p) { var q = self.proyecta(p); return [q.x, q.y]; }), op || {});
    return this;
  };
  Space3D.prototype.poli = function (pts, op) {
    var self = this;
    op = op || {};
    this.g.poly(pts.map(function (p) { var q = self.proyecta(p); return [q.x, q.y]; }), {
      color: op.color, fill: op.fill === undefined ? true : op.fill,
      fillAlpha: op.fillAlpha === undefined ? 0.16 : op.fillAlpha, w: op.w || 1.2, dash: op.dash, alpha: op.alpha
    });
    return this;
  };
  Space3D.prototype.texto = function (p, txt, op) {
    var q = this.proyecta(p);
    this.g.text(q.x, q.y, txt, op || {});
    return this;
  };
  /** La recta que pasa por P con direccion v, recortada al cubo. */
  Space3D.prototype.linea = function (P, v, op) {
    var s = recorta3(P, v, this.R);
    if (s) this.seg(s[0], s[1], op);
    return s;
  };
  /** El plano n·x + D = 0, recortado al cubo. */
  Space3D.prototype.plano = function (n, D, op) {
    var pts = planoCubo(n, D, this.R);
    if (pts.length >= 3) this.poli(pts, op);
    return pts;
  };

  Space3D.prototype._digo = function () {
    if (!this.voz) return;
    var gr = function (r) { return Math.round(r * 180 / Math.PI); };
    this.voz.textContent = con('Vista girada: {a} grados en horizontal y {b} grados de elevación.',
      { a: gr(this.yaw - this.yaw0), b: gr(this.pitch) });
  };

  Space3D.prototype._teclas = function () {
    var self = this, c = this.plot.canvas;
    c.tabIndex = 0;
    this.voz = U.el('div.sr-solo', { 'aria-live': 'polite', 'aria-atomic': 'true' });
    var pie = U.el('div.stage__teclas', {
      html: UI('Arrastra el dibujo para girarlo. Con el teclado: <kbd>Tab</kbd> hasta el dibujo, ' +
        '<kbd>&#8592;</kbd><kbd>&#8594;</kbd><kbd>&#8593;</kbd><kbd>&#8595;</kbd> para girar, ' +
        '<kbd>+</kbd><kbd>&#8722;</kbd> para acercar y <kbd>R</kbd> para volver a la vista inicial.')
    });
    var tras = this.plot.el.nextSibling, padre = this.plot.el.parentNode;
    if (padre) { padre.insertBefore(pie, tras); padre.insertBefore(this.voz, pie); }
    U.on(c, 'keydown', function (ev) {
      var d = ev.shiftKey ? 0.03 : 0.12;
      switch (ev.key) {
        case 'ArrowLeft': self.yaw -= d; break;
        case 'ArrowRight': self.yaw += d; break;
        case 'ArrowUp': self.pitch = Math.min(1.5, self.pitch + d); break;
        case 'ArrowDown': self.pitch = Math.max(-1.5, self.pitch - d); break;
        case '+': case '=': self.zoom = Math.min(2.6, self.zoom * 1.12); break;
        case '-': case '_': self.zoom = Math.max(0.5, self.zoom / 1.12); break;
        case 'r': case 'R': case 'Home':
          self.yaw = self.yaw0; self.pitch = self.pitch0; self.zoom = 1; break;
        default: return;
      }
      ev.preventDefault();
      ev.stopPropagation();
      self.render();
      self._digo();
    });
  };

  Space3D.prototype._arrastre = function () {
    var self = this, c = this.plot.canvas, ini = null;
    function pos(ev) { var t = ev.touches ? ev.touches[0] : ev; return { x: t.clientX, y: t.clientY }; }
    function down(ev) {
      var p = pos(ev);
      ini = { x: p.x, y: p.y, yaw: self.yaw, pitch: self.pitch };
      if (ev.cancelable) ev.preventDefault();
    }
    function move(ev) {
      if (!ini) return;
      var p = pos(ev);
      self.yaw = ini.yaw + (p.x - ini.x) * 0.011;
      self.pitch = Math.max(-1.5, Math.min(1.5, ini.pitch + (p.y - ini.y) * 0.011));
      self.render();
      if (ev.cancelable) ev.preventDefault();
    }
    function up() { if (ini) { ini = null; self._digo(); } }
    U.on(c, 'mousedown', down); U.on(c, 'touchstart', down, { passive: false });
    U.on(global, 'mousemove', move); U.on(c, 'touchmove', move, { passive: false });
    U.on(global, 'mouseup', up); U.on(global, 'touchend', up);
  };

  W.Space3D = Space3D;
  W.space3d = function (host, o) { return new Space3D(host, o); };

  /* repintar todo al cambiar el tema claro/oscuro */
  U.bus.on('theme', function () {
    for (var i = LIVE.length - 1; i >= 0; i--) {
      if (!LIVE[i].canvas.isConnected) { LIVE.splice(i, 1); continue; }
      LIVE[i].render();
    }
  });

  global.W = W;
})(window);
