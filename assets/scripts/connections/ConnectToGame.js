//var socket = io.connect("http://127.0.0.1:4003");

var socket = io.connect("https://cydeaos.lunasphere.co.uk:4003", {secure: true, reconnect: false, rejectUnauthorized: false}); 		// FOR WHEN ONLINE

var currentGamecode = localStorage.getItem("activeCode");
//var currentPlayerID = localStorage.getItem("PlayerID");

var myUsername = sessionStorage.getItem("activeUser");

if (document.getElementById("nameReadout") != null) {
	document.getElementById("nameReadout").innerHTML = myUsername;
}

if (currentGamecode == null || currentGamecode == "") {
	//window.location.replace("index.html");
} else {
	socket.emit('clientReq', {type: "checkCode", playerName: myUsername, code: currentGamecode});
	socket.on('clientRes', function(msg) {
		if (msg.type == "codeTest") {
			if (msg.response == "Failure!") {
				localStorage.setItem("activeCode", null);
				//window.location.replace("index.html");
			} else {
				console.log("Connection Established - Code Accepted - " + currentGamecode);
			}
				/*socket.emit("gameReq", {type: "reconnectReq", playerName: myUsername, code: currentGamecode, PlayerID: currentPlayerID});
				console.log("Ping Reconnect Command : ");
				console.log({type: "reconnectReq", playerName: myUsername, code: currentGamecode, PlayerID: currentPlayerID});*/
		}
		if (msg.timeLeft != null && msg.timeLeft != "null" && msg.timeLeft != "undefined") {
			console.log(msg.timeLeft);
			setTimeout(function() {
				SyncTimer(msg.timeLeft);
			}, 100);
		}
	});
}
socket.on("gameRes", function(msg) {
	if (msg.type == "reconnectRes") {
		console.log(msg);
		if (msg.response == "Failure!") {
			console.log("Game Connection Failure!");
			setTimeout(function() {
				//window.location.replace("index.html");
			}, 4000)
		} else {
			console.log("Game Connection Successful!");
		}
	}
});