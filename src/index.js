const getNodes = s => {
  // div> span .foo  +   .bar.baz   ~  .qux a[ quux  = corge   ]
  s = s
        // div> span .foo + .bar.baz ~ .qux a[ quux= corge ]
        .replace(/\s{2,}/g, () => ' ')
        // div>span .foo +.bar.baz ~.qux a[quux=corge ]
        .replace(/([[=~>+])\s/g, (_, $1) => $1)
        // div>span .foo+.bar.baz~.qux a[quux=corge]
        .replace(/\s([=\]~>+])/g, (_, $1) => $1)

  const nodeStrategies = {
    '.': (value) => ({
      type: 'class',
      value,
      specificity: 10
    }),

    ':': (value) => {
      // TODO: :not ::first-line
      return {
        type: 'pseudo-class',
        value,
        specificity: 10
      }
    },

    '[': (pair) => {
      const [attr, value] = pair.slice(0, -1).split('=')

      return {
        type: 'attribute',
        attr,
        value,
        specificity: 10
      }
    },

    '#': (value) => ({
      type: 'id',
      value,
      specificity: 100
    }),

    '*': () => ({ type: 'universal'} ),

    '+': () => ({ type: 'adjacent' }),

    '>': () => ({ type: 'child' }),

    '~': () => ({ type: 'sibling' }),

    ' ': () => ({ type: 'descendant' }),
  }

  const getSelectorValue = (s, isElm, isPseudoClass) => {
    let value = ''
    const startIndex = isElm ? 0 : 1

    for (let i = startIndex, l = s.length; i < l; i++) {
      if (/[:*.>+~\s\[]/.test(s[i])) {
        value = s.slice(startIndex, i)
        
        break
      }
    }

    return value || s.slice(startIndex)
  }

  const nodes = []

  while (s) {
    const prefix = s[0]
    
    if (/[*>+~\s]/.test(prefix)) {
      nodes.push(nodeStrategies[prefix]())
      s = s.slice(1)
    } else {
      const strategy = nodeStrategies[prefix]
      const isElm = /[.:#\[]/.test(prefix) ? false : true
      const isPseudoClass = prefix === ':'
      const value = getSelectorValue(s, isElm, isPseudoClass)

      if (strategy) {
        nodes.push(strategy(value) )
      } else {
        nodes.push({
          type: 'element',
          value,
          specificity: 1
        })
      }

      s = s.slice(value.length + (isElm ? 0 : 1))
    }
  }

  return nodes
}

const getSpecificity = s => {
  let res = 0
  const nodes = getNodes(s)

  for (let i = 0, l = nodes.length; i < l; i++) {
    res += nodes[i].specificity || 0
  }

  return res
}

const specificity = {
  getNodes,
  getSpecificity
}

export default specificity
  