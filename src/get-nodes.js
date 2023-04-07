const getNodes = s => {
  // div> span .foo  +   .bar.baz   ~  .qux a[ quux  = corge   ]
  s = s
        // div> span .foo + .bar.baz ~ .qux a[ quux= corge ]
        .replace(/\s{2,}/g, () => ' ')
        // div>span .foo +.bar.baz ~.qux a[quux=corge ]
        .replace(/([,[=~>+])\s/g, (_, $1) => $1)
        // div>span .foo+.bar.baz~.qux a[quux=corge]
        .replace(/\s([,=\[\]~>+])/g, (_, $1) => $1)

  const nodeStrategies = {
    '.': (name) => ({
      type: 'class',
      name,
      specificity: 10
    }),

    ':': (exp) => {
      if (exp[0] === ':') {
        return {
          type: 'pseudo-element',
          name: exp.slice(1),
          specificity: 1
        }
      }

      const firstBracketIndex = exp.indexOf('(')
      const name = firstBracketIndex === -1
        ? exp
        : exp.slice(0, firstBracketIndex)
      const isNegationPseudoClass = name === 'not'
      let specificity = isNegationPseudoClass ? 0 : 10
      const node = {
        type: 'pseudo-class',
        name,
        specificity
      }

      if (firstBracketIndex !== -1) {
        const segments = exp.slice(name.length + 1, -1).split(',')
      
        if (/^not|is|where$/.test(name)) {
          const innerNodes = node.innerNodes = []
          for (let i = 0, l = segments.length; i < l; i++) {
            const _innerNodes = getNodes(segments[i])
            Array.prototype.push.apply(innerNodes, _innerNodes)

            for (let i = 0, l = _innerNodes.length; i < l; i++) {
              const innerNode = _innerNodes[i]

              if (isNegationPseudoClass) {
                specificity = Math.max(specificity, innerNode.specificity)
              } 

              delete innerNode.specificity
            }
    
            node.specificity = specificity
          }
        } else {
          node.value = segments[0]
        }
      }
      
      return node
    },

    '[': (pair) => {
      const [name, value] = pair.slice(0, -1).split('=')

      return {
        type: 'attribute',
        name,
        value,
        specificity: 10
      }
    },

    '#': (name) => ({
      type: 'id',
      name,
      specificity: 100
    }),

    ',': () => '',

    '*': () => ({ type: 'universal'} ),

    '+': () => ({ type: 'adjacent' }),

    '>': () => ({ type: 'child' }),

    '~': () => ({ type: 'sibling' }),

    ' ': () => ({ type: 'descendant' }),
  }

  const getSelectorname = (s, isPseudoClass) => {
    if (isPseudoClass) {
      // pseudo element
      if (s[0] === ':') {
        return `:${ getSelectorname(s.slice(1), false) }`
      }

      const firstBracketIndex = s.indexOf('(')

      // :first-of-type...
      if (firstBracketIndex === -1) {
        return getSelectorname(s, false)
      }

      // :not()...
      let counter = 1
      let lastBracketIndex = 0

      for (let i = firstBracketIndex + 1, l = s.length; i < l; i++) {
        if (s[i] === '(') {
          counter++
        } else if (s[i] === ')') {
          counter--
        } 
        
        if (counter === 0) {
          lastBracketIndex = i

          break
        }
      }
    
      return s.slice(0, lastBracketIndex + 1)
    }

    let name = ''
    const regexp = /[,:*.>+~\s\[]/

    for (let i = 0, l = s.length; i < l; i++) {
      if (regexp.test(s[i])) {
        name = s.slice(0, i)

        break
      }
    }


    return name || s.slice(0)
  }

  const nodes = []

  while (s) {
    const prefix = s[0]

    if (/[,*>+~\s]/.test(prefix)) {
      const node = nodeStrategies[prefix]()
      node && nodes.push(node)
      s = s.slice(1)
    } else {
      const strategy = nodeStrategies[prefix]
      const isElm = /[.:#\[]/.test(prefix) ? false : true

      s = s.slice(isElm ? 0 : 1)

      const isPseudoClass = prefix === ':'
      const name = getSelectorname(s, isPseudoClass)

      if (strategy) {
        const node = strategy(name)
        nodes.push(node)
      } else {
        nodes.push({
          type: 'element',
          name,
          specificity: 1
        })
      }

      s = s.slice(name.length)
    }
  }

  return nodes
}

export default getNodes
