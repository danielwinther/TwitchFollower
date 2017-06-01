var twitch = angular.module('twitch', ['ngAnimate']);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.constant('CLIENTID', 'qh95apsorfl1quetwoekq68t5vgzjbq');
twitch.controller('TwitchController', function($scope, $interval, $http, URL, CLIENTID) {
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

            $http.get(URL + 'users/' + $scope.username + '?client_id=' + CLIENTID)
            .then(function(response) {
                $scope.user = response.data;
                $scope.logo = $scope.user.logo ? $scope.user.logo : chrome.extension.getURL('img/default-logo.png');
                $http.get(URL + 'streams/' + $scope.username + '?client_id=' + CLIENTID)
                .then(function(response) {
                    if (response.data.stream != null) {
                        $scope.background = {
                            'background': 'url("' + $scope.logo + '") no-repeat right / 20px content-box, url("' + chrome.extension.getURL('img/red-dot.png') + '") no-repeat right 25px center / 8px content-box',
                            'padding': '5px 5px 5px 12px'
                        };
                    }
                    else {
                        $scope.background = {
                            'background': 'url("' + $scope.logo + '") no-repeat right / 20px content-box',
                            'padding': '5px 5px 5px 12px'
                        };
                    }
                });
            });

            var online = new Array();
            var offline = new Array();
            chrome.storage.sync.get('limit', function (result) {
                $scope.limit = result.limit;
                $http.get(URL + 'users/' + ($scope.username ? $scope.username : 'twitch') + '/follows/channels?direction=asc&limit=' + $scope.limit + '&client_id=' + CLIENTID)
                .then(function(response) {
                    $scope.data = response.data.follows
                    angular.forEach($scope.data, function(value, key){
                        $http.get(URL + 'streams/' + value.channel.name + '?client_id=' + CLIENTID)
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