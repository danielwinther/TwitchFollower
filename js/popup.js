var twitch = angular.module('twitch', ['ngAnimate']);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.controller('TwitchController', function($scope, $interval, $http, URL){
    $scope.title = 'Twitch following | Who is streaming?';
    $scope.onChange = function() {
        chrome.storage.sync.set({'username': $scope.username}, function() {
            $scope.getTwitch();
        });
    };

    $scope.getTwitch = function() {
        chrome.storage.sync.get('username', function (result) {
            $scope.username = result.username;

            chrome.runtime.sendMessage({
                greeting: '0'
            });
            var online = new Array();
            var offline = new Array();
            $http.get(URL + 'users/' + ($scope.username ? $scope.username : 'twitch') + '/follows/channels?direction=asc&limit=1000&sortby=display_name')
            .then(function(response) {
                $scope.data = response.data.follows
                angular.forEach($scope.data, function(value, key){
                    $http.get(URL + 'streams/' + value.channel.name)
                    .then(function(response) {
                        if (response.data.stream != null) {
                            online.push(value);
                            $scope.onlineStreamers = online;
                            $scope.offlineStreamers = offline;

                            chrome.runtime.sendMessage({
                                greeting1: online.length.toString()
                            });
                        }
                        else {
                            offline.push(value);
                            $scope.onlineStreamers = online;
                            $scope.offlineStreamers = offline;
                        }
                    });
                });
            });
        });
    }
});