'use strict';
var app = window.angular.module('niuniu',['ngRoute']);
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            controller:'IndexCtrl',
            templateUrl:'/partials/index.html'
        })
        .when('/404',{
            templateUrl:'/partials/404.html'
        })
        .otherwise({redirectTo:'/'});
}]);