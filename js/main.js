// Project Title: Programaquina y los Secretos del Planeta Algoritmus
// Author: Marcus Baptiste - ID: R0032401

//MAIN SCRIPT FILE - MAKE ASSIGNMENTS OF REFERENCES TO VISUAL COMPONENTS, BIND EVENTS AND BRING 
//TOGETHER THE DIFFERENT PARTS OF THE SOFTWARE

/* TODO 
	- FIX STUFF COMMENTED WITH TODO
	- KEEP WORKING AND FINISH THIS SHIIIIIT

*/
window.onload = function() {
	//interface elements
	//main divisions
	var wrapper = document.getElementsByClassName('wrapper')[0];
	var appContainer = document.getElementsByClassName('app-container')[0];
	var logoContainer = document.getElementsByClassName('logo-container')[0];

	//gui overlay
	var guiOverlay = document.getElementsByClassName('gui-overlay')[0];
	var userCreate = document.getElementsByClassName('user-create')[0];
	var userSelect = document.getElementsByClassName('user-select')[0];
	var userSession = document.getElementsByClassName('user-session')[0];
	var userSessionBar = document.getElementsByClassName('user-session-bar')[0];
	var userProfile = document.getElementsByClassName('user-profile')[0]
	var gameMenu = document.getElementsByClassName('game-menu')[0] ;
	var gameOptions = document.getElementsByClassName('game-options')[0];
	var creditsPage = document.getElementsByClassName('credits-page')[0];
	var levelSelect = document.getElementsByClassName('level-select')[0];

	//code panel
	var cpGUI = document.getElementsByClassName('code-panel');
	var cpViewToggle = document.getElementsByClassName('cp-view-toggle')[0];
	var cpAdd = document.getElementsByClassName('cp-add')[0];
	var cpDelete = document.getElementsByClassName('cp-delete')[0];
	var cpRun = document.getElementsByClassName('cp-run')[0];
	var cpContent = document.getElementsByClassName('cp-content')[0];

	//game view
	var gameCanvas = document.getElementsByClassName('game-canvas')[0];
	
	//specific items identified by id (specific buttons, fields, etc)
	//login form send button
	var btnLogin = document.getElementById('btn-login');

	//login form link to create user
	var linkCreateUser = document.getElementById('link-create-user');

	//create user save button
	var btnCreateUser = document.getElementById('btn-create-user');

	//user session show profile and exit links
	var linkSessionProfile = document.getElementById('link-session-profile');
	var linkSessionExit = document.getElementById('link-session-exit');

	//game menu buttons 
	var  btnStartGame = document.getElementById('btn-start-game');
	var  btnGameOptions = document.getElementById('btn-game-options');
	var  btnCredits = document.getElementById('btn-credits');
	var  btnExit = document.getElementById('btn-exit');

	//level select elements 
	var levelSelectThumbs = document.querySelectorAll('.th-level-select');
	var btnStartLevel = document.getElementById('btn-start-level');

	//game options elements
	var langOptionButtons = document.querySelectorAll('.btn-change-lang');
	var bgOptionButtons = document.querySelectorAll('.bg-thumb');
	var soundOption = document.getElementById('sound-option');

	//user profile elements
	var btnCloseProfile = document.getElementById('btn-close-profile');
	var profileUsername = document.getElementById('profile-username');
	var profileUserNames = document.getElementById('profile-user-names');
	var profileUserPoints = document.getElementById('profile-user-points');
	var profileLevelsCleared = document.getElementById('profile-levels-cleared');
	var profileAcheivements = document.getElementById('profile-acheivements');
	var profileLevels = document.querySelectorAll('.th-profile-level');
	//these could also be used in a section that shows possible acheivements - for now only in profile
	var acheiveThumbs = document.querySelectorAll('.acheive-thumb');

	//back buttons
	var backButtons = document.querySelectorAll('.back-button');

	//check boxes
	var checkBoxes = document.querySelectorAll('.gui-check-box');

	//tab title bars
	var tabTitles = document.querySelectorAll('.gui-tab-title');



	// -- BINDINGS AND EVENTS -----------------------------------------------------------------
	
	//-- CODE PANEL -------------------------------------------------------------------
		//toggle view - open and close 
		cpViewToggle.onclick = function() {
			if (codePanel.viewState === 'open') {
				Velocity(cpGUI, {width: '100px'}, {duration: 300,  complete: function() {
					codePanel.viewState = 'closed';
				}});
			} else {
				Velocity(cpGUI, {width: '400px'}, {duration: 300,  complete: function() {
					codePanel.viewState = 'open';
				}});
			}
		};

		//control buttons
		//add code bits
		cpAdd.onclick = function() {
			if (codePanel.viewState === 'open') {
				if (codePanel.numCodeBits < 8) {
					//only allow 8 code bits (possibly make this a game object property that can be easily
					//changed from there)
					console.log('adding');  //TODO - ADD FUNCTIONALITY
				} else {
					console.log("you've reached the maximum number of code bits"); //TODO - ADD FUNCTIONALITY
				}
			}
		};

		//delete code bits
		cpDelete.onclick = function() {
			if (codePanel.viewState === 'open') {
				//delete selected 
				console.log('deleting'); //TODO - ADD FUNCTIONALITY 
			} else {
				//don't allow deletion of code bits with code panel closed (possibly consider removing 
				//buttons when panel closed)
				console.log('no code bits selected'); //TODO - ADD FUNCTIONALITY 
			}
		};

		//run code bits
		cpRun.onclick = function() {
			console.log('running'); //TODO - ADD FUNCTIONALITY
		};

	//------END CODE PANEL ----------------

	//-- USER CREATE ------------------------------------------------------------------
		btnCreateUser.onclick = function() {
			//get values
			var inputs = userCreate.querySelectorAll('input');
			var validated = true;
			var respMessage = '';
			var i, len = inputs.length;
			//validations
			for (i=0; i<len; i++) {
				var validation = valInput(inputs[i]);
				if (!validation.success ) {
					validated = false;
					respMessage = validation['message' + defaultLanguage];
					break;
				}
			}

			if (validated) {
				var newUser = createUser();
				newUser.firstName = inputs[0].value;
				newUser.lastName = inputs[1].value;
				newUser.user = inputs[2].value;
				newUser.pass = inputs[3].value;

				var res = storeUserData(newUser, true);
				respMessage = res['message'+ defaultLanguage];
				showMessageBox(respMessage , 'alert', 'success');
				//hide user create and show login - TODO - ADD FADE IN FADE OUT EFFECT
				if (res.success)  {
					//clear inputs
					clearFields(userCreate);

					//switch active to user select
					switchScreens(userCreate, userSelect);
				}
			} else {
				//show error
				showMessageBox(respMessage, 'alert', 'error');
			}
		};
	//--------END USER CREATE ------------------

	//-- USER SELECT -----------------------------------------------------------------
		btnLogin.onclick = function() {
			loginProc(userSelect, gameMenu, userSession);
		};
		
		//also set login proc for enter keypress event of inputs
		bindMultiple(userSelect.querySelectorAll('input'), 'onkeyup',  function(ele) {
			if (event.which == 13)  {
				loginProc(userSelect, gameMenu, userSession);
			}
		});


		//LINK TO CREATE USER PAGE
		linkCreateUser.onclick = function() {
			//clear fields in case there was text
			clearFields(userSelect);

			//switch active to user create
			switchScreens(userSelect, userCreate);
		};

	//---------END USER SELECT ---------------

	//-- USER SESSION ----------------------------------------------------------------
		userSessionBar.onclick = function() {
			//open and close user info bar
			toggleClass(this.parentNode, 'user-session-open');
		};

		//Show profile
		linkSessionProfile.onclick = function () {
			//update user profile to match info contained in current user object
			profileUsername.innerHTML = currentUser.user;
			profileUserNames.innerHTML = currentUser.firstName + " " + currentUser.lastName;
			profileUserPoints.innerHTML = currentUser.data.totalPoints;

			//TODO - MAKE LEVELS CLEARED LOAD BY GOING TRHOUGH ARRAY AND PUTTING OUT CORRESPONDING ELEMENTS
			//TODO - MAKE SAME FOR ACHEIVEMENTS

			//show user profile screen
			addClass(userProfile, 'gui-active');

			//close bar
			removeClass(userSession, 'user-session-open');
		};

		//Exit
		linkSessionExit.onclick = function() {
			exitUserSession(userSelect);
		};
	//--------END USER SESSION -----------------

	//-- USER PROFILE ---------------------------------------------------------------
		//display info on levels cleared
		bindMultiple(profileLevels, 'onclick', function(ele) {
			console.log(ele.className); //TODO - ADD FUNCTIONALITY
		});

		//display info on acheievements obtained
		bindMultiple(acheiveThumbs, 'onclick', function(ele) {
			console.log(ele.className); //TODO - ADD FUNCTIONALITY
		});

		btnCloseProfile.onclick = function() {
			removeClass(userProfile, 'gui-active');
		};
	//--------END USER PROFILE ----------------


	//-- START MENU ------------------------------------------------------------------
		btnStartGame.onclick = function() {
			//switch to level select screen
			switchScreens(gameMenu, levelSelect);

			//show level select 
			//TODO MAKE LOAD LEVELS ACCORDING TO CURRENTLY PASSED ETC
		};

		btnGameOptions.onclick = function() {
			//hide start menu 
			removeClass(gameMenu, 'gui-active');

			//update options display according to what's contained in current user
			//language
			var langOptions = gameOptions.querySelectorAll('.btn-change-lang');
			modifyMultiple(langOptions, function(element) {
				if (element.getAttribute('data-lang') === currentUser.options.language) {
					addClass(element, 'active-lang');
				} else {
					removeClass(element, 'active-lang');
				}
			});

			//background
			var bgThumbs = gameOptions.querySelectorAll('.bg-thumb');
			modifyMultiple(bgThumbs, function(element){
				removeClass(element, 'bg-selected');
				if (element.getAttribute('data-bg') === currentUser.options.background) {
					addClass(element, 'bg-selected');
				}
			});

			//sound
			if (currentUser.options.sound === 'on') {
				addClass(soundOption, 'check-box-checked');
			} else {
				removeClass(soundOption, 'check-box-checked');
			}

			//show options menu
			addClass(gameOptions, 'gui-active');
		};

		btnCredits.onclick = function() {
			//switch to credits page
			switchScreens(gameMenu, creditsPage);
		};

		btnExit.onclick = function() {
			exitUserSession(userSelect);
		};
	//-------END START MENU -------------------


	//-- OPTIONS MENU ----------------------------------------------------------------
		//CHANGE LANGUAGE
		bindMultiple(langOptionButtons, 'onclick', function(ele) {
			changeLang(ele);
		});

		//CHANGE BACKGROUND
		bindMultiple(bgOptionButtons, 'onclick', function(ele) {
			changeBackground(ele);
		});


		//change sound option in check-box code

	//------END OPTIONS MENU-------------------


	//-- LEVEL SELECT ----------------------------------------------------------------
		//click level select buttons
		bindMultiple(levelSelectThumbs, 'onclick', function(ele) {
			selectLevel(ele);
		});

		//click start game level button
		btnStartLevel.onclick = function() {
			showMessageBox('Starting Game with a very long text for testing purposes', 'alert', 'success', 
			function() {
				showMessageBox('That\'s right son', 'alert', 'success');
			});
			console.log('starting level'); //TODO - ADD FUNCTIONALITY
		};
	//------END LEVEL SELECT ------------------


	//--- OTHER GUI ELEMENTS ----------------------------------------------------------
		//check boxes
		bindMultiple(checkBoxes, 'onclick', function (ele) { 
			toggleClass(ele, 'check-box-checked'); 

			//function associated with differnt check box options (ultra-specific code)
			var option = ele.getAttribute('data-option');
			switch(option) {
				case 'sound':
						toggleSound();
					break;
			}

		});

		//tabs
		bindMultiple(tabTitles, 'onclick', function(ele) {
			//show hide tabs based on title clicked
			var tabContainer = ele.parentNode.parentNode;
			var titles = tabContainer.querySelectorAll('.gui-tab-title');
			var tabs = tabContainer.querySelectorAll('.gui-tab-content');
			var i, len=titles.length;
			var activeTab = ele.getAttribute('data-target');

			for (i=0; i<len; i++) {
				removeClass(titles[i], 'active-tab-title');
				removeClass(tabs[i], 'active-tab');
			}

			addClass(ele, 'active-tab-title');
			addClass(document.getElementById(activeTab), 'active-tab');
		});
	//------END OTHER GUI ELEMENTS --------------


	//-- NAVIGATION-------------------------------------------------------------
		//BACK BUTTONS
		bindMultiple(backButtons, 'onclick', function(ele){
			var currentScreen = ele.getAttribute('data-screen');

			//TODO - ADD CASES FOR DIFFERENT SECTIONS AS YOU NEED THEM
			switch(currentScreen) {
				case 'user-create' :
					//empty fields in case they had anything
					clearFields(userCreate);

					//switch active to user select
					switchScreens(userCreate, userSelect);
					break;

				case 'game-options' :
					//switch active to user game menu
					switchScreens(gameOptions, gameMenu);
					break;

				case 'level-select' :
					switchScreens(levelSelect, gameMenu);
					break;

				case 'credits-page' :
					switchScreens(creditsPage, gameMenu);
					break;
			};
	
		});
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