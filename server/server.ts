import express = require('express');
import path = require('path');

var port:number = process.env.PORT || 3000;
var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    Twit = require('twit');

//server.listen(8080);

app.use('/app', express.static(path.resolve(__dirname, 'app')));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

var watchList = ['love', 'hate'];
var T = new Twit({
    consumer_key: '8hVWeqjGoHvVo75vM5zw9R0gw',
    consumer_secret: 'aqMRR8G5iG4d647A4haurFwChKWHDV8pE9QKB6kl5c8MBS9wAv',
    access_token: '566709281-9RZaLQUI3O91ZXEYXEkpLBafVMNNJLBqk9YCZqep',
    access_token_secret: 'nE9k7sIVn93XkSLZLh28PztTzWATGdInTjB0u6kLqIsUX'
});

//io.sockets.on('connection', function (socket) {
//    console.log('Connected');
//
//    var stream = T.stream('statuses/filter', {track: watchList});
//
//    stream.on('tweet', function (tweet) {
//        io.sockets.emit('stream', tweet.text);
//    });
//});

var server = app.listen(port, function () {
    console.log(`Express is listening on Port: ${server.address().port}`);
});