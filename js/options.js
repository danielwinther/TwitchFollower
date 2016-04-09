var twitch = angular.module('twitch', []);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.controller('OptionsController', function($scope, $timeout, $http, URL){
    $scope.close = function() {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id);
        });
    }

    $scope.options = function() {
        $scope.enable = true;
        $scope.manifest = chrome.runtime.getManifest();
        $('[data-toggle="tooltip"]').tooltip();

        angular.element(".glyphicon-refresh-animate").hide();
        chrome.storage.sync.get('username', function (result) {
            $scope.username = result.username;
            $http.get(URL + 'users/' + $scope.username)
            .then(function(response) {
                $scope.user = response.data;
                $scope.logo = $scope.user.logo ? $scope.user.logo : 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png';
                $scope.background = {
                    'background': 'url("' + $scope.logo + '") no-repeat right / 35px content-box',
                    'padding': '5px 5px 5px 12px'
                };
            });
        });
        chrome.storage.sync.get('counter', function (result) {
            $scope.counter = result.counter;
        });
        chrome.storage.sync.get('limit', function (result) {
            $scope.limit = result.limit;
        });
        chrome.storage.sync.get('animation', function (result) {
            $scope.animation = result.animation;
        });
    }

    $scope.onChange = function() {
        chrome.storage.sync.set({'username': $scope.username});
        chrome.storage.sync.set({'counter': parseFloat($scope.counter)});
        chrome.storage.sync.set({'limit': $scope.limit});
        chrome.storage.sync.set({'animation': $scope.animation});
        angular.element('.glyphicon-refresh-animate').fadeIn('fast');

        cancelRefresh = $timeout(function callback() {
            angular.element('.glyphicon-refresh-animate').fadeOut('fast');
            $http.get(URL + 'users/' + $scope.username)
            .then(function(response) {
                $scope.user = response.data;
                $scope.logo = $scope.user.logo ? $scope.user.logo : 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png';
                $scope.background = {
                    'background': 'url("' + $scope.logo + '") no-repeat right / 20px content-box'
                };
            });
        }, 1000);
    }
});