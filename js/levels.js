"use strict";
//--GAME LEVEL AND ACHEIVEMENTS DATA---------------------------------	
	//--$Load Levels --------------------------------------------
		//update level list and show level thumbnails (included here so this code can be called by game functions)
		var levelSelectLevels = document.getElementById('level-select-levels');

		var addLevelThumb = function(container, status, index, levelData, grade) {
			var levelThumbCont = document.createElement('div');
			var levelNum = document.createTextNode(index + 1);

			levelThumbCont.className = 'level-thumb th-level-select level-' + status;
			if (status === 'passed') {
					levelThumbCont.className += ' level-' + grade;
			}
			levelThumbCont.className+= ' unselectable';
			levelThumbCont.setAttribute('data-level', index);
			levelThumbCont.appendChild(levelNum);
			
			//possibly other info

			container.appendChild(levelThumbCont);
		};

		function loadLevels() {
			var i = 0;
			var numLevels = gameLevels.length;
			var levelStatus = 'passed';

			//delete current items
			empty(levelSelectLevels);

			while(i < numLevels) {
				if (levelStatus === 'passed') {
					//still checking levels cleared 
					if (currentUser.data.levelsCleared[i]) {
						//load level thumbnail as cleared with corresponding data
						addLevelThumb(levelSelectLevels, 'passed', i, gameLevels[i], currentUser.data.levelsCleared[i].grade);
						i++;
					} else {
						//change status to keep checking other levels
						levelStatus = 'open';
					}					
				} else if (levelStatus === 'open') {
					//load level as open
					addLevelThumb(levelSelectLevels, 'open', i, gameLevels[i]);
					//change status to locked - only one level after all cleared levels is open
					levelStatus = 'locked';
					i++;
				} else if (levelStatus === 'locked') {
					//load level as locked
					addLevelThumb(levelSelectLevels, 'locked', i, gameLevels[i]);
					i++;
				}
			}

			var levelSelectThumbs = document.querySelectorAll('.th-level-select');

			//bind events for click of level select buttons
			bindMultiple(levelSelectThumbs, 'onclick', function(ele) {
				if (classCheck(ele, 'level-locked')) {
					//TODO - show animation of locked level
				} else {
					modifyMultiple(levelSelectThumbs, function(element) {
						removeClass(element, 'level-selected');
					});
					addClass(ele, 'level-selected');
				}
			});
		}
	//-----------------------------------------------------------

	//--$Acheivements-------------------------------------------
		var acheives = [
			{
				id: 0,
				titleEng: 'First Steps',
				titleEsp: 'Primeros Pasos',
				descEng: 'Pass first level',
				descEsp: 'Pasar primer nivel',
				points: 50,
				icon: 'medal.png'
			},
			{
				id: 1,
				titleEng: 'Long Walk',
				titleEsp: 'Caminata',
				descEng: 'Take 8 steps',
				descEsp: 'Hacer 8 pasos',
				points: 50,
				icon: 'medal.png'
			},
			{
				id: 2,
				titleEng: 'User',
				titleEsp: 'Usuario',
				descEng: 'Use a tool',
				descEsp: 'Utilizar una herramienta',
				points: 50,
				icon: 'medal.png'
			},
			{
				id: 3,
				titleEng: 'Improved',
				titleEsp: 'Mejorado',
				descEng: 'Improve grade on a level',
				descEsp: 'Mejor el grado de un nivel',
				points: 50,
				icon: 'medal.png'
			}
		];
	//----------------------------------------------------------

	//--$Grade Criteria -----------------------------------------
		var GradeCriteria = {
			level1: {
				maxCodeBits: { bronze: 10, silver: 5, gold: 3 },
				codeBitsAllowed: {
					bronze: ['step','use','loop','condIf'],
					silver: ['step','use','loop'],
					gold: ['step','loop']
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
				music: 'off',
				puzzleTrack: ['','','','target','','','','','','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,1,1,1,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
						['target','target', 3, 'base'],
						['detonator','tool', 2, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCriteria: GradeCriteria.level1,
				rewards: {
					codeBit: 'use',
					acheive: acheives[0],
					points: 100
				},
				introSlides: IntroSlides[0]
			},
			{
				id: 2,
				name: 'level-test2',
				title: 'Testing Level 2',
				description: 'Another basic level for testing purposes',
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
				gradeCriteria: GradeCriteria.level2,
				rewards: {
					codeBit: '',
					acheive: acheives[1],
					points: 100
				},
				introSlides: []
			},
			{
				id: 3,
				name: 'level-test3',
				title: 'Testing Level 3',
				description: 'Another basic level for testing purposes',
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
				gradeCriteria: GradeCriteria.level3,
				rewards: {
					codeBit: '',
					acheive: acheives[2],
					points: 100
				},
				introSlides: []
			}
		];
	//----------------------------------------------------------

