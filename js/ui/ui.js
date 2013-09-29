define(["./presenters/window.presenter.js"], function(windowPresenter) {
	// Exports
	return {
		/**
		 * Initializes the ui module.
		 */
		init: function() {
			// Initialize top-level presenters
			windowPresenter.init();
			// All Done!
			console.log("UI initialized");
		}
	}
});