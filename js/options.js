var twitch = angular.module('twitch', []);
twitch.constant('URL', 'https://api.twitch.tv/kraken/');
twitch.constant('CLIENTID', 'qh95apsorfl1quetwoekq68t5vgzjbq');
twitch.controller('OptionsController', function($scope, $timeout, $http, URL, CLIENTID){
    $scope.close = function() {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id);
        });
    }
    $scope.options = function() {
        $scope.manifest = chrome.runtime.getManifest();
        $('[data-toggle="tooltip"]').tooltip();

        angular.element('.glyphicon-refresh-animate').hide();
        chrome.storage.sync.get('username', function (result) {
            $scope.username = result.username;
            $http.get(URL + 'users/' + $scope.username + '?client_id=' + CLIENTID)
            .then(function(response) {
                setLogo(response);
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
            $http.get(URL + 'users/' + $scope.username + '?client_id=' + CLIENTID)
            .then(function(response) {
                setLogo(response);
                angular.element('.glyphicon-refresh-animate').fadeOut('fast');
            });
        }, 1000);
    }
    function setLogo (response) {
        $scope.logo = response.data.logo ? response.data.logo : chrome.extension.getURL('img/default-logo.png');
        $http.get(URL + 'streams/' + $scope.username + '?client_id=' + CLIENTID)
        .then(function(response) {
            if (response.data.stream != null) {
                $scope.background = {
                    'background': 'url("' + $scope.logo + '") no-repeat right / 35px content-box, url("' + chrome.extension.getURL('img/red-dot.png') + '") no-repeat right 40px center / 10px content-box',
                    'padding': '5px 5px 5px 12px'
                };
            }
            else {
                $scope.background = {
                    'background': 'url("' + $scope.logo + '") no-repeat right / 35px content-box',
                    'padding': '5px 5px 5px 12px'
                };
            }
        });
    }
});