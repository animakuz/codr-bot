"use strict";
//-- GAME BASED FUNCTIONS AND OBJECTS--------------------------------------------	
//TODO - (FOR LATER) OPTIMIZE GRAPHICS FOR LARGE AND SMALL DEVICES
//-- Base data and functions------------------------------------
	//create js shortcut
	var cjs = createjs;
	var test;
	//set ticker properties
	cjs.Ticker.timingOption = cjs.Ticker.RAF;
	cjs.Ticker.setFPS(UNIT_TIME);

	var introScreen = document.getElementById('intro-screen-wrapper');
	var skipIntro = document.getElementsByClassName('skip-intro')[0];
	var infoScreenWrapper = document.getElementById('info-screen-wrapper');
	var slidesScreen = document.getElementById('slides-screen');
	var solutionScreen = document.getElementById('solution-screen');
	var failScreen = document.getElementById('fail-screen');
	var btnPause = document.getElementById('btn-pause');
	var btnCloseSlides = document.getElementsByClassName('btn-close-slides')[0];

	//show or hide pause button
	function togglePauseButton(action) {
		var pauseScreen = document.getElementById('pause-screen');

		if (action === 'show') {
			//show pause button (and puase screen content set to display)
			addClass(btnPause, 'gui-active');
			addClass(pauseScreen, 'gui-active');
		} else if (action === 'hide') {
			//hide pause button (and puase screen content set to NOT display)
			removeClass(btnPause, 'gui-active');
			removeClass(pauseScreen, 'gui-active');
		}
	}

	function pausePlay() {
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
	}

	skipIntro.onclick = function() {
		removeClass(introScreen, 'gui-active');
	};

	btnCloseSlides.onclick = function() {
		removeClass(slidesScreen, 'gui-active');
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
				use: [0,29,'base'],
				error: [0,29,'base']
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
								pBot.say({ Eng: "He can't cross", Esp: "No puede pasar"});
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
						pBot.animate('use');
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
						codePanel.runtimeErrors += 1;
						pBot.animate('error');
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

//--$Intro Slides -----------------------------------------------
	//hide image and show another
	function switchSlides(indCurr, indNext) {
		var img1 = document.getElementById('img'+ indCurr);
		var img2 = document.getElementById('img' + indNext);
		Velocity(img1, 'fadeOut', {duration: 600 });
		Velocity(img2, 'fadeIn', {duration: 600});
	}

	var slideDisplay = document.getElementById('slide-display');


	//buttons
	var btnPrev = document.getElementsByClassName('btn-prev-slide')[0];
	var btnNext = document.getElementsByClassName('btn-next-slide')[0];
	var btnOK = document.getElementsByClassName('btn-close-slides')[0];

	btnPrev.onclick = function() {
		if (!classCheck(this, 'btn-disabled')) {
			var slideInd = slideDisplay.getAttribute('data-current');
			var slides = theGame.level.introSlides;
			if (slideInd > 0)  {
			
				slideInd--;
				slideDisplay.setAttribute('data-current', slideInd);

				//switch images
				switchSlides(slideInd+1, slideInd);

				if (slideInd === 0) {
					//hide prev button if get to first slide
					addClass(this, 'btn-disabled');
				}

				if (slideInd === slides.length - 2) {
					//bring back next button after hidden from getting to last slide
					removeClass(btnNext, 'btn-disabled');
				}
			}
		}
	};

	btnNext.onclick = function() {
		if (!classCheck(this, 'btn-disabled')) {
			var slideInd = slideDisplay.getAttribute('data-current');
			var slides = theGame.level.introSlides;
			if (slideInd < slides.length - 1)  {
				slideInd++;
				slideDisplay.setAttribute('data-current', slideInd);

				//switch images
				switchSlides(slideInd-1, slideInd);

				if (slideInd === slides.length - 1) {
					//hide next button if get to last slide
					addClass(this, 'btn-disabled');
					//also show OK button
					removeClass(btnOK, 'btn-disabled');
				}

				if (slideInd === 1) {
					//bring back prev button after hidden from getting to last slide
					removeClass(btnPrev, 'btn-disabled');
				}
			}
		}
	};

	btnOK.onclick = function() {
		if (!classCheck(this, 'btn-disabled')) {
			removeClass(slidesScreen, 'gui-active');
		}
	};

	//load slides
	function loadSlides() {
		var slides = theGame.level.introSlides;
		if (slides.length !== 0) {
			//clean up first...
			empty(slideDisplay);
			
			var len = slides.length;
			var i;
			for (i=0; i<len; i++) {
				slideDisplay.appendChild(slides[i]);
			}	
			slideDisplay.setAttribute('data-num', slides.length);
			slideDisplay.setAttribute('data-current', 0);

			//fade in first image
			var firstImage = document.getElementById('img'+0);
			Velocity(firstImage, 'fadeIn', {duration: 800});

			if (slides.length < 2) {
				//only one slide - only show ok button
				removeClass(btnOK, 'btn-disabled');
			} else {
				//only show next button
				removeClass(btnNext, 'btn-disabled');
			}
		}
	}
//---------------------------------------------------------------

//--$EVALUATION FUNCTIONS----------------------------------------
	var getGrade = function(result) {
		switch(result) {
			case 3: return 'gold';
			break;
			case 2: return 'silver';
			break;
			case 1: return 'bronze';
			break;
		}
	};

	var isAcheived = function(acheive) {
		//check if acheivement already obtained
		var len = currentUser.data.acheivements.length;
		var acheived = false;
		while (len--) {
			if (currentUser.data.acheivements[len].id = acheive.id) {
				acheived = true;
				break;
			}
		}

		return acheived;
	};


	var levelCleared = function(grade, result) {
		//add this level to levels cleared (if not already cleared)
		var levelAlreadyCleared = currentUser.data.levelsCleared.length >= theGame.level.id;

		if (!levelAlreadyCleared) {
			//add level cleared data to user file
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

			//return acheivement and base points
			return {
				acheive: theGame.level.rewards.acheive,
				levelPoints: (theGame.level.id * 10) * result
			}

		} else {
			//check and update solution and grade
			if (grade > currentUser.data.levelsCleared[theGame.level.id - 1].grade) {
				//update grade
				currentUser.data.levelsCleared[theGame.level.id - 1].grade = grade;

				return {
					acheive: acheives[3],  //acheivement 4 - increase grade on a level
					levelPoints: 20
				}
			} else {
				//return meager points
					return {
					acheive: undefined,  
					levelPoints: 10
				}
			}
		}
	};

	var evaluateLevel = function() {
		//check number of code bits successfully used - check extras
		var numCB = codePanel.numCodeBits;
		var cbUsed = [];
		var errors = codePanel.runtimeErrors + (codePanel.numCodeBits - codePanel.indexOfExecuted);
		var len = numCB;
		var resNum, resBits, resErr;
		var GC = theGame.level.gradeCriteria;

		//check which code bits used by analyzing array
		while (len--) {
			var ind = cbUsed.length;
			var flag = true;

			while(ind--) {
				if (codePanel.codeBitSequence[len].type === cbUsed[ind]) {
					flag = false;
					break;
				} 
			}

			if (flag) {
				cbUsed.push(codePanel.codeBitSequence[len].type);
			}
		}

		//use all these criteria to make evaluation
		//evaluate numcode bits
		if (numCB <= GC.maxCodeBits.gold ) { resNum = 3; }
		else if (numCB <= GC.maxCodeBits.silver ) { resNum = 2; }
		else { resNum = 1; }

		//evaluate code bits allowed
		if (compSubArrs(cbUsed, GC.codeBitsAllowed.gold)) { resBits = 3; }
		else if (compSubArrs(cbUsed, GC.codeBitsAllowed.silver)) { resBits = 2; }
		else { resBits = 1; }

		//evaluate errors
		if (errors <= GC.errorsAllowed.gold) {	resErr = 3; }
		else if (errors <= GC.errorsAllowed.silver) { resErr = 2; }
		else { resErr = 1; }

		return (resErr + resNum + resBits) / 3;
		
	};
//---------------------------------------------------------------
	

//--$GAME ENGINE-------------------------------------------------
	var theGame = {
		level: {},
		codeBits: [],
		paused: false,
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

			//show intro scenematic
			// if (currentUser.data.levelsCleared.length === 0) {
			// 	//no levels cleared - beginning of game
			// 	addClass(introScreen, 'gui-active');
			// }

			//show intro slides
			if (currentUser.data.levelsCleared.length >= this.level.id) {
				//generic intro slide

			} else {
				//for levels not yet cleared - level (story) specific slides
				if (this.level.introSlides.length > 0) {
					loadSlides();
					addClass(slidesScreen, 'gui-active');
				}
			}

			//show and reset code panel
			codePanel.initialize(this.level.rules.maxCodeBits, this.codeBits);

			//show pause button and content
			togglePauseButton('show');
		},
		pause: function() {
			//sanitization for pausing game
		},
		reset: function() {
			//set all game objects back to their original state defined by the level
			gameObjMngr.resetGameObjects();

			//clear code panel
			codePanel.reset();

			//set bot back to starting position
			pBot.reset();

			//hide information screens
			removeClass(infoScreenWrapper, 'gui-active');
			removeClass(failScreen, 'gui-active');
			removeClass(solutionScreen, 'gui-active');
			removeClass(slidesScreen, 'gui-active');
			removeClass(introScreen, 'gui-active');

			//show pause button and content
			togglePauseButton('show');
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
			// pausePlay();

			//hide information screens
			removeClass(infoScreenWrapper, 'gui-active');
			removeClass(failScreen, 'gui-active');
			removeClass(solutionScreen, 'gui-active');
			removeClass(slidesScreen, 'gui-active');
			removeClass(introScreen, 'gui-active');
		},
		solution: function() {
			if (cjs.Ticker.paused === false) {
				//only execute if game is not paused

				//stop execution - show solution - carry out evaluation process
				codePanel.running = false;
				codePanel.enabled = false;
				
				//evaluate level based on different criteria
				var result = Math.floor(evaluateLevel());
				test = result;
				var grade = getGrade(result);

				//Check if new level cleared
				var baseResults = levelCleared(grade, result);

				//add acheivements
				// if ( !isAcheived(baseResults.acheive)) {
				// 	//if acheivement not already obtained add it
				// }

				var acheivePoints = 0;
				var pointsGained = baseResults.levelPoints;

				if (typeof baseResults.acheive !== 'undefined') {
					currentUser.data.acheivements.push(baseResults.acheive);
					//points earned from acheivements ( add others based on other acheivements)
					acheivePoints += baseResults.acheive.points;
				}


				//total points earned
				pointsGained+=  acheivePoints;
				currentUser.data.totalPoints += pointsGained;

				//RESULTS SCREEN STUFF
				//add next level button (if there are more levels)
				var btnNextLevel = solutionScreen.getElementsByClassName('btn-next-level')[0];
				if (theGame.level.id < gameLevels.length) {
					addLevelThumb(btnNextLevel, 'open', theGame.level.id );
				} else {
					btnNextLevel.parentNode.removeChild(btnNextLevel);
				}

				//show points earned
				var pointsDisplay = document.getElementById('points-obtained-value');
				pointsDisplay.innerHTML = pointsGained;

				//show acheive thumbs and description
				var acheivesEarned = [baseResults.acheive]; 

				//show code bit obtained and description
				var cbEarned = theGame.level.rewards.codeBit;

				//update local storage
				storeUserData(currentUser, false);

				//show info screen
				togglePauseButton('hide');
				addClass(infoScreenWrapper, 'gui-active');
				addClass(solutionScreen, 'gui-active');
			} else {
				//if game is paused set a timer to retry 
				setTimeout(theGame.solution, 100);
			}
		},
		fail: function() {
			//stop execution - show fail - show options to retry or quit
			codePanel.running = false;
			codePanel.enabled = false;
			togglePauseButton('hide');
			addClass(infoScreenWrapper, 'gui-active');
			addClass(failScreen, 'gui-active');
		}
	};
//--END GAME ENGINE---------------------------------------------
