"use strict";
//-- BASE FUNCTIONS AND DATA ----------------------------------------------------

//-- GENERAL GLOBAL DATA ---------------------------------------
	var GAME_WIDTH = 800;

	//pixel size of each distance unit
	var UNIT_DISTANCE = 80;  
	 // duration of unit time in frames (duration of every unit action and same as framerate)
	var UNIT_TIME = 30;

	//default messages - converted to separate objects for future implementation of modifiable language files
	var LANG_ENG = {
		defMsg: 'All Good!',
		defError: 'There was an error!'
	};

	var LANG_ESP = {
		defMsg: 'Todo Bien!',
		defError: 'Hubo un error!'
	};


//-- END GLOBAL DATA -------------------------------------------

//-- Result object prototype -----------------------------------
	var protoResult = { 
		success: true,
		messageEng: LANG_ENG['defMsg'], 
		messageEsp: LANG_ESP['defMsg'] 
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

	//check if an element has a certain class or multiple classes
	function classCheck(element, classesToCheck) {
		var newClasses = classesToCheck.replace(/\s+/g,'').split(",");
		var currentClasses = element.className.trim().replace(/\s+/g,' ') + ' ';
		var ind = newClasses.length;
		var hasClass = true;

        while(ind--) {
			var testTerm = new RegExp(newClasses[ind] +' ');
            if (!testTerm.test(currentClasses)) {
                hasClass = false;
                break;
            }  
 		}
 		return hasClass;
 	}

	//add a class or multiple classes to an element
 	function addClass(element, classesToAdd) {		
		var newClasses = classesToAdd.replace(/\s+/g,'').split(",");		
		var newClassName = element.className.trim().replace(/\s+/g,' ') + ' ';
        var len = newClasses.length;
        var ind = 0;
		while(ind < len) { 
			var testTerm = new RegExp(newClasses[ind] + ' ');
            if (!testTerm.test(newClassName)) {
				//current className doesn't contain class - add it
				newClassName += newClasses[ind] + ' ';			
 			}
            ind++;
 		}

		element.className = newClassName.trim();
 	}

	//remove a class or multiple classes from an element
 	function removeClass(element, classesToRemove) { 
		var classes = classesToRemove.replace(/\s+/g,'').split(",");
		var ind = classes.length;
		var newClass = element.className.trim().replace(/\s+/g,' ') + ' ';
		while(ind--) { 
        //remove class
			newClass = newClass.replace(classes[ind] + ' ','');
		}
		element.className = newClass.trim();
 	}

	//toggle class or multiple classes on and off 
	function toggleClass(element, classesToToggle) {
        var classes = classesToToggle.replace(/\s+/g,'').split(",")
		var newClassName = element.className.trim().replace(/\s+/g,' ') + ' ';
		var len = classes.length;
        var ind = 0;
        while (ind < len) {
            var testTerm = new RegExp(classes[ind] + ' ');
            if (testTerm.test(newClassName)) {
                //class exists - remove it
                newClassName = newClassName.replace(classes[ind] + ' ', '');
            } else {
                //class doesn't exist - add it
                newClassName += classes[ind] + ' ';
            }
            ind++;
        }
        element.className = newClassName.trim();               
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



