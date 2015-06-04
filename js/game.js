//-- GAME BASED FUNCTIONS AND OBJECTS--------------------------------------------	

//-- Base data -------------------------------------------------
	var gameCanvas = document.getElementById('game-canvas');
	var gameLandsCanvas = document.getElementById('game-lands-canvas');
	var unitDistance = 80;  //gameCanvas.width / 10; - no need to calculate width since canvas scales
	var unitTime = 1000; // in miliseconds 
//--------------------------------------------------------------

//-- Game objects ----------------------------------------------
	var createGameObjects = function(xPos, yPos, tipo) {
		//these objects will only store information on the game object. The game engine
		//will be responsible for rendering the visual element
		return {
			xPos: xPos,
			yPos: yPos,
			tipo: tipo
		};
	};
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

	var createCloud = function(imageRef, context) {
		var cloudInd = getRandomInt(0,4);
		var cloudInfo = cloudList[cloudInd];
		var speed = getRandomInt(1,2) - 0.5;
		var direction = getRandomInt(0,1);
		var x, y = getRandomInt(-10, 50);
		var scaleFactor = 0.6;

		//direction options
		if (direction === 0) {
			//cloud moves left
			x = context.canvas.clientWidth + (cloudInfo[2] * scaleFactor) + (cloudInfo[2] * Math.random());
			speed = -speed; //velocity (direction 0 == left, 1 == right)
		} else if (direction === 1) {
			//cloud moves right
			x = -(cloudInfo[2] * scaleFactor);
		}

		return {
			posX: x,
			posY: y,
			vX: speed, 
			scaleX: cloudInfo[2] * scaleFactor, //3rd value of cloud info sub-array = width of image
			scaleY: cloudInfo[3] * scaleFactor, //4th value = height of image (scaled according to a randomly 
												//generated scale factro)
			image: { //image slice properties for getting from sprite sheet
				sX: cloudInfo[0], //slice x
				sY: cloudInfo[1], //slice y
				sW: cloudInfo[2], //slice width
				sH: cloudInfo[3]  //slice height
			},
			offScreen: function() {
				if (direction === 0) {
					//cloud moves left - goes offscreen at left
					if (this.posX < 0 - this.scaleX) {
						return true;
					} else {
						return false;
					}
				} else if (direction === 1) {
					//cloud moves right and goes offscreen at right
					if (this.posX > context.canvas.clientWidth) {
						return true;
					} else {
						return false;
					}
				}
			},
			move: function() {
				this.posX += this.vX;
				//console.log('velocity: ' + this.vX + ' pos: ' + this.posX);
			},
			draw: function() {
				context.drawImage(imageRef, this.image.sX, this.image.sY, this.image.sW, this.image.sH, 
					this.posX, this.posY, this.scaleX, this.scaleY);
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
		var i = 0;
		//initialize clouds variables
		var numClouds = 0;
		var clouds = [];

		//push out 10 clouds at variable intervals - each cloud will behave according to its properties
		var makeClouds = function() {
			//create clouds
			clouds.push(createCloud(sprites.clouds, ctx));
			numClouds++;
			i++;
			if (i<5) {
				nextInterval = getRandomInt(1000,2000);
				// console.log('new cloud');
				setTimeout(makeClouds, nextInterval);
			}
		};
		makeClouds();

		//call function
		var animateClouds = function() {
			var i;
			width = bgCloudCanvas.width;
			ctx.clearRect(0, 0, width, 168);
			for (i=0; i<numClouds; i++) {
				clouds[i].move();
				clouds[i].draw();

				//reset clouds when off screen
				if (clouds[i].offScreen()) {
					//console.log('cloud reset');
					clouds[i] = createCloud(sprites.clouds, ctx);
				}
			}

			window.requestAnimationFrame(animateClouds);
		};

		animateClouds();

	};
//--------------------------------------------------------------


//-- GAME GRAPHICS ---------------------------------------------


//-- END GAME GRAPHICS -----------------------------------------
