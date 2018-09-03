import CSV from 'comma-separated-values'

const parseCsv = (str) => {
  try {
    return CSV.parse(str.replace(/^\ufeff/, ''), { header: true })
  } catch (err) {
    console.error(err)
    return {}
  }
}

export default parseCsv
