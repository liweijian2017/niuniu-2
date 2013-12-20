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
        }
    }


    return services;
});