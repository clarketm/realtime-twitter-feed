# Realtime Twitter Feed
> using Angular2, Twitter, Google Maps, Express, and Socket.io

<br>

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/clarketm/realtime-twitter-feed.git)
### Checkout the [demo](http://app.travismclarke.com/)!
<br>

## Get started

**1)** Create a new [Twitter application](https://apps.twitter.com/) and a new [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key). 

**2)** Next, add your twitter API key and access token to the `server/server.ts` file:

```js
consumer_key: 'CONSUMER_KEY',
consumer_secret: 'CONSUMER_SECRET',
access_token: 'ACCESS_TOKEN',
access_token_secret: 'ACCESS_TOKEN_SECRET'
```
and your Google Maps browser key to the `client/index.html` file:

```html
<script src='//maps.googleapis.com/maps/api/js?key=API_KEY&libraries=visualization'></script>
```

**3)** Install the project dependencies with:

```bash
$ npm install
```

this will also trigger the build on `postinstall`. To run the build manually, simply run:

```bash
$ gulp    
```

**4)** Lastly, run the application using the node server:

```shell
$ node dist/server.js

# or

$ npm start
```

5) Open your application! It will be running on [localhost:3000](http://localhost:3000/)
> the server *port* can be configured in the `.env` file

<br>
## Credits
This project was inspired by the following projects/posts:

* __Angular2 TypeScript Gulp and ExpressJS__ *Maximilian Alexander*
* __Angular2 and Pusher__ *pusher-community*

