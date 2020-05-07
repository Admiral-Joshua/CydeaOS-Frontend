var secondsElapsed = 0;
var minutesElapsed = 0;

var TimeLeft;
var TimeElapsed;
var TimeMax;

function CalculateProgress() {
	var Progress = (TimeLeft / (TimeElapsed + TimeLeft)) * 100;
	document.getElementById("progressActual").style.width = Progress.toString() + "%";
}

function UpdateTime() {
	if (TimeLeft > 0) {
		TimeLeft -= 1
		TimeElapsed += 1;
	}
	
	var minuteString2 = Math.floor(TimeLeft / 60).toString();
	var secondString2 = (TimeLeft % 60).toString();
	
	var secondString = (TimeElapsed % 60).toString();
	var minuteString = (Math.floor(TimeElapsed / 60)).toString();
	
	if (parseInt(secondString) < 10) {
		secondString = "0" + secondString;
	}
	if (parseInt(minuteString) < 10) {
		minuteString = "0" + minuteString;
	}
	if (parseInt(secondString2) < 10) {
		secondString2 = "0" + secondString2;
	}
	if (parseInt(minuteString2) < 10) {
		minuteString2 = "0" + minuteString2;
	}
	
	timeReadout.innerHTML = minuteString + ":" + secondString + '<em id="timeLeft"> / ' + minuteString2 + ":" + secondString2 + '</em>';
	CalculateProgress();
}

var countLoop = null;

/*function startTimer(maxMin, maxSec) {
	if (countLoop != null) {
		clearInterval(countLoop);
	}
	secondsRemaining = maxSec;
	minutesRemaining = maxMin;
	secondsElapsed = 0;
	minutesElapsed = 0;
	
	countLoop = setInterval(updateTime, 1000);
}*/

function StartTimer() {
	if (countLoop != null) {
		clearInterval(countLoop);
	}
	TimeElapsed = 0;
	countLoop = setInterval(UpdateTime, 1000);
}

function SyncTimer(ServerSecs) {
	var TotalTime = ServerSecs + TimeElapsed;
	var TimeDifferential = TotalTime - TimeMax;
	if (TimeDifferential != 0) {
		TimeElapsed -= TimeDifferential;
		TimeLeft += TimeDifferential;
	}
}

function SetTimer(MaxSeconds) {
	
	/*secondsRemaining = MaxSeconds % 60;
	minutesRemaining = Math.floor(MaxSeconds / 60);*/
	TimeLeft = MaxSeconds;
	TimeElapsed = 0;
	//TimeMax = MaxSeconds;
	var GameTime = localStorage.getItem("GameLength");
	if (GameTime == null || GameTime == "undefined") {
		console.log("NO TIME WAS READ, IS THERE SOMETHING WRONG WITH THE GAME SETUP PROCESS?");
		TimeMax = MaxSeconds;
	} else {
		console.log("GAME TIMER ASSIGNED: " + GameTime);
		TimeMax = GameTime;
	}
}
//StartTimer();
function LoadTime() {
	var GameTime = localStorage.getItem("GameLength");
	if (GameTime == null || GameTime == "undefined" || GameTime == 0) {
		//window.location.replace("join-game.html");
		console.log("NO TIME WAS READ, IS THERE SOMETHING WRONG WITH THE GAME SETUP PROCESS?");
	} else {
		SetTimer(parseInt(GameTime));
		console.log("GAME TIMER ASSIGNED: " + GameTime);
	}
}
