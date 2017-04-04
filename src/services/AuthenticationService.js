/**
 * Created by Dipti on 3/28/2017.
 */
(function () {
    angular.module("login").factory("AuthenticationService", ["$rootScope", "userService", "$cookies", function ($rootScope, userService, $cookies) {
        var service = {};

        service.login = login;
        service.setCredentials = setCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        /** Check user credentials with local storage info*/
        function login(user_email, user_pass, callback) {
            var response;

            /** Promise name : getUserDetailByUserName,param : user_email,Promise Response : user **/
            userService.getUserDetailByUserName(user_email).then(function (user) {

                if (user !== null) {
                    if (user_email == user.user_email && user_pass == user.user_pass) {
                        response = {success: true, data: user};
                    }
                    else {
                        response = {success: false, message: "Username or password is incorrect"};
                    }
                }
                else {
                    response = {success: false, message: "User registration is required"};
                }
                callback(response);
            });
        }

        // Set user credentials in $rootScope for  keeping user logged in after page refresh
        function setCredentials(userId, user_email, user_pass) {
            $rootScope.globals = {
                currentUser: {
                    "userId": userId,
                    'username': user_email,
                    'password': user_pass
                }
            };
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, {expires: cookieExp});
        }

        // When user sign out
        function ClearCredentials() {
            $rootScope.globals = {}; // remove from $rootScope
            $cookies.remove('globals'); // remove from $cookies
        }

    }]);
})();