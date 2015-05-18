// Project Title: Programaquina y los Secretos del Planeta Algoritmus
// Author: Marcus Baptiste - ID: R0032401

/* TODO 
	- FIX STUFF COMMENTED WITH TODO
	- MAKE PROPER MESSAGE DISPLAYING FUNCTION SIMILAR TO SWEET ALERT BUT STYLED TO THE GAME
	- KEEP WORKING AND FINISH THIS SHIIIIIT

*/
//general global data
var language = 'Esp';

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
var setUserData = function(userObj, isNewUser) {
	//newObj specifies if the variable is to be newly stored (has to create new ID and 
	//localstorage variable)
	var result = Object.create(protoResult);

	if (isNewUser) {
		//new user - increase value of stored users - create ID and add
		var numUsers = localStorage.getItem('numUsers') || 0;

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
				//user data successfully stored - update number of users and output messages
				numUsers++;
				localStorage.setItem('numUsers', numUsers);
				result.messageEng = 'Your user profile successfully created!';
				result.messageEsp = 'Su usuario fue creado exitosamente!';
				result.success = true;
			} else {
				//show error messages
				result.messageEng = 'There was an error in creating your profile!';
				result.messageEsp = 'Hubo un error en la creación de su usuario!';
				result.success = false;
			}
		}


	} else {
		//not new user - only update

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
	var result = false;
	var checkUser = localStorage.getItem(userName);
	if (checkUser) {
		//user exists get data and return 
		return JSON.parse(checkUser);
	} else {
		//user doesn't exist return false
		return false;
	}
};





window.onload = function() {
	//user currently logged in 
	var currentUser;

	//interface elements
	//main divisions
	var wrapper = document.getElementsByClassName("wrapper")[0];
	var appContainer = document.getElementsByClassName("app-container")[0];
	var logoContainer = document.getElementsByClassName("logo-container")[0];

	//gui overlay
	var guiOverlay = document.getElementsByClassName("gui-overlay")[0];
	var userCreate = document.getElementsByClassName("user-create")[0];
	var userSelect = document.getElementsByClassName("user-select")[0];
	var userSession = document.getElementsByClassName("user-session")[0];
	var userSessionBar = document.getElementsByClassName("user-session-bar")[0];
	var gameMenu = document.getElementsByClassName("game-menu")[0] ;
	var gameOptions = document.getElementsByClassName("game-options")[0];
	var levelSelect = document.getElementsByClassName("level-select")[0];

	//code panel
	var cpGUI = document.getElementsByClassName("code-panel");
	var cpViewToggle = document.getElementsByClassName("cp-view-toggle")[0];
	var cpAdd = document.getElementsByClassName("cp-add")[0];
	var cpDelete = document.getElementsByClassName("cp-delete")[0];
	var cpRun = document.getElementsByClassName("cp-run")[0];
	var cpContent = document.getElementsByClassName("cp-content")[0];

	//game view
	var gameCanvas = document.getElementsByClassName("game-canvas")[0];
	
	//specific items identified by id (specific buttons, fields, etc)
	//login form send button
	var btnLogin = document.getElementById('btn-login');

	//login form link to create user
	var linkCreateUser = document.getElementById('btn-create-profile');

	//create user save button
	var btnCreateUser = document.getElementById('btn-create-user');

	//user session show profile and exit links
	var linkSessionProfile = document.getElementById('user-session-profile');
	var linkSessionExit = document.getElementById('user-session-exit');

	//back buttons
	var backButtons = document.querySelectorAll('.back-button');

	//--GAME BASE FUNCTIONS AND OBJECTS----------------------------------------------------------------

	//game objects
	var createGameObjects = function(xPos, yPos, tipo) {
		//these objects will only store information on the game object. The game engine
		//will be responsible for rendering the visual element
		return {
			xPos: xPos,
			yPos: yPos,
			tipo: tipo
		};
	};


	//game levels
	var createLevel = function(id, title, options) {
		//create level object
		return {
			id: id,
			title: title,
			obstacles: [ ], //array of obstacle game objects
			tools: [], //array of tools game objects
			goal: { }, //location of goal
			gaps: [ ], //array of gap locations
			intro: { }, 
			allowedCodeBits: [ ], //array of code bits allowed
			hints: [ ] //array of hints to be shown
		};
	};


	//code-bit (fragments of code - instruction bits to be place code panel) 
	var createCodeBit = function(name, type, position, number) {
		var codeBit = {
			name: name,
			type: type,
			position: position,
			number : number
		};

		if (type === 'loop') {
			//make code bit object for loop

		} else if (type === 'condIf') {
			//make code bit object for start condition 

		} else if (type === 'condElse') {
			//make code bit object for else condition

		} else if (type === 'function') {
			//make code bit object for function

		} else {
			//make code bit object for any other instruction

		}

		return codeBit;
	};

	//characters 
	var avatar = {
		name: "P-1",
		xPos: 0,
		yPos: 0,
		graphic: { /* graphics data (using image sprits) */},
		theme: "default",
		animation: {
			fall: [],
			fly: [],
			step: [],

		}
	};

	var guideBot = {
		name: "C-bot",
		graphic: { /* graphics data (using image sprits) */},
		animation: {
			talk: [],
			jump: [],
			signal: []
		}
	};

	//code panel control object 
	var codePanel = {
		viewState: "open",
		numCodeBits: 0
	};

	//game engine
	var theGame = {

	};


	//-- END GAME BASE FUNCTIONS AND OBJECTS --------------


	//----NON-CORE FUNCTIONS AND OBJECTS (GUI STUFF ETC) ----------------------------
	//load user after login or automatically at start if user alraedy logged in
	var loadUser = function(user) {
		//switch to start page 
		
		removeClass(userSelect, 'gui-active');
		addClass(userSession, 'gui-active');
		addClass(gameMenu, "gui-active");

		//set current user
		currentUser = user;

		//set current user in localstorage
		localStorage.setItem('currentUser', currentUser.user);

		//set session info
		var userSessionName = userSessionBar.querySelectorAll('.user-name')[0];
		userSessionName.innerHTML = currentUser.user;
	};

	//USER SESSION EXIT FUNCTION ( for both exit buttons in session bar and options menu)
	var exitUserSession = function() {
		//get confirmation
		if (confirm('Are you sure you want to exit?')) {
			//exit confirmed - exit procedure

			//clear current user object
			currentUser = null;

			//clear current user from local storage
			localStorage.removeItem('currentUser');

			//hide all active gui elements
			var i;
			var activeElements = document.querySelectorAll('.gui-active');
			for (i=0; i<activeElements.length; i++) {
				removeClass(activeElements[i], 'gui-active');
			}

			//show start screen (user select)
			addClass(userSelect, 'gui-active');;
		} else {
			return false;
		}
	};
	//User level info prototype ( for showing in completed levels part of profile)
	var UserLevel = {
		id: -1,
		title: "",
		preview: "", //image link to preview
		description: "",
		grade: 0, //0 =failed, 1 = bronze, 2 = silver, 3 = gold
	};

	//user prototype
	var User = {
		firstName: "",
		lastName: "",
		user: "",
		pass: "",
		options: {
			language: "spanish",
			background: "bg1",
			sound: "off"
		},
		data: {
			totalPoints: 0,
			levelsCleared: [], //array of levels objects with specific values	
			achievements: [],	//array of achievement objects with specific values	   
		}
	};
	//-- END NON-CORE FUNCTIONS AND OBJECT-------------------


	// -- GUI INTERACTION -----------------------------------------------------------------
		//-- CODE PANEL -------------------------------------------------------------------
		//toggle view - open and close 
		cpViewToggle.onclick = function() {
			if (codePanel.viewState === "open") {
				Velocity(cpGUI, {width: "100px"}, {duration: 300,  complete: function() {
					codePanel.viewState = "closed";
				}});
			} else {
				Velocity(cpGUI, {width: "400px"}, {duration: 300,  complete: function() {
					codePanel.viewState = "open";
				}});
			}
		};

		//control buttons
		//add code bits
		cpAdd.onclick = function() {
			if (codePanel.viewState === "open") {
				if (codePanel.numCodeBits < 8) {
					//only allow 8 code bits (possibly make this a game object property that can be easily
					//changed from there)
					console.log("adding");
				} else {

					console.log("you've reached the maximum number of code bits");
				}
			}
		};

		//delete code bits
		cpDelete.onclick = function() {
			if (codePanel.viewState === "open") {
				//delete selected 
				console.log("deleting");
			} else {
				//don't allow deletion of code bits with code panel closed (possibly consider removing 
				//buttons when panel closed)
				console.log("no code bits selected");
			}
		};


		//run code bits
		cpRun.onclick = function() {
			console.log("running");
		};

		//------END CODE PANEL ----------------


		//-- USER SELECT -----------------------------------------------------------------
		btnLogin.onclick = function() {
			var inputs = userSelect.querySelectorAll('input');
			var validated = true;
			var i, respMessage = '';
			
			//validations
			for (i=0; i<inputs.length; i++) {
				var validation = valInput(inputs[i]);
				if (!validation.success ) {
					validated = false;
					respMessage = validation["message" + language];
					break;
				}
			}

			if (validated) {
				//user input valid check login
				var userName = inputs[0].value;
				var userAccess = getUserData(userName);
				if (userAccess) {
					//user exists check password
					if (userAccess.pass === inputs[1].value) {
						//correct password
						switch (language) {
							case 'Eng': 
								respMessage = 'You have successfully logged in!';
								break;
							case 'Esp':
								respMessage = 'Usted ha ingresado exitosamente!';
								break;
						}

						alert(respMessage);

						loadUser(userAccess);

					} else {
						//incorrect password
						switch (language) {
							case 'Eng': 
								respMessage = 'The password you have entered is incorrect!';
								break;
							case 'Esp':
								respMessage = 'La clave que introdujo está incorrecto!';
								break;
						}

						alert(respMessage);
					}
				} else {
					//error user doesn't exist;
					switch (language) {
						case 'Eng':
							respMessage = "This user doesn't exist!";
							break;

						case 'Esp':
							respMessage = 'Este usuario no existe!';
							break;
					}

					alert(respMessage);
				}
			} else {
				alert(respMessage);
			}

		};

		//---------END USER SELECT ---------------



		//-- USER CREATE ------------------------------------------------------------------
		btnCreateUser.onclick = function() {
			//get values
			var inputs = userCreate.querySelectorAll('input');
			var validated = true;
			var i, respMessage = '';
			//validations
			for (i=0; i<inputs.length; i++) {
				var validation = valInput(inputs[i]);
				if (!validation.success ) {
					validated = false;
					respMessage = validation["message" + language];
					break;
				}
			}

			if (validated) {
				var newUser = Object.create(User);
				newUser.firstName = inputs[0].value;
				newUser.lastName = inputs[1].value;
				newUser.user = inputs[2].value;
				newUser.pass = inputs[3].value;

				var res = setUserData(newUser, true);
				respMessage = res['message'+language];
				alert(respMessage);
				//hide user create and show login - TODO - ADD FADE IN FADE OUT EFFECT
				if (res.success)  {
					//switch active to user select
					removeClass(userCreate, 'gui-active');
					addClass(userSelect, 'gui-active');
				}
			} else {
				//show error
				alert(respMessage);
			}
		};
		
		//--------END USER CREATE ------------------


		//-- USER SESSION ----------------------------------------------------------------

		userSessionBar.onclick = function() {
			//open and close user info bar
			toggleClass(this.parentNode, "user-session-open");
		};

		//--------END USER SESSION -----------------


		//-- START MENU ------------------------------------------------------------------

		//-------END START MENU -------------------


		//-- OPTIONS MENU ----------------------------------------------------------------

		//------END OPTIONS MENU-------------------


		//-- LEVEL SELECT ----------------------------------------------------------------

		//------END LEVEL SELECT ------------------


		//-- NAVIGATION--------------------


		//BACK BUTTONS
		(function() {
			var i;

			//assign back button navigation events to back buttons
			for (i=0; i<backButtons.length; i++) {
				backButtons[i].onclick = function(){
					var activeGui = document.querySelectorAll(".gui-active")[0];
					//TODO - ADD CASES FOR DIFFERENT SECTIONS AS YOU NEED THEM
					switch(activeGui) {
						case userSelect :
							//there's no back for user -select
							break;

						case userCreate :
							//empty fields in case they had anything
							clearFields(userCreate);

							//switch active to user select
							removeClass(userCreate, 'gui-active');
							addClass(userSelect, 'gui-active');
							break;
					}
				};
			}

		})();


		//LINK TO CREATE USER PAGE
		linkCreateUser.onclick = function() {
			//clear fields in case there was text
			clearFields(userSelect);

			//switch active to user create
			removeClass(userSelect, 'gui-active');
			addClass(userCreate, 'gui-active');
		};


		//LINKS IN USER SESSION BAR

		//Show profile
		linkSessionProfile.onclick = function () {

		};

		//Exit
		linkSessionExit.onclick = exitUserSession;



		//------END NAVIGATION --------------

		
		//--- FINAL INITIALIZATIONS-----------------------------
		//CHECK FOR LOGGED IN USER AND LOAD
	
		var loggedUserName = localStorage.getItem('currentUser');

		if (loggedUserName) {
			//user already logged - automatically load start menu
			var loggedUser = getUserData(loggedUserName);
			loadUser(loggedUser);
		} else {
			//no user logged - show user select screen
			addClass(userSelect, 'gui-active');
		}



		//------END FINAL INITIALIZATIONS -----------

};