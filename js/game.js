"use strict";
//-- GAME BASED FUNCTIONS AND OBJECTS--------------------------------------------	
//TODO - (FOR LATER) OPTIMIZE GRAPHICS FOR LARGE AND SMALL DEVICES
//-- Base data and functions------------------------------------
	//create js shortcut
	var cjs = createjs;

	//set ticker properties
	cjs.Ticker.timingOption = cjs.Ticker.RAF;
	cjs.Ticker.setFPS(UNIT_TIME);

	//show or hide pause button
	function togglePauseButton(action) {
		var pauseBtn = document.getElementById('btn-pause');
		var pauseScreenContent = document.getElementById('pause-screen-content');

		if (action === 'show') {
			//show pause button (and puase screen content set to display)
			addClass(pauseBtn, 'gui-active');
			addClass(pauseScreenContent, 'gui-active');
		} else if (action === 'hide') {
			//hide pause button (and puase screen content set to NOT display)
			removeClass(pauseBtn, 'gui-active');
			removeClass(pauseScreenContent, 'gui-active');
		}
	}
//--------------------------------------------------------------



//-- $CHARACTERS ------------------------------------------------
	//$P-bot (programaquina - player's avatar)
	var pBot = {
		name: "P-1",
		xPos: 0,
		yPos: 0,
		unitPos: 0,
		spriteData: {
			images: [sprites.pbot],
			frames: { width: 161, height: 161, regX: 0, regY: 0 },
			animations: {
				base: [0],
				step: [0,29,'base'],
			}
		},
		framesRemaining: 0,
		moving: 0,
		characterStage: undefined,
		sprite: undefined,
		initialize: function() {
			var spriteSheet = new cjs.SpriteSheet(this.spriteData);

			this.characterStage = new cjs.Stage('game-characters-canvas');
			this.sprite = new cjs.Sprite(spriteSheet);
			this.sprite.width = 160;
			this.sprite.height = 160;
			this.sprite.regX = 80;
			this.sprite.regY = 160;
			this.sprite.x = 40;
			this.sprite.y = 180;
			this.sprite.gotoAndStop('base');
			this.characterStage.addChild(this.sprite);
			this.characterStage.update();
		},
		reset: function() {
			//reset to starting position
			this.sprite.x = 40;
			this.sprite.y = 180;
			this.moving = 0;
			this.unitPos = 0;
			this.framesRemaining = 0;
			this.sprite.gotoAndStop('base');
			this.characterStage.update();
		},
		clearBot: function() {
			if (typeof this.characterStage !== 'undefined') {
				this.characterStage.removeAllChildren();
				this.characterStage.update();
			}
		},
		animate: function(animation, movement, distance) {
			if (movement === 'step') {
				var speed = floorTrunc((distance / UNIT_TIME), 1);
			}
			var pBotUpdate = function(event) {
				if (!event.paused) {
					if (movement === 'step') {
						pBot.sprite.x += speed;
					}
					pBot.framesRemaining -= 1;

					if (pBot.framesRemaining <= 0) {
						//if it reaches 0 delete handler
						cjs.Ticker.removeEventListener('tick', pBotUpdate);
						if (movement === 'step') {
							pBot.unitPos += distance / UNIT_DISTANCE;
						}
					} else {
						// console.log('animating character');
						pBot.characterStage.update();
					}
				}
			};

			if (this.framesRemaining <= 0) {
				//if not animating
				//add 30 to animating (decreases 1 per frame at 30fps so it will take 1 second to go down to 0)
				this.framesRemaining += UNIT_TIME + 1;
				this.sprite.gotoAndPlay(animation);

				//add update function to ticker events
				cjs.Ticker.addEventListener('tick', pBotUpdate);
			}

		},
		say: function(langOptions) {
			//TODO - MAKE CHAT BUBBLE SHOW THIS TEXT INSTEAD OF POPUP BOX
			showMessageBox(langOptions, 'alert', 'error');
		},
		executeAction: function(action) {
			//execute one of a list of possible actions
			var actionToExecute;
			switch(action) {
				case 'step': 
					//check value of current space and next space and assign action to execute based on what they contain
					var currentSpace = theGame.level.puzzleTrack[this.unitPos];
					var nextSpace = theGame.level.puzzleTrack[this.unitPos + 1];

					if (currentSpace === 'bridge') {
						//check state of bridge - if u prevent from moving - if down go to fall - if normal step
						var objPos = this.unitPos;
						var objListInd = gameObjMngr.objectList.length;
						var bridge = undefined;
						while(objListInd--) {
							if (gameObjMngr.objectList[objListInd].unitPos === objPos &&
								gameObjMngr.objectList[objListInd].objType === 'bridge') {
								bridge = gameObjMngr.objectList[objListInd];
							}
						}

						if (bridge.state === 'up') {
							actionToExecute = function() {
								pBot.say({ Eng: "I can't cross", Esp: "No puedo pasar"});
							};
						} else if (bridge.state === 'down') {
							//walk and fall into gap
							actionToExecute = function() {
								//TODO - IMPLEMENT FALL
								pBot.animate('step', 'step', UNIT_DISTANCE);
								console.log('aaaaah');
							};
						} else {
							//bridge flat - normal step
							actionToExecute = function() {
								pBot.animate('step', 'step', UNIT_DISTANCE);
							};
						}					
					} else if (nextSpace === 'target') {
						//hit target
						actionToExecute = function() {
							pBot.animate('step', 'step', UNIT_DISTANCE);
							//animate target - show hit
							var target = undefined;
							var ind = gameObjMngr.objectList.length;
							while(ind--) {
								if (gameObjMngr.objectList[ind].objType === 'target')  {
									target = gameObjMngr.objectList[ind];
									break;
								}
							}

							gameObjMngr.animateGameObject(target.sprite, 'hit', {direction: 'up', distance: '100'});

							setTimeout(theGame.solution, 1000);
						};
					} else if (nextSpace === 'wall') {
						//error - wall blocking way
					} else if (nextSpace === 'rock') {
						//error - rock blocking way
					} else if (nextSpace === 'end') {
						//can't go further - end of track
					} else {
						actionToExecute = function() {
							pBot.animate('step', 'step', UNIT_DISTANCE);
						};
					}

					actionToExecute();
					break;

				case 'use':
					//check if there is a usable game object in the following tile
					var adjObjPos = this.unitPos+1;
					var objListInd = gameObjMngr.objectList.length;
					var usableObj = undefined;
					while(objListInd--) {
						if (gameObjMngr.objectList[objListInd].unitPos === adjObjPos &&
							gameObjMngr.objectList[objListInd].usable === true) {
							usableObj = gameObjMngr.objectList[objListInd];
						}
					}

					if (typeof usableObj !== 'undefined') {
						usableObj.use();
						//apply use on corresponding bridge if obj is lever
						switch(usableObj.objType) {
							case 'lever':
								//find bridge and execute corresponding action
								objListInd = gameObjMngr.objectList.length;
								while(objListInd--) {
									if (gameObjMngr.objectList[objListInd].objType === 'bridge') {
										gameObjMngr.objectList[objListInd].use();
										break;
									}
								}
								break;

							case 'detonator':
								//find bomb and execute corresponding action
								objListInd = gameObjMngr.objectList.length;
								while(objListInd--) {
									if (gameObjMngr.objectList[objListInd].objType === 'bomb') {
										gameObjMngr.objectList[objListInd].use();
										break;
									}
								}
								break;

								break;
						}

					} else {
						//TODO - GENERATE CODE BIT ERROR FOR EVALUATION
					}
					
					break;

				case 'fall':
					console.log('aaaahhhh');
					//TODO - IMPLEMENT
					break;

				case 'push':
					console.log('THIS ACTION IS NOT YET AVAILABLE');
					//TODO - IMPLEMENT
					break;

				case 'pull':
					console.log('THIS ACTION IS NOT YET AVAILABLE');
					//TODO - IMPLEMENT
					break;
			}
		}
	};

	//$C-bot (guide bot)
	var cBot = {
		name: "C-bot",
		xPos: 0,
		yPos: 0,
		spriteData: {
			frames: {},
			animations: {
				base: [0],
				talk: [],
				jump: [],
				signal: []
			},
		},
		characterStage: undefined,
		sprite: undefined,
		talk: function(){
			console.log('talking guide bot');
		}
	};

//--END CHARACTERS-----------------------------------------------



//--$GAME ENGINE-------------------------------------------------
	var theGame = {
		level: {},
		codeBits: [],
		initialize: function(level) {			
			//set level
			this.level = level;

			//set corresponding lands 
			bgGraphics.setLands(level.landsTrack);

			//set corresponding game objects
			gameObjMngr.setGameObjects(level.gameObjects);

			//initialize avatar
			pBot.initialize();

			//update code bits to add those that the player unlocked
			var codeBitsAllowed = this.level.rules.codeBitsAllowed;
			var i, j;
			var lenUser = currentUser.data.codeBits.length;
			var lenLevel = codeBitsAllowed.length;
			this.codeBits = [];
			
			for (i=0; i<lenUser; i++) {
				for (j=0; j<lenLevel; j++) {
					if (currentUser.data.codeBits[i] === codeBitsAllowed[j]) {
						this.codeBits.push(codeBitsAllowed[j]);
						break;
					}
				}
			}

			//show and reset code panel
			codePanel.initialize(this.level.rules.maxCodeBits, this.codeBits);

			//show pause button and content
			togglePauseButton('show');

			console.log('game initialized');
		},
		pause: function() {
			//sanitization for pausing game
		},
		reset: function() {
			//set all game objects back to their original state defined by the level
			//gameObjMngr.resetGameObjects();

			//clear code panel
			codePanel.reset();

			//set bot back to starting position
			pBot.reset();

			//increase temp variable number of retries for acheivement (optional)

		},
		end: function() {
			//end level and go to level select screen
			pBot.clearBot();
			gameObjMngr.clearGameObjects();
			codePanel.hide();

			var levelSelect = document.getElementsByClassName('level-select')[0];
			addClass(levelSelect, 'gui-active');
			loadLevels();

			//hide pause button and content
			togglePauseButton('hide');

			//test
			console.log('game ended');
		},
		endScreen: function() {

		},
		solution: function() {
			if (cjs.Ticker.paused === false) {
				//only execute if game is not paused

				//stop execution - show solution - carry out evaluation process
				codePanel.running = false;
				codePanel.enabled = false;
			
				//check number of code bits successfully used - check extras
				//count number of errors as code runs
				//check which code bits used by analyzing array
				//use all these criteria to make evaluation
				var grade = 10;

				//add this level to levels cleared (if not already cleared)
				var levelAlreadyCleared = false;
				var ind = currentUser.data.levelsCleared.length;
				while (ind--) {
					if (currentUser.data.levelsCleared[ind].id === theGame.level.id) {
						levelAlreadyCleared = true;
						break;
					}
				}

				if (!levelAlreadyCleared) {
					currentUser.data.levelsCleared.push({
						id: theGame.level.id,
						name: theGame.level.name,
						title: theGame.level.title,
						preview: '',
						description: theGame.level.description,
						grade: grade,
						solution: codePanel.codeBitSequence
					});

					//add newly earned code bit
					currentUser.data.codeBits.push(theGame.level.rewards.codeBit);

					//update local storage
					storeUserData(currentUser, false);
				}

				//show info screen
				showMessageBox({Eng: 'Level Cleared!', Esp: 'Nivel Pasado'}, 'alert', 'success', function() {
					theGame.end();
				});
			} else {
				//if game is paused set a timer to retry 
				setTimeout(theGame.solution, 100);
			}
		},
		fail: function() {
			//stop execution - show fail - show options to retry or quit
			codePanel.running = false;
			codePanel.enabled = false;
			showMessageBox({Eng: 'Level failed! Would you like to try again', 
				Esp: 'Nivel fallado! Quieres intentar de nuevo'}, 'confirm', 'error', {
					ok: function() {
						theGame.reset();
					},
					cancel: function() {
						theGame.end();
					}
			});
		}
	};
//--END GAME ENGINE---------------------------------------------
