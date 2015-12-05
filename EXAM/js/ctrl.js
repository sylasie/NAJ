angular.module('app').controller('MainCtrl', function($scope) {
    $scope.todo = '';
    $scope.todos = [];
    
    $scope.addTodo = function(){
        alert($scope.todo);
    }
});