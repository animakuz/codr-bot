//BASE FUNCTIONS AND STUFF (SEPARATED TO MAKE IT EASIER TO WORK)

//GENERAL GLOBAL DATA

//default messages
var msgEng = 'All Good!';
var msgEsp = 'Todo Bien!';
var msgErrorEng = 'There was an error!';
var msgErrorEsp = 'Hubo un error!';

//array containing objects navigated to (for implementing back button)
var navList = []; 

//result object prototype
var protoResult = { 
	success: true,
	messageEng: msgEng, 
	messageEsp: msgEsp 
};

//Source - Alex Grande - StackOverflow  - Answer 09/09/11
var isFunction = function(functionToCheck) {
	//check if variable is function
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

//helper functions 
var classCheck = function(element, classToCheck) {
	//check if an element has a certain class
	var classes = classToCheck.replace(/\s+/g,'').split(",");
	var elementClass = element.className;
	var hasClass = false;
	var i, len=classes.length;

	for (i=0; i<len; i++) {
		var testStr = new RegExp(classes[i]);
		if (testStr.test(elementClass)) {
			hasClass = true;
		} else {
			hasClass = false;
			break;
		}
	}

	return hasClass;
};

var addClass = function(element, classToAdd) {
	//TODO - MAKE THIS WORK WITH ARRAYS OF OBJECTS OR SINGLE OBJECTS
	if (!(classCheck(element, classToAdd))) {
		//element doesn't have class - add it
		var classes = classToAdd.replace(/\s+/g,'').split(",");
		var i, len = classes.length;
		var newClass = element.className.trim();

		for (i=0; i<len; i++) { //agregate separte classes
			newClass += ' ' + classes[i];			
		}
		
		element.className = newClass;
	}
};

var removeClass = function(element, classToRemove) { 
	//TODO - HERE TO
	if (classCheck(element, classToRemove)) {
		//element has class - remove it
		var classes = classToRemove.replace(/\s+/g,'').split(",");
		var i, len = classes.length;
		var newClass = element.className;

		for (i=0; i<len; i++) { //agregate separte classes
			newClass = newClass.replace(classes[i],'');
		}
		
		element.className = newClass.trim();
	}
};

var toggleClass = function(element, classToToggle) {
	if (classCheck(element, classToToggle)) { 
		//element has class  - remove it
		removeClass(element, classToToggle);
	} else {
		//element doesn't have class add it
		addClass(element, classToToggle);
	}
};

var modifyMultiple = function(elements, action) {
	var i, len= elements.length;
	for (i=0; i<len; i++) {
		action(elements[i]);
	}
};

var switchScreens = function(activeScreen, screenToSwitch) {
	removeClass(activeScreen, 'gui-active');
	addClass(screenToSwitch, 'gui-active');
};

var valInput = function(element, pattern) {
	var inputType = element.type;
	var value = element.value;
	var name = element.getAttribute('name');
	var result = Object.create(protoResult);

	if (value == '') {
		//TODO - MAKE PROPER EMPTY STRING VALIDATION WITH REGEX
		result.success = false;
		result.messageEng = "Please fill in all fields!";
		result.messageEsp = "Por favor llenar todos los campos!";
	} else {
		switch(inputType) {
			case 'text':
				if (pattern) {
					//TODO - MAKE THIS WORK - checking for patterns in username and such
					if (!(pattern.test(value))) {
						result.success = false;
						result.messageEng = "";
						result.messageEsp = "";
					}
				}
				break;

			case 'number':
				if (isNaN(value)) {
					result.success = false;
					result.messageEng = "Enter only numbers in the " + name + " field!";
					result.messageEsp = "Introducir solamente numeros en el campo de " + name + "!";
				}
				break;

			case 'email':
				//TDOD - proper email regex
				if (value.indexOf('@') == -1) {
					result.success = false;
					result.messageEng = "Please enter a valid email adress!";
					result.messageEsp = "Por favor introduzca un correo valido!";
				}
				break;
		}
	}

	return result;	
};


var clearFields = function(parentContainer) {
	//clear all the fields in a certain parent
	var inputs = parentContainer.querySelectorAll('input');
	var i;
	for (j=0; j<inputs.length; j++) {
		inputs[j].value = '';
	}
};


//LOCAL STORAGE FUNCTIONS

//store user data 
var storeUserData = function(userObj, isNewUser) {
	//isNewUser specifies if the user data is for a new user 
	var result = Object.create(protoResult);

	if (isNewUser) {
		//check if username already exists
		if (localStorage.getItem(userObj.user)) {
			//username already exists - send error stuff
			result.messageEng = 'This username is not available!';
			result.messageEsp = 'Este nombre de usuario no está dispnible';
			result.success = false;
		} else {
			//user doesn't exist - create it
			//TODO - MAKE ENCRYPTED PASSWORDS
			var userStr = JSON.stringify(userObj);
			localStorage.setItem(userObj.user, userStr);

			if (localStorage.getItem(userObj.user)) {
				//user data successfully stored - update number of users and set response messages
				var numUsers = localStorage.getItem('numUsers') || 0;
				numUsers++;
				localStorage.setItem('numUsers', numUsers);
				result.messageEng = 'Your user profile successfully created!';
				result.messageEsp = 'Su usuario fue creado exitosamente!';
				result.success = true;
			} else {
				//data item not found after using set item implies there was an error with storage?
				result.messageEng = 'There was an error in creating your profile!';
				result.messageEsp = 'Hubo un error en la creación de su usuario!';
				result.success = false;
			}
		}


	} else {
		//not new user - update existing user

		//check if user exists
		if (localStorage.getItem(userObj.user)) {
			//user exists update - set response messages
			localStorage.setItem(userObj.user, JSON.stringify(userObj));
			result.messageEng = 'Your profile was successfully updated!';
			result.messageEsp = 'Su usuario fue actualizado exitosamente!';
			result.success = true;
		} else {
			//user doesn't exist - set error messages
			result.messageEng = 'There was an error in updating your profile!';
			result.messageEsp = 'Hubo un error en la actualización de su usuario!';
			result.success = false;
		}
	}

	return result;
};

//retreive user data - returns user object if user exists - returns false if not
var getUserData = function(userName) {
	var checkUser = localStorage.getItem(userName);
	if (checkUser) {
		//user exists get data and return 
		var retreivedUser = JSON.parse(checkUser);
		return retreivedUser;

	} else {
		//user doesn't exist return false
		return false;
	}
};


//bind similar event to multiple objects
var bindMultiple = function(elements, event, handler) {
	var i, len = elements.length;

	for (i=0; i<len; i++) {
		elements[i][event] = function(event) {
			handler(this, event);
		};
	}
};
