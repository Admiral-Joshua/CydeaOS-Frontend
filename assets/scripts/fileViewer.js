var FileViewer = document.getElementById("fileViewer");
//FileViewer.style.display = "none";
function DisplayFile(fileName, fileContents) {
	var startDelay = 1;
	if (FileViewer.style.display == "block") {
		ForceHideFileViewer();
		startDelay = 1050;
	}
	setTimeout(function() {
		FileViewer.style.animation = "notify-open 1s forwards";
		FileViewer.style.display = "block";
		document.getElementById("textEdit-title").innerHTML = "TextEdit - " + fileName;
		document.getElementById("fileContents").value = fileContents;
	}, startDelay);
}

function ForceHideFileViewer() {
	FileViewer.style.animation = "notify-close 1s forwards";
	setTimeout(function() {
		FileViewer.style.display = "none";
	}, 950);
}

function NewFile() {
	var TargetIP = document.getElementById("ipReadout").innerHTML.toString();
	if (TargetIP !== "localhost" && TargetIP !== "127.0.0.1") {
		socket.emit("gameReq", {type: "createFile", code: currentGamecode, targetIP: TargetIP});
	} else {
		AppendTerminal("\nFile Creation Failed - You are not connected to an external computer.");
		CompleteAppends();
	}
	CloseContextMenu();
}

function SaveFile() {
	var TargetIP = document.getElementById("ipReadout").innerHTML.toString();
	var TargetIP = document.getElementById("ipReadout").innerHTML.toString();
	if (TargetIP !== "localhost" && TargetIP !== "127.0.0.1") {
		var FileName = document.getElementById("textEdit-title").innerHTML.replace("TextEdit - ", "");
		var FinalContents = document.getElementById("fileContents").value;
		console.log({type: "updateFile", code: currentGamecode, targetIP: TargetIP, filename: FileName, newData: FinalContents});
		socket.emit("gameReq", {type: "updateFile", code: currentGamecode, targetIP: TargetIP, filename: FileName, newData: FinalContents});
	}
}

function OpenContextMenu(ItemIndex) {
	var targets = document.getElementsByClassName("contextMenu2");
	if (targets[ItemIndex].style.display !== "block") {
		CloseContextMenu();
		targets[ItemIndex].style.display = "block";
	} else {
		CloseContextMenu();
	}
}

function CloseContextMenu() {
	var targets = document.getElementsByClassName("contextMenu2");
	for (i = 0; i < targets.length; i++) {
		targets[i].style.display = "none";
	}
}