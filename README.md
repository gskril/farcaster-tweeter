# [Farcaster](https://www.farcaster.xyz/) → Twitter

Automatically publish new casts to Twitter.

Notes:
- This isn't really consumer friendly, but could hopefully be a starting point for somebody to build out an easier integration.
- The script filters out any non-parent casts, meaning threads or other types of replies won't be posted to Twitter.
- By default, new casts are fetched every 2 minutes. This can be changed in the `cron.schedule()` function in `index.js`.
- Any casts with an @ mention is ignored, since most Farcaster usernames are different from Twitter usernames.

## Twitter API

You'll need to get Twitter API Keys. This means you'll probably need a [Twitter Developer](https://developer.twitter.com/) account (it's free).

Once you create a new app within the Twitter Developer Portal, you'll need a few things: API key and API secret, then your consumer key and consumer secret. The first two keys connect you to your new Twitter app, and the latter two connect your Twitter account.

If you already have a Twitter Developer account but want to relay your Farcaster messages to a different Twitter account, I recommend generating API keys via [twurl](https://github.com/twitter/twurl).

## How To Use

Install project dependencies:
```sh
yarn install
```

Configure the environment variables (see the configuration section below):
```sh
cp .env.example .env
```

Start a local server:
```sh
yarn start
```

## Configuration

Most of the environment variables in `.env.example` are self explanatory, but the following are slightly more confusing:

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| OPT_IN | boolean | false | If true, your cast will only be posted to Twitter if it ends with OPT_IN_MESSAGE. If false, casts will always be posted to Twitter unless they end with OPT_IN_MESSAGE. |
| OPT_IN_MESSAGE | string | "-t" | End your cast with this to trigger opt-in or out to casts, based on the above variable. |
| SENT_FROM_FARCASTER | boolean | false | If your cast is less than 250 characters, "- Sent from Farcaster" will be appended to the end of your tweet. |