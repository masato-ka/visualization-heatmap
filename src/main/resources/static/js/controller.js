var app = angular.module('App',[]);

app.controller('ApplicationController', ['$scope',function($scope){

    $scope.image = [];

    var temp = [[30.0,30.0,30.0,30.0,30.0,30.0,30.0,30.0],
     [30.0,30.0,30.0,30.0,30.0,30.0,30.0,30.0],
     [30.0,30.0,30.0,30.0,20.0,30.0,30.0,30.0],
     [30.0,30.0,10.0,30.0,80.0,30.0,30.0,30.0],
     [30.0,30.0,30.0,25.0,30.0,30.0,30.0,30.0],
     [30.0,30.0,30.0,0.0,25.0,30.0,30.0,30.0],
     [30.0,30.0,30.0,30.0,30.0,30.0,30.0,30.0],
     [30.0,30.0,30.0,30.0,30.0,30.0,30.0,30.0]];

    $scope.image = temp.map(function(line){
        return line.map(function(temp){
            return translateTempToRGB(temp);
        })
    });

}]);


var translateTempToRGB = function(templature){
    var scale = 1/80.0;
    templature * scale;
    return colorRGBBar(templature * scale);
}

var sigmoid = function(x, gain, offset){
    var value = (x+offset)*gain;
    return ((Math.tanh(value*0.5)+1)*0.5)
}

var colorRGBBar = function(x){
    var gain = 10
    var offset_x = 0.2
    x = (x * 2) - 1
    red = sigmoid(x, gain, -1*offset_x)
    blue = 1-sigmoid(x, gain, offset_x)
    green = sigmoid(x, gain, 0.6) + (1-sigmoid(x,gain,-1*0.6))
    green = green - 1.0
    return [red,green,blue]
}

