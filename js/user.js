//---- ALL FUNCTIONS AND DATA HAVING TO DO WITH USER ----------------------------
//object which contains the data of the user currently logged in
var currentUser;


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

//load user interface with user specific options and data
var loadUser = function(user, selectScreen, menuScreen, sessionBar) {
	//switch to start page 
	
	//set current user
	currentUser = user;


	removeClass(selectScreen, 'gui-active');
	addClass(sessionBar, 'gui-active');
	addClass(menuScreen, "gui-active");

	//set current user in localstorage
	localStorage.setItem('currentUser', currentUser.user);

	//set session info
	var userSessionName = sessionBar.querySelectorAll('.user-name')[0];
	userSessionName.innerHTML = currentUser.user;

	//set options 
};

//USER SESSION EXIT FUNCTION ( for both exit buttons in session bar and options menu)
var exitUserSession = function(selectScreen) {
	//get confirmation
	if (confirm('Are you sure you want to exit?')) {
		//exit confirmed - exit procedure

		//remove current user
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
		addClass(selectScreen, 'gui-active');;
	} else {
		return false;
	}
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

				//clear inputs
				clearFields(selectScreen);

				loadUser(userAccess, selectScreen, menuScreen, sessionBar);

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
			//error - user doesn't exist
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




