define(["../event.manager.js", "./header.presenter.js", "./prompt.presenter.js"], function(eventManager, headerPresenter, promptPresenter) {
	// Bootstap the view
	var view = chrome.app.window.current();
	// Handle window visibility events
	eventManager.on("window:minimize", function() {
		view.minimize();	
	});
	eventManager.on("window:close", function() {
		view.close();	
	});
	eventManager.on("window:resize", function(args) {
		if (args.maximized) {
			view.restore();
			eventManager.trigger("header:unmaximized");
		} else {
			view.maximize();
			eventManager.trigger("header:maximized");
		}
	});

	// Exports
	return {
		/**
		 * Initializes the header module.
		 */
		init: function() {
			// Initialize child presenters
			headerPresenter.init();
			promptPresenter.init();
			// All done!
			console.log("Window Presenter initialized");
		}
	}
});