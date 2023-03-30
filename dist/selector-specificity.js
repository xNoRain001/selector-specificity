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
    .replace(/([[=~>+])\s/g, function (_, $1) {
      return $1;
    })
    // div>span .foo+.bar.baz~.qux a[quux=corge]
    .replace(/\s([=\]~>+])/g, function (_, $1) {
      return $1;
    });
    var nodeStrategies = {
      '.': function _(value) {
        return {
          type: 'class',
          value: value,
          specificity: 10
        };
      },
      ':': function _(value) {
        // TODO: :not ::first-line
        return {
          type: 'pseudo-class',
          value: value,
          specificity: 10
        };
      },
      '[': function _(pair) {
        var _pair$slice$split = pair.slice(0, -1).split('='),
          _pair$slice$split2 = _slicedToArray(_pair$slice$split, 2),
          attr = _pair$slice$split2[0],
          value = _pair$slice$split2[1];
        return {
          type: 'attribute',
          attr: attr,
          value: value,
          specificity: 10
        };
      },
      '#': function _(value) {
        return {
          type: 'id',
          value: value,
          specificity: 100
        };
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
    var getSelectorValue = function getSelectorValue(s, isElm, isPseudoClass) {
      var value = '';
      var startIndex = isElm ? 0 : 1;
      for (var i = startIndex, l = s.length; i < l; i++) {
        if (/[:*.>+~\s\[]/.test(s[i])) {
          value = s.slice(startIndex, i);
          break;
        }
      }
      return value || s.slice(startIndex);
    };
    var nodes = [];
    while (s) {
      var prefix = s[0];
      if (/[*>+~\s]/.test(prefix)) {
        nodes.push(nodeStrategies[prefix]());
        s = s.slice(1);
      } else {
        var strategy = nodeStrategies[prefix];
        var isElm = /[.:#\[]/.test(prefix) ? false : true;
        var value = getSelectorValue(s, isElm);
        if (strategy) {
          nodes.push(strategy(value));
        } else {
          nodes.push({
            type: 'element',
            value: value,
            specificity: 1
          });
        }
        s = s.slice(value.length + (isElm ? 0 : 1));
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
  var specificity = {
    getNodes: getNodes,
    getSpecificity: getSpecificity
  };

  return specificity;

}));
