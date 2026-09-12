/* ===================================================================
   Matebase · mathx.js
   Renderizador ligero de LaTeX -> HTML. Escrito a medida porque el
   proyecto debe funcionar sin internet y sin servidor (nada de CDN).

   Cubre el subconjunto que necesita un curso de ESO/Bachillerato y algo
   mas: fracciones, raices, potencias/subindices, sumatorios, integrales,
   limites, matrices, sistemas, alineados, vectores, simbolos griegos y
   relacionales.

   API:
     MathX.render(tex)      -> string HTML en linea
     MathX.display(tex)     -> string HTML en bloque centrado
     MathX.inline(htmlText) -> sustituye los tramos $...$ de un texto
     MathX.node(tex, disp)  -> elemento DOM
   =================================================================== */
(function (global) {
  'use strict';

  var SYM = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε',
    zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
    lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', rho: 'ρ', varrho: 'ϱ', sigma: 'σ',
    varsigma: 'ς', tau: 'τ', upsilon: 'υ', phi: 'φ', varphi: 'φ', chi: 'χ',
    psi: 'ψ', omega: 'ω', pi: 'π', varpi: 'ϖ',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
    Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
    infty: '∞', partial: '∂', nabla: '∇', emptyset: '∅', varnothing: '∅',
    forall: '∀', exists: '∃', nexists: '∄', neg: '¬', angle: '∠', measuredangle: '∡',
    perp: '⊥', parallel: '∥', triangle: '△', square: '□', degree: '°',
    ldots: '…', dots: '…', cdots: '⋯', vdots: '⋮', ddots: '⋱',
    prime: '′', ell: 'ℓ', hbar: 'ℏ', aleph: 'ℵ', imath: 'ı', jmath: 'ȷ',
    checkmark: '✓', dagger: '†', bullet: '•', therefore: '∴', because: '∵',
    lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉', langle: '⟨', rangle: '⟩',
    lbrace: '{', rbrace: '}', backslash: '\\', vert: '|', Vert: '‖'
  };

  var OPS = {
    cdot: '·', times: '×', div: '÷', pm: '±', mp: '∓', ast: '∗', star: '⋆',
    cup: '∪', cap: '∩', setminus: '∖', oplus: '⊕', ominus: '⊖', otimes: '⊗',
    circ: '∘', wedge: '∧', vee: '∨', land: '∧', lor: '∨', bigcirc: '◯',
    Vert: '‖', parallel: '∥', odot: '⊙', oplus: '⊕', otimes: '⊗'
  };

  var RELS = {
    le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈',
    equiv: '≡', sim: '∼', simeq: '≃', cong: '≅', propto: '∝', ll: '≪', gg: '≫',
    to: '→', rightarrow: '→', longrightarrow: '⟶', leftarrow: '←', longleftarrow: '⟵',
    Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔', leftrightarrow: '↔',
    iff: '⟺', implies: '⟹', mapsto: '↦', nearrow: '↗', searrow: '↘',
    in: '∈', notin: '∉', ni: '∋', subset: '⊂', subseteq: '⊆', supset: '⊃',
    supseteq: '⊇', nsubseteq: '⊄', colon: ':',
    mid: '∣', nmid: '∤', doteq: '≐', asymp: '≍', prec: '≺', succ: '≻',
    smile: '⌣', frown: '⌢',
    Longrightarrow: '⟹', Longleftrightarrow: '⟺', longmapsto: '⟼', uparrow: '↑', downarrow: '↓'
  };

  var BB = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', P: 'ℙ', E: '𝔼', H: 'ℍ' };

  var FUNCS = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'sen', 'tg', 'cotg',
    'arcsin', 'arccos', 'arctan', 'arcsen', 'sinh', 'cosh', 'tanh', 'senh',
    'log', 'ln', 'lg', 'exp', 'max', 'min', 'sup', 'inf', 'mod', 'det', 'dim',
    'ker', 'gcd', 'mcd', 'mcm', 'arg', 'deg', 'rot', 'div'];

  var BIGSTACK = { sum: '∑', prod: '∏', coprod: '∐', bigcup: '⋃', bigcap: '⋂', bigoplus: '⨁' };
  var BIGSIDE = { int: '∫', iint: '∬', iiint: '∭', oint: '∮', oiint: '∯', oiiint: '∰' };

  var MATDELIM = {
    pmatrix: ['(', ')'], bmatrix: ['[', ']'], Bmatrix: ['{', '}'],
    vmatrix: ['|', '|'], Vmatrix: ['‖', '‖'], matrix: ['', ''], array: ['', '']
  };

  /* ------------------------------------------------------------------ */

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }
  function sp(cls, txt) { return '<span class="' + cls + '">' + esc(txt) + '</span>'; }

  function isDigit(c) { return c >= '0' && c <= '9'; }
  function isAlpha(c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'); }

  function skipWs(p) { while (p.i < p.s.length && (p.s[p.i] === ' ' || p.s[p.i] === '\n' || p.s[p.i] === '\t')) p.i++; }

  /** Lee el siguiente grupo en bruto: {..} equilibrado, o un unico token. */
  function group(p) {
    skipWs(p);
    if (p.i >= p.s.length) return '';
    if (p.s[p.i] === '{') {
      var d = 0, st = p.i + 1, i = p.i;
      for (; i < p.s.length; i++) {
        var c = p.s[i];
        if (c === '\\') { i++; continue; }
        if (c === '{') d++;
        else if (c === '}') { d--; if (d === 0) { p.i = i + 1; return p.s.slice(st, i); } }
      }
      p.i = p.s.length; return p.s.slice(st);
    }
    if (p.s[p.i] === '\\') {
      var m = /^\\([a-zA-Z]+|[\s\S])/.exec(p.s.slice(p.i));
      if (m) { p.i += m[0].length; return m[0]; }
    }
    return p.s[p.i++];
  }

  /** Corchete opcional [..] (indice de raiz). */
  function optional(p) {
    skipWs(p);
    if (p.s[p.i] !== '[') return null;
    var j = p.s.indexOf(']', p.i);
    if (j < 0) return null;
    var r = p.s.slice(p.i + 1, j);
    p.i = j + 1;
    return r;
  }

  /* ---------- comandos ---------- */

  function command(p) {
    var m = /^\\([a-zA-Z]+|[\s\S])/.exec(p.s.slice(p.i));
    if (!m) { p.i++; return { h: '' }; }
    p.i += m[0].length;
    var name = m[1];

    switch (name) {
      case 'frac': case 'dfrac': case 'tfrac': case 'cfrac': {
        var a = render(group(p)), b = render(group(p));
        return { h: '<span class="mx-frac"><span class="n">' + a + '</span><span class="d">' + b + '</span></span>' };
      }
      case 'binom': case 'dbinom': {
        var n = render(group(p)), k = render(group(p));
        return {
          h: '<span class="mx-mat" style="--sy:1.9"><span class="b">(</span>' +
            '<span class="mx-frac" style="line-height:1.1"><span class="n">' + n +
            '</span><span class="d" style="border:0">' + k + '</span></span>' +
            '<span class="b">)</span></span>'
        };
      }
      case 'sqrt': {
        var idx = optional(p);
        var c = render(group(p));
        return {
          h: '<span class="mx-sqrt">' + (idx ? '<span class="r">' + render(idx) + '</span>' : '') +
            '<span class="s">√</span><span class="c">' + c + '</span></span>'
        };
      }
      case 'overline': case 'bar':
        return { h: '<span class="mx-ovl">' + render(group(p)) + '</span>' };
      case 'underbrace':
        return { h: '<span style="border-bottom:1.6px solid currentColor;padding-bottom:.1em">' + render(group(p)) + '</span>' };
      case 'overbrace':
        return { h: '<span style="border-top:1.6px solid currentColor;padding-top:.1em">' + render(group(p)) + '</span>' };
      case 'xrightarrow': case 'xleftarrow': {
        var etq = render(group(p));
        return {
          h: '<span class="mx-lim" style="padding:0 .3em"><span class="l" style="font-size:.6em">' + etq +
            '</span><span class="g" style="font-size:1.05em">' + (name === 'xrightarrow' ? '⟶' : '⟵') + '</span></span>'
        };
      }
      /* Una marca pequeña encima de un símbolo: el tipo de indeterminación
         sobre el igual, al aplicar L'Hôpital. Misma pila que \xrightarrow. */
      case 'overset': case 'stackrel': {
        var arriba = render(group(p)), base = render(group(p));
        return {
          h: '<span class="mx-lim" style="padding:0 .15em"><span class="l" style="font-size:.6em">' + arriba +
            '</span><span class="g">' + base + '</span></span>'
        };
      }
      case 'hline': case 'hdashline': case 'noalign':
        return { h: '' };
      case 'underline':
        return { h: '<span style="border-bottom:1.3px solid currentColor">' + render(group(p)) + '</span>' };
      case 'vec':
        return { h: '<span class="mx-vec"><span class="a">→</span>' + render(group(p)) + '</span>' };
      case 'overrightarrow':
        return { h: '<span class="mx-vec"><span class="a">⟶</span>' + render(group(p)) + '</span>' };
      case 'hat': case 'widehat':
        return { h: '<span class="mx-hat"><span class="a">^</span>' + render(group(p)) + '</span>' };
      case 'tilde': case 'widetilde':
        return { h: '<span class="mx-hat"><span class="a">~</span>' + render(group(p)) + '</span>' };
      case 'dot':
        return { h: '<span class="mx-hat"><span class="a">˙</span>' + render(group(p)) + '</span>' };
      case 'ddot':
        return { h: '<span class="mx-hat"><span class="a">¨</span>' + render(group(p)) + '</span>' };
      case 'text': case 'textrm': case 'textnormal': case 'mbox':
        return { h: sp('mx-txt', group(p)) };
      case 'textbf':
        return { h: '<span class="mx-txt" style="font-weight:700">' + esc(group(p)) + '</span>' };
      case 'textit': case 'emph':
        return { h: '<span class="mx-txt" style="font-style:italic">' + esc(group(p)) + '</span>' };
      case 'mathrm': case 'operatorname':
        return { h: sp('mx-fn', group(p)) };
      case 'mathbf': case 'boldsymbol':
        return { h: '<span style="font-weight:700">' + render(group(p)) + '</span>' };
      case 'mathbb': {
        var g = group(p);
        return { h: sp('mx-num', BB[g] || g) };
      }
      case 'mathcal': case 'mathfrak':
        return { h: '<span class="mx-var" style="font-family:var(--serif)">' + render(group(p)) + '</span>' };
      case 'begin': return environment(p, group(p));
      case 'end': { group(p); return { h: '' }; }
      case 'left': return fenced(p);
      case 'right': { readDelim(p); return { h: '' }; }
      case 'big': case 'Big': case 'bigg': case 'Bigg':
      case 'bigl': case 'Bigl': case 'bigr': case 'Bigr':
      case 'middle':
        return { h: sp('mx-par', readDelim(p)) };
      case 'lim': return { h: sp('mx-fn', 'lím'), big: 'lim', raw: 'lím' };
      case 'pmod': return { h: sp('mx-op', ' (mód ') + render(group(p)) + sp('mx-op', ')') };
      case 'bmod': return { h: sp('mx-fn', 'mód') };
      case 'displaystyle': case 'textstyle': case 'limits': case 'nolimits': case 'scriptstyle':
        return { h: '' };
      case 'quad': return { h: '<span style="display:inline-block;width:1em"></span>' };
      case 'qquad': return { h: '<span style="display:inline-block;width:2em"></span>' };
      case ',': return { h: '<span style="display:inline-block;width:.17em"></span>' };
      case ':': case ';': return { h: '<span style="display:inline-block;width:.28em"></span>' };
      case '!': return { h: '<span style="display:inline-block;margin-left:-.14em"></span>' };
      case ' ': return { h: ' ' };
      case '%': case '&': case '#': case '$': case '_': case '{': case '}':
        return { h: sp('mx-num', name) };
      case 'backslash': return { h: sp('mx-op', '\\') };
      case 'Delta': return { h: sp('mx-num', 'Δ') };
    }

    if (BIGSTACK[name]) return { h: '<span style="font-size:1.5em;vertical-align:-.16em">' + BIGSTACK[name] + '</span>', big: 'stack', raw: BIGSTACK[name] };
    if (BIGSIDE[name]) return { h: '<span class="mx-int">' + BIGSIDE[name] + '</span>', big: 'side' };
    if (RELS[name]) return { h: sp('mx-rel', RELS[name]) };
    if (OPS[name]) return { h: sp('mx-op', OPS[name]) };
    if (SYM[name]) return { h: sp('mx-num', SYM[name]) };
    if (FUNCS.indexOf(name) >= 0) return { h: sp('mx-fn', name) };

    return { h: '<span class="mx-err">\\' + esc(name) + '</span>' };
  }

  /* ---------- delimitadores \left ... \right ----------
     Se busca el \right que hace pareja (contando anidamientos), se
     renderiza el interior y solo entonces se sabe si los parentesis
     tienen que crecer (porque dentro hay una fraccion, una matriz...). */

  function readDelim(p) {
    skipWs(p);
    if (p.i >= p.s.length) return '';
    if (p.s[p.i] === '\\') {
      var m = /^\\([a-zA-Z]+|[\s\S])/.exec(p.s.slice(p.i));
      if (!m) { p.i++; return ''; }
      p.i += m[0].length;
      return SYM[m[1]] || m[1];
    }
    return p.s[p.i++];
  }

  function untilRight(p) {
    var depth = 0, start = p.i, i = p.i;
    while (i < p.s.length) {
      if (p.s[i] === '\\') {
        var m = /^\\([a-zA-Z]+)/.exec(p.s.slice(i));
        if (m) {
          if (m[1] === 'left') depth++;
          else if (m[1] === 'right') {
            if (depth === 0) { var inner = p.s.slice(start, i); p.i = i + m[0].length; return inner; }
            depth--;
          }
          i += m[0].length; continue;
        }
        i += 2; continue;
      }
      i++;
    }
    p.i = p.s.length;
    return p.s.slice(start);
  }

  function fenced(p) {
    var open = readDelim(p);
    var inner = untilRight(p);
    var close = readDelim(p);
    var html = render(inner);
    var tall = /mx-frac|mx-mat|mx-big|mx-int|mx-lim|mx-sqrt/.test(html);
    var sy = tall ? 1.95 : 1.2;
    function par(d) {
      if (!d || d === '.') return '';
      return '<span class="mx-par" style="transform:scaleY(' + sy + ')">' + esc(d) + '</span>';
    }
    return { h: par(open) + html + par(close) };
  }

  /* ---------- entornos ---------- */

  function environment(p, env) {
    // \begin{array}{cc} lleva un argumento con la alineacion: se descarta.
    if (env === 'array' || env === 'tabular') group(p);
    var endTag = '\\end{' + env + '}';
    var j = p.s.indexOf(endTag, p.i);
    var body = j < 0 ? p.s.slice(p.i) : p.s.slice(p.i, j);
    p.i = j < 0 ? p.s.length : j + endTag.length;

    var rows = body.split(/\\\\/);
    var cells = [];
    for (var r = 0; r < rows.length; r++) {
      var t = rows[r].trim();
      if (t === '' && r === rows.length - 1) continue;
      cells.push(t.split('&'));
    }

    if (env === 'aligned' || env === 'align' || env === 'align*' || env === 'gathered') {
      var h = '<table class="mx-al">';
      for (var i = 0; i < cells.length; i++) {
        h += '<tr>';
        if (cells[i].length === 1) h += '<td class="r" colspan="2" style="text-align:center">' + render(cells[i][0]) + '</td>';
        else {
          h += '<td class="l">' + render(cells[i][0]) + '</td>';
          h += '<td class="r">' + render(cells[i].slice(1).join('&')) + '</td>';
        }
        h += '</tr>';
      }
      return { h: h + '</table>' };
    }

    var isCases = (env === 'cases');
    var dl = isCases ? ['{', ''] : (MATDELIM[env] || ['', '']);
    var sy = isCases ? Math.max(1.1, cells.length * 0.72) : Math.max(1.4, cells.length * 1.05);
    var out = '<span class="mx-mat' + (isCases ? ' mx-cases' : '') + '" style="--sy:' + sy.toFixed(2) + '">';
    if (dl[0]) out += '<span class="b">' + esc(dl[0]) + '</span>';
    out += '<table>';
    for (var y = 0; y < cells.length; y++) {
      out += '<tr>';
      for (var x = 0; x < cells[y].length; x++) out += '<td>' + render(cells[y][x]) + '</td>';
      out += '</tr>';
    }
    out += '</table>';
    if (dl[1]) out += '<span class="b">' + esc(dl[1]) + '</span>';
    return { h: out + '</span>' };
  }

  /* ---------- atomos sueltos ---------- */

  function atom(p) {
    skipWs(p);
    if (p.i >= p.s.length) return null;
    var c = p.s[p.i];

    if (c === '}') { p.i++; return { h: '' }; }
    if (c === '{') return { h: render(group(p)) };
    if (c === '\\') return command(p);

    if (isDigit(c)) {
      var st = p.i;
      while (p.i < p.s.length && (isDigit(p.s[p.i]) ||
        ((p.s[p.i] === '.' || p.s[p.i] === ',') && isDigit(p.s[p.i + 1] || '')))) p.i++;
      return { h: sp('mx-num', p.s.slice(st, p.i)) };
    }
    p.i++;
    if (isAlpha(c)) {
      // funciones escritas sin barra: sin, cos, log...
      for (var f = 0; f < FUNCS.length; f++) {
        var w = FUNCS[f];
        if (p.s.substr(p.i - 1, w.length) === w && !isAlpha(p.s[p.i - 1 + w.length] || '')) {
          p.i += w.length - 1;
          return { h: sp('mx-fn', w) };
        }
      }
      return { h: sp('mx-var', c) };
    }
    if (c === '=' || c === '<' || c === '>') return { h: sp('mx-rel', c) };
    if (c === '+') return { h: sp('mx-op', '+') };
    if (c === '-') return { h: sp('mx-op', '−') };
    if (c === '*') return { h: sp('mx-op', '·') };
    if (c === '/') return { h: sp('mx-op', '/') };
    if (c === "'") return { h: '<sup>′</sup>' };
    if (c === '~') return { h: ' ' };
    return { h: sp('mx-num', c) };
  }

  /* ---------- secuencia con super/subindices ---------- */

  function scripts(p, a) {
    var sup = null, sub = null;
    for (;;) {
      skipWs(p);
      var c = p.s[p.i];
      if (c === '^') { p.i++; sup = (sup || '') + render(group(p)); }
      else if (c === '_') { p.i++; sub = (sub || '') + render(group(p)); }
      else if (c === "'") { p.i++; sup = (sup || '') + '′'; }
      else break;
    }
    if (sup === null && sub === null) return a.h;

    if (a.big === 'stack') {
      return '<span class="mx-big">' + (sup ? '<span class="u">' + sup + '</span>' : '') +
        '<span class="g">' + a.raw + '</span>' +
        (sub ? '<span class="l">' + sub + '</span>' : '') + '</span>';
    }
    if (a.big === 'lim') {
      return '<span class="mx-lim"><span class="g">lim</span>' +
        (sub ? '<span class="l">' + sub + '</span>' : '') + '</span>' +
        (sup ? '<sup>' + sup + '</sup>' : '');
    }
    if (sub !== null && sup !== null) {
      return a.h + '<span class="mx-sup2"><span style="margin-bottom:.15em">' + sup +
        '</span><span>' + sub + '</span></span>';
    }
    return a.h + (sub !== null ? '<sub>' + sub + '</sub>' : '') + (sup !== null ? '<sup>' + sup + '</sup>' : '');
  }

  function render(src) {
    if (src === null || src === undefined) return '';
    var p = { s: String(src), i: 0 }, out = '';
    var guard = 0;
    while (p.i < p.s.length && guard++ < 20000) {
      var before = p.i;
      var a = atom(p);
      if (a === null) break;
      out += scripts(p, a);
      if (p.i === before) p.i++;
    }
    return out;
  }

  /* ---------- API publica ---------- */

  var MathX = {};

  MathX.render = function (tex) {
    return '<span class="mx">' + render(tex) + '</span>';
  };
  MathX.display = function (tex) {
    return '<span class="mx mx-display">' + render(tex) + '</span>';
  };
  /** Sustituye los tramos $...$ dentro de un texto que puede llevar HTML. */
  MathX.inline = function (s) {
    if (s === null || s === undefined) return '';
    /* Los enlaces entre capitulos se resuelven aqui porque este es el embudo
       por el que pasa toda la prosa del curso: parrafos, notas, pistas, pasos
       de una solucion y marcadores. Un solo sitio, y funcionan en todos. */
    if (window.U && U.enlaces) s = U.enlaces(s);
    s = String(s);
    if (s.indexOf('$') < 0) return s;
    var parts = s.split('$'), out = '';
    for (var i = 0; i < parts.length; i++) {
      out += (i % 2 === 0) ? parts[i] : MathX.render(parts[i]);
    }
    return out;
  };
  MathX.node = function (tex, display) {
    var n = document.createElement('span');
    n.innerHTML = display ? MathX.display(tex) : MathX.render(tex);
    return n.firstChild;
  };

  global.MathX = MathX;
  /** Atajo global muy usado en los temas. */
  global.M = MathX.render;
  global.MD = MathX.display;
})(window);
