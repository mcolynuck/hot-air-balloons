/*
 * Author: Michael Colynuck
 * Date: August 27 2015
 * Main source for balloon html graphics.
 */

// Globals
var imageNum = 0,
	maxImageNum = 7,			// Max number of balloon images available
	liveCnt = 0,
	maxLiveCnt = 12,			// Max number of balloons to display at one time
	stopMakingBalloons = false,
    intervalTimer = null;

/* =================================================
 * Counter for use in looping over balloon images.
 * ================================================= */
function nextImgNum(){
	if(imageNum >= maxImageNum){
		imageNum = 0;
	}
	return imageNum++;
}


/* =================================================
 * Create balloon element and set atributes
 * ================================================= */
function buildElement(template){
	var key = "balloon_"+(new Date()).getTime();

	if(!template.content){	// Work-around for IE but could work for all browsers
		var temp = document.createElement('div');
		temp.innerHTML = template.innerHTML;
		item = temp.cloneNode(true);
	} else {
		item = template.content.cloneNode(true);	
	}

	// Set attributes we're interested in.
	item.querySelector('.image-container').setAttribute('id', key);
	// item.querySelector(".gallery").setAttribute('onclick', "launchGalleryItem('"+data['url']+"')");
	item.querySelector('.image-img').src = 'images/balloon_sm_' + nextImgNum() + '.png';

	return item;
}


/* =================================================
 * Positions, sizes, times this item
 * id - id of div that surrounds the image
 * ================================================= */
function setDisplayParams(id) {
	var viewWidth = document.documentElement.clientWidth,
	    viewHeight = $("#sky-content").css("height");

	var top = parseInt(viewHeight) + 10;		// Add a bit extra, just in case.
	$(id).css("top", top+"px");		// Start image just below bottom of screen.

	// set image size (based on image size)
	var height = Math.random() * 1000 * 0.8,	// 0.8 is scaler to increase/decrease height size so we can have even larger or lesser maximum sizes.
	    width = 0;

	if(height < 20) {
		height += 20;		// No micro-sized balloons!
	} else if(height > 2000) {
		height = 2000;	// No mega-sized balloons!
	}

	width = height * 25 / 30;				// Chrome didn't like it when I just set the height so use image ratio of 30 high by 25 wide.

	// Set div and image sizes
	$(id).css("height", height+"px").css("width", width+"px");				
	$(id).find("img").css("height", height+"px").css("width", width+"px");			// Fixes issue with Safari

	// set x-position using viewWidth
	var left = Math.random() * (viewWidth + 300) - 300;		// Increase screen width for calc then offset so we overlap images on left side.
	$(id).css("left", left+"px");

	// set speed relative to size (smaller = longer)
	var time = 40000 / height;		// Adjust time constant to slow down (increase) or speed up (decrease);
	$(id).css("-webkit-animation-duration", time+"s");
	$(id).css("-moz-animation-duration", time+"s");
	$(id).css("animation-duration", time+"s");

	$(id).css("visibility", "visible");

	// Set z-index based on size (smmaller is lower).  Usually not a problem but if sizes are close and overlapping.
	var zIndex = parseInt(height);
	$(id).css("z-index", zIndex);
// console.log("top: "+top+"  height: "+height+"   left: "+left+"   time: "+time+"  zIndex: "+zIndex);
}


/* =================================================
 * Entry point tomake a new balloon
 * ================================================= */
function makeBalloon() {

	// Check for a halt in producing new balloons or if we've hit our maximum allowed.
	if(stopMakingBalloons) {
		return;
	} else if (liveCnt >= maxLiveCnt) {
		return;		// Too many on screen already so wait until some ar popped or rise out of sight.
	}


	var template = document.querySelector('#balloon-template'),
	    balloon = buildElement(template),
	    container = document.querySelector('#sky-content'),
	    id = balloon.querySelector('.image-container').getAttribute('id');

	liveCnt++;
console.log("+liveCnt: "+liveCnt+"  ("+id+")");
	container.appendChild(document.importNode(balloon, true));
	setDisplayParams("#"+id);


	// Remove node after completion to avoid memory issue with all the imates loaded but no longer visible.
	$('#'+id).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(event){
// console.log("animation completed: "+event.originalEvent.animationName);
		if(event.originalEvent.animationName == 'shake') {
console.log("shake animation so skipping removal ("+id+")");
			return;		// Ignore this as it's not the end animation when user clicks on balloon.
		}	// Only slideInUp or slideOutDown will continue through.

		liveCnt--;
console.log("-liveCnt: "+liveCnt+"  ("+id+")");
		$('#'+id).remove();
	});

	// // Show it and start the animation
	$("#"+id).addClass("animated slideInUp");
}


/** =================================================
 * Div element being popped by mouse click
 *  ================================================= */
function popBalloon(divElm) {
	
	// Stop the animation in its tracks
	divElm.css('animation-play-state', 'paused');
	divElm.css('-moz-animation-play-state', 'paused');
	divElm.css('-webkit-animation-play-state', 'paused');
	
	// Get it's current position
	var pos = divElm.position();

	// Set it with the position, overriding it's original setting prior to animation.				
	divElm.css({top: pos.top, left: pos.left, position:'absolute'});

	divElm.css('display', 'none');		// Safari sometimes flashes image at a higher position so hide it temporarily

	// Remove animation classes
	divElm.removeClass("slideInUp");
	divElm.removeClass("animated");

	// Use the calculated duration time for this element in the fall
	var curDuration = 0;
	if (divElm.css('animation-duration')) {
		curDuration = divElm.css('animation-duration');
	} else if (divElm.css('-moz-animation-duration')) {
		curDuration = divElm.css('-moz-animation-duration');
	} else {
		curDuration = divElm.css('-webkit-animation-duration');
	}
	var parts = curDuration.split("s");		// Need to remove 's'
	curDuration = parseInt((parseInt(parts[0]) / 3)) + 's';	// A fraction of the rising time

	// Set duration for this animation
	divElm.css('animation-duration', '1s');
	divElm.css('-moz-animation-duration', '1s');
	divElm.css('-webkit-animation-duration', '1s');

	// Set new animations , durations and delays.
	divElm.css('animation', 'shake 1s, slideOutDown '+curDuration);
	divElm.css('-moz-animation', 'shake 1s, slideOutDown '+curDuration);
	divElm.css('-webkit-animation', 'shake 1s, slideOutDown '+curDuration);

	divElm.css('animation-delay', '0s, 1s');
	divElm.css('-moz-animation-delay', '0s, 1s');
	divElm.css('-webkit-animation-delay', '0s, 1s');

	// Turn animation process back on
	divElm.css('animation-play-state', 'running');
	divElm.css('-moz-animation-play-state', 'running');
	divElm.css('-webkit-animation-play-state', 'running');

	divElm.css('display', 'block');		// Re-display the image now that we've modified it.
}



 /* ================================================= 
  * Windows load event
  * ================================================= */
$( window ).load(function() {	// Window is ready for us to start processing

	// Randomizes first balloon image to load
	imageNum = parseInt(Math.random() * 10);		// If value is over maxImageNum, it will be rest to zero before use.

	for(var i=0; i < 3; i++){		// Kick off with a few balloons
		makeBalloon();
	}

	$("#sky-content").on("click", function(event){
		if ($(event.target).is(".image-img")) {
console.log("pop!");
			popBalloon($(event.target).parent());
		} else {
console.log((stopMakingBalloons ? "restarting" : "stop"));
			stopMakingBalloons = !stopMakingBalloons;		// Toggle process
		}
	});

	// Every 5 seconds, kick off another balloon with an offset time so they're not so regular looking.
	intervalTimer = window.setInterval(function(){
			if(!stopMakingBalloons && liveCnt < maxLiveCnt) {
				window.setTimeout(function(){
					makeBalloon();
				},
				Math.random()*1000);		// Random timespan (0 to 10 seconds)
			}
		},
		4000	// 4 seonds
	);
});
