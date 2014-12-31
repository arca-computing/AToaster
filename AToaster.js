/*
    Creator: Maelig GOHIN For ARCA-Computing - www.arca-computing.fr
    Creation Date: November 2014
    Description:    AToaster is an Angular directive to show a simple toaster to inform user.
                    More infos on demo page : http://arca-computing.github.io/AToaster/
 */
angular.module('AToaster', ['ngAnimate'])
    .factory('service.toaster', ['$rootScope', function ($rootScope) {
        'user strict';
        var pop = function (type, title, message, timeout) {
                var toast = {
                    type: type,
                    title: title,
                    message: message,
                    timeout: timeout
                };
                $rootScope.$broadcast('toaster:new', toast);
            },
            clear = function () {
                $rootScope.$broadcast('toaster:clear');
            };

        return{
            pop: function(type, title, message, timeout){
                pop(type, title, message, timeout);
            },
            clearAndPop: function(type, title, message, timeout){
                clear();
                pop(type, title, message, timeout);
            },
            clear: function(){
                clear();
            }
        };
    }])
    .constant('toasterConfig', {
        timeout: 3000
    })
    .directive('toasterContainer', ['$rootScope', '$timeout', 'toasterConfig', function ($rootScope, $timeout, toasterConfig) {
        'user strict';
        return {
            restrict: 'AE',
            scope: {
                options: '='
            },
            template: '<div class="toaster-container">' +
                '<div class="clearfix {{toast.type}}" ng-class="{\'fast\':toast.removeFast}" ng-repeat="toast in toasts" ng-click="removeToastFromUI(toast)" ng-mouseover="stopTimer(toast)" ng-mouseout="resetTimer(toast)">' +
                '<div class="icon"><i class="glyphicon {{types[toast.type].css}}"></i></div>' +
                '<div class="infos">' +
                '<div class="title">{{toast.title}}</div>' +
                '<div class="message">{{toast.message}}</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            link: function (scope) {
                scope.toasts = [];
                scope.types = {
                    success: {
                        css: 'glyphicon-ok',
                        excapable: true
                    },
                    error: {
                        css: 'glyphicon-remove',
                        excapable: true
                    },
                    warning: {
                        css: 'glyphicon-warning-sign',
                        excapable: true
                    },
                    wait: {
                        css: 'glyphicon-refresh spin',
                        excapable: false
                    }
                };
                var mergedConfig = angular.extend({}, toasterConfig, scope.$eval(scope.options)),
                    removeToast = function (toast) {
                        scope.toasts.splice(scope.toasts.indexOf(toast), 1);
                    },
                    removeAllToasts = function () {
                        scope.toasts = [];
                    },
                    setToastTimeout = function (toast) {
                        if (typeof toast.timeout === 'undefined' || toast.timeout === null) {
                            toast.timeout = mergedConfig.timeout;
                        }
                        if (toast.timeout > 0) {
                            toast.to = $timeout(function () {
                                removeToast(toast);
                            }, toast.timeout);
                        }
                    },
                    addToast = function (toast) {
                        $timeout(function(){
                            setToastTimeout(toast);
                            scope.toasts.unshift(toast);
                        });                        
                    };

                scope.removeToastFromUI = function (toast) {
                    if (scope.types[toast.type].excapable) {
                        toast.removeFast = true;
                        $timeout(function () {
                            removeToast(toast);
                        });
                    }
                };

                scope.resetTimer = function (toast) {
                    setToastTimeout(toast);
                };

                scope.stopTimer = function (toast) {
                    $timeout.cancel(toast.to);
                };

                var rootScopeListener1 = $rootScope.$on('toaster:new', function (evt, toast) {
                    addToast(toast);
                });

                var rootScopeListener2 = $rootScope.$on('toaster:clear', function () {
                    removeAllToasts();
                });

                scope.$on('$destroy', function() {
                    rootScopeListener1();
                    rootScopeListener2();
                });
            }
        };
    }]);