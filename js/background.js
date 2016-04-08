var twitch = angular.module('twitch', []);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.controller('TwitchController', function($scope, $interval, $http, URL){
    $scope.manifest = chrome.runtime.getManifest();
    chrome.storage.sync.get('counter', function (result) {
        $interval(function(){
            $scope.getTwitch();
            i++;
        }, result.counter * 60000);
    });

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

        chrome.storage.sync.get('username', function (result) {
            chrome.storage.sync.get('limit', function (result1) {
                $http.get(URL+ 'users/' + (result.username ? result.username : "twitch")  + '/follows/channels?limit=' + result1.limit)
                .then(function(response) {
                    console.log(response);
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
            });
        });
    }
});