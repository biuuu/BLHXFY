const sortKeywords = (list, key = 'EMPTY') => {
  return list.sort((prev, next) => {
    let valPrev = prev
    let valNext = next
    if (key !== 'EMPTY') {
      valPrev = prev[key]
      valNext = next[key]
    }
    if (valNext && valPrev) {
      if (valNext.includes(valPrev)) {
        return 1
      } else if (valPrev.includes(valNext)) {
        return -1
      }
    }
    return 0
  })
}

export default sortKeywords
