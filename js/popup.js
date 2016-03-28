var app = angular.module('app', ['ngStorage']);
app.constant('URL', 'https://api.twitch.tv/kraken/');
app.constant('PARAMETERS', '?direction=DESC&limit=1000sortby=display_name');
app.controller('ctrl', function($scope, $localStorage, $interval, $http, URL, PARAMETERS){
    $scope.username = $localStorage.username;

    $scope.getTwitch = function() {
        chrome.runtime.sendMessage({
            greeting: "0"
        },
        function(response) {
            console.log(response.msg);
        });

        $localStorage.username = $scope.username;
        var online = new Array();
        var offline = new Array();
        $http.get(URL + 'users/' + ($scope.username ? $scope.username : "twitch") + '/follows/channels' + PARAMETERS)
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
                        },
                        function(response) {
                            console.log(response.msg);
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
    };
});