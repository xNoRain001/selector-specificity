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
const s = 'div> span .foo  +   .bar.baz  ~   .qux a[ quux  = corge   ]'

specificity.getNodes(s)
// [
//   { type: 'element', value: 'div', specificity: 1 },
//   { type: 'child' },
//   { type: 'element', value: 'span', specificity: 1 },
//   { type: 'descendant' },
//   { type: 'class', value: 'foo', specificity: 10 },
//   { type: 'adjacent' },
//   { type: 'class', value: 'bar', specificity: 10 },
//   { type: 'class', value: 'baz', specificity: 10 },
//   { type: 'sibling' },
//   { type: 'class', value: 'qux', specificity: 10 },
//   { type: 'descendant' },
//   { type: 'element', value: 'a', specificity: 1 },
//   { type: 'attribute', attr: 'quux', value: 'corge', specificity: 10 }
// ]

specificity.getSpecificity(s) // -> 53
```
