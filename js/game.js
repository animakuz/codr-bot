"use strict";


//-- GAME BASED FUNCTIONS AND OBJECTS--------------------------------------------	
//TODO - (FOR LATER) OPTIMIZE GRAPHICS FOR LARGE AND SMALL DEVICES
//-- Base data -------------------------------------------------
	var activeAnimations = {
		gameObjects: 0,
		characters: 0
	};

	//create js shortcut
	var cjs = createjs;

	//set ticker properties
	cjs.Ticker.timingOption = cjs.Ticker.RAF;
	cjs.Ticker.setFPS(30);

	var unitDistance = 80;  //pixel size of each distance unit
	var unitTime = 1000; // duration of unit time in miliseconds (duration of every unit action)
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
				var currX = i * unitDistance;

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
			frames: [[0,0,240,70],[0,70,285,145],[240,0,435,50],[285,55,425,50],[285,100,420,145]]
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

					this.sprite.gotoAndStop(cloudInd); //set cloud image according to randomly generated number
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
			var i;
			for (i=0; i<this.numClouds; i++) {
				this.clouds[i].move();

				//reset clouds when off screen
				if (this.clouds[i].offScreen()) {
					this.clouds[i].initialize(this.cloudSheet, this.cloudData.frames);
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

			cjs.Ticker.addEventListener('tick', function() {
				bgGraphics.animateClouds();
			});
		}
	//----------------------------------------------------------
	};
//--------------------------------------------------------------

//--IN GAME ELEMENTS -------------------------------------------
	//--Game Objects--------------------------------------------
	var gameObjMngr = {	
		//dimensions for each game object graphic
		imgFrames: {
			bomb: { width: 80, height: 80 , regX: 0, regY: 80 },
			bridge: { width: 160, height: 160 , regX: 0, regY: 160 },
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
				flatToUp: [0,29],
				up: [29],
				upToFlat: [30,59],
				flatToDown: [60,89],
				down: [89],
				downToFlat: [90,119]
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
		initializeGameObjectData: function() {
			this.gameObjectStage = new cjs.Stage('game-objects-canvas');
		},
		animateGameObject: function(gameObjectSprite, animation) {
			//checks for animating and such
			// gameObjectSprite.gotoAndPlay(animation);
			//clearing tick and such
		},
		createGameObject: function(type, category, unitPos) { //create new game object
			return {
				posX: 0,
				posY: 0,
				type: '',
				category: '',
				unitPos: '',
				state: 'base',
				sprite: undefined,
				initialize: function(spriteList, frameList, animList, verAnchorList) {
					this.type = type;
					this.category = category;
					this.unitPos = unitPos;
					if (type === 'wall') {
						this.posX = ((unitPos - 1) * unitDistance) - 40;
					} else {
						this.posX = ((unitPos - 1) * unitDistance);
					}

					//set vertical position
					this.posY = verAnchorList[type];					
					
					//setup sprite
					var frameData = {
						images: [spriteList[type]],
						frames: frameList[type],
						animations: animList[type]
					};

					var spriteSheet = new cjs.SpriteSheet(frameData);
					if (typeof this.sprite === 'undefined') {
						this.sprite = new cjs.Sprite(spriteSheet);
					}

					this.sprite.x = this.posX;
					this.sprite.y = this.posY;
					this.sprite.gotoAndStop('base');
					//add complementary functions according to type
					// switch (type) {
					// 	case 'bridge': 
					// 		this.drop = function() {
					// 			if (this.state === 'base' || this.state ==='flat') {
					// 				animateGameObject(this.sprite, 'flatToDown');
					// 				this.state = 'down';
					// 			} else if (this.state === 'up') {
					// 				animateGameObject(this.sprite, 'upToFlat' );
					// 				this.state = 'flat';
					// 			}
					// 		};
					// 		break;
					// }
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
					objDataList[i][2]) //unit position
				);
				this.objectList[i].initialize(sprites, this.imgFrames, this.animations, this.vertAnchors);
				this.gameObjectStage.addChild(this.objectList[i].sprite);
			}

			//draw lines to mark unit positions
			// for (i=0; i<10; i++) {
			// 	var line = new cjs.Shape();
			// 	line.graphics.setStrokeStyle(1).beginStroke('red');
			// 	line.graphics.moveTo(i* unitDistance, 0).lineTo(i* unitDistance, 200);
			// 	this.gameObjectsStage.addChild(line);
			// }

			//set event bindings for ingame elements

			this.gameObjectStage.update();
		}
	};

	//----------------------------------------------------------
//--END IN GAME ELEMENTS----------------------------------------


//-- Game levels -----------------------------------------------
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
//--------------------------------------------------------------

//-- Code-bits -------------------------------------------------
	// fragments of code - instruction bits to be placed in code panel
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
//--------------------------------------------------------------

//-- Characters ------------------------------------------------
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
		},
		talk: function(){
			console.log('talking guide bot');
		}
	};
//--------------------------------------------------------------

//-- Code panel control object ---------------------------------
	var codePanel = {
		viewState: "open",
		numCodeBits: 0
	};
//--------------------------------------------------------------


//-- Game engine -----------------------------------------------
	var theGame = {
		id: 0,
		level: {},
		gameObjectsStage: undefined,
		characterStage: undefined,
		initialize: function() {
			//set stages and containers
			this.gameObjectsStage = new cjs.Stage('game-objects-canvas');
			var goCont = new cjs.Container();
			goCont.x = 0;
			goCont.y = 0;
			goCont.width = 800;
			goCont.height = 200;
			
			//set level

			//set corresponding lands (test)
			bgGraphics.setLands([1,1,3,0,2,1,1,1,1,1]);
			//set corresponding game objects

			//set corresponding rules

			//set corresponding goals

			//test (this data will be taken from level object in real use)
			var gameObjectsTest = [
				['lever','tool',2],
				['bridge','tool',3],
				['detonator','tool',6],
				['wall','obstacle',7],
				['bomb','tool', 9],
				['target','target',10]
			];

			//set game objects
			gameObjMngr.setGameObjects(gameObjectsTest);

		},
		checkResults: function() {
			
		}
	};
//--------------------------------------------------------------
