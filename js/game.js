//--GAME BASE FUNCTIONS AND OBJECTS----------------------------------------------------------------	
//game objects
var createGameObjects = function(xPos, yPos, tipo) {
	//these objects will only store information on the game object. The game engine
	//will be responsible for rendering the visual element
	return {
		xPos: xPos,
		yPos: yPos,
		tipo: tipo
	};
};


//game levels
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


//code-bit (fragments of code - instruction bits to be place code panel) 
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


//-- END GAME BASE FUNCTIONS AND OBJECTS --------------