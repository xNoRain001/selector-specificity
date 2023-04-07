const { 
  compare, 
  getNodes, 
  getSpecificity 
} = require('../dist/selector-specificity')

test('test getNodes', () => {
  const t = {
    ',': [{ type: 'combine' }]
  }

  for (const key in t) {
    expect(getNodes(key)).toStrictEqual(t[key])
  }
})

test('test getSpecificity', () => {
  const t = {
    '*': 0,
    ',': 0,
    '>': 0,
    '+': 0,
    '~': 0,
    ' ': 0,
    div: 1,
    '::before': 1,
    '.bar': 10,
    ':first-of-type': 10,
    '[name="username"]': 10,
    'div:nth-of-type(2n)': 11,
    'div:not(:first-of-type)': 11,
    '#foo': 100,
    'div:not(:first-of-type, #foo)': 101
  }

  for (const key in t) {
    expect(getSpecificity(key)).toBe(t[key])
  }
})

test('test compare', () => {
  expect(compare('#foo', 'div')).toBe(1)
  expect(compare('div', 'span')).toBe(0)
  expect(compare('div', '#foo')).toBe(-1)
})
