var MusicVolume = 0.45;
var SfxVolume = 1.0;

function LoadSettings() {
	var DesiredMusicVol = localStorage.getItem("musicVol");
	var DesiredSfxVol = localStorage.getItem("sfxVol");
	if (DesiredMusicVol == "undefined" || DesiredMusicVol == null || DesiredSfxVol == "undefined" || DesiredSfxVol == null) {
		ResetDefaultSettings();
	} else {
		MusicVolume = DesiredMusicVol;
		SfxVolume = DesiredSfxVol;
		if (window.location.href.indexOf("index.html") != -1 || window.location.href == "https://cydeaos.lunasphere.co.uk") {
			setTimeout(function() {
				document.getElementById("musicVol").value = MusicVolume;
				document.getElementById("sfxVol").value = SfxVolume;
				TempModify()
			}, 250);
		};
		return "Music Volume Assigned: " + MusicVolume + "\nSfx Volume Assigned: " + SfxVolume;
	}
}
function ResetDefaultSettings() {
	MusicVolume = 0.8;
	SfxVolume = 1.0;
	localStorage.setItem("musicVol", MusicVolume);
	localStorage.setItem("sfxVol", SfxVolume);
}

var Music1 = new Audio();
Music1.volume = 0;
var Music2 = new Audio();
Music2.volume = 0;
var Sfx = new Audio();

function StartNewTrack(TargetURL) {
	if (Music1.src == "" || Music1.src == null) {
		Music1.src = TargetURL;
		Music1.volume = 0;
		//Music1.currentTime = 15;
		Music1.play();
		FadeOut(Music2);
		FadeIn(Music1, MusicVolume);
	} else if (Music2.src == "" || Music2.src == null) {
		Music2.src = TargetURL;
		Music2.volume = 0;
		//Music2.currentTime = 15;
		Music2.play();
		FadeOut(Music1);
		FadeIn(Music2, MusicVolume);
	} else {
		if (Music1.volume == 0) {
			Music1.src = TargetURL;
			Music1.play();
			FadeOut(Music2);
			FadeIn(Music1, 0.8);
		} else if (Music2.volume == 0) {
			Music2.src = TargetURL;
			Music2.play();
			FadeOut(Music1);
			FadeIn(Music2, MusicVolume);
		}
	}
}

function PlaySFX(SourceURL) {
	Music1.volume = MusicVolume / 2;
	Music2.volume = MusicVolume / 2;
	Sfx.src = SourceURL;
	Sfx.volume = SfxVolume;
	Sfx.play();
	setTimeout(function() {
		Music1.volume = MusicVolume;
		Music2.volume = MusicVolume;
	}, Sfx.duration);
}

function FadeIn(TargetChannel, TargetVol) {
	var LoopCounter = 0;
	var StepAmount = TargetVol / 25;
	var fadeInEffect = setInterval(function() {
		var NextVolLevel = TargetChannel.volume + StepAmount;
		if (NextVolLevel > 1) {
			NextVolLevel = 1;
		}
		TargetChannel.volume = NextVolLevel;	
		LoopCounter++;	
		
		if (LoopCounter >= 25 || TargetChannel.volume == TargetVol) {
			TargetChannel.volume = TargetVol;
			clearInterval(fadeInEffect);
		}
	}, 175);
}

function FadeOut(TargetChannel) {
	var LoopCounter = 0;
	var StepAmount = TargetChannel.volume / 25;
	var fadeOutEffect = setInterval(function() {
		var NextVolLevel = TargetChannel.volume - StepAmount;
		if (NextVolLevel < 0) {
			NextVolLevel = 0;
		}
		TargetChannel.volume = NextVolLevel;
		LoopCounter++;
		
		if (LoopCounter >= 25 || TargetChannel.volume == 0) {
			TargetChannel.volume = 0;
			TargetChannel.pause();
			clearInterval(fadeOutEffect);
		}
	}, 175);
}


Music1.addEventListener('ended', function() {
	socket.emit("musicReq", {type: "getTrack", gameCode: currentGamecode});
});
Music2.addEventListener('ended', function() {
	socket.emit("musicReq", {type: "getTrack", gameCode: currentGamecode});
});

socket.on("musicRes", function(msg) {
	console.log(msg);
	if (msg.code == currentGamecode) {
		if (msg.type == "playTrack") {
			StartNewTrack(msg.musicSrc);
		}
	}
});

LoadSettings();