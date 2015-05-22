// Project Title: Programaquina y los Secretos del Planeta Algoritmus
// Author: Marcus Baptiste - ID: R0032401

//MAIN SCRIPT FILE - MAKE ASSIGNMENTS OF REFERENCES TO VISUAL COMPONENTS, BIND EVENTS AND BRING 
//TOGETHER THE DIFFERENT PARTS OF THE SOFTWARE

/* TODO 
	- FIX STUFF COMMENTED WITH TODO
	- MAKE PROPER MESSAGE DISPLAYING FUNCTION SIMILAR TO SWEET ALERT BUT STYLED TO THE GAME
	- KEEP WORKING AND FINISH THIS SHIIIIIT

*/
window.onload = function() {
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

	//game menu buttons 
	var linkGameOptions = document.getElementById('btn-game-options');

	//game options elements
	var optionLangEsp = document.getElementById('option-lang-esp');
	var optionLangEng = document.getElementById('option-lang-eng');

	//back buttons
	var backButtons = document.querySelectorAll('.back-button');

	//check boxes
	var checkBoxes = document.querySelectorAll('.gui-check-box');




	// -- BINDINGS AND EVENTS -----------------------------------------------------------------
	
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
					//clear inputs
					clearFields(userCreate);

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

	//-- USER SELECT -----------------------------------------------------------------
		btnLogin.onclick = function() {
			loginProc(userSelect, gameMenu, userSession);
		};
		
		//also set login proc for enter keypress event of inputs
		(function() { 
			var inputs = userSelect.querySelectorAll('input');
			var i;

			for (i=0; i<inputs.length; i++) {
				inputs[i].onkeyup = function(event) {
					if (event.which == 13)  {
						loginProc(userSelect, gameMenu, userSession);
					}
				};
			}

		})();
	//---------END USER SELECT ---------------

	//-- USER SESSION ----------------------------------------------------------------
		userSessionBar.onclick = function() {
			//open and close user info bar
			toggleClass(this.parentNode, "user-session-open");
		};
	//--------END USER SESSION -----------------


	//-- START MENU ------------------------------------------------------------------
		linkGameOptions.onclick = function() {
			//hide start menu and show options
			removeClass(gameMenu, "gui-active");
			addClass(gameOptions, "gui-active");
		};
	//-------END START MENU -------------------


	//-- OPTIONS MENU ----------------------------------------------------------------

	//------END OPTIONS MENU-------------------


	//-- LEVEL SELECT ----------------------------------------------------------------

	//------END LEVEL SELECT ------------------




	//--- OTHER GUI ELEMENTS ----------------------------------------------------------
		//check boxes
		(function() {
			var i;

			for (i=0; i<checkBoxes.length; i++) {
				checkBoxes[i].onclick = function() {
					toggleClass(this, 'check-box-checked');
				};
			}
		})();
	//------END OTHER GUI ELEMENTS --------------



	//-- NAVIGATION-------------------------------------------------------------
		//BACK BUTTONS
		(function() {
			var i;

			//assign back button navigation events to back buttons
			for (i=0; i<backButtons.length; i++) {
				backButtons[i].onclick = function(){
					var currentScreen = this.getAttribute('data-screen');

					//TODO - ADD CASES FOR DIFFERENT SECTIONS AS YOU NEED THEM
					switch(currentScreen) {
						case 'user-create' :
							//empty fields in case they had anything
							clearFields(userCreate);

							//switch active to user select
							removeClass(userCreate, 'gui-active');
							addClass(userSelect, 'gui-active');
							break;

						case 'game-options' :
							//switch active to user game menu
							removeClass(gameOptions, 'gui-active');
							addClass(gameMenu, 'gui-active');
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
		linkSessionExit.onclick = function() {
			exitUserSession(userSelect);
		};

	//------END NAVIGATION --------------

	
	//--- FINAL INITIALIZATIONS-----------------------------
		//CHECK FOR LOGGED IN USER AND LOAD
		
		var loggedUserName = localStorage.getItem('currentUser');
		if (loggedUserName) {
			//user already logged - automatically load start menu
			var loggedUser = getUserData(loggedUserName);
			loadUser(loggedUser, userSelect, gameMenu, userSession);
		} else {
			//no user logged - show user select screen
			addClass(userSelect, 'gui-active');
		}

	//------END FINAL INITIALIZATIONS -----------

};