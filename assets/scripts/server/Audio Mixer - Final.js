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
	}
}
function ResetDefaultSettings() {
	MusicVolume = 0.8;
	SfxVolume = 1.0;
	localStorage.setItem("musicVol", MusicVolume);
	localStorage.setItem("sfxVol", SfxVolume);
}

LoadSettings();

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
	//console.log({type: "AudioChannel", "Channel Name" : "Music01", Volume: Music1.volume, "Now Playing": Music1.src});
	//console.log({type: "AudioChannel", "Channel Name" : "Music02", Volume: Music2.volume, "Now Playing": Music2.src});
}


function FadeIn(TargetChannel, TargetVol) {
	var LoopCounter = 0;
	var StepAmount = TargetVol / 20;
	var fadeInEffect = setInterval(function() {
		var NextVolLevel = TargetChannel.volume + StepAmount;
		if (NextVolLevel > 1) {
			NextVolLevel = 1;
		}
		TargetChannel.volume = NextVolLevel;	
		LoopCounter++;	
		
		if (LoopCounter >= 20 || TargetChannel.volume == TargetVol) {
			TargetChannel.volume = TargetVol;
			clearInterval(fadeInEffect);
		}
	}, 175);
}

function FadeOut(TargetChannel) {
	var LoopCounter = 0;
	var StepAmount = TargetChannel.volume / 20;
	var fadeOutEffect = setInterval(function() {
		var NextVolLevel = TargetChannel.volume - StepAmount;
		if (NextVolLevel < 0) {
			NextVolLevel = 0;
		}
		TargetChannel.volume = NextVolLevel;
		LoopCounter++;
		
		if (LoopCounter >= 20 || TargetChannel.volume == 0) {
			TargetChannel.volume = 0;
			TargetChannel.pause();
			clearInterval(fadeOutEffect);
		}
	}, 175);
}

Music1.addEventListener('ended', function() {
	socket.emit("musicReq", {type: "getTrack", gameCode: CurrentGameID});
});
Music2.addEventListener('ended', function() {
	socket.emit("musicReq", {type: "getTrack", gameCode: CurrentGameID});
});

socket.on("musicRes", function(msg) {
	console.log(msg);
	if (msg.code == CurrentGameID) {
		if (msg.type == "playTrack") {
			StartNewTrack(msg.musicSrc);
		}
	}
});

/*if (CurrentGameID != null) {
	socket.emit("musicReq", {type: "getTrack", gameCode: CurrentGameID});
}*/