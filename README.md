## Installation

```
npm install selector-specificity
```

## Usage

```js
// CommonJS
const specificity = require('selector-specificity')
```

```js
// ESModule
import specificity from 'selector-specificity'
```

```js
const s = 'div:nth-of-type(2n) > span .foo + .bar.baz ~ .qux a[quux=corge]:not(.grault)'

specificity.getNodes(s)
// [
//   { type: "element", name: "div", specificity: 1 },
//   { 
//     type: "pseudo-class", 
//     name: "nth-of-type", 
//     specificity: 10, 
//     value: "2n" 
//   }, 
//   { type: "child" }, 
//   { type: "element", name: "span", specificity: 1 }, 
//   { type: "descendant" }, 
//   { type: "class", name: "foo", specificity: 10 }, 
//   { type: "adjacent" }, 
//   { type: "class", name: "bar", specificity: 10 }, 
//   { type: "class", name: "baz", specificity: 10 }, 
//   { type: "sibling" }, 
//   { type: "class", name: "qux", specificity: 10 }, 
//   { type: "descendant" }, 
//   { type: "element", name: "a", specificity: 1 }, 
//   { type: "attribute", name: "quux", value: "corge", specificity: 10 }, 
//   { 
//     type: "pseudo-class", 
//     name: "not", specificity: 10, 
//     "innerNodes": [{ type: "class", name: "grault" }] 
//   }
// ]

specificity.getSpecificity(s) // -> 73
```
