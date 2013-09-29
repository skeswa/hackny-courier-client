define(["jquery", "io", "../event.manager.js"], function($, io, eventManager) {
    var promptHtml = "<div class=\"input-group\">\r\n    <span class=\"input-group-addon\">@<\/span>\r\n    <input type=\"text\" id=\"prompt-userId\" class=\"form-control\" placeholder=\"Username\">\r\n<\/div> <p class=\"modal-info\">Feel free to select a geographical scope, relative to you, in order to join the conversation:<\/p>";
    var notificationTemplateHtml = "<div class=\"alert alert-<%= type %>\">\r\n    <a href=\"#\" class=\"alert-link\"><%= message %><\/a>\r\n<\/div>"
    var messageTemplateHtml = "<div class=\"panel panel-default <%= orientation %>\">\r\n    <div class=\"panel-timestamp\"><%= timestamp %><\/div>\r\n    <div class=\"panel-heading\"><%= from %><\/div>\r\n    <div class=\"panel-body\"><%= message %><\/div>\r\n<\/div>";
    // Constants
    var WS_URL = /*"courier.nodejitsu.com";*/ "sandile.me";
    var WS_PORT = 16558;
    // Instance variables
    var userId = null;
    var locale = null;
    var currentSession = null;
    var currLat = null;
    var currLong = null;

    // Geoloc subroutines
    function distance(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var radlon1 = Math.PI * lon1 / 180
        var radlon2 = Math.PI * lon2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        return dist
    }
    var updatePosition = function (callback) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position);
            currLat = position.coords.latitude;
            currLong = position.coords.longitude;
            callback(currLat, currLong);
        }, function(positionError) {
            addNotification("danger", "We were blocked from getting Location.");
        });
    };
    // Bootstrapping subroutines
    var addNotification = function(type, message) {
        var html = notificationTemplateHtml
        .replace("<%= type %>", type)
        .replace("<%= message %>", message);

        $("#log-inner").append(html);
        console.log($("#log")[0].scrollHeight);
        $("#log").scrollTop($("#log")[0].scrollHeight);
    };
    var addMessage = function(msg, from, loc, ts) {
        var html = messageTemplateHtml
        .replace("<%= timestamp %>", ts)
        .replace("<%= orientation %>", (from === "Me") ? "right" : "left")
        .replace("<%= from %>", (from === "Me") ? from : ("@" + from))
        .replace("<%= message %>", msg);

        $("#log-inner").append(html);
        console.log($("#log")[0].scrollHeight);
        $("#log").scrollTop($("#log")[0].scrollHeight);
    };
    var joinSession = function(localeId) {
        userId = escape($("#prompt-userId").val());
        console.log(userId);
        switch (localeId) {
            case 0:
                // Building
                locale = "Building";
                break;
            case 1:
                // Block
                locale = "Block";
                break;
            case 2:
                // Neighborhood
                locale = "Neighborhood";
                break;
            case 3:
                // City
                locale = "City";
                break;
        };
        addNotification("success", "Now listening at the '" + locale + "' scope.");
        var ws = io.connect("ws://" + WS_URL + ":" + WS_PORT);
        ws.on("connect", function(sock) {
            addNotification("info", "Joined session successfully.");
            currentSession = ws;

            if (sock) {
                sock.on('disconnect', function () {
                    addNotification("danger", "Session was brutally murdered by Wifi.");
                    currentSession = null;
                });
            }
        });
        ws.on("message", function(data) {
            addMessage(data['message'], data['pseudo'], data['location'], new Date().toISOString(), false);
        });
        ws.on('nbUsers', function(msg) {
            addNotification("info", "Number of concurrent users now " + msg.nb + ".");
            console.log("Number of users = " + msg.nb);
        });
        ws.on('disconnect', function () {
            addNotification("danger", "Session was brutally murdered by Wifi.");
            currentSession = null;
        });
        ws.emit("setPseudo", userId);
        ws.on("pseudoStatus", function(data) {
            if (data == "ok") {
                bootbox.hideAll();
                $("#chat-box").focus();
            } else {
                addNotification("danger", "The internet jacked us.");
                console.log("OHHhhh NOOOOOooooooo....");
                console.log(data);
            }
        });

        $("#chat-box").bind('keypress', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                sendMessage();
            }
        });
        $("#chat-button").click(function() {
            sendMessage();
        });
        updatePosition(function () {
            addNotification("success", "Location locked to (" + currLat + ", " + currLong + ")");
        });
    };

    var sendMessage = function() {
        if (currentSession && $("#chat-box").val() && (currLat !== null && currLat !== null)) {
            var jsonObj = {
                msg: $("#chat-box").val(),
                loc: {
                    latitude: currLat,
                    longitude: currLong
                }
            };
            currentSession.emit("message", jsonObj);
            addMessage($("#chat-box").val(), "Me", null, new Date().toISOString(), true);
            $("#chat-box").val("");
            $("#chat-box").focus();
        }
    };

    // Handle header ui events
    eventManager.on("prompt:present", function() {
        bootbox.dialog({
            message: promptHtml,
            title: "Welcome to Courier",
            buttons: {
                building: {
                    label: "Building",
                    className: "btn-primary",
                    callback: function() {
                        joinSession(0);
                    }
                },
                block: {
                    label: "Block",
                    className: "btn-info",
                    callback: function() {
                        joinSession(1);
                    }
                },
                area: {
                    label: "Neighborhood",
                    className: "btn-success",
                    callback: function() {
                        joinSession(2);
                    }
                },
                city: {
                    label: "City",
                    className: "btn-warning",
                    callback: function() {
                        joinSession(3);
                    }
                }
            }
        });
    });


    // Exports
    return {
        /**
         * Initializes the header module.
         */
        init: function() {
            // All done!
            console.log("Prompt Presenter initialized");
        }
    }
});