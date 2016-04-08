var twitch = angular.module('twitch', ['ngAnimate']);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.controller('TwitchController', function($scope, $interval, $http, URL){
    $scope.manifest = chrome.runtime.getManifest();
    $scope.onChange = function() {
        chrome.storage.sync.set({'username': $scope.username}, function() {
            $scope.getTwitch();
        });
    };

    $scope.getTwitch = function() {
        chrome.storage.sync.get('username', function (result) {
            $scope.username = result.username;
            chrome.storage.sync.get('counter', function (result) {
                if (result.counter == null) {
                    chrome.storage.sync.set({'counter': 1});
                }
            });
            chrome.storage.sync.get('limit', function (result) {
                if (result.limit == null) {
                    chrome.storage.sync.set({'limit': 1000});
                }
            });

            chrome.runtime.sendMessage({
                greeting: '0'
            });

            $http.get(URL + 'users/' + $scope.username)
            .then(function(response) {
                $scope.user = response.data;
            });

            var online = new Array();
            var offline = new Array();
            chrome.storage.sync.get('limit', function (result) {
                $scope.limit = result.limit;
                $http.get(URL + 'users/' + ($scope.username ? $scope.username : 'twitch') + '/follows/channels?direction=asc&limit=' + $scope.limit + '&sortby=display_name')
                .then(function(response) {
                    $scope.data = response.data.follows
                    angular.forEach($scope.data, function(value, key){
                        $http.get(URL + 'streams/' + value.channel.name)
                        .then(function(response) {
                            if (response.data.stream != null) {
                                online.push(value);
                            }
                            else {
                                offline.push(value);
                            }
                            chrome.runtime.sendMessage({
                                greeting1: online.length.toString()
                            });
                            $scope.onlineStreamers = online;
                            $scope.offlineStreamers = offline;
                        });
                    });
                });
            });
        });
    }
});