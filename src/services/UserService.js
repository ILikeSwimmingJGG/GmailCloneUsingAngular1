/**
 * Created by Dipti on 3/27/2017.
 */

(function () {
    angular.module("login", []).factory("userService", ["$timeout", '$filter', '$q', '$location', function ($timeout, $filter, $q, $location) {

        var userDetail = {};

        userDetail.setUser = setUser; // set user data to local storage
        userDetail.getAllUsersDetails = getAllUsersDetails; // get data from local storage
        userDetail.getUserDetailByUserName = getUserDetailByUserName;// get data by user email
        userDetail.clearAllUserDetail = clearAllUserDetail; // clear data from $rootScope and local storage
        userDetail.getTotalUserCount = getTotalUserCount; // get total user count
        return userDetail;

        // Set user's credentials to local storage
        function setUser(user_email, user_pass) {
            var deferred = $q.defer();
            var users = getAllUsersDetails();
            var userId = getTotalUserCount() > 0 ? (getTotalUserCount() + 1) : 1;

            // if promise success then check for duplicate user validation
            getUserDetailByUserName(user_email)
                .then(function (duplicateUser) {
                    if (duplicateUser !== null) {
                        deferred.resolve({"success": false, message: 'Duplicate User name-' + user_email});
                    } else {
                        var userDetailObject = {"userId": userId, "user_email": user_email, "user_pass": user_pass};
                        // Add object to users array
                        users.push(userDetailObject);
                        localStorage.setItem('userDetailObject', JSON.stringify(users));
                        var retrievedObject = users;
                        deferred.resolve({success: true});
                        $location.path('/login');
                    }
                });
            /**Whatever values passed in deferred.resolve ,
             * will be captured in deferred.promise
             * */
            return deferred.promise;
        }

        /** Get all user's details  */
        function getAllUsersDetails() {
            var users;
            if (!localStorage.getItem("userDetailObject")) {
                users = JSON.stringify([]);
            }
            else {
                users = localStorage.getItem("userDetailObject");
            }
            return JSON.parse(users);
        }

        /**  Get user details*/
        function getUserDetailByUserName(user_email) {
            var deferred = $q.defer();
            // Get array filtered by  user email
            var filtered = $filter('filter')(getAllUsersDetails(), {"user_email": user_email});
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        /** Count all users */
        function getTotalUserCount() {
            var users = getAllUsersDetails();
            return users.length;
        }

        /** clear local storage when log out */
        function clearAllUserDetail() {
            localStorage.clear();
        }
    }]);
})();