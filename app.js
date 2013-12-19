/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var cards = require('./routes/cards');
var rooms = require('./routes/rooms');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/get_cards', cards.cards);
app.get('/enter_room', rooms.enter_room);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var Data = {};

io.sockets.on('connection', function(socket){
    socket.emit('init', {hello:'world'});

    socket.on('userInfo', function(data){
        var room = (Data[data.roomId] = Data[data.roomId] || {});
        room[socket.id] = {};
        socket.emit('this', 'Welcome '+ data.clientId);
    });

    socket.on('ready', function(data){
        var room = Data[data.roomId];
        room[socket.id].ready = !room[socket.id].ready;
        console.log(Data);
        var allReady = true;
        var count = 0;
        for(var k in room){
            var client = room[k];
            if(!client.ready){
                allReady = false;
                break;
            }
            count++;
        }
        if(count == 2 && allReady){
            socket.emit('this', 'start');
        }else{
            socket.emit('this', 'waiting');
        }

    });

    socket.on('disconnect', function () {
        if(Data.room[socket.id]){
            delete Data.room[socket.id];
        }
    });
});


