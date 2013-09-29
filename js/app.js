// Configure the require lib with all our other libs
require.config({
	baseUrl: "js/lib",
	paths: {
		jquery: "jquery-2.0.3.min", // jQuery
        io: "socket.io",
		googleApi: "gapi-client.min", // Google API JS Client
	}
});

// Start the main app logic.
require(["./js/ui/event.manager.js", "./js/dal/dal.js", "./js/ui/ui.js"], function (eventManager, dal, ui) {
    $(function () {
        eventManager.trigger("prompt:present");
    });
    // Initialize modules
    dal.init();
    ui.init();
});