"use strict";
//--GAME LEVEL AND ACHEIVEMENTS DATA---------------------------------	
	//--$Load Levels --------------------------------------------
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
				if (classCheck(ele, 'level-locked')) {
					console.log('level is loicked');
					//TODO - SHOW MESSAGE THAT LEVEL IS LOCKED
				} else {
					modifyMultiple(levelSelectThumbs, function(element) {
						removeClass(element, 'level-selected');
					});
					addClass(ele, 'level-selected');
				}
			});
		}
	//-----------------------------------------------------------

	//--$Intro Slides -------------------------------------------
		var IntroSlides = {
			level1: [ ],
			level2: [ ],
			level3: [ ]
		};
	//-----------------------------------------------------------

	//--$Grade Criteria -----------------------------------------
		var GradeCriteria = {
			level1: {
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
			level2: {
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
			level3: {
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
			}

		}
	//-----------------------------------------------------------

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
				gradeCritera: GradeCriteria.level1,
				rewards: {
					codeBit: 'use',
					acheives: ['first steps'],
					points: 100
				},
				introSlides: IntroSlides.level1
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
				gradeCritera: GradeCriteria.level2,
				rewards: {
					codeBit: '',
					acheives: ['user'],
					points: 100
				},
				introSlides: IntroSlides.level2
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
				gradeCritera: GradeCriteria.level3,
				rewards: {
					codeBit: '',
					acheives: [''],
					points: 100
				},
				introSlides: IntroSlides.level3
			}
		];
	//----------------------------------------------------------

	//--$Acheivements-------------------------------------------
		var acheives = {
			'first-steps': {
				titleEng: 'First Steps',
				titleEsp: 'Primeros Pasos',
				descEng: 'Pass first level',
				descEsp: 'Pasar primer nivel',
				points: 50,
				icon: 'medal.png'
			},
			'user': {
				titleEng: 'First Steps',
				titleEsp: 'Primeros Pasos',
				descEng: 'Pass first level',
				descEsp: 'Pasar primer nivel',
				points: 50,
				icon: 'medal.png'
			}
		};
	//----------------------------------------------------------