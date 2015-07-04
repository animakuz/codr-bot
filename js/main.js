'use strict';
//-- MAIN SCRIPT FILE -----------------------------------------------------------
//-- ASSIGNMENTS OF REFERENCES TO VISUAL COMPONENTS
//-- EVENT BINDINGS AND INITIALIZATIONS

// Project Title: Programaquina y los Secretos del Planeta Algoritmus
// Author: Marcus Baptiste - ID: R0032401

/* TODO 
	- FIX STUFF COMMENTED WITH TODO
	- KEEP WORKING AND FINISH THIS SHIIIIIT
*/
window.onload = function() {
//--MAIN INTERFACE ELEMENT ASSIGNMENTS------------------------------------------
	//--Main divisions
	var loaderContainer = document.getElementById('loader-container');
	var contentWrapper = document.getElementById('content-wrapper');
	var logoContainer = document.getElementsByClassName('logo-container')[0];
	var appContainer = document.getElementsByClassName('app-container')[0];
	var dimensionWrapper = document.getElementsByClassName('dimension-wrapper')[0];

	//--Background elements outside of main game canvas
	var gameBGSky = document.getElementById('game-bg-sky');
	var gameBGUnderground = document.getElementById('game-bg-underground');
	var gameBGClouds = document.getElementById('game-bg-clouds-canvas');
	var gameBGLandsLeft = document.getElementById('game-bg-lands-left');
	var gameBGLandsRight = document.getElementById('game-bg-lands-right');

	//--Gui overlay
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

	//--Code panel
	var cpContainer = document.getElementsByClassName('code-panel');
	var cpViewToggle = document.getElementsByClassName('cp-view-toggle')[0];
	var cpControls = document.getElementsByClassName('cp-controls')[0];
	var cpAdd = document.getElementsByClassName('cp-add')[0];
	var cpDelete = document.getElementsByClassName('cp-delete')[0];
	var cpRun = document.getElementsByClassName('cp-run')[0];
	var cpContentWrapper = document.getElementsByClassName('cp-content-wrapper')[0];
	var cpContent = document.getElementsByClassName('cp-content')[0];
	//Code-bit list
	var codeBitList = document.getElementsByClassName('code-bit-list')[0];

	//--Game view
	var btnPause = document.getElementById('btn-pause');
	var infoScreenWrapper = document.getElementById('info-screen-wrapper');
	var btnResetLevel = document.getElementsByClassName('btn-reset-level')[0];
	var btnQuitLevel = document.getElementsByClassName('btn-quit-level')[0];
	// var gameObjectsCanvas = document.getElementById('game-objects-canvas');
	// var gameLandsCanvas = document.getElementById('game-lands-canvas');
	// var gameObjectsCanvas = document.getElementById('game-objects-canvas');
//-- END MAIN INTERFACE ELEMENT ASSIGNMENTS-------------------------------------

//--SPECIFIC ELEMENT ASSIGNMENTS (specific buttons, fields, etc) ---------------
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
	var btnStartLevel = document.getElementById('btn-start-level');
	var levelSelectLevels = document.getElementById('level-select-levels');

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
//--END SPECIFIC ELEMENT ASSIGNMENTS -------------------------------------------

//-- BINDINGS AND EVENTS -------------------------------------------------------
	
	//--Code Panel--------------------------------------------------------------
		//toggle view button - open and close 
		cpViewToggle.onclick = function() {
			if (codePanel.running === false && codePanel.enabled === true) {
				if (codePanel.viewState === 'open') {
					removeClass(codeBitList, 'gui-active');
					var newHeight = this.parentNode.clientHeight;
					Velocity(cpContainer, {height: newHeight + 'px'}, {duration: 300,  complete: function() {
						removeClass(cpViewToggle, 'cp-view-toggle-up');
						codePanel.viewState = 'closed';
					}});
				} else {
					codePanel.clearSelection();
					var newHeight = this.parentNode.clientHeight * 6;
					Velocity(cpContainer, {height: newHeight + 'px'}, {duration: 300,  complete: function() {
						addClass(cpViewToggle, 'cp-view-toggle-up');
						codePanel.viewState = 'open';
					}});
				}
			}
		};

		//add code bit button
		cpAdd.onclick = function() {
			if (codePanel.viewState === 'open' && (codePanel.running === false && codePanel.enabled === true)) {
				codePanel.clearSelection();
				toggleClass(codeBitList, 'gui-active');
			}
		};

		//delete code bit button
		cpDelete.onclick = function() {
			if (codePanel.viewState === 'open' && (codePanel.running === false && codePanel.enabled === true)) {
				codePanel.deleteCodeBit();				
			}
		};

		//run code sequence button
		cpRun.onclick = function() {
			if (codePanel.running === false && codePanel.enabled === true) {
				if (codePanel.numCodeBits > 0) {
					codePanel.running = true;
					codePanel.clearSelection();
					removeClass(codeBitList, 'gui-active');

					codePanel.runSequence();
				} else {
					showMessageBox( {Eng: 'There are no code bits to execute', Esp: 'No hay code bits para ejecutar'}, 
						'alert', 'warning');
				}
			}
		};
	//--------------------------------------------------------------------------

	//--Create User ------------------------------------------------------------
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
				showMessageBox({ Eng: respMessage , Esp: respMessage},  'alert', 'success');
				//hide user create and show login - TODO - ADD FADE IN FADE OUT EFFECT
				if (res.success)  {
					//clear inputs
					clearFields(userCreate);

					//switch active to user select
					switchScreens(userCreate, userSelect);
				}
			} else {
				//show error
				showMessageBox({ Eng: respMessage, Esp: respMessage}, 'alert', 'error');
			}
		};
	//--------------------------------------------------------------------------

	//--Select User ------------------------------------------------------------
		btnLogin.onclick = function() {
			loginProc(userSelect, gameMenu, userSession);
		};
		
		//also set login proc for enter keypress event of inputs
		bindMultiple(userSelect.querySelectorAll('input'), 'onkeyup',  function(ele) {
			if (event.which == 13)  {
				loginProc(userSelect, gameMenu, userSession);
			}
		});

		//link to create user page
		linkCreateUser.onclick = function() {
			//clear fields in case there was text
			clearFields(userSelect);

			//switch active to user create
			switchScreens(userSelect, userCreate);
		};
	//--------------------------------------------------------------------------

	//--User Session------------------------------------------------------------
		//open and close user info bar
		userSessionBar.onclick = function() {
			toggleClass(this.parentNode, 'user-session-open');
		};

		//show profile
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

		//exit user session
		linkSessionExit.onclick = function() {
			exitUserSession(userSelect);
		};
	//--------------------------------------------------------------------------

	//--User Profile------------------------------------------------------------
		//display info on levels cleared
		bindMultiple(profileLevels, 'onclick', function(ele) {
			console.log(ele.className); //TODO - ADD FUNCTIONALITY
		});

		//display info on acheievements obtained
		bindMultiple(acheiveThumbs, 'onclick', function(ele) {
			console.log(ele.className); //TODO - ADD FUNCTIONALITY
		});

		//close profile view
		btnCloseProfile.onclick = function() {
			removeClass(userProfile, 'gui-active');
		};
	//--------------------------------------------------------------------------

	//--Start Menu--------------------------------------------------------------
		//show game start screen (level select)
		btnStartGame.onclick = function() {
			//switch to level select screen
			switchScreens(gameMenu, levelSelect);
			
			loadLevels();
			
		};

		//show options screen
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

		//show credits screen
		btnCredits.onclick = function() {
			//switch to credits page
			switchScreens(gameMenu, creditsPage);
		};

		//exit user session
		btnExit.onclick = function() {
			exitUserSession(userSelect);
		};
	//--------------------------------------------------------------------------

	//--Options Menu------------------------------------------------------------
		//change language
		bindMultiple(langOptionButtons, 'onclick', function(ele) {
			changeLang(ele);
		});

		//change background
		bindMultiple(bgOptionButtons, 'onclick', function(ele) {
			changeBackground(ele);
		});

		//CHANGE SOUND FUNCTION IN CHECK-BOX CODE
	//--------------------------------------------------------------------------

	//--Level Select------------------------------------------------------------
		//click start game button
		btnStartLevel.onclick = function() {
			var levelSelected = levelSelect.querySelectorAll('.level-selected')[0];

			if (levelSelected) {
				var level = levelSelected.getAttribute('data-level');
				//remove level select screen to display game
				removeClass(levelSelect, 'gui-active');

				theGame.initialize(gameLevels[level]);
			} else {
				//no level selected
				showMessageBox( { Eng: 'Please select a level', Esp: 'Por favor seleccione un nivel' }, 'alert', 'warning');
			}
		};
	//--------------------------------------------------------------------------

	//--Other GUI Elements------------------------------------------------------
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
	//--------------------------------------------------------------------------

	//--Navigation Elements-----------------------------------------------------
		//back buttons
		bindMultiple(backButtons, 'onclick', function(ele){
			var currentScreen = ele.getAttribute('data-screen');

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
	//--------------------------------------------------------------------------

	//--Pause Button------------------------------------------------------------
		var pausePlay = function() {
			var btn = this || btnPause;
			if (btn.getAttribute('data-paused') === 'false') {
				//show pause menu and switch button to play
				addClass(infoScreenWrapper, 'gui-active');
				toggleClass(btn,'btn-pause, btn-play');
				btn.setAttribute('data-paused', true);
				theGame.paused = true;
				createjs.Ticker.setPaused(true);
			} else {
				//hide pause menu and switch button to pause
				removeClass(infoScreenWrapper, 'gui-active');
				toggleClass(btn,'btn-pause, btn-play');
				btn.setAttribute('data-paused', false);
				theGame.paused = false;
				createjs.Ticker.setPaused(false);
			}
		};

		btnPause.onclick = pausePlay;

		//reset level button
		btnResetLevel.onclick = function() {
			if (theGame.paused) {
				//get confirmation if on game paused
				showMessageBox({ 
						Eng: 'Are you sure you want to reset the level?', 
						Esp: 'Estas seguro que quieres resetear el nivel?'
					},
					'confirm', 'warning', 
					{
						ok: function() { 
							pausePlay();
							theGame.reset(); 
						},
						cancel: function() { }
				});
			} else {
				theGame.reset();
			}
		};

		//quit level button
		btnQuitLevel.onclick = function() {
			showMessageBox({
					Eng: 'Are you sure you want to quit the level?',
					Esp: 'Estas seguro que quieres salir del nivel?'
				},
				'confirm','warning',
				{
					ok: function() { 
						pausePlay();
						theGame.end(); 
					},
					cancel: function() {}
			});
		};
	//--------------------------------------------------------------------------

//--END BINDINGS AND EVENTS-----------------------------------------------------
	
//--FINAL INITIALIZATIONS-------------------------------------------------------
	//SHOW LOGO
	window.initializeApp = function() {
		//initialize game graphics external to game
		bgGraphics.initializeGraphics();
			
		var loggedUserName = localStorage.getItem('currentUser');
		if (loggedUserName) {
			//user already logged - automatically load start menu
			var loggedUser = getUserData(loggedUserName);
			loadUser(loggedUser, userSelect, gameMenu, userSession);
		} else {
			//no user logged - show user select screen
			addClass(userSelect, 'gui-active');
		}
	};
//--END FINAL INITIALIZATIONS---------------------------------------------------
};