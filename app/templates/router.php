<?php
// router.php

//Files in the foundation folder (if present) should be ignored by all rules below.
if (preg_match('/_\/(bower_components|foundation).*?\.css/', $_SERVER["REQUEST_URI"])) {
	return false;
}

//Handle CSS files, serving up the pre-processed file from the .tmp folder instead of the app folder.
if (preg_match('/\.(?:css)$/', $_SERVER["REQUEST_URI"])) {
    $serverPath = $_SERVER["DOCUMENT_ROOT"];
    //$urlPath = str_ireplace("/", "\\", $_SERVER["REQUEST_URI"]);
    $urlPath = $_SERVER["REQUEST_URI"];

    $filePath = str_ireplace("app", ".tmp", $serverPath . $urlPath);
	header('Content-type: text/css');
    echo(file_get_contents($filePath));
} else {
	return false;
}
?>