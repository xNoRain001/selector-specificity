(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.specificity = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var getNodes = function getNodes(s) {
    // div> span .foo  +   .bar.baz   ~  .qux a[ quux  = corge   ]
    s = s
    // div> span .foo + .bar.baz ~ .qux a[ quux= corge ]
    .replace(/\s{2,}/g, function () {
      return ' ';
    })
    // div>span .foo +.bar.baz ~.qux a[quux=corge ]
    .replace(/([,[=~>+])\s/g, function (_, $1) {
      return $1;
    })
    // div>span .foo+.bar.baz~.qux a[quux=corge]
    .replace(/\s([,=\[\]~>+])/g, function (_, $1) {
      return $1;
    });
    var nodeStrategies = {
      '.': function _(name) {
        return {
          type: 'class',
          name: name,
          specificity: 10
        };
      },
      ':': function _(exp) {
        if (exp[0] === ':') {
          return {
            type: 'pseudo-element',
            name: exp.slice(1),
            specificity: 1
          };
        }
        var firstBracketIndex = exp.indexOf('(');
        var name = firstBracketIndex === -1 ? exp : exp.slice(0, firstBracketIndex);
        var isNegationPseudoClass = name === 'not';
        var specificity = isNegationPseudoClass ? 0 : 10;
        var node = {
          type: 'pseudo-class',
          name: name,
          specificity: specificity
        };
        if (firstBracketIndex !== -1) {
          var segments = exp.slice(name.length + 1, -1).split(',');
          if (/^not|is|where$/.test(name)) {
            var innerNodes = node.innerNodes = [];
            for (var i = 0, l = segments.length; i < l; i++) {
              var _innerNodes = getNodes(segments[i]);
              Array.prototype.push.apply(innerNodes, _innerNodes);
              for (var _i = 0, _l = _innerNodes.length; _i < _l; _i++) {
                var innerNode = _innerNodes[_i];
                if (isNegationPseudoClass) {
                  specificity = Math.max(specificity, innerNode.specificity);
                }
                delete innerNode.specificity;
              }
              node.specificity = specificity;
            }
          } else {
            node.value = segments[0];
          }
        }
        return node;
      },
      '[': function _(pair) {
        var _pair$slice$split = pair.slice(0, -1).split('='),
          _pair$slice$split2 = _slicedToArray(_pair$slice$split, 2),
          name = _pair$slice$split2[0],
          value = _pair$slice$split2[1];
        return {
          type: 'attribute',
          name: name,
          value: value,
          specificity: 10
        };
      },
      '#': function _(name) {
        return {
          type: 'id',
          name: name,
          specificity: 100
        };
      },
      ',': function _() {
        return '';
      },
      '*': function _() {
        return {
          type: 'universal'
        };
      },
      '+': function _() {
        return {
          type: 'adjacent'
        };
      },
      '>': function _() {
        return {
          type: 'child'
        };
      },
      '~': function _() {
        return {
          type: 'sibling'
        };
      },
      ' ': function _() {
        return {
          type: 'descendant'
        };
      }
    };
    var getSelectorname = function getSelectorname(s, isPseudoClass) {
      if (isPseudoClass) {
        // pseudo element
        if (s[0] === ':') {
          return ":".concat(getSelectorname(s.slice(1), false));
        }
        var firstBracketIndex = s.indexOf('(');

        // :first-of-type...
        if (firstBracketIndex === -1) {
          return getSelectorname(s, false);
        }

        // :not()...
        var counter = 1;
        var lastBracketIndex = 0;
        for (var i = firstBracketIndex + 1, l = s.length; i < l; i++) {
          if (s[i] === '(') {
            counter++;
          } else if (s[i] === ')') {
            counter--;
          }
          if (counter === 0) {
            lastBracketIndex = i;
            break;
          }
        }
        return s.slice(0, lastBracketIndex + 1);
      }
      var name = '';
      var regexp = /[,:*.>+~\s\[]/;
      for (var _i2 = 0, _l2 = s.length; _i2 < _l2; _i2++) {
        if (regexp.test(s[_i2])) {
          name = s.slice(0, _i2);
          break;
        }
      }
      return name || s.slice(0);
    };
    var nodes = [];
    while (s) {
      var prefix = s[0];
      if (/[,*>+~\s]/.test(prefix)) {
        var node = nodeStrategies[prefix]();
        node && nodes.push(node);
        s = s.slice(1);
      } else {
        var strategy = nodeStrategies[prefix];
        var isElm = /[.:#\[]/.test(prefix) ? false : true;
        s = s.slice(isElm ? 0 : 1);
        var isPseudoClass = prefix === ':';
        var name = getSelectorname(s, isPseudoClass);
        if (strategy) {
          var _node = strategy(name);
          nodes.push(_node);
        } else {
          nodes.push({
            type: 'element',
            name: name,
            specificity: 1
          });
        }
        s = s.slice(name.length);
      }
    }
    return nodes;
  };
  var getSpecificity = function getSpecificity(s) {
    var res = 0;
    var nodes = getNodes(s);
    for (var i = 0, l = nodes.length; i < l; i++) {
      res += nodes[i].specificity || 0;
    }
    return res;
  };
  var compare = function compare(s1, s2) {
    var res1 = getSpecificity(s1);
    var res2 = getSpecificity(s2);
    return res1 > res2 ? 1 : res1 === res2 ? 0 : -1;
  };
  var specificity = {
    compare: compare,
    getNodes: getNodes,
    getSpecificity: getSpecificity
  };

  return specificity;

}));
