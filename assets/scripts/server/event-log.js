function LogEvent(EventText) {
	var EventTime = document.getElementById("countdownText").innerHTML.toString();
	var EventLogOutput = document.getElementById("eventLogOutput");
	if (EventLogOutput.value.length > 0) {
		EventLogOutput.value += "\n";
	}
	EventLogOutput.value += EventTime.replace(" ", "") + " - " + EventText;
	EventLogOutput.scrollTop = EventLogOutput.scrollHeight;
	
	document.getElementsByClassName("eventLog")[0].style.animation = "";
	setTimeout(function() {
		document.getElementsByClassName("eventLog")[0].style.animation = "eventFlash .4s 1";
	}, 150);
}
LogEvent("Game Initialised!");

/*
setInterval(function() {
	LogEvent("SPAM TEST");
}, 1000);
*/