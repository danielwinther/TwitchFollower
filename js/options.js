var twitch = angular.module('twitch', ['ngAnimate']);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.controller('OptionsController', function($scope, $timeout, $http, URL){
    $scope.options = function() {
        $scope.manifest = chrome.runtime.getManifest();
        angular.element(".glyphicon-refresh-animate").hide();
        chrome.storage.sync.get('username', function (result) {
            $scope.username = result.username;
            $http.get(URL + 'users/' + $scope.username)
            .then(function(response) {
                $scope.user = response.data;
            });
        });
        chrome.storage.sync.get('counter', function (result) {
            $scope.counter = result.counter;
        });
        chrome.storage.sync.get('limit', function (result) {
            $scope.limit = result.limit;
        });
    }

    $scope.onChange = function() {
        chrome.storage.sync.set({'username': $scope.username});
        chrome.storage.sync.set({'counter': $scope.counter});
        chrome.storage.sync.set({'limit': $scope.limit});
        angular.element('.glyphicon-refresh-animate').fadeIn();

        cancelRefresh = $timeout(function callback() {
            angular.element('.glyphicon-refresh-animate').fadeOut();
            $http.get(URL + 'users/' + $scope.username)
            .then(function(response) {
                $scope.user = response.data;
            });
        }, 1000);
    }
});