/**
 * Created by Dipti on 3/28/2017.
 */
(function () {
    // mailClient module depends on login and inbox module

    var app = angular.module("mailClient", ['ngRoute', 'ngCookies', 'ngMessages', 'login', 'inbox']);

    // Route Configuration
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        var viewBase = 'views';
        $locationProvider.hashPrefix('');
        $routeProvider
            .when('/', {
                // controller: 'IndexController',
                //  templateUrl: 'index.html',
                // controllerAs: 'vm'
                //
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: viewBase + '/login/login.html',
                // controllerAs: 'vm'

            })
            .when('/logout', {
                controller: 'LoginController',
                templateUrl: viewBase + '/login/login.html',
                // controllerAs: 'vm'

            })
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: viewBase + '/register/register.html',
                //controllerAs: 'vm'
            })
            .when('/inbox', {
                controller: 'InboxController',
                templateUrl: viewBase + '/inbox/inbox.html',
                //controllerAs: 'vm'
            })
            .when('/inbox/email/:id', {
                templateUrl: viewBase + '/inbox/inbox.html',
                controller: 'InboxController',
                //controllerAs: 'email'
            })
            .when('/sent', {
                templateUrl: viewBase + '/inbox/inbox.html',
                controller: 'InboxController',
                //     //controllerAs: 'email'
            })
            .when('/sent/email/:id', {
                templateUrl: viewBase + '/inbox/mailDetail.html',
                controller: 'sentController',
                //controllerAs: 'email'
            })
            .when('/drafts', {
                templateUrl: viewBase + '/inbox/inbox.html',
                controller: 'InboxController',
                //controllerAs: 'email'
            })

            .otherwise({redirectTo: '/'});
        //$locationProvider.html5Mode(true);

    }]);

    angular.module("mailClient").run(["$rootScope", "$location", "$cookies", function ($rootScope, $location, $cookies) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};

        //If restricted pages are allowed for logged in user
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            // check if current path is login or registration page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;

             // Redirect user to login page  if current path is restricted page and user is not logged in
            if (restrictedPage && !loggedIn) {
                $location.path("/");
            }
        });
    }]);

})();