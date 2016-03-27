var app = angular.module('app', ['ngStorage']);
app.controller('ctrl', function($scope, $localStorage, $interval, $http){
    $scope.username = $localStorage.username;

    $scope.getTwitch = function() {
        $localStorage.username = $scope.username;
        var online = new Array();
        var offline = new Array();

        $http.get('https://api.twitch.tv/kraken/users/' + ($scope.username ? $scope.username : "twitch")  + '/follows/channels?direction=DESC&limit=1000sortby=display_name')
        .then(function(response) {
            $scope.data = response.data.follows
            angular.forEach($scope.data, function(value, key){
                $http.get('https://api.twitch.tv/kraken/streams/' + value.channel.display_name)
                .then(function(response) {
                    if (response.data.stream != null) {
                        online.push(value);
                        $scope.onlineStreamers = online;
                        $scope.offlineStreamers = offline;
                        chrome.browserAction.setBadgeText ( { text: online.length.toString()});
                    }
                    else {
                        offline.push(value);
                        $scope.onlineStreamers = online;
                        $scope.offlineStreamers = offline;
                    }
                });
            });
        });
    };
});