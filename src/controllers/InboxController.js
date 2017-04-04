/**
 * Created by Dipti Mandani on 3/26/2017.
 */
(function () {
    angular.module("inbox").controller("InboxController", ["EmailService", "$scope", "$rootScope", "$window", "$filter", "$location", "$routeParams", function (EmailService, $scope, $rootScope, $window, $filter, $location, $routeParams) {

        // Show current user name in Inbox
        $scope.currentUserName = $scope.isLoggedIn ? $rootScope.globals.currentUser.username : '';

        // Get the current path
        $scope.folder = $location.path();
        // Flag to show/hide viewMail
        $scope.viewMailFlag = Number($routeParams.id) > 0 ? true : false;

        /* Get all mails from service and display data based on path
        Promises are used here to get all mails
        * */
        EmailService.getAllMails().then(function (response) {

            if ($location.path() == '/inbox')
                $scope.data = response.inbox;
            if ($location.path() == '/sent')
                $scope.data = response.sent;
            if ($location.path() == '/drafts')
                $scope.data = response.drafts;

            /** Response array contains 3 objects Inbox,sent and drafts*/

            // If user is in inbox
            if (window.location.href.indexOf("inbox") > -1) {
                if (Number($routeParams.id) > 0) {

                    $scope.viewdata = $filter('filter')(response.inbox, {'id': Number($routeParams.id)}, true);
                }
            }
            // If user is in sent folder
            if (window.location.href.indexOf("sent") > -1) {
                if (Number($routeParams.id) > 0) {
                    $scope.viewdata = $filter('filter')(response.sent, {'id': Number($routeParams.id)}, true);
                }
            }
            //if user is in drafts folder
            if (window.location.href.indexOf("drafts") > -1) {
                if (Number($routeParams.id) > 0) {
                    $scope.viewdata = $filter('filter')(response.drafts, {'id': Number($routeParams.id)}, true);
                }
            }
        });
        //Reload page
        $scope.reloadPage = function () {
            $window.location.reload();
        };
        /* Get unread mails count
         * */
        function getUnreadCount() {
            // UnreadCount contains unreadCount for all folders
            EmailService.totalUnreadCount().then(function (unreadCount) {
                $scope.totalUnreadCountInbox = unreadCount.inbox; // for inbox folder
                $scope.totalUnreadCountSent = unreadCount.sent; // for sent folder
                $scope.totalUnreadCountDraft = unreadCount.drafts; // for drafts folder
            });
        }

        // Call function to get unreadCount
        getUnreadCount();
        // Open viewDetail mail
        $scope.openViewMail = function (mailId) {
            $location.path('/inbox/email/' + mailId);
        };
        // Delete mail
        $scope.onDelete = function () {
            EmailService.deleteMail($scope.data).then(function (response) {
                if(response.success)
                    $scope.notification=response.removedId+"Selected mails deleted successfully";
            });
        };
    }]);
})();
