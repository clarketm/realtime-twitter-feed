import express = require('express');
import path = require('path');
import dotenv = require('dotenv');
import IO = require('socket.io');
import Twit = require('twit');

// configure environment variables
dotenv.config();

var port:number = process.env.PORT,
    app = express(),
    server = app.listen(port, () =>  console.log(`Listening on port ${port}`)),
    io = IO(server);

app.use('/app', express.static(path.resolve(__dirname, 'app')));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

var T = new Twit({
        consumer_key: '8hVWeqjGoHvVo75vM5zw9R0gw',
        consumer_secret: 'aqMRR8G5iG4d647A4haurFwChKWHDV8pE9QKB6kl5c8MBS9wAv',
        access_token: '566709281-1OywZG64RfARHGIHvjmrMR9gsMlYthcmK8Vz4vUL',
        access_token_secret: 'nNWAgKCdFmNF2eXynnj8PTyrEulwyzJdJnhLWqAr4L5XL'
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
