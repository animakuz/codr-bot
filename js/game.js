"use strict";


//-- GAME BASED FUNCTIONS AND OBJECTS--------------------------------------------	
//TODO - (FOR LATER) OPTIMIZE GRAPHICS FOR LARGE AND SMALL DEVICES
//-- Base data and functions------------------------------------
	//create js shortcut
	var cjs = createjs;

	var UNIT_DISTANCE = 80;  //pixel size of each distance unit
	var UNIT_TIME = 30; // duration of unit time in frames (duration of every unit action and same as framerate)

	//set ticker properties
	cjs.Ticker.timingOption = cjs.Ticker.RAF;
	cjs.Ticker.setFPS(UNIT_TIME);

	//update level list and show level thumbnails (included here so this code can be called by game functions)
	function loadLevels() {
		var i = 0;
		var numLevels = gameLevels.length;
		var levelStatus = 'passed';
		var levelSelectLevels = document.getElementById('level-select-levels');
		var addLevelThumb = function(status, index, levelData) {
			var levelThumbCont = document.createElement('div');
			var levelNum = document.createTextNode(' ' + levelData.id);

			levelThumbCont.className = 'level-thumb th-level-select level-' + status + ' unselectable';
			levelThumbCont.setAttribute('data-level', index);
			generateLangOptions(levelThumbCont, {Eng: 'Level', Esp: 'Nivel'});
			levelThumbCont.appendChild(levelNum);
			
			//possibly other info

			levelSelectLevels.appendChild(levelThumbCont);
		};

		//delete current items
		empty(levelSelectLevels);

		while(i < numLevels) {
			if (levelStatus === 'passed') {
				//still checking levels cleared 
				if (currentUser.data.levelsCleared[i]) {
					//load level thumbnail as cleared with corresponding data
					addLevelThumb('passed', i, gameLevels[i]);
					i++;
				} else {
					//change status to keep checking other levels
					levelStatus = 'open';
				}					
			} else if (levelStatus === 'open') {
				//load level as open
				addLevelThumb('open', i, gameLevels[i]);
				//change status to locked - only one level after all cleared levels is open
				levelStatus = 'locked';
				i++;
			} else if (levelStatus === 'locked') {
				//load level as locked
				addLevelThumb('locked', i, gameLevels[i]);
				i++;
			}
		}

		var levelSelectThumbs = document.querySelectorAll('.th-level-select');

		//bind events for click of level select buttons
		bindMultiple(levelSelectThumbs, 'onclick', function(ele) {
			if (!(classCheck(ele, 'level-locked'))) {
				modifyMultiple(levelSelectThumbs, function(element) {
					removeClass(element, 'level-selected');
				});
				addClass(ele, 'level-selected');
			} else {
				//TODO - SHOW MESSAGE THAT LEVEL IS LOCKED
			}
		});
	}

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

//-- $BACKGROUND GRAPHICS ---------------------------------------
	var bgGraphics = {
	//--$lANDS---------------------------------------------------
		imgLands: sprites.lands, 		
		setLands: function(landsTrack) { //set 'lands' graphics
			var landsCanvas = document.getElementById('game-lands-canvas');
			var ctx = landsCanvas.getContext('2d');
			var width = GAME_WIDTH;
			var height = landsCanvas.height;
			var len = landsTrack.length;
			var i;

			//refresh lands canvas
			ctx.clearRect(0, 0, width, height);

			//draw images according to values in landsTrack array
			for (i=0; i<len; i++) {
				var currX = i * UNIT_DISTANCE;

				switch(landsTrack[i]) {
					case 0:  //0 = gap - don't draw anything
						break;

					case 1: //1 = continuous graphic
						ctx.drawImage(this.imgLands, 0, 0, 80, 80, currX, 0, 80, 80 );
						break;

					case 2: //2 = left side edge of gap graphic
						ctx.drawImage(this.imgLands, 0, 80, 80, 80, currX, 0, 80, 80 );
						break;

					case 3: //3 = right side edge of gap graphic
						ctx.drawImage(this.imgLands, 0, 160, 80, 80, currX, 0, 80, 80 );
						break;
				}
			}
		},
	//----------------------------------------------------------

	//--$Clouds--------------------------------------------------
		numClouds: 0, 
		clouds: [],
		cloudData: { //cloud sprite sheet data
			images: [sprites.clouds],
			frames: [[0,0,240,70],[0,70,285,145],[240,0,435,50],[285,55,425,50],[285,105,420,145]],
			animations: {
				cloud0: [0],
				cloud1: [1],
				cloud2: [2],
				cloud3: [3],
				cloud4: [4]
			}
		},
		cloudSheet: undefined,
		cloudStage: undefined, 
		initializeCloudData: function() {
			this.cloudSheet = new cjs.SpriteSheet(this.cloudData);
			this.cloudStage = new cjs.Stage('game-bg-clouds-canvas');
		},
		createCloud: function() {
			return {
				vX: 0, 
				direction: undefined,
				width: 0,
				height: 0,
				sprite: undefined,
				initialize: function(spriteSheet, cloudFrames) {
					var cloudInd = getRandomInt(0,4);
					var cloudDim = cloudFrames[cloudInd];
					
					this.vX = getRandomInt(1,2); //random velocity
					this.direction = getRandomInt(0,1); //random direction from two possible directions
					this.width = cloudDim[2]; //sub index 2 is width of frame that holds corresponding cloud image
					this.height = cloudDim[3]; //sub index 3 is height
					if (typeof this.sprite === 'undefined') {
						this.sprite = new cjs.Sprite(spriteSheet);
					}

					this.sprite.gotoAndStop('cloud' + cloudInd); //set cloud image according to randomly generated number
					this.sprite.regX = 0;
					this.sprite.regY = 0;

					//direction options
					if (this.direction === 0) {
						//cloud starts at right edge and moves left
						this.sprite.x = GAME_WIDTH + Math.floor(this.width * Math.random());
						this.vX = -this.vX; //velocity (direction 0 == left, 1 == right)
					} else if (this.direction === 1) {
						//cloud starts at left edge and moves right
						this.sprite.x = -(this.width + Math.floor(this.width * Math.random()));
					}
					this.sprite.y = getRandomInt(10, 80);
				},
				move: function() {
					this.sprite.x += this.vX;
				},
				offScreen: function() {
					if (this.direction === 0) {
						//cloud moves left - goes offscreen at left
						return this.sprite.x < (0 - this.width);
					} else if (this.direction === 1) {
						//cloud moves right and goes offscreen at right
						return this.sprite.x > GAME_WIDTH;
					}
				}
			};
		},
		animateClouds: function() {
			var ind = this.numClouds;
			while (ind--) {
				this.clouds[ind].move();

				//reset clouds when off screen
				if (this.clouds[ind].offScreen()) {
					this.clouds[ind].initialize(this.cloudSheet, this.cloudData.frames);
				}
			}
			this.cloudStage.update();
		},
		setClouds: function() {//set clouds objects and graphics
			var nextInterval;
			var bg = this;

			//intialize elements necessary to generate clouds
			this.initializeCloudData();

			//push out a set number of clouds at variable intervals - each cloud will behave according to its properties
			function makeClouds() {
				//create clouds
				bg.clouds.push(bg.createCloud());
				bg.clouds[bg.numClouds].initialize(bg.cloudSheet, bg.cloudData.frames);
				bg.cloudStage.addChild(bg.clouds[bg.numClouds].sprite);
				bg.cloudStage.update();

				bg.numClouds++;
				if (bg.numClouds<5) {
					nextInterval = getRandomInt(1000,2000);
					setTimeout(makeClouds, nextInterval);
				}
			}
			makeClouds();
		},
	//----------------------------------------------------------
		initializeGraphics: function() {
			//TODO - DETECT DEVICE CAPABILITIES AND REDUCE CLOUDS VARIANCE AND SUCH FOR BETTER PERF ON MOBILE
			this.setLands([1,3,0,2,1,1,3,0,2,1]);
			this.setClouds();
			cjs.Ticker.addEventListener('tick', function(event) {
				if (!event.paused) {
					bgGraphics.animateClouds();
				}
			});
		}
	};
//--------------------------------------------------------------

//--$IN-GAME ELEMENTS -------------------------------------------
	//--$Game Objects--------------------------------------------
		var gameObjMngr = {	
			//dimensions for each game object graphic
			imgFrames: {
				bomb: { width: 80, height: 80 , regX: 0, regY: 40 },
				bridge: { width: 161, height: 161 , regX: 0, regY: 120 },
				detonator: { width: 80, height: 80 , regX: 0, regY: 40 },
				lever: { width: 81, height: 81 , regX: 0, regY: 40 },
				rock: { width: 80, height: 80 , regX: 0, regY: 40 },
				target: {width: 80, height: 80 , regX: 0, regY: 40 },
				wall: { width: 160, height: 160, regX: 0, regY: 120 },
			},
			animations: { //animation list for each game object
				bomb: { base: [0]},
				bridge: { 
					base: [0],
					flat: [0],
					flatToUp: [0,29, 'up'],
					up: [29],
					upToFlat: [30,59, 'flat'],
					flatToDown: [60,89, 'down'],
					down: [89],
					downToFlat: [90,119, 'flat']
				},
				detonator: { base: [0] },
				lever: { 
					base: [0],
					flat: [0],
					flatToUp: [0,29, 'up'],
					up: [29],
					upToFlat: [30,59, 'flat'],
					flatToDown: [60,89, 'down'],
					down: [89],
					downToFlat: [90,119, 'flat']
				},
				rock: { base: [0] },
				target: { 
					base: [0],
					hit: [1,28,'gone'],
					gone: [29]
				},
				wall: { base: [0] },
			},
			vertAnchors: { //list of vertical anchor positions for game objects
				bomb: 140,
				bridge: 200,
				detonator: 140,
				lever: 140,
				rock: 140,
				target: 120,
				wall: 140
			},
			objectList: [],
			gameObjectStage: undefined,
			framesRemaining: 0, //number of frames remaining to be animated
			initializeGameObjectData: function() {
				if (typeof this.gameObjectStage === 'undefined') {
					this.gameObjectStage = new cjs.Stage('game-objects-canvas');
				}

				this.objectList = [];
				this.framesRemaining = 0;
			},
			addHandler: function(gameObj) {
				//only need to a add a click hanlder for showing info
			},
			animateGameObject: function(gameObjectSprite, animation, movement) {
				//set speed of movement increment based on frame rate
				if (movement) {
					var speed = floorTrunc((movement.distance / UNIT_TIME), 1);
				}

				//animation update function
				var gameObjUpdate = function(event) {
					if (!event.paused) {
						gameObjMngr.framesRemaining -= 1;
						if (gameObjMngr.framesRemaining <= 0) {
							//if it reaches 0 delete handler and reduce active
							cjs.Ticker.removeEventListener('tick', gameObjUpdate);
						} else {
							if (movement) {
								//execute movement
								switch(movement.direction) {
									case 'up':
										gameObjectSprite.y -= speed;
										break;

									case 'down':
										gameObjectSprite.y += speed;
										break;

									case 'left':
										gameObjectSprite.x -= speed;
										break;

									case 'right':
										gameObjectSprite.x += speed;
										break;
								}
							}
							gameObjMngr.gameObjectStage.update();
						}
					}
				};

				if (this.framesRemaining <= 0) {
					//no existing ticker (nothing animating)  - add ticker
					cjs.Ticker.addEventListener('tick', gameObjUpdate);
				}

				//add animation
				this.framesRemaining += (UNIT_TIME + 1) - this.framesRemaining;
				gameObjectSprite.gotoAndPlay(animation);
			},
			createGameObject: function(objType, category, unitPos, startState) { //create new game object
				return {
					objType: objType,
					category: category,
					unitPos: unitPos,
					state: startState,
					usable: false,
					sprite: undefined,
					initialize: function(spriteList, frameList, animList, verAnchorList) {
						//setup sprite
						var frameData = {
							images: [ spriteList[this.objType] ],
							frames: frameList[this.objType],
							animations: animList[this.objType]
						};

						var spriteSheet = new cjs.SpriteSheet(frameData);
						if (typeof this.sprite === 'undefined') {
							this.sprite = new cjs.Sprite(spriteSheet);
						}

						//object dimensions
						if (this.objType === 'wall') {
							this.sprite.x = (this.unitPos * UNIT_DISTANCE) - 40;
						} else {
							this.sprite.x = (this.unitPos * UNIT_DISTANCE);
						}
						this.sprite.y = verAnchorList[objType];

						//object starting state graphic
						this.sprite.gotoAndStop(startState);

						//set usable option for corresponding code-bits
						switch(this.objType) {
							case 'lever':
							case 'detonator':
								this.usable = true;
								break;
						}	

						// add complementary functions according to type
						switch (this.objType) {
							case 'bridge': 
							case 'lever':
								this.drop = function() {
									if (this.state === 'base' || this.state ==='flat') {
										gameObjMngr.animateGameObject(this.sprite, 'flatToDown');
										this.state = 'down';
									} else if (this.state === 'up') {
										gameObjMngr.animateGameObject(this.sprite, 'upToFlat' );
										this.state = 'flat';
									}
								};

								this.lift = function() {
									if (this.state === 'base' || this.state ==='flat') {
										gameObjMngr.animateGameObject(this.sprite, 'flatToUp');
										this.state = 'up';
									} else if (this.state === 'down') {
										gameObjMngr.animateGameObject(this.sprite, 'downToFlat');
										this.state = 'flat';
									}
								};

								this.use = function() {
									if (this.state === 'up' || this.state === 'flat') {
										this.drop();
									} else {
										this.lift();
									}
								}
								break;

						}
					}
				};
			},
			setGameObjects : function(objDataList) {
				//draw game objects to stage
				var len = objDataList.length;
				var i;
				// var goCont = new cjs.Container();
				//initialize elements necessary to display game objects
				this.initializeGameObjectData();

				for (i=0; i<len; i++) {
					this.objectList.push(this.createGameObject(
						objDataList[i][0], //type of game object
						objDataList[i][1], //category of game object
						objDataList[i][2], //unit position
						objDataList[i][3] //starting state
						) 
					);

					this.objectList[i].initialize(sprites, this.imgFrames, this.animations, this.vertAnchors);
					this.addHandler(this.objectList[i]);
					this.gameObjectStage.addChild(this.objectList[i].sprite);
				}

				//draw lines to mark unit positions
				// for (i=0; i<10; i++) {
				// 	var line = new cjs.Shape();
				// 	line.graphics.setStrokeStyle(4).beginStroke('red');
				// 	line.graphics.moveTo(i* UNIT_DISTANCE, 0).lineTo(i* UNIT_DISTANCE, 200);
				// 	this.gameObjectStage.addChild(line);
				// }
				this.gameObjectStage.update();
			},
			resetGameObjects: function() {

			},
			clearGameObjects: function() {
				if (typeof this.gameObjectStage !== 'undefined') {
					this.gameObjectStage.removeAllChildren();
					this.gameObjectStage.update();
				}
			}
		};
	//----------------------------------------------------------

	//--$Game levels --------------------------------------------
		var gameLevels = [
			{	
				id: 1,
				name: 'level-test',
				title: 'Testing Level',
				description: 'A basic level for testing purposes',
				bg: 'sunny',
				music: 'off',
				puzzleTrack: ['','','','','','','','','target','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,1,1,1,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
						['target','target', 8, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCritera: {
					maxCodeBits: { bronze: 10, silver: 10, gold: 10 },
					codeBitsAllowed: {
						bronze: ['step'],
						silver: ['step'],
						gold: ['step']
					},
					errorsAllowed: {
						bronze: 5,
						silver: 3,
						gold: 0
					}
				},
				hints: [ ],
				scenes: [ ],
				dialogue: [ ]
			},
			{
				id: 2,
				name: 'level-test2',
				title: 'Testing Level 2',
				description: 'Another basic level for testing purposes',
				bg: 'sunny',
				music: 'off',
				puzzleTrack: ['','','lever','','bridge','gap','','target','','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,3,0,2,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['lever','tool', 2, 'down' ],
					['bridge', 'tool', 4, 'down'],
					['target','target', 7, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCritera: {
					maxCodeBits: { bronze: 10, silver: 10, gold: 10 },
					codeBitsAllowed: {
						bronze: ['step', 'use'],
						silver: ['step', 'use'],
						gold: ['step', 'use']
					},
					errorsAllowed: {
						bronze: 5,
						silver: 3,
						gold: 0
					}
				},
				hints: [ ],
				scenes: [ ],
				dialogue: [ ]
			},
			{
				id: 3,
				name: 'level-test3',
				title: 'Testing Level 3',
				description: 'Another basic level for testing purposes',
				bg: 'cloudy',
				music: 'off',
				puzzleTrack: ['','','lever','','bridge','gap','','target','','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,3,0,2,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['lever','tool', 2, 'up' ],
					['bridge', 'tool', 4, 'up'],
					['target','target', 7, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCritera: {
					maxCodeBits: { bronze: 10, silver: 10, gold: 10 },
					codeBitsAllowed: {
						bronze: ['step', 'use'],
						silver: ['step', 'use'],
						gold: ['step', 'use']
					},
					errorsAllowed: {
						bronze: 5,
						silver: 3,
						gold: 0
					}
				},
				hints: [ ],
				scenes: [ ],
				dialogue: [ ]
			}
		];
	//----------------------------------------------------------

	//--$Characters----------------------------------------------
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
	//----------------------------------------------------------
//--END IN-GAME ELEMENTS----------------------------------------

//--$CODE PANEL--------------------------------------------------
	//$Code bits- instruction blocks to be placed in code panel
	var codeBits = {
		step: {
			titleEng: 'step',
			titleEsp: 'paso'
		},
		use: {
			titleEng: 'use',
			titleEsp: 'usar'
		},
		loop: {
			titleEng: 'loop',
			titleEsp: 'ciclo'
		},
		wait: {
			titleEng: 'wait',
			titleEsp: 'esperar'
		},
		condIf: {
			titleEng: 'if',
			titleEsp: 'si'
		},
		condElse: {
			titleEng: 'else',
			titleEsp: 'si no'
		},
		getCodeBit: function(type, lang) {
			return this[type]['title'+lang];
		}
	};

	var selectCodeBitEvent = function() {
		if (codePanel.running === false) {
			var codeBits = codePanel.codeBits;
			var len = codeBits.length;

			codePanel.clearSelection();

			while (len--) {
				if (codeBits[len]=== this) {
					codePanel.indexOfSelected = len;
					break;
				}
			}

			addClass(this, 'cb-selected');
		}
	};
	
	//event handler for start dragging code bit from code bit list
	var starDragCodeBit = function() {
		var type = this.getAttribute('data-type');
		var cpCodeBit = this.cloneNode(true);

		

	};

	//event handler for dragging
	var dragCodeBit = function() {

	};

	//event handler for drop (stop drag)
	var dropCodeBit = function() {

		cpCodeBit.addEventListener('click', selectCodeBitEvent);
		codePanel.addCodeBit(cpCodeBit);
		
		//add visual component to code panel
		codePanel.cpContent.appendChild(cpCodeBit);
	}

	//$Code panel control object
	var codePanel = {
		viewState: 'open',
		numCodeBits: 0,
		codeBitSequence: [],
		maxCodeBits: 0,
		indexOfSelected: -1,
		indexOfExecuted: 0,
		enabled: true,
		running: false,
		scrolling: false,
		scrollPos: 0,
		scrollMax: 0,
		dragPos: 0,
		cpContainer: undefined,
		cpContent: undefined,
		cpScroll: undefined,
		cpScrollBar: undefined,
		cpControls: undefined,
		cpAdd: undefined,
		cpDelete: undefined,
		cpRun: undefined,
		codeBitList: undefined,
		codeBits: [],
		initialize: function(maxCodeBits, codeBitsAllowed) {
			this.cpContainer = document.getElementsByClassName('code-panel')[0];
			this.cpContent = document.getElementsByClassName('cp-content')[0];
			this.cpScroll = document.getElementsByClassName('cp-scroll')[0];
			this.cpScrollBar = document.getElementsByClassName('cp-scroll-bar')[0];
			this.cpControls = document.getElementsByClassName('cp-controls')[0];
			this.cpAdd = document.getElementsByClassName('cp-add')[0];
			this.cpDelete = document.getElementsByClassName('cp-delete')[0];
			this.cpRun = document.getElementsByClassName('cp-run')[0];
			this.codeBitList = document.getElementsByClassName('code-bit-list')[0];

			this.maxCodeBits = maxCodeBits;

			//reset code panel and show
			this.reset();
			this.show();

			//empty code bit list and add allowed code bits
			empty(this.codeBitList);

			var ind = 0;
			var len = codeBitsAllowed.length;
			while (ind < len) {
				var codeBitCont = document.createElement('div');
				var codeBitType = codeBitsAllowed[ind];
				var codeBitText = document.createTextNode(codeBits.getCodeBit(codeBitType, currentUser.options.language));
				codeBitCont.appendChild(codeBitText);
				codeBitCont.className = 'code-bit cb-' + codeBitType;
				codeBitCont.setAttribute('data-type', codeBitType);
				codeBitCont.addEventListener('click', addCodeBitEvent);
				this.codeBitList.appendChild(codeBitCont);

				ind++;
			}
		},
		show: function() {
			//TODO - use velocity for actual slide animation
			addClass(this.cpContainer, 'gui-active');
		},
		hide: function() {
			//TODO - use velocity for actual slide animation
			removeClass(this.cpContainer, 'gui-active');
		},
		reset: function(maxCodeBits) {
			empty(this.cpContent);
			this.viewState = 'open';
			this.numCodeBits = 0;
			this.codeBits = [];
			this.codeBitSequence = [];
			this.indexOfSelected = -1;
			this.indexOfExecuted = 0;
			this.running = false;
			this.enabled = true;
			this.updateScroll();
		},
		scroll: function(change) {
			if (change >= 0 ) {
				//move scroll down
				if (this.scrollPos < this.scrollMax) {
					this.scrollPos += change;
				} else {
					this.scrollPos = this.scrollMax;
				}
			} else {
				//move scroll up
				if (this.scrollPos > 0) {
					this.scrollPos += change;
				} else {
					this.scrollPos = 0;
				}
			}

			this.cpScrollBar.style.top = this.scrollPos + 'px';
			this.cpContent.style.top = (-this.scrollPos) + 'px';
		},
		resetScroll: function() {
			//hide scroll bar
			this.cpScrollBar.style.top = '0';
			this.cpContent.style.top = 0;
			this.scrollPos = 0;
		},
		updateScroll: function() {
			if (this.numCodeBits >= 6) {
				//show scroll bar if number of code bits = 6
				if (this.numCodeBits === 6) {
					this.cpScrollBar.style.display = 'block';
				}
				
				//update size of scroll bar
				var barHeight = 200 - ((this.numCodeBits - 5) * 30);
				this.cpScrollBar.style.height = barHeight + 'px';
				this.scrollMax = (this.numCodeBits - 5) * 30;
			} else {
				this.cpScrollBar.style.display = 'none';
				this.resetScroll();
			}

			this.scroll(0);
		},
		clearSelection: function() {
			if (this.indexOfSelected > -1) {
				removeClass(this.codeBits[this.indexOfSelected], 'cb-selected');
				this.indexOfSelected = -1;
			}
		},
		addCodeBit: function(codeBitRef) {
			if (this.numCodeBits < this.maxCodeBits) {
				this.numCodeBits++;
				this.codeBitSequence.push(codeBitRef.getAttribute('data-type'));
				this.codeBits.push(codeBitRef);

				this.updateScroll();
			} else {
				showMessageBox({ Eng: 'maximum number of code bits reache', Esp: 'numero maximo de code bits'}, 'alert', 'warning');
				// console.log('reached maximum number of code bits');
			}
		},
		deleteCodeBit: function(codeBitIndex) {
			var ind = this.indexOfSelected;
			if (ind > -1) {
				this.clearSelection();

				//remove actual element
				this.cpContent.removeChild(this.codeBits[ind]);

				this.numCodeBits-=1;
				this.codeBitSequence.splice(ind, 1);
				this.codeBits.splice(ind, 1);

				this.updateScroll();
			} else {
				showMessageBox({ Eng: 'Please select a code bit', Esp: 'Por favor seleccione un code bit'}, 
					'alert', 'warning');
			}
		},
		runSequence: function() {
			this.resetScroll();
			pBot.reset();
			//go through code bits and execute each one every second
			var executionCycle = function() {
				if (codePanel.running) {
					if (pBot.framesRemaining <= 0) {
						//only execute when bot is ready for another animation
						var ind = codePanel.indexOfExecuted;
						if (ind < codePanel.numCodeBits) {
							if (ind > 0) {
								removeClass(codePanel.codeBits[ind - 1], 'cb-executing');
							} 

							if (ind >= 5) {
								//scroll 
								codePanel.scroll(30);
							}

							//highlight code bit
							addClass(codePanel.codeBits[ind], 'cb-executing');

							//execute
							pBot.executeAction(codePanel.codeBitSequence[ind]);

							codePanel.indexOfExecuted++;
							setTimeout(executionCycle, 100);

						} else {
							//show result of execution
							showMessageBox( {Eng: 'Execution Complete', Esp: 'Fin de Ejecucion'}, 'alert', 'success');

							removeClass(codePanel.codeBits[ind - 1], 'cb-executing');
							codePanel.running = false;
							codePanel.indexOfExecuted = 0;
							codePanel.resetScroll();
						}
					} else {
						setTimeout(executionCycle, 100);
					}
				}
			};

			executionCycle();
		}
	};
//--END CODE PANEL----------------------------------------------

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
