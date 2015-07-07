"use strict";
//--Game Objects-----------------------------------------------
	var gameObjMngr = {	
		//dimensions for each game object graphic
		imgFrames: {
			bomb: { width: 160, height: 160 , regX: 120, regY: 120 },
			bridge: { width: 161, height: 161 , regX: 0, regY: 120 },
			detonator: { width: 80, height: 80 , regX: 0, regY: 40 },
			lever: { width: 81, height: 81 , regX: 0, regY: 40 },
			rock: { width: 80, height: 80 , regX: 0, regY: 40 },
			target: {width: 80, height: 81 , regX: 0, regY: 40 },
			wall: { width: 160, height: 160, regX: 0, regY: 120 },
		},
		animations: { //animation list for each game object
			bomb: { 
				base: [0],
				explode: [1,28,'gone'],
				gone: [29]
			},
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
			detonator: { 
				base: [0],
				press: [1,28,'pressed'],
				pressed: [29]
			},
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
			rock: { 
				base: [0],
				fall: [1,28,'flipped'],
				flipped: [29] 
			},
			target: { 
				base: [0],
				pulse: [1,29,'base'],
				hit: [30,58,'gone'],
				gone: [59]
			},
			wall: { 
				base: [0],
				explode: [1,28,'gone'],
				gone: [29]
			},
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
				initialState: startState,
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
			var len = this.objectList.length;
			while(len--) {
				var tempObj = this.objectList[len];
				tempObj.sprite.gotoAndStop(tempObj.initialState);
				tempObj.state = tempObj.initialState;
				tempObj.sprite.y = this.vertAnchors[tempObj.objType];
			}
			this.gameObjectStage.update();
		},
		clearGameObjects: function() {
			if (typeof this.gameObjectStage !== 'undefined') {
				this.gameObjectStage.removeAllChildren();
				this.gameObjectStage.update();
			}
		}
	};
//----------------------------------------------------------