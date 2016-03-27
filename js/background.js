var app = angular.module('app', ['ngStorage']);
app.controller('ctrl', function($scope, $localStorage, $interval, $http){
    $scope.runBackground = function() {
        test();
        $interval(function(){
            test();
        }, 60000 * 15);
    };
    function test() {
        var online = new Array();

        $http.get('https://api.twitch.tv/kraken/users/' + ($localStorage.username ? $localStorage.username: "twitch")  + '/follows/channels')
        .then(function(response) {
            $scope.data = response.data.follows
            angular.forEach($scope.data, function(value, key){
                $http.get('https://api.twitch.tv/kraken/streams/' + value.channel.display_name)
                .then(function(response) {
                    if (response.data.stream != null) {
                        online.push(value);
                        chrome.browserAction.setBadgeText ( { text: online.length.toString()});
                    }
                });
            });
        });
    }
});