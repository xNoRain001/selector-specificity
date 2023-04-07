const sepecificityMap = {
  universal: 0,
  adjacent: 0,
  child: 0,
  sibling: 0,
  descendant: 0,
  'pseudo-element': 1,
  element: 1,
  'pseudo-class': 10,
  attribute: 10,
  class: 10,
  id: 100
}

export default sepecificityMap
