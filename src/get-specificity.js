import getNodes from "./get-nodes"

const getSpecificity = s => {
  let res = 0
  const nodes = getNodes(s)

  for (let i = 0, l = nodes.length; i < l; i++) {
    res += nodes[i].specificity || 0
  }

  return res
}

export default getSpecificity
