/**
 * Created by Dipti on 3/26/2017.
 */
(function () {


    angular.module("login").controller("LoginController", ['$scope', 'userService', 'AuthenticationService', '$location', function ($scope, userService, AuthenticationService, $location) {

        /** User login validation
         * Call Authentication service and first clear credentials
         * */
        $scope.validateLogin = function () {
            (function initController() {
                // reset login status
                AuthenticationService.ClearCredentials();
            })();
            // Check username and password
            if ($scope.login_email && $scope.login_pass) {
                var username = $scope.login_email;
                var password = $scope.login_pass;

                AuthenticationService.login(username, password, function (response) {

                    if (response.success) {
                        $scope.successMsg = "Login Successful";
                        //If credentials matches , store it to local storage
                        AuthenticationService.setCredentials(response.data.userId, username, password);
                        $location.path('/inbox');
                    }
                    else {
                        $scope.errorMsg = response.message;
                    }
                });
            }
        };
    }]);
})();