// Titulo de Proyecto: Programaquina y los Secretos del Planeta Algoritmus;
// Autor: Marcus Baptiste - ID: R0032401;

$(document).ready(function() {
	//game objects
	function crearObjetosJuego(xPos, yPos, tipo) {
		//these objects will only store information on the game object. The game engine
		//will be responsible for rendering the visual element
		return {
			"xPos": xPos,
			"yPos": yPos,
			"tipo": tipo
		};

	}


	//game levels
	function crearNivel(id, titulo) {
		//create level object
		return {
			"id": id,
			"titulo": titulo,
			"obstaculos": [ ],
			"herramientas": [],
			"meta": { },
			"huecos": [ ],
			"entrada": { },
			"codigoPermitido": [ ],
			"guias": [ ]
		};
	}


	//code-frags (fragmentos de codigo) 
	function crearCodeFrag(nombre, tipo, posicion, numero) {
		var codeFrag = {
			"nombre": nombre,
			"tipo": tipo,
			"posicion": posicion
		};

		if (tipo === 'ciclo') {
			//make code frag object for loop

		} else if (tipo === 'condInicio') {
			//make code frag object for start condition 

		} else if (tipo === 'condElse') {
			//make code frag object for else condition

		} else if (tipo === 'function') {
			//make code frag object for function

		} else {
			//make code frag object for any other instruction

		}

		return codeFrag;
	}

	//characters 
	var avatar = {
		"nombre": "P-1",
		"xPos": 0,
		"yPos": 0,
		"grafico": "camnio al grafico",
		"tema": "default",
		"animacion": {
			"caer": [],
			"volar": [],
			"paso": [],

		}
	};

	var guia = {
		"nombre": "C-bot",
		"grafico": "file name of graphic",
		"animacion": {
			"hablar": [],
			"saltar": [],
			"senalar": []
		}
	};



	//game engine
	var elJuego = {
	};

	alert("test");
});