const URL = 'https://api.twitch.tv/kraken/';

setStorageVariables();
getStreamers();
setAndListenOnAlarm();

function setStorageVariables() {
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
    chrome.storage.sync.get('animation', function (result) {
        if (result.animation == null) {
            chrome.storage.sync.set({'animation': 0.5});
        }
    });
}

function setAndListenOnAlarm() {
    chrome.storage.sync.get('counter', function (result) {
        chrome.alarms.create('alarm', {
            delayInMinutes : result.counter, 
            periodInMinutes: result.counter
        });
        chrome.alarms.onAlarm.addListener(function(alarm) {
            if (alarm.name == 'alarm') {
                getStreamers();
            }
        });
    });
}

function getStreamers() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            sendResponse({
                msg: request.greeting
            });
            chrome.browserAction.setBadgeText ({ text: request.greeting});
        });

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            sendResponse({
                msg1: request.greeting1
            });
            chrome.browserAction.setBadgeText ({ text: request.greeting1});
        });
    chrome.browserAction.setBadgeText ({ text: '0'});

    chrome.storage.sync.get('username', function (result) {
        chrome.storage.sync.get('limit', function (result1) {
            var online = 0;
            $.ajax({
                url: URL + 'users/' + (result.username ? result.username : 'twitch')  + '/follows/channels?limit=' + result1.limit,
                dataType: 'json',
                success: function(data) {
                    $.each(data.follows, function (key, value) {
                        $.ajax({
                            url: URL + 'streams/' + value.channel.name,
                            dataType: 'json',
                            success: function(response) {
                                if (response.stream != null) {
                                    online++;
                                    chrome.browserAction.setBadgeText ({ text: online.toString()});
                                }
                            }
                        });
                    });
                },
                error: function (error) {
                }
            });
        });
    });
}