import express = require('express');
import path = require('path');
import request = require('request');
import dotenv = require('dotenv');
import IO = require('socket.io');
import Twit = require('twit');

// configure environment variables
dotenv.config();

var port: number = process.env.PORT,
    app = express(),
    server = app.listen(port, () => console.log(`Listening on port ${port}`)),
    io = IO(server);

app.use('/app', express.static(path.resolve(__dirname, 'app')));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/googlemaps', function (req, res) {
    request(
        'https://maps.googleapis.com/maps/api/js?key='
        + process.env.GOOGLE_MAPS_KEY
        + '&libraries=visualization'
    ).pipe(res);
});

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

var T = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
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
