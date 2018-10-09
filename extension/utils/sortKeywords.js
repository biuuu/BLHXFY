const sortKeywords = (list, key = 'name') => {
  return list.sort((prev, next) => {
    if (next[key] && prev[key]) {
      if (next[key].includes(prev[key])) {
        return 1
      } else if (prev[key].includes(next[key])) {
        return -1
      }
    }
    return 0
  })
}

export default sortKeywords
