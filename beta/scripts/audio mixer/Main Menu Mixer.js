// AJay's HTML Audio Mixer Protocol v1.2
//  This is currently the Alpha version of my current Audio Mixer Script
//  Designed for use in CydeaOS, the background music player as well as for SFX Later Too.
//  This is the local / client-side version only, but a new version will be released soon to
//    work with Socket.IO, syncing up with the server to ensure all are playing the same music
//    or whether the client will not play music at all.

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
		setTimeout(function() {
			document.getElementById("musicVol").value = MusicVolume;
			document.getElementById("sfxVol").value = SfxVolume;
			TempModify()
		}, 250);
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
var CurrentGenre;

LoadSettings();

ActiveMusicQueue = [];

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
	console.log({type: "AudioChannel", "Channel Name" : "Music01", Volume: Music1.volume, "Now Playing": Music1.src});
	console.log({type: "AudioChannel", "Channel Name" : "Music02", Volume: Music2.volume, "Now Playing": Music2.src});
}

Music1.addEventListener('ended', function() {
	PickNewTrack();
});
Music2.addEventListener('ended', function() {
	PickNewTrack();
});

function QueueMainMenu() {
	CurrentGenre = "Main Menu";
	ActiveMusicQueue = [];
	FileNames = ["4 - Efence - Spaceflight.mp3",
	"3 - TeknoAXE - Home Sweet Megalopolisc.mp3",
	"2 - As Yet Untitled.mp3",
	"1 - D Kexer - POFF.mp3"];
	LoadFullPaths(FileNames, "main-menu");
}

function LoadFullPaths(Filenames, Genre) {
	for (z=0; z < Filenames.length; z++) {
		ActiveMusicQueue.push(("resources/music/" + Genre.toString() + "/" + Filenames[z].toString()).toString());
	}
}

function PickNewTrack() {
	if (ActiveMusicQueue.length > 0) {
		var IndexNumber = 0;
		for (i=0;i < 3; i++) {
			IndexNumber = Math.floor(Math.random() * ActiveMusicQueue.length);
		}
		StartNewTrack(ActiveMusicQueue[IndexNumber]);
		ActiveMusicQueue.splice(IndexNumber, 1);
	} else {
		QueueMainMenu();
		setTimeout(PickNewTrack(), 500);
	}
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

PickNewTrack();