"use strict";


//-- GAME BASED FUNCTIONS AND OBJECTS--------------------------------------------	
//TODO - (FOR LATER) OPTIMIZE GRAPHICS FOR LARGE AND SMALL DEVICES
//-- Base data -------------------------------------------------
	//create js shortcut
	var cjs = createjs;

	var UNIT_DISTANCE = 80;  //pixel size of each distance unit
	var UNIT_TIME = 30; // duration of unit time in frames (duration of every unit action and same as framerate)

	//set ticker properties
	cjs.Ticker.timingOption = cjs.Ticker.RAF;
	cjs.Ticker.setFPS(UNIT_TIME);
//--------------------------------------------------------------

//-- BACKGROUND GRAPHICS ---------------------------------------
	var bgGraphics = {
	//--lANDS---------------------------------------------------
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

	//--Clouds--------------------------------------------------
		numClouds: 0, 
		clouds: [],
		cloudData: { //cloud sprite sheet data
			images: [sprites.clouds],
			frames: [[0,0,240,70],[0,70,285,145],[240,0,435,50],[285,55,425,50],[285,100,420,145]],
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
			cjs.Ticker.addEventListener('tick', function() {
				bgGraphics.animateClouds();
			});
		}
	};
//--------------------------------------------------------------

//--IN-GAME ELEMENTS -------------------------------------------
	//--Game Objects--------------------------------------------
		var gameObjMngr = {	
			//dimensions for each game object graphic
			imgFrames: {
				bomb: { width: 80, height: 80 , regX: 0, regY: 80 },
				bridge: { width: 161, height: 161 , regX: 0, regY: 160 },
				detonator: { width: 80, height: 80 , regX: 0, regY: 80 },
				lever: { width: 80, height: 80 , regX: 0, regY: 80 },
				rock: { width: 80, height: 80 , regX: 0, regY: 80 },
				target: {width: 80, height: 80 , regX: 0, regY: 80 },
				wall: { width: 160, height: 160, regX: 0, regY: 160 },
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
				lever: { base: [0] },
				rock: { base: [0] },
				target: { base: [0] },
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
				this.gameObjectStage = new cjs.Stage('game-objects-canvas');
			},
			addHandler: function(gameObj) {
				//consider changing this to add Handler(S) to just go through through array and add all the handlers for 
				//different objects
				if (gameObj.objType === 'bridge') {
					gameObj.sprite.addEventListener('click', function() {
						switch(gameObj.state) {
							case 'up' : 
								gameObj.drop();
								break;
							case 'down': 
								gameObj.lift();
								break;
							default: 
								if (getRandomInt(0,1)) {
									gameObj.drop();
								} else {
									gameObj.lift();
								}
							break;
						}
					});
				}
			},
			animateGameObject: function(gameObjectSprite, animation) {
				//set animating to true or increment animation stack
				var gameObjUpdate = function() {
					gameObjMngr.framesRemaining -= 1;
					if (gameObjMngr.framesRemaining <= 0) {
						//if it reaches 0 delete handler and reduce active
						cjs.Ticker.removeEventListener('tick', gameObjUpdate);
					} else {
						gameObjMngr.gameObjectStage.update();
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

						if (this.objType === 'wall') {
							this.sprite.x = (this.unitPos * UNIT_DISTANCE) - 40;
						} else {
							this.sprite.x = (this.unitPos * UNIT_DISTANCE);
						}
						this.sprite.y = verAnchorList[objType];

						this.sprite.gotoAndStop(startState);

						// add complementary functions according to type
						switch (this.objType) {
							case 'bridge': 
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
				for (i=0; i<10; i++) {
					var line = new cjs.Shape();
					line.graphics.setStrokeStyle(4).beginStroke('red');
					line.graphics.moveTo(i* UNIT_DISTANCE, 0).lineTo(i* UNIT_DISTANCE, 200);
					this.gameObjectStage.addChild(line);
				}
				this.gameObjectStage.update();
			},
			clearGameObjects: function() {
				this.gameObjectStage.removeAllChildren();
				this.gameObjectStage.update();
			}
		};
	//----------------------------------------------------------

	//--Game levels --------------------------------------------
		var gameLevels = [
			{
				name: 'level-test',
				title: 'Testing Level',
				description: 'A basic level for testing purposes',
				bg: 'sunny',
				music: 'off',
				puzzleTrack: ['','','','','','','','target','',''], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,1,1,1,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['target','target', 7, 'base']
				], 
				rules: {
					numCodeBits: 10,
					codeBitsAllowed: ['step']
				},
				gradeCritera: {
					numCodeBits: { bronze: 10, silver: 10, gold: 10 },
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
				name: 'level-test2',
				title: 'Testing Level 2',
				description: 'Another basic level for testing purposes',
				bg: 'sunny',
				music: 'off',
				puzzleTrack: ['','','lever-down','','bridge-down','gap','','target','',''], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,3,0,2,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['lever','tool', 2, 'down' ],
					['bridge', 'tool', 4, 'down'],
					['target','target', 7, 'base']
				], 
				rules: {
					numCodeBits: 10,
					codeBitsAllowed: ['step']
				},
				gradeCritera: {
					numCodeBits: { bronze: 10, silver: 10, gold: 10 },
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

	//--Characters----------------------------------------------
		//P-bot (programaquina - player's avatar)
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
				var self = this;

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

				this.sprite.addEventListener('click', function() {
					self.executeAction('step');
				});
			},
			reset: function() {
				//reset to starting position
			},
			clearBot: function() {
				this.characterStage.removeAllChildren();
				this.characterStage.update();
			},
			animate: function(animation, move, distance) {
				if (move) {
					var speed = floorTrunc((distance / UNIT_TIME), 1);
					console.log(speed);
				}
				var pBotUpdate = function() {
					if (move) {
						pBot.sprite.x += speed;
						// console.log(speed);
					}
					pBot.framesRemaining -= 1;

					if (pBot.framesRemaining <= 0) {
						//if it reaches 0 delete handler
						cjs.Ticker.removeEventListener('tick', pBotUpdate);
						if (move) {
							pBot.unitPos += distance / UNIT_DISTANCE;
						}
					} else {
						// console.log('animating character');
						pBot.characterStage.update();
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
			executeAction: function(action) {
				//execute one of a list of possible actions
				switch(action) {
					case 'step': 
						this.animate('step', true, UNIT_DISTANCE);
						break;
				}
			}
		};

		//C-bot (guide bot)
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

//--CODE PANEL--------------------------------------------------
	//Code bits- instruction blocks to be placed in code panel
	var codeBits = {
		createCodeBit: function(name, type, position, number) {
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
		}
	};

	//Code panel control object
	var codePanel = {
		viewState: "open",
		numCodeBits: 0,
		codeBitSequence: [],
		addCodeBit: function(type) {

		},
		removeCodeBit: function(codeBit) {
			
		}
	};
//--END CODE PANEL----------------------------------------------

//--GAME ENGINE-------------------------------------------------
	var theGame = {
		level: {},
		initialize: function(level) {			
			//set level
			this.level = level;

			//set corresponding lands 
			bgGraphics.setLands(level.landsTrack);

			//set corresponding game objects
			gameObjMngr.setGameObjects(level.gameObjects);

			//initialize avatar
			pBot.initialize();
		},
		pause: function() {

		},
		checkResults: function() {
			
		},
		reset: function() {

		},
		end: function() {

		}
	};
//--END GAME ENGINE---------------------------------------------
