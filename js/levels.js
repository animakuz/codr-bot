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
				id: 1,
				titleEng: 'First Steps',
				titleEsp: 'Primeros Pasos',
				descEng: 'Pass first level',
				descEsp: 'Pasar primer nivel',
				points: 50,
				icon: 'medal.png'
			},
			{
				id: 2,
				titleEng: 'Long Walk',
				titleEsp: 'Caminata',
				descEng: 'Take 8 steps',
				descEsp: 'Hacer 8 pasos',
				points: 50,
				icon: 'medal.png'
			},
			{
				id: 3,
				titleEng: 'User',
				titleEsp: 'Usuario',
				descEng: 'Use a tool',
				descEsp: 'Utilizar una herramienta',
				points: 50,
				icon: 'medal.png'
			},
			{
				id: 4,
				titleEng: 'Advanced User',
				titleEsp: 'Usuario Avanzado',
				descEng: 'Use more than one tool',
				descEsp: 'Utilizar mas de una herramienta',
				points: 50,
				icon: 'medal.png'
			}, 
			{
				id: 5,
				titleEng: 'Explosive',
				titleEsp: 'Explosivo',
				descEng: 'Blow up something with a bomb',
				descEsp: 'Explotar algo con una bomba',
				points: 50,
				icon: 'medal.png'
			}, 
			{
				id: 6,
				titleEng: 'Cyclical Redundancy',
				titleEsp: 'Redundancia Ciclica',
				descEng: 'Use a loop',
				descEsp: 'Utilizar un ciclo',
				points: 50,
				icon: 'medal.png'
			}, 
			{
				id: 7,
				titleEng: 'Lucky number 7',
				titleEsp: 'Siete de suerte',
				descEng: 'Pass 7 levels',
				descEsp: 'Pasar 7 niveles',
				points: 77,
				icon: 'medal.png'
			}, 
			{
				id: 8,
				titleEng: 'Mission Complete',
				titleEsp: 'Mision Terminada',
				descEng: 'Complete all 8 levels',
				descEsp: 'Terminar los 8 niveles',
				points: 50,
				icon: 'medal.png'
			}, 
			{
				id: 9,
				titleEng: 'Improvement',
				titleEsp: 'Mejora',
				descEng: 'Improve your score on a level',
				descEsp: 'Mejorar tu grado de un nivel',
				points: 50,
				icon: 'medal.png'
			}, 
			{
				id: 10,
				titleEng: 'Persistent',
				titleEsp: 'Persistente',
				descEng: 'Repeat a level 5 times in a row',
				descEsp: 'Repetir un nivel 5 veces seguido',
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
				maxCodeBits: { bronze: 10, silver: 9, gold: 8 },
				codeBitsAllowed: {
					bronze: ['step', 'use', 'loop', 'condIf'],
					silver: ['step', 'use', 'loop'],
					gold: ['step', 'loop']
				},
				errorsAllowed: {
					bronze: 5,
					silver: 3,
					gold: 0
				}
			},
			level3: {
				maxCodeBits: { bronze: 10, silver: 9, gold: 7 },
				codeBitsAllowed: {
					bronze: ['step', 'use', 'loop', 'condIf', 'wait'],
					silver: ['step', 'use', 'loop', 'condIf'],
					gold: ['step', 'use', 'loop']
				},
				errorsAllowed: {
					bronze: 5,
					silver: 3,
					gold: 0
				}
			},
			level4: {
				maxCodeBits: { bronze: 10, silver: 8, gold: 6 },
				codeBitsAllowed: {
					bronze: ['step', 'use', 'loop', 'condIf', 'wait'],
					silver: ['step', 'use', 'loop', 'condIf'],
					gold: ['step', 'use', 'loop']
				},
				errorsAllowed: {
					bronze: 5,
					silver: 3,
					gold: 0
				}
			},
			level5: {
				maxCodeBits: { bronze: 10, silver: 9, gold: 7 },
				codeBitsAllowed: {
					bronze: ['step', 'use', 'loop', 'condIf', 'wait'],
					silver: ['step', 'use', 'loop','condIf'],
					gold: ['step', 'use', 'loop']
				},
				errorsAllowed: {
					bronze: 5,
					silver: 3,
					gold: 0
				}
			},
			level6: {
				maxCodeBits: { bronze: 10, silver: 6, gold: 2 },
				codeBitsAllowed: {
					bronze: ['step', 'use', 'loop', 'condIf', 'wait'],
					silver: ['step', 'use', 'loop'],
					gold: ['step', 'loop']
				},
				errorsAllowed: {
					bronze: 5,
					silver: 3,
					gold: 0
				}
			},
			level7: {
				maxCodeBits: { bronze: 10, silver: 9, gold: 8 },
				codeBitsAllowed: {
					bronze: ['step', 'use', 'loop', 'condIf', 'wait'],
					silver: ['step', 'use','loop', 'wait'],
					gold: ['step', 'use','loop']
				},
				errorsAllowed: {
					bronze: 5,
					silver: 3,
					gold: 0
				}
			},
			level8: {
				maxCodeBits: { bronze: 10, silver: 10, gold: 10 },
				codeBitsAllowed: {
					bronze: ['step', 'use','loop','wait','condIf'],
					silver: ['step', 'use','loop','wait','condIf'],
					gold: ['step', 'use','loop','wait','condIf']
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
				name: 'level1',
				titleEng: 'First Steps',
				titleEsp: 'Primeros Pasos',
				descEng: 'Learn how to use code-bit to take steps',
				descEsp: 'Aprender a utilizar code-bit para hacer un paso',
				puzzleTrack: ['','','','target','','','','','','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,1,1,1,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
						['target','target', 3, 'base'],
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCriteria: GradeCriteria.level1,
				rewards: {
					codeBit: '',
					acheive: acheives[0],
					points: 100
				},
				introSlides: IntroSlides[0]
			},
			{
				id: 2,
				name: 'level2',
				titleEng: 'Long Walk',
				titleEsp: 'Caminata',
				descEng: 'Learn to take as many steps as needed',
				descEsp: 'Aprender a hacer tantos pasos como sea necesario',
				puzzleTrack: ['','','','','','','','target','','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,1,1,1,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['target','target', 7, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCriteria: GradeCriteria.level2,
				rewards: {
					codeBit: 'use',
					acheive: acheives[1],
					points: 100
				},
				introSlides: []
			},
			{
				id: 3,
				name: 'level3',
				titleEng: 'Bridging the gap',
				titleEng: 'Cruzando el puente',
				descEng: 'Make it to the other side',
				descEsp: 'Llegar al otro lado',
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
				gradeCriteria: GradeCriteria.level3,
				rewards: {
					codeBit: '',
					acheive: acheives[2],
					points: 100
				},
				introSlides: IntroSlides[1]
			},
			{
				id: 4,
				name: 'level4',
				titleEng: 'One more bridge to cross',
				titleEng: 'Un puente mas',
				descEng: 'Cross the bridge to the other side',
				descEsp: 'Cruzar el puente hacia el otro lado',
				music: 'off',
				puzzleTrack: ['','','','lever','bridge','gap','','target','','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,3,0,2,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['lever','tool', 3, 'up' ],
					['bridge', 'tool', 4, 'up'],
					['target','target', 7, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCriteria: GradeCriteria.level4,
				rewards: {
					codeBit: '',
					acheive: acheives[3],
					points: 100
				},
				introSlides: []
			},
			{
				id: 5,
				name: 'level5',
				titleEng: 'Overcoming Obstacles',
				titleEng: 'Superando Obstaculos',
				descEng: 'Get rid of an obstacle in your way',
				descEsp: 'Quitar un obstaculo que esta tu camino',
				music: 'off',
				puzzleTrack: ['','detonator','','','wall','bomb','target','','','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,1,1,1,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['detonator','tool', 1, 'base' ],
					['wall','obstacle', 4, 'base' ],
					['bomb', 'tool', 5, 'base'],
					['target','target', 6, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCriteria: GradeCriteria.level5,
				rewards: {
					codeBit: 'loop',
					acheive: acheives[4],
					points: 100
				},
				introSlides: IntroSlides[2]
			},
			{
				id: 6,
				name: 'level6',
				titleEng: 'Cyclical Redundancy',
				titleEng: 'Redundancia Ciclica',
				descEng: 'Use a loop to pass this level',
				descEsp: 'Utilizar un ciclo para pasar este nivel',
				music: 'off',
				puzzleTrack: ['','','','','','','','','','target','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,1,1,1,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['target','target', 9, 'base']
				], 
				rules: {
					maxCodeBits: 5,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCriteria: GradeCriteria.level6,
				rewards: {
					codeBit: '',
					acheive: acheives[5],
					points: 100
				},
				introSlides: IntroSlides[3]
			},
			{
				id: 7,
				name: 'level7',
				titleEng: 'Double Dose',
				titleEng: 'Doble dosis',
				descEng: 'This level is very easy - if you know how to use loops',
				descEsp: 'Este nivel es muy facil si sabes utilizar ciclos',
				music: 'off',
				puzzleTrack: ['','lever','bridge','gap','','lever','bridge','gap','target','','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,3,0,2,3,0,2,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['lever','tool', 1, 'down' ],
					['bridge', 'tool', 2, 'down'],					
					['lever','tool', 4, 'up' ],
					['bridge', 'tool', 5, 'up'],
					['target','target', 8, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCriteria: GradeCriteria.level7,
				rewards: {
					codeBit: '',
					acheive: acheives[6],
					points: 100
				},
				introSlides: []
			},
			{
				id: 8,
				name: 'level8',
				titleEng: 'End of the line',
				titleEng: 'Final de la linea',
				descEng: 'Make it the last control point.',
				descEsp: 'Llegar al ultimo punto de control',
				music: 'off',
				puzzleTrack: ['','detonator','lever','','bridge','gap','','wall','bomb','target','end'], //data sequence describing puzzle to be solved
				landsTrack: [1,1,1,1,3,0,2,1,1,1], //array with corresponding 'lands' values to match puzzle 
				gameObjects: [ //array of game objects corresponding to puzzle
					['detonator','tool', 1, 'base' ],
					['lever','tool', 2, 'down' ],
					['bridge', 'tool', 4, 'down'],
					['wall', 'obstacle', 7, 'base'],
					['bomb', 'tool', 8, 'base'],
					['target','target', 9, 'base']
				], 
				rules: {
					maxCodeBits: 10,
					codeBitsAllowed: ['step','use','loop']
				},
				gradeCriteria: GradeCriteria.level8,
				rewards: {
					codeBit: '',
					acheive: acheives[7],
					points: 100
				},
				introSlides: IntroSlides[4]
			}
		];
	//----------------------------------------------------------

