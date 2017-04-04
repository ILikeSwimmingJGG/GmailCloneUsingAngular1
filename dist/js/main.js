!function() {
    angular.module("login").factory("AuthenticationService", [ "$rootScope", "userService", "$cookies", function(a, b, c) {
        function d(a, c, d) {
            var e;
            b.getUserDetailByUserName(a).then(function(b) {
                e = null !== b ? a == b.user_email && c == b.user_pass ? {
                    success: !0,
                    data: b
                } : {
                    success: !1,
                    message: "Username or password is incorrect"
                } : {
                    success: !1,
                    message: "User registration is required"
                }, d(e);
            });
        }
        function e(b, d, e) {
            a.globals = {
                currentUser: {
                    userId: b,
                    username: d,
                    password: e
                }
            };
            var f = new Date();
            f.setDate(f.getDate() + 7), c.putObject("globals", a.globals, {
                expires: f
            });
        }
        function f() {
            a.globals = {}, c.remove("globals");
        }
        var g = {};
        return g.login = d, g.setCredentials = e, g.ClearCredentials = f, g;
    } ]);
}(), function() {
    angular.module("inbox", []).factory("EmailService", [ "$rootScope", "$http", "$q", "$filter", "$location", "$window", function(a, b, c, d, e, f) {
        function g() {
            var a = c.defer();
            return h().then(function(b) {
                if (b) {
                    var c = d("filter")(b.inbox, {
                        markAsRead: !1
                    }), e = d("filter")(b.sent, {
                        markAsRead: !1
                    }), f = d("filter")(b.drafts, {
                        markAsRead: !1
                    }), g = c ? c.length : 0, h = e ? e.length : 0, i = f ? f.length : 0;
                    a.resolve({
                        inbox: g,
                        sent: h,
                        drafts: i
                    });
                }
            }), a.promise;
        }
        function h() {
            var d = c.defer();
            return b.get("../data/email.json").then(function(b) {
                var c = b.data[a.globals.currentUser.userId];
                d.resolve({
                    inbox: c.inbox,
                    sent: c.sent,
                    drafts: c.drafts
                });
            }, function(a) {
                d.resolve({
                    success: !1,
                    message: a.statusText
                });
            }), d.promise;
        }
        function i(a) {
            var b = c.defer(), d = [];
            return f.confirm("Are you sure to delete selected messages?") && angular.forEach(a, function(b) {
                if (b.checked) {
                    var c = a.indexOf(b);
                    a.splice(c, 1), d.push(b.id);
                }
            }), b.resolve({
                removedId: d,
                success: !0
            }), b.promise;
        }
        var j = {};
        return j.getAllMails = h, j.deleteMail = i, j.totalUnreadCount = g, j;
    } ]);
}(), function() {
    angular.module("login", []).factory("userService", [ "$timeout", "$filter", "$q", "$location", function(a, b, c, d) {
        function e(a, b) {
            var e = c.defer(), i = f(), j = h() > 0 ? h() + 1 : 1;
            return g(a).then(function(c) {
                if (null !== c) e.resolve({
                    success: !1,
                    message: "Duplicate User name-" + a
                }); else {
                    var f = {
                        userId: j,
                        user_email: a,
                        user_pass: b
                    };
                    i.push(f), localStorage.setItem("userDetailObject", JSON.stringify(i));
                    e.resolve({
                        success: !0
                    }), d.path("/login");
                }
            }), e.promise;
        }
        function f() {
            var a;
            return a = localStorage.getItem("userDetailObject") ? localStorage.getItem("userDetailObject") : JSON.stringify([]), 
            JSON.parse(a);
        }
        function g(a) {
            var d = c.defer(), e = b("filter")(f(), {
                user_email: a
            }), g = e.length ? e[0] : null;
            return d.resolve(g), d.promise;
        }
        function h() {
            return f().length;
        }
        function i() {
            localStorage.clear();
        }
        var j = {};
        return j.setUser = e, j.getAllUsersDetails = f, j.getUserDetailByUserName = g, j.clearAllUserDetail = i, 
        j.getTotalUserCount = h, j;
    } ]);
}(), function() {
    angular.module("inbox").controller("InboxController", [ "EmailService", "$scope", "$rootScope", "$window", "$filter", "$location", "$routeParams", function(a, b, c, d, e, f, g) {
        b.currentUserName = b.isLoggedIn ? c.globals.currentUser.username : "", b.folder = f.path(), 
        b.viewMailFlag = Number(g.id) > 0, a.getAllMails().then(function(a) {
            "/inbox" == f.path() && (b.data = a.inbox), "/sent" == f.path() && (b.data = a.sent), 
            "/drafts" == f.path() && (b.data = a.drafts), window.location.href.indexOf("inbox") > -1 && Number(g.id) > 0 && (b.viewdata = e("filter")(a.inbox, {
                id: Number(g.id)
            }, !0)), window.location.href.indexOf("sent") > -1 && Number(g.id) > 0 && (b.viewdata = e("filter")(a.sent, {
                id: Number(g.id)
            }, !0)), window.location.href.indexOf("drafts") > -1 && Number(g.id) > 0 && (b.viewdata = e("filter")(a.drafts, {
                id: Number(g.id)
            }, !0));
        }), b.reloadPage = function() {
            d.location.reload();
        }, function() {
            a.totalUnreadCount().then(function(a) {
                b.totalUnreadCountInbox = a.inbox, b.totalUnreadCountSent = a.sent, b.totalUnreadCountDraft = a.drafts;
            });
        }(), b.openViewMail = function(a) {
            f.path("/inbox/email/" + a);
        }, b.onDelete = function() {
            a.deleteMail(b.data).then(function(a) {
                a.success && (b.notification = a.removedId + "Selected mails deleted successfully");
            });
        };
    } ]);
}(), function() {
    angular.module("mailClient").controller("IndexController", [ "$rootScope", "$scope", "AuthenticationService", "$location", function(a, b, c, d) {
        b.isLoggedIn = !!a.globals.currentUser, b.currentUserName = b.isLoggedIn ? a.globals.currentUser.username : "", 
        b.signOutUser = function() {
            c.ClearCredentials(), d.path("/login");
        };
    } ]);
}(), function() {
    angular.module("login").controller("LoginController", [ "$scope", "userService", "AuthenticationService", "$location", function(a, b, c, d) {
        a.validateLogin = function() {
            if (function() {
                c.ClearCredentials();
            }(), a.login_email && a.login_pass) {
                var b = a.login_email, e = a.login_pass;
                c.login(b, e, function(f) {
                    f.success ? (a.successMsg = "Login Successful", c.setCredentials(f.data.userId, b, e), 
                    d.path("/inbox")) : a.errorMsg = f.message;
                });
            }
        };
    } ]);
}(), function() {
    angular.module("login").controller("RegisterController", [ "$scope", "userService", function(a, b) {
        a.registerUser = function() {
            var c = a.user_email, d = a.user_pass;
            b.setUser(c, d).then(function(b) {
                b.success ? a.successMsg = "Registration successful!Do login to access MailClient App" : a.errorMsg = b.message;
            });
        };
    } ]);
}();