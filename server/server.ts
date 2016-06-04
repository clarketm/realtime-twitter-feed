import express = require('express');
import path = require('path');

var port:number = process.env.PORT || 3000;

var app = express(),
    server = app.listen(port),
    io = require('socket.io')(server),
    Twit = require('twit');


app.use('/app', express.static(path.resolve(__dirname, 'app')));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

var T = new Twit({
        consumer_key: '8hVWeqjGoHvVo75vM5zw9R0gw',
        consumer_secret: 'aqMRR8G5iG4d647A4haurFwChKWHDV8pE9QKB6kl5c8MBS9wAv',
        access_token: '566709281-9RZaLQUI3O91ZXEYXEkpLBafVMNNJLBqk9YCZqep',
        access_token_secret: 'nE9k7sIVn93XkSLZLh28PztTzWATGdInTjB0u6kLqIsUX'
    }),
    streams = new Map();

io.sockets.on('connection', function (socket) {
    console.log('Socket Connected');

    socket.on('disconnect', function () {
        console.log('Socket Disconnected');
    });

    socket.on('search', function (keyword) {
        streams.set(keyword, createStream(keyword));
        console.log(`Twitter stream started => ${keyword}`);
     });

    socket.on('toggle', function (keyword, active) {
        let stream = streams.get(keyword);
        active ? stream.start() : stream.stop();
        console.log(`Stream active state set to ${active} => ${keyword}`);
    });

    socket.on('delete', function (keyword) {
        streams.get(keyword).stop();
        streams.delete(keyword);
        console.log(`Disconnected from twitter stream  =>  ${keyword}`);
        console.log(`Active streams: ${streams.size}`);
    })
});


function createStream(keyword) {
    let stream = T.stream('statuses/filter', {track: keyword});

    stream.on('tweet', function (data) {
        if (data.geo && data.user.profile_image_url_https) {
            io.sockets.emit(new Buffer(keyword).toString('base64'), data);
        }
    });

    return stream;
}
