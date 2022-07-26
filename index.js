require('dotenv').config()
const cron = require('node-cron')
const { tweet } = require('./utils/twitter')
const { getActivity } = require('./utils/farcaster')

const FARCASTER_USERNAME = process.env.FARCASTER_USERNAME
let previousLastCast = new Date().getTime()

// Check for new posts 5 minutes
cron.schedule('*/5 * * * *', async () => {
  const casts = await getActivity(FARCASTER_USERNAME).then((res) => {
    // Only return 10 recent casts to save bandwidth
    return res.slice(0, 10)
  })

  // Get all parent casts (ignore replies, recasts, deletes)
  const parentCasts = casts.filter((cast) => {
    if (
      cast.body.data.replyParentMerkleRoot ||
      cast.body.data.text.startsWith('recast:') ||
      cast.body.data.text.startsWith('recast:')
    ) {
      return false
    } else {
      return true
    }
  })

  const lastCast = parentCasts[0].body.publishedAt

  const newCasts = parentCasts.filter((cast) => {
    return cast.body.publishedAt > previousLastCast
  })

  if (newCasts.length === 0) {
    console.log('No new casts')
    return
  }

  // Handle new casts
  console.log(`New casts!`)
  newCasts.forEach((cast) => {
    // Post to Twitter
    tweet(cast.body.data.text)
  })

  // Set the previous last cast date
  previousLastCast = lastCast
})
