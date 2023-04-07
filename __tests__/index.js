const { compare, getSpecificity } = require('../dist/selector-specificity')

test('test getSpecificity', () => {
  const t = {
    '*': 0,
    '>': 0,
    '+': 0,
    '~': 0,
    ' ': 0,
    div: 1,
    '::before': 1,
    ':first-of-type': 10,
    '[name="username"]': 10,
    '.bar': 10,
    '#foo': 100,
    'div:nth-of-type(2n)': 11,
    'div:not(:first-of-type)': 11,
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
