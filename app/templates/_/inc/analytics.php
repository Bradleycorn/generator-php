<?php
	//Code can go here to set the $VirtualPageView if necessary
?>
<script>
    var _gaq=[['_setAccount','<?php echo(ANALYTICS_ID); ?>']];
	_gaq.push(['_trackPageview'<?php if ($VirtualPageView != '') echo(", '" . $VirtualPageView . "'"); ?>]);
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src='//www.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g,s)}(document,'script'));
</script>