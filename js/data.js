//--LOAD ALL EXTERNAL DATA (IMAGES, SOUNDS ETC)-----------------------------------
	// var allAssetsLoaded = false;
	// var imagesLoaded = 0;
	// var numImages = 0;

	var sources = {
		lands : 'img/sprite-bg-lands.png',
		clouds: 'img/sprite-bg-clouds.png',
		bomb: 'img/sprite-game-object-bomb.png',
		bridge: 'img/sprite-game-object-bridge.png',
		detonator: 'img/sprite-game-object-detonator.png',
		lever: 'img/sprite-game-object-lever.png',
		rock: 'img/sprite-game-object-rock.png',
		wall: 'img/sprite-game-object-wall.png',
		target: 'img/sprite-game-object-target.png'
	};

	//count number of images
	// for (var src in sources) {
	// 	numImages++;
	// }

	var sprites = loadImages(sources, function() {
		// imagesLoaded++;
		// if (imagesLoaded >= numImages) {
		// 	// allAssetsLoaded = true;
		// }
		
	});