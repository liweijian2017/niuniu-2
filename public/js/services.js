//var niuniuModule = angular.module('niuniu',[]);
var socket = io.connect('http://localhost:3000');

app.factory('Rooms',function($q){

    var services = {
        getRooms:function(){
            var def = $q.defer();
            socket.on('getRooms', function (data) {
                def.resolve(data);
            });
            return def.promise;
        },
        createRoom:function(){
            var def = $q.defer();
            socket.on('createRoom', function (data) {
                def.resolve(data);
            });
            socket.emit('createRoom');
            return def.promise;
        }
    }


    return services;
});