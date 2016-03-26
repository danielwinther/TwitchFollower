    showStreamers(localStorage["username"]);
    setInterval(function () {
            showStreamers(localStorage["username"]);
            chrome.browserAction.setBadgeText ( { text: onlineCounter.toString()});
    }, 60000 * 15);


function showStreamers(username) {
        onlineCounter = 0;
        $.ajax({
        url: "https://api.twitch.tv/kraken/users/" + username + "/follows/channels",
        dataType: 'json',
          success: function(data) {
            $.each(data.follows, function (key, value) {
                $.ajax({
                    url: 'https://api.twitch.tv/kraken/streams/' + value.channel.name,
                    dataType: 'json',
                    success: function(data) {
                        if (data.stream != null) {
                            onlineCounter++;
                            if (onlineCounter > 999) {
                                chrome.browserAction.setBadgeText ( { text: "999+"});
                            }
                            else {
                                chrome.browserAction.setBadgeText ( { text: onlineCounter.toString()});
                            }
                        }
                      }
                    });
                });
            },
            error: function (error) {
                localStorage.removeItem("username");
                location.reload();
            }
        });
    }