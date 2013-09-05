<?php
	function setSectionInfo() {
		global $SiteSection, $SubSection;
		$SiteSection = "";
		$SubSection = "";

		$path = parse_url($_SERVER['PHP_SELF'], PHP_URL_PATH);
		$pathInfo = trim(pathinfo($path, PATHINFO_DIRNAME));

		if ($pathInfo != "/") {
			$pathInfo = trim($pathInfo, "/");
			$pathParts = explode("/",$pathInfo);
			$SiteSection = $pathParts[0];

			if (count($pathParts) > 1) {
				$SubSection = $pathParts[1];
			}
		} else {
			if (basename($_SERVER['SCRIPT_NAME']) == "index.php") {
				$SiteSection = "home";
			}
		}
	}

	function slugify($text, $makeLowerCase = true) { 
		// replace non letter or digits by -
		$text = preg_replace('~[^\\pL\d]+~u', '-', $text);

		// trim
		$text = trim($text, '-');

		// transliterate
		$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

		// lowercase
		if ($makeLowerCase) {
			$text = strtolower($text);
		}

		// remove unwanted characters
		$text = preg_replace('~[^-\w]+~', '', $text);

		if (empty($text)) {
			return 'n-a';
		}

		return $text;
	}

	function ScrubText($text) {
		if (!isset($text) || trim($text)==='') {
			return '';
		}

		return trim($text);
	}

	function SendMail($to, $subject, $message, $html = true, $from = FROM_EMAIL) {
		$headers = "";
		if ($html) {
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		}
		$headers .= "From: " . $from;

		return mail($to, $subject, $message, $headers);
	}

	function HasFormError($fieldName) {
		global $FormErrors;

		if (isset($FormErrors[$fieldName])) {
			return $FormErrors[$fieldName];
		}

		return false;
	}

?>