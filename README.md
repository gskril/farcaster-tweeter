# [Farcaster](https://www.farcaster.xyz/) → Twitter

Automatically publish new casts to Twitter.

Notes:
- This isn't really consumer friendly, but could hopefully be a starting point for somebody to build out an easier integration.
- The script filters out any non-parent casts, meaning threads or other types of replies won't be posted to Twitter.
- By default, new casts are fetched every 5 minutes. This can be changed in the `cron.schedule()` function in `index.js`.

## Twitter API

You'll need to get Twitter API Keys. This means you'll probably need a [Twitter Developer](https://developer.twitter.com/) account (it's free).

Once you create a new app within the Twitter Developer Portal, you'll need a few things: API key and API secret, then your consumer key and consumer secret. The first two keys connect you to your new Twitter app, and the latter two connect your Twitter account.

If you already have a Twitter Developer account but want to relay your Farcaster messages to a different Twitter account, I recommend generating API keys via [twurl](https://github.com/twitter/twurl).

## How To Use

Install project dependencies:
```sh
yarn install
```

Configure the environment variables with your Twitter API keys and Farcaster username:
```sh
cp .env.example .env
```

Start a local server:
```sh
yarn start
```
