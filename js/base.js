"use strict";
//-- BASE FUNCTIONS AND DATA ----------------------------------------------------

//-- GENERAL GLOBAL DATA ---------------------------------------
	//default messages
	var GAME_WIDTH = 800;
	var msgEng = 'All Good!';
	var msgEsp = 'Todo Bien!';
	var msgErrorEng = 'There was an error!';
	var msgErrorEsp = 'Hubo un error!';

//-- END GLOBAL DATA -------------------------------------------

//-- Result object prototype -----------------------------------
	var protoResult = { 
		success: true,
		messageEng: msgEng, 
		messageEsp: msgEsp 
	};
//--------------------------------------------------------------

//-- HELPER FUNCTIONS ------------------------------------------
	//check if variable is function
	//Source - Alex Grande - StackOverflow  - Answer 09/09/11
	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	//get random integer between a specific range
	//Source - Ionuț G. Stan - StackOverflow - Answer 06/10/09
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//truncate decimals to floor
	function floorTrunc(num, numDecimals) {
	    var strNum = String(num);
	    var pointPos = strNum.indexOf('.');
	    strNum = strNum.slice(0, pointPos + numDecimals + 1);
	    return parseFloat(strNum);
	}

	//truncate  decimals to ceiling
	function ceilTrunc(num, numDecimals) {

	}

	//truncate decimals while rounding
	function roundTrunc(num, numDecimals) {

	}

	//delete all child nodes from element
	//Source - Gabriel McAdams - StackOverflow - Answer 17/10/10
	function empty(element) {
		while (element.firstChild) {
   			 element.removeChild(element.firstChild);
		}
	}

	//check if an element has a certain class
	function classCheck(element, classToCheck) {
		var classes = classToCheck.replace(/\s+/g,'').split(",");
		var elementClass = element.className;
		var hasClass = false;
		var ind = classes.length;

		while(ind--) {
			var testStr = new RegExp(classes[ind]);
			if (testStr.test(elementClass)) {
				hasClass = true;
			} else {
				hasClass = false;
				break;
			}
		}
		return hasClass;
	}

	//add a class or multiple classes to an element
	function addClass(element, classToAdd) {
		if (!(classCheck(element, classToAdd))) {
			//element doesn't have class - add it
			var classes = classToAdd.replace(/\s+/g,'').split(",");
			var ind = classes.length;
			var newClass = element.className.trim();

			while(ind--) { //agregate separate classes
				newClass += ' ' + classes[ind];			
			}
			
			element.className = newClass;
		}
	}

	//remove a class or multiple classes from an element (in the case of multiple classes
	//the element must contain ALL the classes or the function fails)
	function removeClass(element, classToRemove) { 
		if (classCheck(element, classToRemove)) {
			//element has class - remove it
			var classes = classToRemove.replace(/\s+/g,'').split(",");
			var ind = classes.length;
			var newClass = element.className;

			while(ind--) { //agregate separte classes
				newClass = newClass.replace(classes[ind],'');
			}
			
			element.className = newClass.trim();
		}
	}

	//toggle class or multiple classes on and off - for multiple classes 
	//element must either contain all classes supplied to toggle off or none of them to toggle on
	function toggleClass(element, classToToggle) {
		if (classCheck(element, classToToggle)) { 
			//element has class  - remove it
			removeClass(element, classToToggle);
		} else {
			//element doesn't have class add it
			addClass(element, classToToggle);
		}
	}

	//modify multiple elements with similar function
	function modifyMultiple(elements, process) {
		var ind = elements.length;
		while(ind--) {
			process(elements[ind]);
		}
	}

	//bind similar event to multiple objects
	function bindMultiple(elements, event, handler) {
		var ind = elements.length;

		while(ind--) {
			elements[ind][event] = function(event) {
				handler(this, event);
			};
		}
	}
//-- END HELPER FUNCTIONS --------------------------------------

//-- LOCAL STORAGE FUNCTIONS------------------------------------
	//store user data 
	function storeUserData(userObj, isNewUser) {
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
	}

	//retreive user data - returns user object if user exists - returns false if not
	function getUserData(userName) {
		var checkUser = localStorage.getItem(userName);
		if (checkUser) {
			//user exists get data and return 
			var retreivedUser = JSON.parse(checkUser);
			return retreivedUser;

		} else {
			//user doesn't exist return false
			return false;
		}
	}
//-- END LOCAL STORAGE FUNCTIONS -------------------------------

//-- LOAD DATA (IMAGES, SOUND ETC)------------------------------
	//Load Images
	function loadImages(sources, callback) {
    	var images = {};

        for(var src in sources) {
          	images[src] = new Image();
          	images[src].onload = callback;
          	images[src].src = sources[src];
        }
        return images;
    }
//-- END LOAD DATA----------------------------------------------



