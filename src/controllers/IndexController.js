/**
 * Created by Dipti  on 3/26/2017.
 */
(function () {

    angular.module("mailClient").controller("IndexController", ['$rootScope', '$scope', 'AuthenticationService', '$location', function ($rootScope, $scope, AuthenticationService, $location) {

        /* To check if user has logged in or not, check if $rootscope has that variable
         currentUser variable stored in $rootScope.
        * */
        $scope.isLoggedIn = $rootScope.globals.currentUser ? true : false;
        //To show current user in Inbox
        $scope.currentUserName = $scope.isLoggedIn ? $rootScope.globals.currentUser.username : '';

        //Sign out  : clearCredentials from local storage
        $scope.signOutUser = function () {
            AuthenticationService.ClearCredentials();
            $location.path('/login');
        };
    }]);

})();