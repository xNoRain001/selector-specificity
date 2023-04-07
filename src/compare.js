import getSpecificity from "./get-specificity"

const compare = (s1, s2) => {
  const res1 = getSpecificity(s1)
  const res2 = getSpecificity(s2)

  return res1 > res2
    ? 1
    : res1 === res2
      ? 0
      : -1
}

export default compare
