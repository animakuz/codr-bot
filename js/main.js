// Titulo de Proyecto: Programaquina y los Secretos del Planeta Algoritmus;
// Autor: Marcus Baptiste - ID: R0032401;
window.onload = function() {
	//interface elements
	var guiOverlay = document.getElementById("gui_overlay");



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


	//code-bit (fragments of code - instruction bits to be place code panel) 
	function crearCodeBit(nombre, tipo, posicion, numero) {
		var codeBit = {
			"nombre": nombre,
			"tipo": tipo,
			"posicion": posicion
		};

		if (tipo === 'ciclo') {
			//make code bit object for loop

		} else if (tipo === 'condInicio') {
			//make code bit object for start condition 

		} else if (tipo === 'condElse') {
			//make code bit object for else condition

		} else if (tipo === 'function') {
			//make code bit object for function

		} else {
			//make code bit object for any other instruction

		}

		return codeBit;
	}

	//characters 
	var avatar = {
		"name": "P-1",
		"xPos": 0,
		"yPos": 0,
		"graphic": { /* graphics data (using image sprits) */},
		"tema": "default",
		"animation": {
			"fall": [],
			"fly": [],
			"step": [],

		}
	};

	var guideBot = {
		"name": "C-bot",
		"graphic": { /* graphics data (using image sprits) */},
		"animation": {
			"talk": [],
			"jump": [],
			"signal": []
		}
	};

	//code panel control object 
	var codePanel = {
		"viewState": "open",
		"numCodeBits": 0
	};

	//game engine
	var theGame = {

	};





	//GUI INTERACTION
		//CODE PANEL
		// !change all this shit to work with VELOCITY
		$(".gui_overlay").on("click", ".cp_view_toggle", function() {
			//open and close code panel
			if (codePanel.viewState === "open") {
				$(".code_panel").animate({width: "100px"}, "fast", function() {
					codePanel.viewState = "closed";
				});
			} else {
				$(".code_panel").animate({width: "400px"}, "fast", function() {
					codePanel.viewState = "open";
				});
			}
		});

		//control buttons
		$(".gui_overlay").on("click", ".cp_agregar, .cp_eliminar, .cp_correr",
			function() {
				var cualBoton = $(this).attr("class");
				switch(cualBoton) {
					case "cp_agregar": 
						if (codePanel.viewState === "open") {
							if (codePanel.numCodeBits < 8) {
								//only allow 8 code bits
								

							}
						}
					break;

					case "cp_eliminar": 
						//eliminate selected
					break;

					case "cp_correr": 
						//run code

					break;
				}
			}
		);
	console.log("prueba");
};