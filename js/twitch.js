    $( document ).ready(function() {
    var reloadStreamersDuration = 600000
    var fadeInDuration = "normal";

    if (localStorage.getItem("username") != null) {
        showStreamers(localStorage["username"]);

        /*setInterval(function () {
            $(".streamers").empty();
            showStreamers(localStorage["username"]);
        }, reloadStreamersDuration);*/
    }

    var username = $("#username");
    username.val(localStorage.getItem("username"));

    $("#login").click(function () {
        localStorage.setItem("username", username.val());
        location.reload();
    });

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
                            $("#online").append("<p><a class='text-success' target='_blank' href='" + value.channel.url + "'>" + value.channel.display_name + "</a></p>").hide().fadeIn(fadeInDuration);
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
                        else {
                            $("#offline").append("<p><a class='text-danger' target='_blank' href='" + value.channel.url + "'>" + value.channel.display_name + "</a></p>").hide().fadeIn(fadeInDuration);
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
});