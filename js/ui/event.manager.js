define([], function() {
	var eventManager = new Object();
	_.extend(eventManager, Backbone.Events);
	// Event Logging
	eventManager.on("all", function (eventName, args) {
		console.log("Event triggered: " + eventName + "(" + JSON.stringify(args) + ")");
	});
	// Exports
	return eventManager;
});