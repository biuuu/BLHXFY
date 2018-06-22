const { reCollectSkill } = require('../store/skillMap')
const { reCollectScenario } = require('../store/scenarioState')
const { reCollectFiles } = require('../store/staticMap')
const { getData, readNoun, readMsg } = require('../store/nameMap')

module.exports = () => {
  getData('en')
  getData('jp')
  readNoun()
  readMsg()
  reCollectScenario()
  reCollectFiles()
  reCollectSkill()
}
