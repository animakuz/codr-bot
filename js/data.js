//--LOAD ALL EXTERNAL DATA (IMAGES, SOUNDS ETC)-----------------------------------
	// var allAssetsLoaded = false;
	// var imagesLoaded = 0;
	// var numImages = 0;

	var sources = {
		lands : 'img/sprite-bg-lands.png',
		clouds: 'img/sprite-bg-clouds.png'
	};

	// //count number of images
	// for (var src in sources) {
	// 	numImages++;
	// }

	var sprites = loadImages(sources, function() {
		// imagesLoaded++;
		// if (imagesLoaded >= numImages) {
		// 	// allAssetsLoaded = true;
		// }
	});