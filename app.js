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
/* Rooms ��ݽṹ
 * {
 *     0001[roomId]:{
 *         00001[clientId]:Clients[Object]
 *     }
 * }
 * */
var Rooms = {};
/* client ��ݽṹ
 * {
 *     roomId:0001,
 *     clientId:00001,
 *     ready:true
 * }
 * */
var Clients = {};


io.sockets.on('connection', function(socket){
    socket.emit('init', {hello:'world'});
    socket.emit('getRooms', Rooms);
    var id = socket.id;

    socket.on('getRooms', function(){
        socket.emit('getRooms', {"001":"aa"});
    });

    socket.on('userInfo', function(data){
        var roomId = data.roomId;
        var room = (Rooms[roomId] = Rooms[roomId] || {});
        var client = (Clients[id] = Clients[id] || {});
        client.roomId = roomId;
        client.clientId = id;
        room[id] = client;

        socket.emit('this', 'Welcome '+ data.clientId);
    });

    socket.on('ready', function(data){
        var room = Rooms[data.roomId];
        var client = room[id];
        client.ready = !client.ready;
        console.log(Rooms);
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
        if(count >= 2 && allReady){
            socket.emit('this', 'start');
        }else{
            socket.emit('this', 'waiting');
        }

    });

    socket.on('disconnect', function () {
        //delete Clients[id];
        /*delete Rooms[Clients[id].roomId][Clients[id].clientId];
        delete Clients[id];
        console.log(Rooms);*/
    });
});


