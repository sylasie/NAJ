angular.module('myapp').controller('UserCtrl', function ($scope, $stateParams, usersList) {
    $scope.user = usersList[$stateParams.userId];
    $scope.userId = $stateParams.userId;
});
