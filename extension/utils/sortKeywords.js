const sortKeywords = (list, key = 'name') => {
  return list.sort((prev, next) => {
    if (!next[key] || !prev[key] || next[key] === prev[key]) {
      return 0
    } else if (next[key].includes(prev[key])) {
      return 1
    } else {
      return -1
    }
  })
}

export default sortKeywords
