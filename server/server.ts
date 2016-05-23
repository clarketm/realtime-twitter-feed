import express = require('express');
import path = require('path');

var port:number = process.env.PORT || 3000;

var app = express(),
    server = app.listen(port),
    io = require('socket.io')(server),
    Twit = require('twit');


//app.use('/app', express.static(path.resolve(__dirname, 'app')));
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
    stream = null, // Define global stream holder as we will only ever have ONE active stream
    currentKeyword = null, // Hold the current keyword we are streaming
    currentSockets = 0; // Counter to determine number of open sockets



io.sockets.on('connection', function (socket) {
    currentSockets++;
    socket.emit('connected', currentKeyword);

    console.log('Socket Connected');

    if (currentKeyword !== null && stream === null) {
        stream = createStream(currentKeyword);
    }

    socket.on('disconnect', function () {
        currentSockets--;
        console.log('Socket Disconnected');

        if (stream !== null && currentSockets <= 0) {
            stream.stop();
            stream = null;
            currentSockets = 0;
            console.log('No active sockets, disconnecting from stream');
        }
    });


    socket.on('keyword-change', function (keyword) {
        if (stream !== null) {
            stream.stop();
            console.log('Stream Stopped');
        }

        stream = createStream(keyword);
        currentKeyword = keyword;
        io.sockets.emit('keyword-changed', currentKeyword);
        console.log('Stream restarted with keyword => ' + currentKeyword);
     });
});


function createStream(keyword) {
    var stream = T.stream('statuses/filter', {track: keyword});

    stream.on('tweet', function (data) {
        if (data.geo && data.user.profile_image_url) {
            io.sockets.emit('twitter-stream', data); // Emit our new tweet to ALL connected clients
        }
    });

    stream.on('connect', function () {
        console.log('Connected to twitter stream using keyword => ' + keyword);
    });

    stream.on('disconnect', function () {
        console.log('Disconnected from twitter stream using keyword => ' + keyword);
    });

    return stream;
}
