angular.module('myapp', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('users', {
        url: '/users',
        controller: 'UsersCtrl',
        templateUrl: 'partials/users.html'
    }).state('user', {
        url: '/user/:userId',
        controller: 'UserCtrl',
        templateUrl: 'partials/user.html'
    }).state('user.favorites', {
        url: '/favorites',
        controller: 'FavoritesCtrl',
        templateUrl: 'partials/favorites.html'
    }).state('user.inventory', {
        url: '/inventory',
        controller: 'InventoryCtrl',
        templateUrl: 'partials/inventory.html'
    });
    //user
    //user.favorites
    //user.inventory
    $urlRouterProvider.otherwise('/users');
});
