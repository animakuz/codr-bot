"use strict";
//--CODE PANEL-------------------------------------------------
	var container = document.getElementsByClassName('app-container')[0];

	//$Code bits- instruction blocks to be placed in code panel
	var codeBits = {
		step: {
			titleEng: 'step',
			titleEsp: 'paso'
		},
		use: {
			titleEng: 'use',
			titleEsp: 'usar'
		},
		loop: {
			titleEng: 'loop',
			titleEsp: 'ciclo'
		},
		wait: {
			titleEng: 'wait',
			titleEsp: 'esperar'
		},
		condIf: {
			titleEng: 'if',
			titleEsp: 'si'
		},
		condElse: {
			titleEng: 'else',
			titleEsp: 'si no'
		},
		getCodeBit: function(type, lang) {
			return this[type]['title'+lang];
		}
	};

	var selectCodeBitEvent = function() {
		if (codePanel.running === false) {
			var codeBits = codePanel.codeBits;
			var len = codeBits.length;

			codePanel.clearSelection();

			while (len--) {
				if (codeBits[len]=== this) {
					codePanel.indexOfSelected = len;
					break;
				}
			}

			addClass(this, 'cb-selected');
		}
	};
	
	//drag and drop functions for code bit list code bits and code panel
	var dragCodeBit = function(event) {
		//TODO - ADD CONSTRAINTS
		codePanel.draggingCodeBit.style.top = (event.clientY - 20) + 'px';
		codePanel.draggingCodeBit.style.left = (event.clientX - 100) + 'px';
	};
	
	var dropCodeBit = function() {
		var cbRect = codePanel.draggingCodeBit.getBoundingClientRect();  //bounds of dragging code bit
		var cpRect = codePanel.cpContentWrapper.getBoundingClientRect(); //bounds of target area (code panel content)

		if ((cbRect.left <= cpRect.right) && (cbRect.top <= cpRect.bottom)) {
			//call add codebit function
			if (codePanel.addCodeBit(codePanel.draggingCodeBit)) {
				//code bit added - append element to cpcontent
				codePanel.draggingCodeBit.style.position = 'relative';
				codePanel.draggingCodeBit.style.left = 0;
				codePanel.draggingCodeBit.style.top = 0;
				codePanel.draggingCodeBit.addEventListener('click',selectCodeBitEvent);
				codePanel.cpContent.appendChild(codePanel.draggingCodeBit);
			} else {
				//code bit cannot be added - discard it
				container.removeChild(codePanel.draggingCodeBit);
			}
		} else {
			//code bit was not dropped - discard it
			container.removeChild(codePanel.draggingCodeBit);
		}

		//clean up event listeners and draggingcodebit value
		container.removeEventListener('mousemove', dragCodeBit, false);
		container.removeEventListener('mouseup', dropCodeBit, false);
		codePanel.draggingCodeBit = undefined;
	};

	//event handler for adding code bit from code bit list
	var startDragCodeBit = function(event) {
		var newCodeBit = this.cloneNode(true);
		newCodeBit.style.position = 'absolute';
		container.appendChild(newCodeBit);
		codePanel.draggingCodeBit = newCodeBit;
		container.addEventListener('mousemove', dragCodeBit, false);
		container.addEventListener('mouseup', dropCodeBit, false);
	};


	//$Code panel control object
	var codePanel = {
		viewState: 'open',
		numCodeBits: 0,
		codeBitSequence: [],
		maxCodeBits: 0,
		indexOfSelected: -1,
		indexOfExecuted: 0,
		enabled: true,
		running: false,
		scrolling: false,
		scrollPos: 0,
		scrollMax: 0,
		scrollDragPos: 0,
		draggingCodeBit: undefined,
		cpContainer: undefined,
		cpContent: undefined,
		cpContentWrapper: undefined,
		cpScroll: undefined,
		cpScrollBar: undefined,
		cpControls: undefined,
		cpAdd: undefined,
		cpDelete: undefined,
		cpRun: undefined,
		codeBitList: undefined,
		codeBits: [],
		initialize: function(maxCodeBits, codeBitsAllowed) {
			this.cpContainer = document.getElementsByClassName('code-panel')[0];
			this.cpContent = document.getElementsByClassName('cp-content')[0];
			this.cpContentWrapper = document.getElementsByClassName('cp-content-wrapper')[0];
			this.cpScroll = document.getElementsByClassName('cp-scroll')[0];
			this.cpScrollBar = document.getElementsByClassName('cp-scroll-bar')[0];
			this.cpControls = document.getElementsByClassName('cp-controls')[0];
			this.cpAdd = document.getElementsByClassName('cp-add')[0];
			this.cpDelete = document.getElementsByClassName('cp-delete')[0];
			this.cpRun = document.getElementsByClassName('cp-run')[0];
			this.codeBitList = document.getElementsByClassName('code-bit-list')[0];

			this.maxCodeBits = maxCodeBits;

			//reset code panel and show
			this.reset();
			this.show();

			//empty code bit list and add allowed code bits
			empty(this.codeBitList);

			var ind = 0;
			var len = codeBitsAllowed.length;
			while (ind < len) {
				var codeBitCont = document.createElement('div');
				var codeBitType = codeBitsAllowed[ind];
				var codeBitText = document.createTextNode(codeBits.getCodeBit(codeBitType, currentUser.options.language));
				codeBitCont.appendChild(codeBitText);
				codeBitCont.className = 'code-bit cb-' + codeBitType;
				codeBitCont.setAttribute('data-type', codeBitType);
				codeBitCont.addEventListener('mousedown', startDragCodeBit, false);
				this.codeBitList.appendChild(codeBitCont);

				ind++;
			}
		},
		show: function() {
			//TODO - use velocity for actual slide animation
			addClass(this.cpContainer, 'gui-active');
		},
		hide: function() {
			//TODO - use velocity for actual slide animation
			removeClass(this.cpContainer, 'gui-active');
		},
		reset: function(maxCodeBits) {
			empty(this.cpContent);
			this.viewState = 'open';
			this.numCodeBits = 0;
			this.codeBits = [];
			this.codeBitSequence = [];
			this.indexOfSelected = -1;
			this.indexOfExecuted = 0;
			this.running = false;
			this.enabled = true;
			this.updateScroll();
		},
		scroll: function(change) {
			if (change >= 0 ) {
				//move scroll down
				if (this.scrollPos < this.scrollMax) {
					this.scrollPos += change;
				} else {
					this.scrollPos = this.scrollMax;
				}
			} else {
				//move scroll up
				if (this.scrollPos > 0) {
					this.scrollPos += change;
				} else {
					this.scrollPos = 0;
				}
			}

			this.cpScrollBar.style.top = this.scrollPos + 'px';
			this.cpContent.style.top = (-this.scrollPos) + 'px';
		},
		resetScroll: function() {
			//hide scroll bar
			this.cpScrollBar.style.top = '0';
			this.cpContent.style.top = 0;
			this.scrollPos = 0;
		},
		updateScroll: function() {
			if (this.numCodeBits >= 6) {
				//show scroll bar if number of code bits = 6
				if (this.numCodeBits === 6) {
					this.cpScrollBar.style.display = 'block';
				}
				
				//update size of scroll bar
				var barHeight = 200 - ((this.numCodeBits - 5) * 30);
				this.cpScrollBar.style.height = barHeight + 'px';
				this.scrollMax = (this.numCodeBits - 5) * 30;
			} else {
				this.cpScrollBar.style.display = 'none';
				this.resetScroll();
			}

			this.scroll(0);
		},
		clearSelection: function() {
			if (this.indexOfSelected > -1) {
				removeClass(this.codeBits[this.indexOfSelected], 'cb-selected');
				this.indexOfSelected = -1;
			}
		},
		addCodeBit: function(codeBitRef) {
			if (this.numCodeBits < this.maxCodeBits) {
				this.numCodeBits++;
				this.codeBitSequence.push(codeBitRef.getAttribute('data-type'));
				this.codeBits.push(codeBitRef);

				this.updateScroll();
				return true;
			} else {
				showMessageBox({ Eng: 'maximum number of code bits reache', Esp: 'numero maximo de code bits'}, 'alert', 'warning');
				return false;				
			}
		},
		deleteCodeBit: function(codeBitIndex) {
			var ind = this.indexOfSelected;
			if (ind > -1) {
				this.clearSelection();

				//remove actual element
				this.cpContent.removeChild(this.codeBits[ind]);

				this.numCodeBits-=1;
				this.codeBitSequence.splice(ind, 1);
				this.codeBits.splice(ind, 1);

				this.updateScroll();
			} else {
				showMessageBox({ Eng: 'Please select a code bit', Esp: 'Por favor seleccione un code bit'}, 
					'alert', 'warning');
			}
		},
		runSequence: function() {
			this.resetScroll();
			pBot.reset();
			//go through code bits and execute each one every second
			var executionCycle = function() {
				if (codePanel.running) {
					if (pBot.framesRemaining <= 0) {
						//only execute when bot is ready for another animation
						var ind = codePanel.indexOfExecuted;
						if (ind < codePanel.numCodeBits) {
							if (ind > 0) {
								removeClass(codePanel.codeBits[ind - 1], 'cb-executing');
							} 

							if (ind >= 5) {
								//scroll 
								codePanel.scroll(30);
							}

							//highlight code bit
							addClass(codePanel.codeBits[ind], 'cb-executing');

							//execute
							pBot.executeAction(codePanel.codeBitSequence[ind]);

							codePanel.indexOfExecuted++;
							setTimeout(executionCycle, 100);

						} else {
							//show result of execution
							showMessageBox( {Eng: 'Execution Complete', Esp: 'Fin de Ejecucion'}, 'alert', 'success');

							removeClass(codePanel.codeBits[ind - 1], 'cb-executing');
							codePanel.running = false;
							codePanel.indexOfExecuted = 0;
							codePanel.resetScroll();
						}
					} else {
						setTimeout(executionCycle, 100);
					}
				}
			};

			executionCycle();
		}
	};
//--END CODE PANEL----------------------------------------------