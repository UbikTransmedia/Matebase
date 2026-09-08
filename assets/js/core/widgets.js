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
    var txt = this.o.aria;
    if (!txt) {
      var card = this.el.closest ? this.el.closest('.card') : null;
      var t = card && card.querySelector('.card__title');
      txt = t ? ('Gráfica del ejemplo «' + t.textContent.trim() + '»')
              : 'Gráfica';
    }
    txt += '. Eje horizontal de ' + U.fmt(this.xmin, 2) + ' a ' + U.fmt(this.xmax, 2);
    if (this.o.yaxis !== false) {
      txt += '; eje vertical de ' + U.fmt(this.ymin, 2) + ' a ' + U.fmt(this.ymax, 2);
    }
    txt += '.';
    if (c.tabIndex === 0) {
      // Si tiene puntos que se mueven es un control, no una ilustracion,
      // y hay que decir ademas como se maneja.
      var n = this._movibles().length;
      c.setAttribute('role', 'application');
      c.setAttribute('aria-label', txt +
        (n === 1
          ? ' Tiene un punto que se puede mover. Muévelo con las flechas; con Mayúsculas se mueve más despacio.'
          : ' Tiene ' + n + ' puntos que se pueden mover. Muévelos con las flechas; ' +
            'con Mayúsculas se mueven más despacio; la barra espaciadora pasa al punto siguiente.'));
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
    ctx.font = '11px ' + 'system-ui, sans-serif';
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
    ctx.font = 'italic 13px ' + 'Georgia, serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    if (this.o.xlabel !== null) ctx.fillText(this.o.xlabel || 'x', this.W - 6, y0 - 5);
    if (this.o.yaxis !== false && this.o.ylabel !== null) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(this.o.ylabel || 'y', x0 + 7, 4);
    }
  };

  Plot.prototype._boxedText = function (txt, px, py, align) {
    var ctx = this.ctx, p = this.p;
    ctx.font = '11px system-ui, sans-serif';
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
    ctx.font = (o.italic ? 'italic ' : '') + (o.bold ? '600 ' : '') + (o.size || 13) + 'px ' +
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
    var nom = (h.o.label || h.id || 'punto').replace(/[$\\{}]/g, '');
    this._voz.textContent = nom + ': x = ' + U.fmt(h.x, 3) + ', y = ' + U.fmt(h.y, 3);
  };

  Plot.prototype._bindKeys = function () {
    var self = this, c = this.canvas;
    if (!this._movibles().length) return;      // nada que mover, nada que enfocar

    c.tabIndex = 0;                            // el nombre lo pone _nombra()

    // Fuera de .stage: ese recuadro recorta lo que sobresale y tiene fondo propio.
    this._voz = U.el('div.sr-solo', { 'aria-live': 'polite', 'aria-atomic': 'true' });
    var pie = U.el('div.stage__teclas', {
      html: 'También con el teclado: <kbd>Tab</kbd> hasta el dibujo y ' +
        '<kbd>&#8592;</kbd><kbd>&#8593;</kbd><kbd>&#8595;</kbd><kbd>&#8594;</kbd> para mover el punto.'
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
      c.style.cursor = hit(pt) ? 'grab' : (self.o.onClick ? 'pointer' : 'default');
      if (self.o.onHover) { self.o.onHover(self.iX(pt.px), self.iY(pt.py), self); }
    }
    function up() { if (self._drag) { self._drag = null; c.style.cursor = 'default'; } }
    U.on(c, 'mousedown', down); U.on(c, 'touchstart', down, { passive: false });
    U.on(global, 'mousemove', move); U.on(c, 'touchmove', move, { passive: false });
    U.on(global, 'mouseup', up); U.on(global, 'touchend', up);
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

  /* repintar todo al cambiar el tema claro/oscuro */
  U.bus.on('theme', function () {
    for (var i = LIVE.length - 1; i >= 0; i--) {
      if (!LIVE[i].canvas.isConnected) { LIVE.splice(i, 1); continue; }
      LIVE[i].render();
    }
  });

  global.W = W;
})(window);
