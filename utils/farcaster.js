const got = require('got')
const { providers, Contract, utils } = require('ethers')

const provider = new providers.AlchemyProvider(
  'rinkeby',
  process.env.ALCHEMY_SECRET // optional but recommended
)

const contract = new Contract(
  '0xe3Be01D99bAa8dB9905b33a3cA391238234B79D1',
  require('./abi.json'),
  provider
)

async function getActivity(username) {
  const directoryUrl = await getDirectoryUrl(username)
  const activityUrl = await getActivityUrl(directoryUrl)

  const activity = await got(activityUrl)
    .json()
    .catch(() => {
      console.log('Error getting activity')
      return null
    })

  return activity
}

async function getActivityUrl(directoryUrl) {
  return await got(directoryUrl)
    .json()
    .then((res) => res.body.addressActivityUrl)
    .catch(() => null)
}

async function getDirectoryUrl(username) {
  const byets32Username = utils.formatBytes32String(username)

  const userDirectory = await contract
    .usernameToUrl(byets32Username)
    .then((res) => res.url)
    .catch(() => null)

  return userDirectory
}

module.exports = { getActivity }
