/**
 * Created by Dipti on 3/26/2017.
 */
(function () {


    angular.module("login").controller("RegisterController", ['$scope', "userService", function ($scope, userService) {
        // user registration
        $scope.registerUser = function () {

            var user_email = $scope.user_email;
            var user_password = $scope.user_pass;

            // Call userService to store user info in local storage
            userService.setUser(user_email, user_password).then(function (response) {
                if (response.success) {
                    $scope.successMsg = "Registration successful!Do login to access MailClient App";
                }
                else {
                    $scope.errorMsg = response.message;
                }
            });
            //userService.getAllUsersDetails();
        };

    }]);
})();