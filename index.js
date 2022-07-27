require('dotenv').config()
const cron = require('node-cron')
const { tweet } = require('./utils/twitter')
const { getActivity } = require('./utils/farcaster')

const FARCASTER_USERNAME = process.env.FARCASTER_USERNAME
let previousLastCast = new Date().getTime()

const devEnv = process.env.NODE_ENV === 'development'
const cronSchedule = devEnv ? '*/10 * * * * *' : '*/2 * * * *'

// Check activity every 2 mins (or 10 secs in dev mode)
cron.schedule(cronSchedule, async () => {
  const casts = await getActivity(FARCASTER_USERNAME).then((res) => {
    // Only return 10 recent casts to save bandwidth
    return res.slice(0, 10)
  })

  // Get all parent casts (ignore replies, recasts, deletes)
  const parentCasts = casts.filter((cast) => {
    if (
      cast.body.data.replyParentMerkleRoot ||
      cast.body.data.text.startsWith('recast:') ||
      cast.body.data.text.startsWith('delete:')
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

  if (newCasts.length === 0) return

  const isOptIn = process.env.OPT_IN == 'true'
  const optInMessage = process.env.OPT_IN_MESSAGE
  const sentFromFc = process.env.SENT_FROM_FARCASTER == 'true'

  // Handle new casts
  newCasts.forEach((cast) => {
    let text = cast.body.data.text

    // Ignore @ mentions
    if (text.match(/@[^\s]/g)) {
      return console.log('New cast but it includes a mention -- ignoring')
    }

    // If opt-in is enabled, ignore casts that don't end with the message
    if (isOptIn && !text.endsWith(optInMessage)) {
      return console.log("New cast but it doesn't opt-in -- ignoring")
    }

    // If opt-out is enabled, ignore casts that end with the message
    if (!isOptIn && text.endsWith(optInMessage)) {
      return console.log('New cast but it opts-out -- ignoring')
    }

    if (sentFromFc && text.length < 250) {
      text = `${text}\n\n - Sent from Farcaster`
    }

    tweet(text)
  })

  // Set the previous last cast date
  previousLastCast = lastCast
})
