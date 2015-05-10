// Titulo de Proyecto: Programaquina y los Secretos del Planeta Algoritmus;
// Autor: Marcus Baptiste - ID: R0032401;
window.onload = function() {
	//interface elements
	//main divisions
	var wrapper = document.getElementsByClassName("wrapper")[0];
	var appContainer = document.getElementsByClassName("app-container")[0];
	var logoContainer = document.getElementsByClassName("logo-container")[0];

	//gui overlay
	var guiOverlay = document.getElementsByClassName("gui-overlay")[0];
	var userCreate = document.getElementsByClassName("user-create")[0];
	var userSelect = document.getElementsByClassName("user-select")[0];
	var userSession = document.getElementsByClassName("user-session")[0];
	var gameMenu = document.getElementsByClassName("game-menu")[0] ;
	var gameOptions = document.getElementsByClassName("game-options")[0];
	var levelSelect = document.getElementsByClassName("level-select")[0];

	//code panel
	var cpGUI = document.getElementsByClassName("code-panel");
	var cpViewToggle = document.getElementsByClassName("cp-view-toggle")[0];
	var cpAdd = document.getElementsByClassName("cp-add")[0];
	var cpDelete = document.getElementsByClassName("cp-delete")[0];
	var cpRun = document.getElementsByClassName("cp-run")[0];
	var cpContent = document.getElementsByClassName("cp-content")[0];

	//game view
	var gameCanvas = document.getElementsByClassName("game-canvas")[0];

	//game objects
	function createGameObjects(xPos, yPos, tipo) {
		//these objects will only store information on the game object. The game engine
		//will be responsible for rendering the visual element
		return {
			xPos: xPos,
			yPos: yPos,
			tipo: tipo
		};

	}


	//game levels
	function createLevel(id, title) {
		//create level object
		return {
			id: id,
			title: title,
			obstacles: [ ],
			tools: [],
			goal: { },
			gaps: [ ],
			intro: { },
			allowedCodeBits: [ ],
			hints: [ ]
		};
	}


	//code-bit (fragments of code - instruction bits to be place code panel) 
	function createCodeBit(name, type, position, number) {
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

	//characters 
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

	//code panel control object 
	var codePanel = {
		viewState: "open",
		numCodeBits: 0
	};

	//game engine
	var theGame = {

	};





	//GUI INTERACTION
		//CODE PANEL
		//toggle view - open and close 
		cpViewToggle.onclick = function() {
			if (codePanel.viewState === "open") {
				Velocity(cpGUI, {width: "100px"}, {duration: 300,  complete: function() {
					codePanel.viewState = "closed";
				}});
			} else {
				Velocity(cpGUI, {width: "400px"}, {duration: 300,  complete: function() {
					codePanel.viewState = "open";
				}});
			}
		};

		//control buttons
		//add code bits
		cpAdd.onclick = function() {
			if (codePanel.viewState === "open") {
				if (codePanel.numCodeBits < 8) {
					//only allow 8 code bits
					console.log("adding");

				}
			}
		};

		//delete code bits
		cpDelete.onclick = function() {
			if (codePanel.viewState === "open") {
				//delete selected 
				console.log("deleting");
			}
		};


		//run code bits
		cpRun.onclick = function() {
			console.log("running");
		};

};