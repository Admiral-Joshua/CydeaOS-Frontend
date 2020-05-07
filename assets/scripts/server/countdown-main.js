var TimeLeft;
var TimeElapsed;
var TimeMax;

var TimerGoal = "";

function SetTime(MaxSeconds, StringGoal) {
	TimeLeft = parseInt(MaxSeconds);
	TimeMax = parseInt(MaxSeconds);
	TimerGoal = StringGoal;
	TimeElapsed = 0;
	RefreshTimeOutput();
}

/*var GameLength;
var GameLengthString = localStorage.getItem("GameLength");
if (GameLengthString != null && GameLengthString != "undefined" && GameLengthString != "") {
	GameLength = parseInt(GameLengthString); 
} else {
	//window.location.replace("host-game.html");
}*/

var GameClock;

function UpdateTime() {
	if (TimeLeft > 0) {
		TimeLeft -= 1;
		if (TimeLeft == 80) {
			ChangeStatus("Game Timer Running Out!", "warning");
		}
	} else {
		ChangeStatus("Game Ended", "warning");
		document.getElementById("countdownText").style.color = "rgb(240, 20, 10)";
		socket.emit('serverReq', {type: "gameEnd", code: CurrentGameID});
		console.log("Game Has Ended!");
		setTimeout(function() {
			clearInterval(GameClock);
		}, 250);
	}
	TimeElapsed += 1;
	RefreshTimeOutput();
}

function StartTimer() {
	if (GameClock != null) {
		clearInterval(GameClock);
	}
	GameClock = setInterval(UpdateTime, 1000);
}

function ChangeStatus(TxtStatus, AlertType) {
	document.getElementById("statusReadout").innerHTML = TxtStatus.toString();
	if (AlertType == "information" || AlertType == null) {
		document.getElementById("statusReadout").style.color = "rgb(80, 180, 255)";
	} else if (AlertType == "warning") {
		document.getElementById("statusReadout").style.color = "rgb(180, 200, 80)";
	} else if (AlertType == "error") {
		document.getElementById("statusReadout").style.color = "rgb(240, 20, 10)";
	}
}

function SyncTimer(ServerSecs) {
	var TotalTime = ServerSecs + TimeElapsed;
	var TimeDifferential = TotalTime - TimeMax;
	if (TimeDifferential != 0) {
		TimeElapsed -= TimeDifferential;
		TimeLeft += TimeDifferential;
	}
}

function RefreshTimeOutput() {
	var HoursString = Math.floor(TimeLeft / 3600);
	var MinutesString = Math.floor((TimeLeft % 3600) / 60);
	var SecondsString = (TimeLeft % 3600) % 60;
	
	if (HoursString < 10) {
		HoursString = "0" + HoursString.toString();
	}
	if (MinutesString < 10) {
		MinutesString = "0" + MinutesString.toString();
	}
	if (SecondsString < 10) {
		SecondsString = "0" + SecondsString.toString();
	}
	if (TimerGoal == "initial" && TimeLeft > 0) {
		document.getElementById("countdownText").innerHTML = "-" + HoursString + " : " + MinutesString + " : " + SecondsString + " ";
	} else {
		document.getElementById("countdownText").innerHTML = " " + HoursString + " : " + MinutesString + " : " + SecondsString + " ";
	}
}

//SetTime(10, "initial");
//StartTimer();