define(["jquery", "../event.manager.js", "../views/header.view.js"], function($, eventManager, view) {
	// Handle header ui events
	eventManager.on("header:unmaximized", function() {
		view.setResizeButtonUnmaximized();
	});
	eventManager.on("header:maximized", function() {
		view.setResizeButtonMaximized();
	});
	

	// Exports
	return {
		/**
		 * Initializes the header module.
		 */
		init: function() {
			// Initialize view
			view.init();
			// All done!
			console.log("Header Presenter initialized");
		}
	}
});