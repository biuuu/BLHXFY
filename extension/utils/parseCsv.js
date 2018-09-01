import CSV from 'papaparse'

const parseCsv = (str) => {
  try {
    return CSV.parse(str.replace(/^\ufeff/, ''), { header: true }).data
  } catch (err) {
    console.error(err)
    return {}
  }
}

export default parseCsv