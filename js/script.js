var supports_video = !!document.createElement('video').canPlayType;
if (supports_video) {

	// setup custom controls
	var video_container = document.getElementById('video-container');
	var video = document.getElementById('video');
	var video_controls = document.getElementById('video-controls');
	var left_video_controls = document.getElementById('left-controls');
	var right_video_controls = document.getElementById('right-controls');
	var transcript_area = document.getElementById('transcript');

	// hide default controls
	video.controls = false;

	// display custom video controls
	video_controls.style.display = 'block';

	// grab all them control buttons
	var play_button = document.getElementById('play-pause');
	var progress_bar = document.getElementById('progress-bar');
	var buffer_bar = document.getElementById('buffer-bar');
	var mute_button = document.getElementById('mute');
	var volume_bar = document.getElementById('volume-bar');
	var fullscreen_button = document.getElementById('full-screen');
	var current_time = document.getElementById('current-time');
	var duration = document.getElementById('duration');
	var caption_button = document.getElementById('closed-caption');
	var playback_button = document.getElementById('playback-speed');

	// transcript text area
	var transcript_text = document.getElementById('transcript');

	// some utilities vars
	var play_state = '<img src="icons/play-icon.png" alt="play video" />';
	var pause_state = '<img src="icons/pause-icon.png" alt="pause video" />';
	var mute_state = '<img src="icons/volume-off-icon.png" alt="mute video" />';
	var unmute_state = '<img src="icons/volume-on-icon.png" alt="unmute video" />';

	// placeholder for transcript object;
	var transcript_obj;

	// Array of object for transcript text with start and finish
	var transcript_array = [
		{"start": "0.00",
			"fin": "7.535",
			"text": "Now that we've looked at the architecture of the internet, let's see how you might connect your personal devices to the internet inside your house."},
		{"start": "7.536",
			"fin": "13.960",
			"text": "Well there are many ways to connect to the internet, and most often people connect wirelessly."},
		{"start": "13.961",
			"fin": "17.940",
			"text": "Let's look at an example of how you can connect to the internet."},
		{"start": "17.941",
			"fin": "30.920",
			"text": "If you live in a city or a town, you probably have a coaxial cable for cable Internet, or a phone line if you have DSL, running to the outside of your house, that connects you to the Internet Service Provider, or ISP."},
		{"start": "32.100",
			"fin": "41.190",
			"text": "If you live far out in the country, you'll more likely have a dish outside your house, connecting you wirelessly to your closest ISP, or you might also use the telephone system."},
		{"start": "42.350",
			"fin": "53.760",
			"text": "Whether a wire comes straight from the ISP hookup outside your house, or it travels over radio waves from your roof, the first stop a wire will make once inside your house, is at your modem."},
		{"start": "53.761",
			"fin": "57.780",
			"text": "A modem is what connects the internet to your network at home."},
		{"start": "57.781",
			"fin": "59.000",
			"text": "A few common residential modems are DSL or--"}   
	];

	// Utility function to format time nicely
	function format_time(seconds) {
	    minutes = Math.floor(seconds / 60);
	    minutes = (minutes >= 10) ? minutes : "0" + minutes;
	    seconds = Math.floor(seconds % 60);
	    seconds = (seconds >= 10) ? seconds : "0" + seconds;
	    return minutes + ":" + seconds;
	}

	// Skip video to the time specified in span ID
	function skip_to_text(e) {
		video.currentTime = e.target.id;
		video.play();
	}

	// Place text inside the #transcript with appropriate span and id
	function prep_transcript() {
		var temp;
		for (var i = 0; i < transcript_array.length; i++) {
			// create a span element
			temp = document.createElement('span');

			// put the text to the span element
			temp.innerHTML = transcript_array[i].text + ' ';

			// set the id to the time of start of the cue
			temp.setAttribute('id', transcript_array[i].start);

			// append the element to transcript area
			transcript_area.appendChild(temp);

			// attach event listener that will fire skip_to_text when span is clicked
			temp.addEventListener('click', skip_to_text);
		}
	}

	// Function calls
	prep_transcript();

	// set the duration of the video
	video.addEventListener('loadedmetadata', function() {
	   	duration.innerHTML = format_time(video.duration);
	});

	// Play Button Click Event
	play_button.addEventListener('click', function() {
		if (video.paused == true) {
			// Play the video
			video.play();

			// Update the button icon to 'Pause' icon
			play_button.innerHTML = pause_state;
		} else {
			// Pause the video
			video.pause();

			// Update the button icon to 'Play' icon
			play_button.innerHTML = play_state;
		}
	});

	// Mute Button Click Event
	mute_button.addEventListener('click', function() {
		if (video.muted == true) {
			// unmute video
			video.muted = false;
			volume_bar.value = 100;

			// change button icon to 'unmuted'
			mute_button.innerHTML = unmute_state;
		} else {
			// mute video
			video.muted = true;
			volume_bar.value = 0;

			// change button icon to 'muted'
			mute_button.innerHTML = mute_state;
		}
	});

	// Fullscreen button Click Event
	fullscreen_button.addEventListener("click", function() {
		if (video.requestFullscreen) {
			video.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
			video.mozRequestFullScreen(); // Firefox
		} else if (video.webkitRequestFullscreen) {
			video.webkitRequestFullscreen(); // Chrome and Safari
		}
	});

	// Progress bar Change event
	progress_bar.addEventListener("change", function() {
		// Calculate the new time
		var time = video.duration * (progress_bar.value / 100);

		// Update the video time
		video.currentTime = time;
	});
	
	// Update video when progress bar changed, and-
	// During video play, check for time and place #highlight on the span to change the color of the text
	video.addEventListener("timeupdate", function() {
		// Calculate the slider value
		var value = (100 / video.duration) * video.currentTime;

		// calculate the buffer value;
		var buffer_value = (100 / video.duration) * video.buffered.end(0);

		// Update the slider and buffer value
		progress_bar.value = value;
		buffer_bar.value = buffer_value;

		// update current-time value;
		current_time.innerHTML = format_time(video.currentTime);

		// highlight the appropriate transcript span
		for (var i = 0; i < transcript_array.length; i++) {

			// remove .highlight from all span elements first, and then
			document.getElementById(transcript_array[i].start).classList.remove('highlight');

			// find the span element with the correct id
			if (video.currentTime >= transcript_array[i].start && video.currentTime <= transcript_array[i].fin) {

				// append .highlight to the correct span
				document.getElementById(transcript_array[i].start).classList.add('highlight');

			}
		}
	});

	// Update video playback when progress bar is clicked anywhere
	progress_bar.addEventListener('click', function(e) {
	   var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
	   video.currentTime = pos * video.duration;
	});

	// Volume Bar change event
	volume_bar.addEventListener("change", function() {
		// Update the video volume
		video.volume = volume_bar.value;

		// change mute_button icon to mute if volume is 0
		if (video.volume == 0) {
			mute_button.innerHTML = mute_state;
		} else {
			mute_button.innerHTML = unmute_state;
		}
	});

	// Caption button click event
	caption_button.addEventListener('click', function() {
		if (video.textTracks[0].mode == "showing") {
            	// Turn off captions
            	video.textTracks[0].mode = "hidden";

            	// update CC button text 
                caption_button.innerHTML = "<strike>CC</strike>";
            } else {
            	// Turn captions on
            	video.textTracks[0].mode = "showing";

            	// update CC button text 
                caption_button.innerHTML = "CC";
            }    
        });

	// Playback Speed button click event 
	playback_button.addEventListener('click', function() {
		if (playback_button.innerText == 'Normal') {
			video.playbackRate = 1.5;
			video.play();
			playback_button.innerText = '1.5x';
		} else if (playback_button.innerText == '1.5x') {
			video.playbackRate = 1.0;
			video.play();
			playback_button.innerText = 'Normal';
		}
	});
	
		
}
