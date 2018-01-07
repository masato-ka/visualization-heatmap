var app = angular.module('App',[]);
var es = new EventSource('/api/v1/thermography/sse');

app.controller('ApplicationController', ['$scope',function($scope){

    es.addEventListener('message', function (event) {

        var acceptData = JSON.parse(event.data);

        var temp = []

        for (var i = 0; i <= 56; i += 8) {
            temp.push(acceptData.slice(i, i + 8));
        }
        $scope.image = [];
        $scope.image = temp.map(function (line) {
            return line.map(function (temp) {
                return translateTempToRGB(temp);
            })
        });
        $scope.$apply();
    });

    data = function () {
        $scope.image = [];
        var temp = [[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]];

        $scope.image = temp.map(function (line) {
            return line.map(function (temp) {
                return translateTempToRGB(temp);
            })
        });
    }
    data();
}]);


var translateTempToRGB = function(temp){
    var scale = 1 / 50.0;
    temp * scale;
    return colorRGBBar(temp * scale);
}

var sigmoid = function(x, gain, offset){
    var value = (x+offset)*gain;
    return ((Math.tanh(value*0.5)+1)*0.5);
}

var colorRGBBar = function(x){
    var gain = 10
    var offset_x = 0.2
    x = (x * 2) - 1
    red = sigmoid(x, gain, -1*offset_x)
    blue = 1-sigmoid(x, gain, offset_x)
    green = sigmoid(x, gain, 0.6) + (1-sigmoid(x,gain,-1*0.6))
    green = green - 1.0
    return [Math.floor(red*255),Math.floor(green*255),Math.floor(blue*255)];
}

