/* global _gaq */

/* exported TrackEvent */
function TrackEvent(category, action, label, url) {
	try {
		_gaq.push(['_trackEvent', category, action, label]);

		if (url) {
			setTimeout(function() {
				document.location.href = url;
			}, 1000);
			return false;
		}

		return true;
	} catch(e) {
		//Do nothing, it's just a track event.
	}
}