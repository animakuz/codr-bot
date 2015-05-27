//---- ALL FUNCTIONS AND DATA HAVING TO DO WITH USER ----------------------------
//object which contains the data of the user currently logged in
var currentUser;
var defaultLanguage = 'Esp';

//User level info prototype ( for showing in completed levels part of profile)
var UserLevel = {
	id: -1,
	title: '',
	preview: '', //image link to preview
	description: '',
	grade: 0, //0 =failed, 1 = bronze, 2 = silver, 3 = gold
};

//user prototype
var createUser = function() {
	return {
		firstName: '',
		lastName: '',
		user: '',
		pass: '',
		options: {
			language: 'Esp',
			background: 'bg1',
			sound: 'off'
		},
		data: {
			totalPoints: 0,
			levelsCleared: [], //array of levels objects with specific values	
			achievements: [],	//array of achievement objects with specific values	   
		}
	};
};

/*show messages with game style - the action variable is a callback function
with the code to be run after clicking the ok button
if a simple function object is defined, it is taken as the OK response function
both for simple alerts and confirm*/
var showMessageBox = function(message, boxType, messageType, action) {
	//create elements
	var container = document.getElementsByClassName('gui-overlay')[0];
	var box = document.createElement('div');
	var titleBox = document.createElement('h3');
	var title = document.createTextNode(messageType.toUpperCase() + "!");
	var icon = document.createElement('div');
	var messageTextBox = document.createElement('span');
	var messageText = document.createTextNode(message);
	var lineBreak = document.createElement('br');
	var buttonWrapper = document.createElement('div');
	var buttonOK = document.createElement('button');
	var buttonOKText = document.createTextNode('OK');


	//set classes and values	
	addClass(box, 'gui-message-box');
	addClass(titleBox, 'message-box-title');
	addClass(icon, 'message-box-icon');
	addClass(messageTextBox, 'message-box-text');
	addClass(buttonWrapper, 'message-button-wrapper');
	addClass(buttonOK, 'message-box-button, message-btn-ok, small-button');

	lineBreak.style.clear = 'both';

	switch(messageType) {
		case 'success':
			addClass(icon, 'message-icon-success');
			break;

		case 'warning':
			addClass(icon, 'message-icon-warning');
			break;

		case 'error':
			addClass(icon, 'message-icon-error');
			break;
	};

	//organize elements
	messageTextBox.appendChild(messageText);
	titleBox.appendChild(title);
	buttonOK.appendChild(buttonOKText);
	
	box.appendChild(titleBox);
	box.appendChild(icon);
	box.appendChild(messageTextBox);
	box.appendChild(lineBreak);

	//button bindings
	buttonOK.onclick = function() {
		//TODO ADD FADE OUT
		container.removeChild(box);
		if(typeof action !== 'undefined') {
			if (isFunction(action)) {
				action();
			}

			if (typeof action.ok !== 'undefined') {
				action.ok();
			}
		}
	};

	buttonWrapper.appendChild(buttonOK);

	//condition message buttons
	if (boxType === 'alert') {
		//possibly alert specific stuff

	} else if (boxType === 'confirm') {
		//cancel button
		var buttonCancel = document.createElement('button');
		var buttonCancelText = document.createTextNode('Cancel');
		addClass(buttonCancel, 'message-box-button, message-btn-cancel, small-button');
		buttonCancel.appendChild(buttonCancelText);
		buttonWrapper.appendChild(buttonCancel);

		buttonCancel.onclick = function() {
			//TODO ADD FADE OUT
			container.removeChild(box);
			if(typeof action !== 'undefined') {
				//get cancel function from object
				if (typeof action.cancel !== 'undefined') {
					action.cancel();
				}
			}
		};
	}
	
	box.appendChild(buttonWrapper);

	//TODO ADD FADE IN
	container.appendChild(box);
};

//set language on visual components
var setLanguageVC = function(language) {
	var lang = 'lang-' + language.toLowerCase();
	var langTexts = document.querySelectorAll('.lang-eng,.lang-esp');

	modifyMultiple(langTexts, function(element) {
		var className = element.className;
		element.style.display = (className === lang ? 'inline' : 'none');
	});

};

//set background visual component
var setBackgroundVC = function(bg) {
	//TODO - SET BACKGROUDN VISUALLY
};


//load user interface with user specific options and data
var loadUser = function(user, selectScreen, menuScreen, sessionBar) {
	//switch to start page 
	
	//set current user
	currentUser = user;

	removeClass(selectScreen, 'gui-active');
	addClass(sessionBar, 'gui-active');
	addClass(menuScreen, 'gui-active');

	//set current user in localstorage
	localStorage.setItem('currentUser', currentUser.user);

	//set session info
	var userSessionName = sessionBar.querySelectorAll('.user-name')[0];
	userSessionName.innerHTML = currentUser.user;

	//set options - language, background, sound
	setLanguageVC(currentUser.options.language);

	setBackgroundVC(currentUser.options.background);

};

//USER SESSION EXIT FUNCTION ( for both exit buttons in session bar and options menu)
var exitUserSession = function(returnScreen) {
	//get confirmation
	showMessageBox('Are you sure you want to exit?', 'confirm', 'warning', {
		ok: function() {
			//exit confirmed - exit procedure

			//remove current user
			currentUser = null;

			//clear current user from local storage
			localStorage.removeItem('currentUser');

			//hide all active gui elements
			var activeElements = document.querySelectorAll('.gui-active');
			modifyMultiple(activeElements, function(element) {
				removeClass(element, 'gui-active');
			});

			//show start screen (user select)
			addClass(returnScreen, 'gui-active');

			//set language option back to default language
			setLanguageVC(defaultLanguage);

		},
		cancel: function() {

		}
	});
};



//SWITCH LANGUAGE IN OPTIONIS
var changeLang = function(btnLang) {
	//get language value and show corresponding button as selected
	var lang = btnLang.getAttribute('data-lang');
	var langButtons = document.querySelectorAll('.btn-change-lang');

	modifyMultiple(langButtons, function(element) {
		removeClass(element, 'active-lang');
	});

	addClass(btnLang, 'active-lang');
	//set language value in appropriate places

	currentUser.options.language = lang;
	
	//update local storage value
	storeUserData(currentUser, false);

	//reflect changes in visuals
	setLanguageVC(currentUser.options.language);

};


var toggleSound = function() {
	var soundOpc = currentUser.options.sound;

	if (soundOpc === 'on') {
		currentUser.options.sound = 'off';

		//stop reproducing sound if any

	} else if (soundOpc === 'off') {
		currentUser.options.sound = 'on';
	}

	storeUserData(currentUser, false);
};


var changeBackground = function(bgThumb) {
	var bg = bgThumb.getAttribute('data-bg');
	var bgThumbs = document.querySelectorAll('.bg-thumb');

	//change selected background
	modifyMultiple(bgThumbs, function(element) {
		removeClass(element, 'bg-selected');
	});
	addClass(bgThumb, 'bg-selected');

	//set data in current user and local storage
	currentUser.options.background = bg;

	storeUserData(currentUser, false);

	//set background visual component
	setBackgroundVC(bg);

};

var selectLevel = function(levelThumb) {
	//TODO - ADD FUNCTIONALITY
	console.log(levelThumb.getAttribute('data-level'));
};

//LOGIN PROCEDURE
var loginProc = function(selectScreen, menuScreen, sessionBar) {
	var inputs = selectScreen.querySelectorAll('input');
	var validated = true;
	var i, respMessage = '';
	
	//validations
	for (i=0; i<inputs.length; i++) {
		var validation = valInput(inputs[i]);
		if (!validation.success ) {
			validated = false;
			respMessage = validation['message' + defaultLanguage];
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
				switch (userAccess.options.language) {
					case 'Eng': 
						respMessage = 'You have successfully logged in!';
						break;
					case 'Esp':
						respMessage = 'Usted ha ingresado exitosamente!';
						break;
				}

				showMessageBox(respMessage, 'alert', 'success'); 

				//clear inputs
				clearFields(selectScreen);

				loadUser(userAccess, selectScreen, menuScreen, sessionBar);

			} else {
				//incorrect password
				switch (userAccess.options.language) {
					case 'Eng': 
						respMessage = 'The password you have entered is incorrect!';
						break;
					case 'Esp':
						respMessage = 'La clave que introdujo está incorrecto!';
						break;
				}

				showMessageBox(respMessage, 'alert', 'error');
			}
		} else {
			//error - user doesn't exist
			switch (defaultLanguage) {
				case 'Eng':
					respMessage = "This user doesn't exist!";
					break;

				case 'Esp':
					respMessage = 'Este usuario no existe!';
					break;
			}

			showMessageBox(respMessage, 'alert', 'error');
		}
	} else {
		showMessageBox(respMessage, 'alert', 'error');
	}

};
