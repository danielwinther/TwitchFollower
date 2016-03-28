var twitch = angular.module('twitch', ['ngStorage']);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.constant('PARAMETERS', '?direction=DESC&limit=1000sortby=display_name');
twitch.controller('TwitchController', function($scope, $localStorage, $interval, $http, URL, PARAMETERS){
    var minutes = 0.5;
    $interval(function(){
        $scope.getTwitch();
    }, minutes * 60000);

    $scope.getTwitch = function() {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                sendResponse({
                    msg: request.greeting
                });
                chrome.browserAction.setBadgeText ({ text: request.greeting});
            });

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                sendResponse({
                    msg1: request.greeting1
                });
                chrome.browserAction.setBadgeText ({ text: request.greeting1});
            });

        var online = new Array();
        chrome.browserAction.setBadgeText ({ text: '0'});

        $http.get(URL+ 'users/' + ($localStorage.username ? $localStorage.username: "twitch")  + '/follows/channels' + PARAMETERS)
        .then(function(response) {
            $scope.data = response.data.follows
            angular.forEach($scope.data, function(value, key){
                $http.get(URL + 'streams/' + value.channel.name)
                .then(function(response) {
                    if (response.data.stream != null) {
                        online.push(value);
                        chrome.browserAction.setBadgeText ({ text: online.length.toString()});
                    }
                });
            });
        });
    }
});