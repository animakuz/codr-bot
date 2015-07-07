"use strict";
//--LOAD ALL EXTERNAL DATA (IMAGES, SOUNDS ETC)-----------------------------------
	// var allAssetsLoaded = false;
	// var imagesLoaded = 0;
	// var numImages = 0;

	//consider separating these - one for lands and clouds - one for game objects an done for characters- 
	//also in the load function
	var sources = {
		lands : 'img/sprite-bg-lands.png',
		clouds: 'img/sprite-bg-clouds.png',
		bomb: 'img/sprite-game-object-bomb.png',
		bridge: 'img/sprite-game-object-bridge.png',
		detonator: 'img/sprite-game-object-detonator.png',
		lever: 'img/sprite-game-object-lever.png',
		rock: 'img/sprite-game-object-rock.png',
		target: 'img/sprite-game-object-target.png',
		wall: 'img/sprite-game-object-wall.png',
		pbot: 'img/sprite-character-p-bot.png'
	};

	// count number of images
	// for (var src in sources) {
	// 	numImages++;
	// }
	var sprites = loadImages(sources, function() {
		// imagesLoaded++;
		// if (imagesLoaded >= numImages) {
		// 	// allAssetsLoaded = true;
		// }
	});

	function generateSlides(level, num) {
		var i;
		var slides = [];
		var tempSlide;
		var src;
		for (i=0; i<num; i++) {
			src = 'img/slides/level' + level + '/slide' + i + '.jpg';
			tempSlide = new Image();
			tempSlide.className = 'slide-img';
			tempSlide.id = 'img' + i;
			tempSlide.src = src;
			slides.push(tempSlide);
		}
		return slides;
	}

	//slides
	var IntroSlides = [generateSlides(1, 12)];

