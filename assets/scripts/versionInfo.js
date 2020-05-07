var serverStatus = document.getElementById("serverStatusOutput");

socket.on('utilRes', function(msg) {
	if (msg.type === "getVersion") {
		document.getElementById("versionOut").innerHTML = "Build Version " + msg.versionNo;
		serverStatus.innerHTML = "Online";
		serverStatus.style.color = "lime";
	}
});

function checkServer() {
	socket.emit('utilReq', {type: "getVersion"});
}

setInterval(checkServer, 2500);
