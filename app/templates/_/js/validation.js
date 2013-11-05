function validEmail(email) {
	//An empty email is valid.
	//If you want to check for empty, call the hasValue() method.
	if (email === "") {
		return true;
	}

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function hasValue(text) {
	return (text !== "");
}

function validateField($field) {
		var success = true;

		//Stores the valdation tests to check for this element.
		var tests = $field.data("validate");
		var errorField = $field.data("errorField");

		for(var i=0;i<tests.length;i++) {
			switch(tests[i]) {
				case "required":
					success = hasValue($field.val());
					break;
				case "email":
					success = validEmail($field.val());
					break;
			}
			if (!success) {
				break; //Exit the for loop. No need to continue if we've got an error.
			}
		}

		if (!success) {
			//This element has errors, so show it's error message.
			$("#" + errorField).addClass("visible");
		} else {
			//no errors, hide the error field
			$("#" + errorField).removeClass("visible");
		}

		return success;
}

$(document).ready(function() {
	$("form.validate").submit(function(e) {
		var success = true;

		//Get all form fields with a data-validate attribute
		$(this).find("*[data-validate]").each(function() {
			if (!validateField($(this))) {
				success = false;
			}
		});

		if (!success) {
			e.preventDefault();
		}
	});

	$("form.validate *[data-validate]").blur(function() {
		validateField($(this));
	});
});