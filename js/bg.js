"use strict";
//-- BACKGROUND GRAPHICS --------------------------------------
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