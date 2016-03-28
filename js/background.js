var app = angular.module('app', ['ngStorage']);
app.constant('URL', 'https://api.twitch.tv/kraken/');
app.constant('PARAMETERS', '?direction=DESC&limit=1000sortby=display_name');
app.controller('ctrl', function($scope, $localStorage, $interval, $http, URL, PARAMETERS){
    $scope.runBackground = function() {
        chrome.browserAction.setBadgeText ({ text: '0'});
        getTwitch();
        $interval(function(){
            getTwitch();
        }, 60000 * 10);
    };
    function getTwitch() {
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