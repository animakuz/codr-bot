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
				if (codeBits[len].ref === this) {
					codePanel.indexOfSelected = len;
					break;
				}
			}

			addClass(this, 'cb-selected');
		}
	};
	
	//arrange code bits while hovering a code bit over panel to preview its placement
	var arrangeCodeBits = function() {
		var len = codePanel.codeBits.length;
		var ind = 0;
		var target = -1;

		while (ind < len) {
			var rectCB = codePanel.codeBits[ind].ref.getBoundingClientRect(); //dimensions of code bit to check against
			var rectDCB = codePanel.tempCodeBit.ref.getBoundingClientRect(); //dimensions of code bit being dragged
			var middle = (rectDCB.top + rectDCB.height/2);

			if ((middle > rectCB.top) && (middle < (rectCB.bottom - rectCB.height /2))) {
				//dragging is higher than code bit - target it for moving down
				if (classCheck(codePanel.codeBits[ind].ref, 'code-bit-block')) {
					if (middle > rectCB.top + (rectCB.height/3) ) {
						//code bit inside block - place it
						if (!classCheck(codePanel.tempCodeBit.ref, 'cb-loop')) {
							codePanel.tempCodeBit.block = ind;
							codePanel.tempCodeBit.position = ind + 1;
						}
					} else {
						target = ind;
					}
				} else {
					target = ind;
				}
				break;
			}
			ind++;
		}

		if (target >= 0) {
			codePanel.clearShift();
			//shift target down (causing all those below it to shift down in turn)
			addClass(codePanel.codeBits[target].ref, 'shift-down');
			codePanel.tempCodeBit.position = target;
			codePanel.tempCodeBit.block = -1;
		} else {
			if (codePanel.tempCodeBit.block === -1) {
				codePanel.tempCodeBit.position = codePanel.numCodeBits;
			}
		}
	};

	var incLoopNum = function() {
		if (codePanel.running === false) {
			var numBox = this.parentNode.childNodes[1];
			var num = parseInt(numBox.innerHTML);
			if (num < 10) {
				num++;
				numBox.innerHTML = num;
				numBox.parentNode.parentNode.setAttribute('data-num', num);
			}
		}
	};

	var decLoopNum = function() {
		if (codePanel.running === false) {
			var numBox = this.parentNode.childNodes[1];
			var num = parseInt(numBox.innerHTML);
			if (num > 1) {
				num--;
				numBox.innerHTML = num;
				numBox.parentNode.parentNode.setAttribute('data-num', num);
			}
		}
	};

	var updateBlocks = function(ind1, ind2, type1, type2) {
		var tempBlockA;
		var tempBlockB;
		var cbs = codePanel.codeBitSequence;
		//check if code bit at current position is block type
		if (type1 === 'loop' || type1 === 'condIf') {
			tempBlockA = ind1;
		}

		if (type2 === 'loop' || type2 === 'condIf' ) {
			tempBlockB = ind2;
		}

		if (typeof tempBlockA !== 'undefined') {
			//type 1 is block - switch all occurences of bits with block = ind1 to ind2 (switch owners)
			var len = codePanel.numCodeBits;
			while (len--) {
				if (codePanel.codeBitSequence[len].block === tempBlockA) {
					codePanel.codeBitSequence[len].block = ind2;
				}
			}
			console.log('temp-block A updated');
		}

		if (typeof tempBlockB !== 'undefined') {
			//type 2 is block - switch all occurences of bits with block = ind2 to ind1 (switch owners)
			var len = codePanel.numCodeBits;
			while (len--) {
				if (codePanel.codeBitSequence[len].block === tempBlockB) {
					codePanel.codeBitSequence[len].block = ind1;
				}
			}
			console.log('temp-block B updated');
		}

	};

	var switchCodeBits = function(target1, target2) {

		if (typeof target2 === 'undefined') {
			target2 = target1 - 1;
		}

		var tempCB = codePanel.codeBits[target1];
		var tempCBS = codePanel.codeBitSequence[target1];
		var type1 = tempCBS.type;
		var type2 = codePanel.codeBitSequence[target2].type;

		codePanel.codeBits[target1] = codePanel.codeBits[target2];
		codePanel.codeBitSequence[target1] = codePanel.codeBitSequence[target2];

		codePanel.codeBits[target2] = tempCB;
		codePanel.codeBitSequence[target2] = tempCBS;

		updateBlocks(target1, target2, type1, type2);

	};

	var moveUPCodeBit = function() {
		if (codePanel.running === false) {
			var len = codePanel.codeBits.length;
			var ind, target;
			for (ind =0; ind< len; ind++) {
				if (codePanel.codeBits[ind].ref === this.parentNode) {
					target = ind;
					break;
				}
			}

			//check if at top
			if (target > 0) {
				codePanel.clearSelection();
				//if in block - check if it goes above block - if so take out of block
				if (codePanel.codeBitSequence[target - 1].type === 'loop' || codePanel.codeBitSequence[target - 1].type === 'condIf') {
					//code bit preceeded by block
					if (codePanel.codeBitSequence[target].block === target - 1) {
						//code bit in block
						// codePanel.codeBitSequence[target].block = -1;
						// var cb = codePanel.codeBits[target];
						// codePanel.codeBits[target - 1].ref.removeChild(cb);
						// // codePanel.cpContent.appendChild(cb);
						// switchCodeBits(target);

					} else {
						//not in block - add
						if (codePanel.codeBitSequence[target].type !== 'loop') {
							codePanel.codeBitSequence[target].block = target - 1;
						} else {
							//code bit is loop - call normal switch
							switchCodeBits(target, target - 1);
						}
					}
				} else {
					//code bit not preceeded by block
					if (codePanel.codeBitSequence[target - 1].block !== -1) {
						//preceeding code bit is inside block 
						if (codePanel.codeBitSequence[target].block !== codePanel.codeBitSequence[target - 1].block) {
							//code bit not inside block - add
							if (codePanel.codeBitSequence[target].type !== 'loop') {
								codePanel.codeBitSequence[target].block = codePanel.codeBitSequence[target - 1].block;
							} else {
								//code bit is loop - call normal switch
								switchCodeBits(target, codePanel.codeBitSequence[target - 1].block);
							}
						} else {
							//code bit inside block - switch
							switchCodeBits(target);
						}
					} else {
						//normal switch
						codePanel.codeBitSequence[target].block = -1;
						switchCodeBits(target);
					}
				}


				codePanel.reRenderCodeBits();
			}
		}
	};

	//drag and drop functions for dragging code bits from code bit list
	var dragCodeBit = function(event) {
		codePanel.tempCodeBit.ref.style.top = (event.clientY - 20) + 'px';
		codePanel.tempCodeBit.ref.style.left = (event.clientX - 100) + 'px';

		var cbRect = codePanel.tempCodeBit.ref.getBoundingClientRect();  //bounds of dragging code bit
		var cpRect = codePanel.cpContent.getBoundingClientRect(); //bounds of target area (code panel content)
		
		if ((cbRect.left <= cpRect.right) && (cbRect.top <= cpRect.bottom)) {
			arrangeCodeBits();
		} else {
			codePanel.clearShift();
		}
	};
	
	var dropCodeBit = function() {
		var cbRect = codePanel.tempCodeBit.ref.getBoundingClientRect();  //bounds of dragging code bit
		var cpRect = codePanel.cpContentWrapper.getBoundingClientRect(); //bounds of target area (code panel content)

		if ((cbRect.left <= cpRect.right) && (cbRect.top <= cpRect.bottom)) {
			//call add codebit function
			if (codePanel.addCodeBit()) {
				//code bit added - append element to cpcontent
				codePanel.tempCodeBit.ref.style.position = 'relative';
				codePanel.tempCodeBit.ref.style.left = 0;
				codePanel.tempCodeBit.ref.style.top = 0;
				removeClass(codePanel.tempCodeBit.ref, 'code-bit-drag');
				codePanel.tempCodeBit.ref.addEventListener('click',selectCodeBitEvent, true);
				// codePanel.tempCodeBit.ref.addEventListener('mousedown', startSortCodeBit);

				var codeBitType = codePanel.tempCodeBit.ref.getAttribute('data-type');
				if (codeBitType === 'loop' || codeBitType === 'condIf') {
					//add special properties for loop and condif code bit
					codePanel.tempCodeBit.ref.className += ' code-bit-block';
					if (codeBitType === 'loop') {
						var loopNum = document.createElement('div');
						loopNum.className = 'loop-number';
						var num = document.createTextNode('1');
						loopNum.appendChild(num);
						var decNum = document.createElement('div');
						var incNum = document.createElement('div');
						decNum.className = 'loop-dec-num';
						incNum.className = 'loop-inc-num';
						decNum.addEventListener('click', decLoopNum, false);
						incNum.addEventListener('click', incLoopNum, false);

						var numBox = document.createElement('div');
						numBox.className = 'loop-num-box';

						numBox.appendChild(decNum);
						numBox.appendChild(loopNum);
						numBox.appendChild(incNum);

						codePanel.tempCodeBit.ref.appendChild(numBox);
						codePanel.tempCodeBit.ref.setAttribute('data-num', '1');
					} else if (codeBitType === 'condIf') {

					}
				} 

				//add priority button on code bit
				var moveUpBtn = document.createElement('div');
				moveUpBtn.className = 'move-up';
				moveUpBtn.addEventListener('click', moveUPCodeBit);
				codePanel.tempCodeBit.ref.appendChild(moveUpBtn);

				if (codePanel.tempCodeBit.block === -1) {
					codePanel.cpContent.appendChild(codePanel.tempCodeBit.ref);
				} else {
					var cont = codePanel.codeBits[codePanel.tempCodeBit.block].ref;
					cont.appendChild(codePanel.tempCodeBit.ref);
				}

				//arrange code bit according to placement from codebits array
				if (codePanel.tempCodeBit.position < codePanel.numCodeBits - 1) {
					codePanel.reRenderCodeBits();
				}
				

			} else {
				//code bit cannot be added - discard it
				container.removeChild(codePanel.tempCodeBit.ref);
			}
		} else {
			//code bit was not dropped - discard it
			container.removeChild(codePanel.tempCodeBit.ref);
		}

		//clean up event listeners and draggingcodebit value
		container.removeEventListener('mousemove', dragCodeBit, false);
		container.removeEventListener('mouseup', dropCodeBit, false);
		codePanel.tempCodeBit = undefined;
		codePanel.clearShift();
	};


	var startDragCodeBit = function(event) {
		var newCodeBit = this.cloneNode(true);
		newCodeBit.style.position = 'absolute';
		addClass(newCodeBit, 'code-bit-drag');
		container.appendChild(newCodeBit);
		container.addEventListener('mousemove', dragCodeBit, false);
		container.addEventListener('mouseup', dropCodeBit, false);

		//temp data for code bit being added
		codePanel.tempCodeBit = {
			block: -1, //index of code bit block it belongs to (if it is added to a loop or if block)
			position: 0, //position it will be added to
			ref: newCodeBit
		};
	};

	//$Code panel control object
	var codePanel = {
		viewState: 'open',
		numCodeBits: 0,
		runtimeErrors: 0,
		codeBitSequence: [],
		maxCodeBits: 0,
		indexOfSelected: -1,
		indexOfExecuted: 0,
		loopSize: 0,
		loopCount: 0,
		loopPos: 0,
		loopMax: 0,
		tempCodeBit: undefined,
		enabled: true,
		running: false,
		sortingCodeBit: undefined,
		cpContainer: undefined,
		cpContent: undefined,
		cpContentWrapper: undefined,
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
			this.cpControls = document.getElementsByClassName('cp-controls')[0];
			this.cpAdd = document.getElementsByClassName('cp-add')[0];
			this.cpDelete = document.getElementsByClassName('cp-delete')[0];
			this.cpRun = document.getElementsByClassName('cp-run')[0];
			this.codeBitList = document.getElementsByClassName('code-bit-list-inner')[0];

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
			//hide code bit list if it was showing
			removeClass(this.codeBitList.parentNode, 'gui-active');
			console.log('code panel hidden');
			//TODO - use velocity for actual slide animation
			removeClass(this.cpContainer, 'gui-active');
		},
		reset: function(maxCodeBits) {
			empty(this.cpContent);
			this.viewState = 'open';
			this.numCodeBits = 0;
			this.codeBits = [];
			this.codeBitSequence = [];
			this.clearSelection();
			this.clearShift();
			this.indexOfExecuted = 0;
			this.running = false;
			this.enabled = true;
			this.tempCodeBit = undefined;
			this.loopSize = 0;
			this.loopCount = 0;
			this.runtimeErrors = 0;
		},
		clearSelection: function() {
			if (this.indexOfSelected > -1) {
				removeClass(this.codeBits[this.indexOfSelected].ref, 'cb-selected');
				this.indexOfSelected = -1;
			}
		},
		clearExecuting: function() {
			var len = this.codeBits.length;
			while(len--) {
				removeClass(this.codeBits[len].ref, 'cb-executing');
			}
		},
		clearShift: function() {
			var i = 0;
			var len = this.codeBits.length;
			while(i < len) {
				removeClass(this.codeBits[i].ref, 'shift-down, cb-selected');
				i++;
			}
		},
		addCodeBit: function() {
			if (this.numCodeBits < this.maxCodeBits) {
				if (typeof this.tempCodeBit !== 'undefined') {
					var tcb = this.tempCodeBit;
					this.numCodeBits++;

					this.codeBits.splice(tcb.position, 0, { ref: tcb.ref});
					this.codeBitSequence.splice(tcb.position, 0, { block: tcb.block, type: tcb.ref.getAttribute('data-type')});
					
					return true;
				} else {
					return false;
				}
			} else {
				showMessageBox({ Eng: 'Maximum number of code bits reached', Esp: 'Numero maximo de code bits alcanzado'}, 'alert', 'warning');
				return false;				
			}
		},
		deleteCodeBit: function(indToDel) {
			var ind =  indToDel || this.indexOfSelected;
			if (ind > -1) {
				this.clearSelection();

				//delete code bits in block if it contains any
				if (this.codeBitSequence[ind].type === 'loop' || this.codeBitSequence[ind].type === 'condIf') {
					var len = this.codeBits.length;
					while (len--) {
						if (this.codeBitSequence[len].block === ind) {
							this.deleteCodeBit(len);
						}
					}
				}

				//remove actual element
				if (this.codeBitSequence[ind].block === -1) {
					this.cpContent.removeChild(this.codeBits[ind].ref);
				} else {
					var cont = this.codeBits[this.codeBitSequence[ind].block].ref;
					cont.removeChild(this.codeBits[ind].ref);
				}

				this.numCodeBits-=1;
				//removal depending on if in block or not
				this.codeBitSequence.splice(ind, 1);
				this.codeBits.splice(ind, 1);
			} else {
				showMessageBox({ Eng: 'Please select a code bit', Esp: 'Por favor seleccione un code bit'}, 
					'alert', 'warning');
			}
		},
		reRenderCodeBits: function() {
			//order code bits based on sequence in codebits array
			empty(this.cpContent);
			var len = this.codeBits.length;
			var ind;
			for (ind=0; ind<len; ind++) {
				if (this.codeBitSequence[ind].block === -1) {
					this.cpContent.appendChild(this.codeBits[ind].ref);
				} else {
					var cont = this.codeBits[this.codeBitSequence[ind].block].ref;
					cont.appendChild(this.codeBits[ind].ref);
				}
				//rebind events if need be
			}
		},
		runSequence: function() {
			//scroll to top
			this.cpContentWrapper.scrollTop = 0;
			pBot.reset();
			//go through code bits and execute each one every second
			var executionCycle = function() {
				if (codePanel.running) {
					if (pBot.framesRemaining <= 0) {
						//only execute when bot is ready for another animation
						var ind = codePanel.indexOfExecuted;
						
						if (ind < codePanel.numCodeBits && codePanel.loopMax === 0) {
							//generate loop stack if encounter loop bit
							if (codePanel.codeBitSequence[ind].type === 'loop') {
								codePanel.loopMax = codePanel.codeBits[ind].ref.getAttribute('data-num') - 1;
								//get code bits inside block
								var len = codePanel.numCodeBits;
								var i;
								for (i=0; i<len; i++) {
									if (codePanel.codeBitSequence[i].block === ind) {
										codePanel.loopSize += 1;
									}
								}
								codePanel.loopMax *= codePanel.loopSize;
								codePanel.loopCount = 0;
								codePanel.loopPos = ind;
								console.log(codePanel.loopMax);
							}
						}

						//manage loop count
						if (codePanel.loopCount < codePanel.loopMax) {
							ind = codePanel.loopPos + ((codePanel.loopCount % codePanel.loopSize) + 1);
							codePanel.loopCount++;
							console.log(ind);
						} 

						// console.log(ind + ' loopCount: ' + codePanel.loopCount);
						if (ind < codePanel.numCodeBits) {
							codePanel.clearExecuting();

							//scroll code bit being executed into view
							var exRect = codePanel.codeBits[ind].ref.getBoundingClientRect();
							var cpRect = codePanel.cpContentWrapper.getBoundingClientRect();

							if (exRect.bottom > cpRect.bottom - 20) {
								Velocity(codePanel.codeBits[ind].ref, 'scroll', { duration: 100, container: codePanel.cpContentWrapper});
							}

							//highlight code bit
							addClass(codePanel.codeBits[ind].ref, 'cb-executing');

							//execute
							pBot.executeAction(codePanel.codeBitSequence[ind].type);

							if (codePanel.loopCount === codePanel.loopMax) {
								//loop ended
								codePanel.loopSize = 0;
								codePanel.loopPos = 0;
								codePanel.loopMax = 0;
								codePanel.loopCount = 0;
								codePanel.indexOfExecuted++;
							}
							setTimeout(executionCycle, 100);
						} else {
							//execution complete without reaching target - fail
							removeClass(codePanel.codeBits[ind - 1].ref, 'cb-executing');
							codePanel.running = false;
							// codePanel.indexOfExecuted = 0;

							theGame.fail();
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