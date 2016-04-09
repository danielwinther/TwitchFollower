var twitch = angular.module('twitch', ['ngAnimate']);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.controller('TwitchController', function($scope, $interval, $http, URL){
    $scope.manifest = chrome.runtime.getManifest();
    $scope.onChange = function() {
        chrome.storage.sync.set({'username': $scope.username}, function() {
            $scope.getStreamers();
        });
    };

    $scope.getStreamers = function() {
        chrome.storage.sync.get('animation', function (result) {
            $scope.animation = {
                'transition': 'all ease ' + result.animation + 's'
            };
        });
        chrome.storage.sync.get('username', function (result) {
            $scope.username = result.username;
            chrome.runtime.sendMessage({
                greeting: '0'
            });

            $http.get(URL + 'users/' + $scope.username)
            .then(function(response) {
                $scope.user = response.data;
                $scope.logo = $scope.user.logo ? $scope.user.logo : 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png';
                $scope.background = {
                    'background': 'url("' + $scope.logo + '") no-repeat right / 20px content-box',
                    'padding': '5px 5px 5px 12px'
                };
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
                            $('[data-toggle="tooltip"]').tooltip();
                        });
                    });
                });
            });
        });
    }
    $scope.options = function() {
        chrome.runtime.openOptionsPage();    
    }
});