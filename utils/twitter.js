const Twit = require('twit')

const T = new Twit({
  consumer_key: process.env['CONSUMER_KEY'],
  consumer_secret: process.env['CONSUMER_SECRET'],
  access_token: process.env['ACCESS_TOKEN'],
  access_token_secret: process.env['ACCESS_TOKEN_SECRET'],
})

// Verify valid credentials
T.get('account/verify_credentials')
  .then((res) => {
    console.log('Successfully logged into Twitter @' + res.data.screen_name)
  })
  .catch((err) => {
    console.log('Could not connect to Twitter.', err.allErrors[0].message)
    process.exit(0)
  })

function tweet(text) {
  T.post('statuses/update', { status: text })
    .then((res) => {
      const data = res.data
      console.log(
        `Tweet sent: https://twitter.com/${data.user.screen_name}/status/${data.id_str}`
      )
    })
    .catch((err) => console.log('Error sending tweet', err))
}

module.exports = { tweet }
