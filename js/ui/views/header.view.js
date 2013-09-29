define(["jquery", "../event.manager.js"], function($, eventManager) {
	// UI Instance Variables
	var resizeButton = $("#header-content-window-controls-resize");

	// Exports
	return {
		/**
		 * Initializes the header module.
		 */
		init: function() {
			// Window controls
			$("#header-content-window-controls-minimize").click(function() {
				eventManager.trigger("window:minimize");
			});
			$("#header-content-window-controls-close").click(function() {
				eventManager.trigger("window:close");
			});
			resizeButton.click(function() {
				eventManager.trigger("window:resize", {
					maximized: resizeButton.hasClass("maximized")
				});
			});
			// All done!
			console.log("Header View initialized");
		},
		setResizeButtonMaximized: function() {
			resizeButton.addClass("maximized");
		},
		setResizeButtonUnmaximized: function() {
			resizeButton.removeClass("maximized");
		}
	}
});