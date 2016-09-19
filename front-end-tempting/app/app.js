var app = angular
    .module("Temp-ting", ["ngRoute", "ui.bootstrap", "ngCookies"])

    .config(function($interpolateProvider, $httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $interpolateProvider.startSymbol("((");
        $interpolateProvider.endSymbol("))");
    });
