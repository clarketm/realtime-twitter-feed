import express = require('express');
import path = require('path');

var port:number = process.env.PORT || 3000;
var app = express(),
    Twit = require('twit');

app.use('/app', express.static(path.resolve(__dirname, 'app')));
app.use('/libs', express.static(path.resolve(__dirname, 'libs')));
app.use('/css', express.static(path.resolve(__dirname, 'css')));
app.use('/img', express.static(path.resolve(__dirname, 'img')));

var renderIndex = (req:express.Request, res:express.Response) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
};

app.get('/*', renderIndex);

//var watchList = ['love', 'hate'];
//var T = new Twit({
//    consumer_key: '8hVWeqjGoHvVo75vM5zw9R0gw',
//    consumer_secret: 'aqMRR8G5iG4d647A4haurFwChKWHDV8pE9QKB6kl5c8MBS9wAv',
//    access_token: '566709281-9RZaLQUI3O91ZXEYXEkpLBafVMNNJLBqk9YCZqep',
//    access_token_secret: 'nE9k7sIVn93XkSLZLh28PztTzWATGdInTjB0u6kLqIsUX'
//});
//
//var stream = T.stream('statuses/filter', {track: watchList});
//
//stream.on('tweet', function (tweet) {
//    console.log(tweet)
//});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('This express app is listening on port:' + port);
});