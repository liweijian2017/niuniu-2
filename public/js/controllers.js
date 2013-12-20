app.controller('IndexCtrl',['$scope','Rooms',function($scope, Rooms){
    Rooms.getRooms().then(function(rooms){
        $scope.rooms = rooms;
    });
}]);

//app.controller('NotFoundCtrl',[]);