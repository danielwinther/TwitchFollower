var twitch = angular.module('twitch', []);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.controller('TwitchController', function($scope, $interval, $http, URL){
    $scope.title = 'Twitch following | Who is streaming?';
    var minutes = 0.5;
    $interval(function(){
        $scope.getTwitch();
        i++;
        console.log(i.toString());
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

        chrome.storage.sync.get('username', function (result) {
            $http.get(URL+ 'users/' + (result.username ? result.username : "twitch")  + '/follows/channels')
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
        });
    }
});