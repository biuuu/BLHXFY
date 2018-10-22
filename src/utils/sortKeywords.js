const sortKeywords = (list, key = 'EMPTY') => {
  return list.sort((prev, next) => {
    let valPrev = prev
    let valNext = next
    if (key !== 'EMPTY') {
      valPrev = prev[key]
      valNext = next[key]
    }
    if (valNext && valPrev) {
      if (valNext.length > valPrev.length) {
        return 1
      } else if (valPrev.length > valNext.length) {
        return -1
      }
    }
    return 0
  })
}

export default sortKeywords
