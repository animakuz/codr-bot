//-- GAME BASED FUNCTIONS AND OBJECTS--------------------------------------------	

//-- Base data -------------------------------------------------
	var gameCanvas = document.getElementById('game-canvas');
	var gameLandsCanvas = document.getElementById('game-lands-canvas');
	var unitDistance = 80;  //gameCanvas.width / 10; - no need to calculate width since canvas scales
	var unitTime = 1000; // in miliseconds 
//--------------------------------------------------------------

//-- Game objects ----------------------------------------------

//--------------------------------------------------------------

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

	};
//--------------------------------------------------------------

//-- BACKGROUND GRAPHICS ---------------------------------------
	//set 'lands' graphics
	var setLands = function(landsTrack) {
		var landsCanvas = document.getElementById('game-lands-canvas');
		var ctx = landsCanvas.getContext('2d');
		var width = landsCanvas.width;
		var height = landsCanvas.height;
		var i, len= landsTrack.length;

		//refresh lands canvas
		ctx.clearRect(0, 0, width, height);

		//draw images according to values in landsTrack array
		for (i=0; i<len; i++) {
			var currX = i * unitDistance;

			switch(landsTrack[i]) {
				case 0:  //0 = gap - don't draw anything
					break;

				case 1: //1 = continuous graphic
					ctx.drawImage(sprites.lands, 0, 0, 160, 160, currX, 0, 80, 80 );
					break;

				case 2: //2 = left side gap edge graphic
					ctx.drawImage(sprites.lands, 0, 160, 160, 160, currX, 0, 80, 80 );
					break;

				case 3: //3 = right side gap edge graphic
					ctx.drawImage(sprites.lands, 0, 320, 160, 160, currX, 0, 80, 80 );
					break;
			}
		}
	};

	//cloud sprite sheet image slices coordinates
	var cloudList = [
		[0,0,480,140],
		[0,140,560,290],
		[480,0,870,100],
		[570,110,850,100],
		[570,200,840,290]
	];

	var createCloud = function() {
		return {
			posX: 0,
			posY: 0,
			vX: 0, 
			scaleX: 0,
			scaleY: 0,
			direction: 0,
			image: { //image slice properties for getting from sprite sheet
				img: undefined,
				sX: 0,
				sY: 0,
				sW: 0,
				sH: 0
			},
			initialize: function(context, imageRef, cloudData) {
				var cloudInd = getRandomInt(0,4);
				var cloudInfo = cloudData[cloudInd];
				var scaleFactor = 0.6;

				this.posY = getRandomInt(-10, 50);
				this.vX = getRandomInt(1,2) - 0.5;
				this.direction = getRandomInt(0,1);
				this.scaleX = cloudInfo[2] * scaleFactor, //3rd value of cloud info sub-array = width of image
				this.scaleY = cloudInfo[3] * scaleFactor, //4th value = height of image 
				this.image.img = imageRef;
				this.image.sX = cloudInfo[0], //slice x
				this.image.sY = cloudInfo[1], //slice y
				this.image.sW = cloudInfo[2], //slice width
				this.image.sH = cloudInfo[3]  //slice height

				//direction options
				if (this.direction === 0) {
					//cloud starts at right edge and moves left
					this.posX = context.canvas.clientWidth + (cloudInfo[2] * scaleFactor) + (cloudInfo[2] * Math.random());
					this.vX = -this.vX; //velocity (direction 0 == left, 1 == right)
				} else if (this.direction === 1) {
					//cloud starts at left edge and moves right
					this.posX = -(cloudInfo[2] * scaleFactor);
				}
			},
			move: function() {
				this.posX += this.vX;
				//console.log('velocity: ' + this.vX + ' pos: ' + this.posX);
			},
			draw: function(context) {
				context.drawImage(this.image.img, this.image.sX, this.image.sY, this.image.sW, this.image.sH, 
					this.posX, this.posY, this.scaleX, this.scaleY);
			},
			offScreen: function(context) {
				if (this.direction === 0) {
					//cloud moves left - goes offscreen at left
					if (this.posX < 0 - this.scaleX) {
						return true;
					} else {
						return false;
					}
				} else if (this.direction === 1) {
					//cloud moves right and goes offscreen at right
					if (this.posX > context.canvas.clientWidth) {
						return true;
					} else {
						return false;
					}
				}
			}
		};
	};

	//set clouds graphics
	var setClouds = function() {
		//load clous canvas and set graphics
		var bgCloudCanvas = document.getElementById('game-bg-clouds-canvas');
		var ctx = bgCloudCanvas.getContext('2d');
		var width = bgCloudCanvas.width;
		var nextInterval;
		var numClouds = 0;
		var clouds = [];

		//push out 10 clouds at variable intervals - each cloud will behave according to its properties
		var makeClouds = function() {
			//create clouds
			clouds.push(createCloud());
			clouds[numClouds].initialize(ctx, sprites.clouds, cloudList);
			numClouds++;
			if (numClouds<5) {
				nextInterval = getRandomInt(1000,2000);
				// console.log('new cloud');
				setTimeout(makeClouds, nextInterval);
			}
		};
		makeClouds();

		//call function
		var animateClouds = function() {
			var i;
			ctx.clearRect(0, 0, width, 168);
			for (i=0; i<numClouds; i++) {
				clouds[i].move();
				clouds[i].draw(ctx);

				//reset clouds when off screen
				if (clouds[i].offScreen(ctx)) {
					//console.log('cloud reset');
					clouds[i].initialize(ctx, sprites.clouds, cloudList);
				}
			}

			window.requestAnimationFrame(animateClouds);
		};

		animateClouds();
	};
//--------------------------------------------------------------


//-- GAME ELEMENTS ---------------------------------------------

	//all this code should probably go in game engine object

	//create game objects (temporarily here - will be placed in level initialization)
	var createGameObject = function(type, unitPos) {
		return {
			posX: 0,
			posY: 0,
			scaleX: 0,
			scaleY: 0,
			image: {
				img: undefined,
			},
			initialize: function(spriteList) {
				this.image.img = spriteList[type];
				this.posX = ((unitPos - 1) * unitDistance);
				this.posY = 80;
				this.scaleX = spriteList[type].width * 0.5;
				this.scaleY = spriteList[type].width * 0.5;
			},
			draw: function(context) {
				context.drawImage(this.image.img, this.posX, this.posY, this.scaleX, this.scaleY);
			}
		};
	};

	//set game objects and correspondig graphics
	var setGameObjects = function(objectList) {
		var gameObjectsCanvas = document.getElementById('game-objects-canvas');
		var ctx = gameObjectsCanvas.getContext('2d');
		var width = gameObjectsCanvas.width;
		var height = gameObjectsCanvas.height;
		var i;
		// var len = objectList.length;


		//create test game objects (in actual use case this values would be taken from objectList)
		var gameObjectsTest = [];
		gameObjectsTest.push(createGameObject('bridge', 1));
		gameObjectsTest[0].initialize(sprites);
		gameObjectsTest.push(createGameObject('lever', 7));
		gameObjectsTest[1].initialize(sprites);

		ctx.clearRect(0, 0, width, height);
		//mark distance units with random colors
		for (i=0; i<10; i++) {
			var blueOffset = getRandomInt(5,25);
			var redOffset = getRandomInt(5,25);
			var color = 'rgba(' + redOffset*i + ',' + 25*i + ',' + blueOffset*i + ', 0.5)';
			ctx.fillStyle = color;
			ctx.fillRect(i*unitDistance, 0, unitDistance, 200);
		}

		//draw game objects to canvas
		for (i=0; i<2; i++) {
			gameObjectsTest[i].draw(ctx);
		}
	};

//-- END GAME ELEMENTS -----------------------------------------
