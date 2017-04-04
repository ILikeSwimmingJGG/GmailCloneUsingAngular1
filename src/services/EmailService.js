/**
 * Created by Dipti on 3/29/2017.
 */
(function () {
    angular.module("inbox", []).factory("EmailService", ["$rootScope", "$http", "$q", "$filter", "$location", '$window',function ($rootScope, $http, $q, $filter, $location,$window) {
        var emailObj = {};
        emailObj.getAllMails = getAllMails;
        emailObj.deleteMail=deleteMail;
        emailObj.totalUnreadCount = totalUnreadCount;
        /*emailObj.getMailDetail=getMailDetail;
         emailObj.markAsRead=markAsRead;
         emailObj.newMail=newMail;
         emailObj.sendMail=sendMail;
         emailObj.saveAsDraft=saveAsDraft;
         emailObj.replyMail=replyMail;
         emailObj.forwardMail=forwardMail;*/
        return emailObj;
        
        /*Get total unread count for folder  inbox,sent and drafts*/
        function totalUnreadCount() {
            var deferred = $q.defer();

            /** Promise name : getAllMails,Promise Response : response **/
            getAllMails().then(function (response) {
                if (response) {
                    // Check for markAsRead flag in response
                    var unreadInboxData = $filter('filter')(response.inbox, {'markAsRead': false});
                    var unreadSentData = $filter('filter')(response.sent, {'markAsRead': false});
                    var unreadDraftsData = $filter('filter')(response.drafts, {'markAsRead': false});

                    var totalUnreadCountInbox = unreadInboxData ? unreadInboxData.length : 0;
                    var totalUnreadCountSent = unreadSentData ? unreadSentData.length : 0;
                    var totalUnreadCountDrafts = unreadDraftsData ? unreadDraftsData.length : 0;
                    deferred.resolve({
                        'inbox': totalUnreadCountInbox,
                        'sent': totalUnreadCountSent,
                        'drafts': totalUnreadCountDrafts
                    });
                }
            });
            return deferred.promise;
        }

        /** Get all mails for logged in user */
        function getAllMails() {
            // var mailApi="https://api.myjson.com/bins/ziikf";
            var mailApi = "../data/email.json";
            var deferred = $q.defer();

            //$http service will fetch data from API or .json file
            $http.get(mailApi).then(function (response) {
                //Select current user data from main data array
                var filtered = response.data[$rootScope.globals.currentUser.userId];

                //Response array will contain 3 objects inbox,sent,drafts
                deferred.resolve(
                    {
                        'inbox': filtered.inbox,
                        'sent': filtered.sent,
                        'drafts': filtered.drafts
                    });
            }, function (response) {
                deferred.resolve({'success': false, 'message': response.statusText});
            });
            return deferred.promise;
        }

        /**Delete selected mails */
        function deleteMail(data) {
            var deferred = $q.defer();
            var removedId=[];
            var opt = $window.confirm("Are you sure to delete selected messages?");
            if(opt) {
                angular.forEach(data, function (itm) {
                    // If itm is checked for delete
                    if (itm.checked) {
                        // get the position of item
                        var idx = data.indexOf(itm);
                        //remove from array
                        data.splice(idx, 1);
                        removedId.push(itm.id);
                    }
                });
            }
            deferred.resolve({'removedId':removedId,'success':true});
            return deferred.promise;
        }

        // function getMailsByFolder(folderName) {
        //     var deferred = $q.defer();
        //     var currentRoute = $location.path();
        //     switch(currentRoute){
        //         case '/inbox':
        //             var folder="inbox";
        //             break;
        //         case '/sent':
        //             var folder="sent";
        //             break;
        //         case '/draft':
        //             var folder="draft";
        //             break;
        //         default :'/inbox';
        //     }
        //     getAllMails().then(function (response) {
        //         if(folder=='inbox'){
        //             var filtered = response['inbox'];
        //             deferred.resolve(filtered);
        //         }
        //         if (folder == 'sent') {
        //             var filtered = response['sent'];
        //             deferred.resolve(filtered);
        //         }
        //         if(folder=='draft'){
        //             var filtered = response['draft'];
        //             deferred.resolve(filtered);
        //         }
        //     }, function (response) {
        //         deferred.resolve({'success': false, 'message': response.statusText});
        //     })
        //     return deferred.promise;
        // }
    }]);
})();