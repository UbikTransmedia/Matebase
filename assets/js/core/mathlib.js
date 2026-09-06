/* ===================================================================
   Matebase · mathlib.js
   Matematicas de apoyo compartidas por todos los temas:
   fracciones exactas, aritmetica entera, polinomios, matrices y un
   evaluador de expresiones para corregir las respuestas del alumno.
   =================================================================== */
(function (global) {
  'use strict';

  var ML = {};

  /* =========== 1. Aritmetica entera =========== */

  ML.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  ML.lcm = function (a, b) { return (!a || !b) ? 0 : Math.abs(a * b) / ML.gcd(a, b); };
  ML.gcdList = function (l) { return l.reduce(function (a, b) { return ML.gcd(a, b); }, 0); };
  ML.lcmList = function (l) { return l.reduce(function (a, b) { return ML.lcm(a, b); }, 1); };

  ML.isPrime = function (n) {
    n = Math.abs(n);
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0) return false;
    for (var i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
    return true;
  };
  /** [[primo, exponente], ...] */
  ML.factorize = function (n) {
    n = Math.abs(n); var out = [];
    if (n < 2) return out;
    for (var d = 2; d * d <= n; d++) {
      if (n % d === 0) { var e = 0; while (n % d === 0) { n /= d; e++; } out.push([d, e]); }
    }
    if (n > 1) out.push([n, 1]);
    return out;
  };
  ML.factorTex = function (n) {
    var f = ML.factorize(n);
    if (!f.length) return String(n);
    return f.map(function (p) { return p[1] === 1 ? p[0] : p[0] + '^{' + p[1] + '}'; }).join(' \\cdot ');
  };
  ML.divisors = function (n) {
    n = Math.abs(n); var out = [];
    for (var i = 1; i * i <= n; i++) if (n % i === 0) { out.push(i); if (i !== n / i) out.push(n / i); }
    return out.sort(function (a, b) { return a - b; });
  };
  ML.primesUpTo = function (n) {
    var s = new Array(n + 1).fill(true), out = [];
    s[0] = s[1] = false;
    for (var i = 2; i <= n; i++) {
      if (!s[i]) continue;
      out.push(i);
      for (var j = i * i; j <= n; j += i) s[j] = false;
    }
    return out;
  };
  ML.factorial = function (n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; };
  ML.comb = function (n, k) {
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k); var r = 1;
    for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1);
    return Math.round(r);
  };
  ML.perm = function (n, k) { var r = 1; for (var i = 0; i < k; i++) r *= (n - i); return r; };

  /* =========== 2. Fracciones exactas =========== */

  function Frac(n, d) {
    if (d === undefined) d = 1;
    if (d === 0) { this.n = NaN; this.d = 1; return; }
    if (d < 0) { n = -n; d = -d; }
    var g = ML.gcd(n, d) || 1;
    this.n = n / g; this.d = d / g;
  }
  Frac.prototype.add = function (o) { o = F(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); };
  Frac.prototype.sub = function (o) { o = F(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); };
  Frac.prototype.mul = function (o) { o = F(o); return new Frac(this.n * o.n, this.d * o.d); };
  Frac.prototype.div = function (o) { o = F(o); return new Frac(this.n * o.d, this.d * o.n); };
  Frac.prototype.neg = function () { return new Frac(-this.n, this.d); };
  Frac.prototype.inv = function () { return new Frac(this.d, this.n); };
  Frac.prototype.pow = function (k) {
    if (k < 0) return this.inv().pow(-k);
    return new Frac(Math.pow(this.n, k), Math.pow(this.d, k));
  };
  Frac.prototype.val = function () { return this.n / this.d; };
  Frac.prototype.isInt = function () { return this.d === 1; };
  Frac.prototype.eq = function (o) { o = F(o); return this.n === o.n && this.d === o.d; };
  Frac.prototype.cmp = function (o) { o = F(o); return this.n * o.d - o.n * this.d; };
  Frac.prototype.abs = function () { return new Frac(Math.abs(this.n), this.d); };
  Frac.prototype.toString = function () { return this.d === 1 ? String(this.n) : this.n + '/' + this.d; };
  /** LaTeX: 3/4 -> \frac{3}{4};  -3/4 -> -\frac{3}{4} */
  Frac.prototype.tex = function () {
    if (this.d === 1) return String(this.n);
    return (this.n < 0 ? '-' : '') + '\\frac{' + Math.abs(this.n) + '}{' + this.d + '}';
  };
  /** LaTeX entre parentesis si es negativa o fraccion. */
  Frac.prototype.texp = function () {
    return (this.n < 0) ? '\\left(' + this.tex() + '\\right)' : this.tex();
  };

  function F(a, b) {
    if (a instanceof Frac) return a;
    if (typeof a === 'number' && b === undefined) {
      if (Number.isInteger(a)) return new Frac(a, 1);
      // aproximacion por fracciones continuas
      // h/k van guardando los convergentes: h1/k1 es el actual, h0/k0 el anterior.
      var sign = a < 0 ? -1 : 1, x = Math.abs(a);
      var bq = Math.floor(x), fr = x - bq;
      var h1 = bq, h0 = 1, k1 = 1, k0 = 0;
      for (var i = 0; i < 30 && fr > 1e-12; i++) {
        var r = 1 / fr; bq = Math.floor(r); fr = r - bq;
        var h2 = bq * h1 + h0; h0 = h1; h1 = h2;
        var k2 = bq * k1 + k0; k0 = k1; k1 = k2;
        if (k1 > 1e9) break;
        if (Math.abs(h1 / k1 - x) < 1e-12) break;
      }
      return new Frac(sign * h1, k1 || 1);
    }
    return new Frac(a, b === undefined ? 1 : b);
  }
  ML.Frac = Frac;
  ML.F = F;

  /* =========== 3. Formato de terminos y polinomios =========== */

  /** Coeficiente delante de una variable: 1x -> x, -1x -> -x, 0 -> '' */
  ML.coefTex = function (c, showOne) {
    if (c === 1) return showOne ? '1' : '';
    if (c === -1) return showOne ? '-1' : '-';
    return U.fmt(c);
  };

  /** Un termino  c*var^e  con su signo. first=true omite el + inicial. */
  ML.termTex = function (c, v, e, first) {
    if (c === 0) return '';
    var s = c < 0 ? '-' : (first ? '' : '+');
    var a = Math.abs(c);
    var body;
    if (!v || e === 0) body = U.fmt(a);
    else {
      var coef = (a === 1) ? '' : U.fmt(a);
      body = coef + v + (e === 1 ? '' : '^{' + e + '}');
    }
    return s + body;
  };

  /** Polinomio desde coeficientes de mayor a menor grado: [1,-3,2] -> x^2-3x+2 */
  ML.polyTex = function (coefs, v) {
    v = v || 'x';
    var n = coefs.length - 1, out = '', first = true;
    for (var i = 0; i <= n; i++) {
      var c = coefs[i], e = n - i;
      if (c === 0) continue;
      out += ML.termTex(c, v, e, first);
      first = false;
    }
    return out || '0';
  };

  ML.polyEval = function (coefs, x) {
    var r = 0;
    for (var i = 0; i < coefs.length; i++) r = r * x + coefs[i];
    return r;
  };
  /** Producto de dos polinomios (mayor a menor grado). */
  ML.polyMul = function (a, b) {
    var r = new Array(a.length + b.length - 1).fill(0);
    for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) r[i + j] += a[i] * b[j];
    return r;
  };
  ML.polyAdd = function (a, b) {
    var n = Math.max(a.length, b.length), r = [];
    for (var i = 0; i < n; i++) {
      var ia = i - (n - a.length), ib = i - (n - b.length);
      r.push((ia >= 0 ? a[ia] : 0) + (ib >= 0 ? b[ib] : 0));
    }
    return r;
  };
  /** Regla de Ruffini: divide por (x - r). Devuelve {q, rest} */
  ML.ruffini = function (coefs, r) {
    var q = [coefs[0]];
    for (var i = 1; i < coefs.length; i++) q.push(coefs[i] + q[i - 1] * r);
    return { q: q.slice(0, -1), rest: q[q.length - 1] };
  };
  /** Raices enteras (divisores del termino independiente, con signo). */
  ML.intRoots = function (coefs) {
    var c0 = coefs[coefs.length - 1], out = [];
    if (c0 === 0) {
      // x = 0 es raiz: se saca factor x y se sigue con el resto.
      var rest = coefs.slice(0, -1);
      while (rest.length && rest[rest.length - 1] === 0) rest = rest.slice(0, -1);
      return [0].concat(rest.length > 1 ? ML.intRoots(rest) : []);
    }
    var ds = ML.divisors(c0);
    for (var i = 0; i < ds.length; i++) {
      if (Math.abs(ML.polyEval(coefs, ds[i])) < 1e-9) out.push(ds[i]);
      if (Math.abs(ML.polyEval(coefs, -ds[i])) < 1e-9) out.push(-ds[i]);
    }
    return out.sort(function (a, b) { return a - b; });
  };

  /** Ecuacion de 2 grado: devuelve {disc, n, x1, x2} */
  ML.quadratic = function (a, b, c) {
    var D = b * b - 4 * a * c;
    if (D > 1e-12) {
      var r = Math.sqrt(D);
      return { disc: D, n: 2, x1: (-b + r) / (2 * a), x2: (-b - r) / (2 * a) };
    }
    if (Math.abs(D) <= 1e-12) return { disc: 0, n: 1, x1: -b / (2 * a), x2: -b / (2 * a) };
    return { disc: D, n: 0, re: -b / (2 * a), im: Math.sqrt(-D) / (2 * a) };
  };

  /** Raiz cuadrada simplificada: 12 -> [2,3] (o sea 2·raiz(3)) */
  ML.simplifySqrt = function (n) {
    if (n < 0 || !Number.isInteger(n)) return [1, n];
    if (n === 0) return [0, 1];
    var out = 1, i = 2;
    while (i * i <= n) { while (n % (i * i) === 0) { n /= i * i; out *= i; } i++; }
    return [out, n];
  };
  ML.sqrtTex = function (n) {
    var s = ML.simplifySqrt(n);
    if (s[1] === 1 || s[0] === 0) return String(s[0]);
    return (s[0] === 1 ? '' : s[0]) + '\\sqrt{' + s[1] + '}';
  };

  /* =========== 4. Matrices y sistemas =========== */

  ML.det2 = function (m) { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; };
  ML.det3 = function (m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
      - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
      + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  };
  ML.matTex = function (m, delim) {
    var d = delim || 'pmatrix';
    return '\\begin{' + d + '}' + m.map(function (row) {
      return row.map(function (v) { return (typeof v === 'number') ? U.fmt(v) : v; }).join(' & ');
    }).join(' \\\\ ') + '\\end{' + d + '}';
  };
  /** Sistema 2x2 por Cramer. Devuelve {type:'unica'|'ninguna'|'infinitas', x, y} */
  ML.solve2 = function (a1, b1, c1, a2, b2, c2) {
    var d = a1 * b2 - a2 * b1;
    if (Math.abs(d) > 1e-12) return { type: 'unica', x: (c1 * b2 - c2 * b1) / d, y: (a1 * c2 - a2 * c1) / d };
    var dx = c1 * b2 - c2 * b1, dy = a1 * c2 - a2 * c1;
    if (Math.abs(dx) < 1e-12 && Math.abs(dy) < 1e-12) return { type: 'infinitas' };
    return { type: 'ninguna' };
  };

  /* =========== 5. Estadistica =========== */

  ML.mean = function (a) { return U.sum(a) / a.length; };
  ML.median = function (a) {
    var s = a.slice().sort(function (x, y) { return x - y; }), n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  };
  ML.mode = function (a) {
    var m = {}, best = [], bc = 0;
    a.forEach(function (v) { m[v] = (m[v] || 0) + 1; });
    for (var k in m) { if (m[k] > bc) { bc = m[k]; best = [Number(k)]; } else if (m[k] === bc) best.push(Number(k)); }
    return best;
  };
  ML.variance = function (a) {
    var m = ML.mean(a), s = 0;
    for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m);
    return s / a.length;
  };
  ML.sd = function (a) { return Math.sqrt(ML.variance(a)); };
  ML.quantile = function (a, p) {
    var s = a.slice().sort(function (x, y) { return x - y; });
    var pos = p * (s.length - 1), lo = Math.floor(pos), hi = Math.ceil(pos);
    return s[lo] + (s[hi] - s[lo]) * (pos - lo);
  };
  ML.cov = function (x, y) {
    var mx = ML.mean(x), my = ML.mean(y), s = 0;
    for (var i = 0; i < x.length; i++) s += (x[i] - mx) * (y[i] - my);
    return s / x.length;
  };
  ML.corr = function (x, y) { return ML.cov(x, y) / (ML.sd(x) * ML.sd(y)); };
  /** Funcion de distribucion normal estandar (Abramowitz-Stegun). */
  ML.normalCdf = function (z) {
    var t = 1 / (1 + 0.2316419 * Math.abs(z));
    var d = 0.3989422804014327 * Math.exp(-z * z / 2);
    var p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return z > 0 ? 1 - p : p;
  };

  /* =========== 6. Evaluador de expresiones =========== */
  /*  Convierte lo que teclea el alumno en un numero.
      Acepta: 3/4   -2,5   2^10   sqrt(2)   pi/6   (x-3)(x+2)   2x+1
      Multiplicacion implicita incluida.                              */

  var CONST = { pi: Math.PI, e: Math.E, phi: (1 + Math.sqrt(5)) / 2, inf: Infinity, infinito: Infinity };
  var FN = {
    sqrt: Math.sqrt, raiz: Math.sqrt, abs: Math.abs, sin: Math.sin, sen: Math.sin,
    cos: Math.cos, tan: Math.tan, tg: Math.tan, asin: Math.asin, acos: Math.acos,
    atan: Math.atan, arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    ln: Math.log, log: function (x) { return Math.log(x) / Math.LN10; },
    log2: function (x) { return Math.log(x) / Math.LN2; },
    exp: Math.exp, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    floor: Math.floor, ceil: Math.ceil, round: Math.round, sign: Math.sign
  };

  function Lexer(src) {
    this.t = []; this.p = 0;
    // Se acepta lo que un alumno escribe de verdad: signos unicode, el
    // simbolo espanol de division, corchetes y raices.
    var s = String(src)
      .replace(/\s+/g, '')
      .replace(/[·×✕]/g, '*')
      .replace(/[÷:]/g, '/')
      .replace(/[−–—]/g, '-')
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'pi')
      .replace(/[\[]/g, '(').replace(/[\]]/g, ')')
      .replace(/\{/g, '(').replace(/\}/g, ')')
      .replace(/²/g, '^2').replace(/³/g, '^3')
      .replace(/,(?![0-9])/g, '');
    var i = 0;
    while (i < s.length) {
      var c = s[i];
      if (/[0-9]/.test(c) || ((c === '.' || c === ',') && /[0-9]/.test(s[i + 1] || ''))) {
        var j = i;
        while (j < s.length && (/[0-9]/.test(s[j]) || ((s[j] === '.' || s[j] === ',') && /[0-9]/.test(s[j + 1] || '')))) j++;
        this.t.push({ k: 'num', v: parseFloat(s.slice(i, j).replace(',', '.')) });
        i = j; continue;
      }
      if (/[a-zA-Z]/.test(c)) {
        // Primero solo letras. Los digitos siguientes solo se pegan al
        // identificador si asi forman una funcion conocida (log2), porque
        // si no "sqrt9" se leeria como un nombre inventado en vez de
        // como la raiz de 9.
        var k = i;
        while (k < s.length && /[a-zA-Z]/.test(s[k])) k++;
        var word = s.slice(i, k).toLowerCase();
        var k2 = k;
        while (k2 < s.length && /[0-9_]/.test(s[k2])) k2++;
        if (k2 > k) {
          var full = s.slice(i, k2).toLowerCase();
          if (FN[full] || CONST[full] !== undefined) { word = full; k = k2; }
        }
        this.t.push({ k: 'id', v: word });
        i = k; continue;
      }
      if ('+-*/^()|%!'.indexOf(c) >= 0) { this.t.push({ k: c }); i++; continue; }
      throw new Error('carácter no válido: ' + c);
    }
  }

  function Parser(src, vars) {
    this.lx = new Lexer(src); this.vars = vars || {};
  }
  Parser.prototype.peek = function () { return this.lx.t[this.lx.p]; };
  Parser.prototype.eat = function (k) {
    var t = this.peek();
    if (t && (t.k === k)) { this.lx.p++; return t; }
    return null;
  };
  Parser.prototype.expr = function () {
    var v = this.term();
    for (;;) {
      if (this.eat('+')) v += this.term();
      else if (this.eat('-')) v -= this.term();
      else return v;
    }
  };
  Parser.prototype.term = function () {
    var v = this.unary();
    for (;;) {
      if (this.eat('*')) v *= this.unary();
      else if (this.eat('/')) v /= this.unary();
      else if (this.eat('%')) v *= 0.01;
      else {
        var t = this.peek();
        // multiplicacion implicita:  2x   3(x+1)   (a)(b)   2pi
        if (t && (t.k === 'num' || t.k === 'id' || t.k === '(')) v *= this.unary();
        else return v;
      }
    }
  };
  Parser.prototype.unary = function () {
    if (this.eat('-')) return -this.unary();
    if (this.eat('+')) return this.unary();
    return this.power();
  };
  Parser.prototype.power = function () {
    var b = this.postfix();
    if (this.eat('^')) return Math.pow(b, this.unary());
    return b;
  };
  /** Factorial escrito detras: 5! = 120 */
  Parser.prototype.postfix = function () {
    var v = this.atom();
    while (this.eat('!')) {
      if (v < 0 || v > 170 || !Number.isInteger(v)) throw new Error('factorial no válido');
      v = ML.factorial(v);
    }
    return v;
  };
  Parser.prototype.atom = function () {
    var t = this.peek();
    if (!t) throw new Error('expresion incompleta');
    if (t.k === 'num') { this.lx.p++; return t.v; }
    if (t.k === '(') {
      this.lx.p++;
      var v = this.expr();
      if (!this.eat(')')) throw new Error('falta un parentesis');
      return v;
    }
    if (t.k === '|') {
      this.lx.p++;
      var w = this.expr();
      if (!this.eat('|')) throw new Error('falta una barra');
      return Math.abs(w);
    }
    if (t.k === 'id') {
      this.lx.p++;
      var name = t.v;
      if (FN[name]) {
        var arg;
        if (this.eat('(')) { arg = this.expr(); if (!this.eat(')')) throw new Error('falta un parentesis'); }
        else arg = this.unary();
        return FN[name](arg);
      }
      if (Object.prototype.hasOwnProperty.call(this.vars, name)) return this.vars[name];
      if (CONST[name] !== undefined) return CONST[name];
      throw new Error('no se que es "' + name + '"');
    }
    throw new Error('no entiendo la respuesta');
  };

  /** Evalua una expresion. Lanza error si no es valida. */
  ML.evalExpr = function (src, vars) {
    var p = new Parser(src, vars);
    var v = p.expr();
    if (p.peek()) throw new Error('sobra algo al final');
    return v;
  };
  /** Version tolerante: devuelve NaN en vez de lanzar. */
  ML.tryEval = function (src, vars) {
    try { var v = ML.evalExpr(src, vars); return (typeof v === 'number') ? v : NaN; }
    catch (e) { return NaN; }
  };
  /** Comprueba si dos expresiones con variables son equivalentes. */
  ML.equivalent = function (a, b, varNames, tol) {
    varNames = varNames || ['x'];
    tol = tol || 1e-6;
    var ok = 0;
    for (var t = 0; t < 12; t++) {
      var vars = {};
      for (var i = 0; i < varNames.length; i++) vars[varNames[i]] = (t % 2 ? 1 : -1) * (0.37 + t * 0.53 + i * 0.11);
      var va = ML.tryEval(a, vars), vb = ML.tryEval(b, vars);
      if (isNaN(va) || isNaN(vb)) continue;
      if (!isFinite(va) || !isFinite(vb)) continue;
      if (Math.abs(va - vb) > tol * (1 + Math.abs(va))) return false;
      ok++;
    }
    return ok >= 4;
  };

  global.ML = ML;
})(window);
