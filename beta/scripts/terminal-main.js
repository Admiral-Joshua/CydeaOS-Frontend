var Terminal = document.getElementById("terminal-container");
function handleBodyKey(e) {
	//alert(e.keyCode);
	if (e.keyCode === 223) {
		//toggleTerminal();
	} else if (e.keyCode !== 13) {
		setTimeout(function() {
			terminal1.focus();
		}, 100);
	}
}

/*function toggleTerminal() {
	if (Terminal.style.animation === "ui-open1 1s forwards") {
		Terminal.style.animation = "hide-window 1s forwards";
		setTimeout(function() {
			Terminal.style.display = "none";
		}, 800);
	} else {
		Terminal.style.display = "block";
		Terminal.style.animation = "ui-open1 1s forwards";
	}
}*/

//OUR TERMINAL's TEXT OBJECT
var terminal1 = document.getElementById("terminal1");


// OUR HANDY HELP MENU THAT CAN BE NAVIGATED AND VIEWED VIA THE 'HELP' COMMAND

var HelpMenu = ["echo [string] - Output a specified string value",
"clear - Clears the terminal window",
"wget [filename] - Downloads the specified file to your computer",
"color - change the color of the terminal text. Valid options are:\n  - red\n  - cyan\n  - lime\n  - gold\n  - white",
"connect [IP] - Connects to the specified IP address.",
"exit - Hides the terminal window. Press ` key to reveal again.",
"filebrowser - Open/Close the file browser",
"del (rm) [Filename] - Deletes the file with the specified filename",
"ren [Filename] [New Filename] - Renames the file with the new filename",
"nmap (probe) - Used to analyze the security on the current system and identify weaknesses.",
"pwordcrack - Use this to attempt to gain admin access on a computer once all ports have been opn'd.",
"ls (dir) - list files on the computer you're currently connected to."
];



// TERMINAL VARIABLES - FOR STORING CURRENT COMMAND, COMMAND HISTORY ETC
//var Command = "";
var CommandHistory = [];
var ConsoleOutput = "Terminal>";
var HistoryPointer = 0;
/*var capsLock = false;
function releaseTerminalKey(e) {
	if (e.keyCode == 16) {
		capsLock = false;	
	}
}*/

function AppendTerminal(TxtLines) {
	ConsoleOutput += TxtLines;
	RefreshTerminal();
}

function CompleteAppends() {
	ConsoleOutput = ConsoleOutput.concat("\n", "Terminal>");
	HistoryPointer = CommandHistory.length;
	RefreshTerminal();
}

function RefreshTerminal() {
	terminal1.scrollTop = terminal1.scrollHeight;
	terminal1.value = ConsoleOutput;
}


$("#terminalProcessor").submit(function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
	var lastLine = terminal1.value.split("\n");
	lastLine = lastLine[lastLine.length - 1];
	ProcessCommand(lastLine);
});

function handleTerminalInput(e) {
	//alert(e.which);
	if (e.which == 38) {
		if (CommandHistory.length > 0) {
			HistoryPointer -= 1;
			if (HistoryPointer < 0) {
				HistoryPointer = CommandHistory.length - 1;
			}
			//Command = CommandHistory[HistoryPointer];
			var ConsoleText = terminal1.value.split("\n");
			ConsoleText[ConsoleText.length - 1] = "Terminal>".concat(CommandHistory[HistoryPointer]);
			terminal1.value = ConsoleText.join("\n");
		}
		e.preventDefault();
	} else if (e.keyCode == 40) {
		if (CommandHistory.length > 0) {
			HistoryPointer += 1;
			if (HistoryPointer > CommandHistory.length - 1) {
				HistoryPointer = 0;
			}
			//Command = CommandHistory[HistoryPointer];
			var ConsoleText = terminal1.value.split("\n");
			ConsoleText[ConsoleText.length - 1] = "Terminal>".concat(CommandHistory[HistoryPointer]);
			terminal1.value = ConsoleText.join("\n");
		}
		e.preventDefault();
	} else if (e.which == 8) {
		var ConsoleText = terminal1.value.split("\n");
		if (ConsoleText[ConsoleText.length - 1].length > 9) {
			var LastLine = ConsoleText[ConsoleText.length - 1].toString();
			//alert("Before: " + LastLine);
			LastLine = LastLine.slice(0, -1);
			//alert("After: " + LastLine);
			ConsoleText[ConsoleText.length - 1] = LastLine;
		}
		terminal1.value = ConsoleText.join("\n");
		e.preventDefault();
	} else if (e.which === 13) {
		$("#terminalProcessor").submit();
		e.preventDefault();
	}
}
	
function ProcessCommand(Command) {
	Command = Command.replace("Terminal>", "", 1);
	AppendTerminal(Command.concat("\n"));
	
	if (Command != "") {
		CommandHistory.push(Command);
	}
	if (Command.toLowerCase().indexOf("echo") == 0) {
		AppendTerminal(Command.replace("echo ", ""));
		CompleteAppends();
///			ConsoleOutput += Command.replace("echo ", "");
	} else if (Command.toLowerCase() == "clear") {
		ConsoleOutput = "";
		CompleteAppends();
	} else if (Command.toLowerCase() == "filebrowser") {
		toggleFileBrowser();
		if (fileBrowser.style.animation == "ui-open1 1s forwards") {
//				ConsoleOutput += "File Browser Opened!";
			AppendTerminal("File Browser Opened!");
		} else {
			AppendTerminal("File Browser Closed!");
		}
		CompleteAppends();
	} else if (Command.toLowerCase().indexOf("color ") != -1) {
		var targetColor = Command.toLowerCase().replace("color ", "");
		if (targetColor == "cyan") {
			terminal1.style.color = "rgb(0, 160, 240)";
		} else if (targetColor == "lime") {
			terminal1.style.color = "lime";	
		} else if (targetColor == "red") {
			terminal1.style.color = "red";
		} else if (targetColor == "gold") {
			terminal1.style.color = "gold";
		} else if (targetColor == "white") {
			terminal1.style.color = "white";
		}
		CompleteAppends();
	} else if (Command.toLowerCase().indexOf("memevirus") == 0) {
		var TargetIP = document.getElementById("ipReadout").innerHTML;
		socket.emit("gameReq", {type: "virusLaunch", vType: "memes", code: currentGamecode, targetIP: TargetIP});
	} else if (Command.toLowerCase().indexOf("ren ") == 0) {
		var RenCommand = Command.toLowerCase().replace("ren ", "");
		if (RenCommand.indexOf(" ") != -1) {
			RenParams = RenCommand.split(" ");
			targetIP = document.getElementById("ipReadout").innerHTML;
			AppendTerminal("Performing Rename...");
			if (targetIP == "localhost" || targetIP == "127.0.0.1" || targetIP == null) {
				AppendTerminal("\nRename Failed - You are not connected to an external computer.");
				CompleteAppends();
			} else {
				socket.emit("gameReq", {type: "renReq", targetIp: targetIP, code: currentGamecode, origFilename: RenParams[0], newFilename: RenParams[1]});
			}
		} else {
			RenParams = null;
			AppendTerminal("Rename Failed - Must specify exactly two parameters.");
		}
	} else if (Command.toLowerCase().indexOf("cat") === 0) {
		var TargetIP = document.getElementById("ipReadout").innerHTML.toString();
		if (TargetIP == "localhost" || TargetIP == "127.0.0.1" || TargetIP == null) {
			AppendTerminal("Cannot open file - You are not connected to another computer.");
			CompleteAppends();
		} else {
			var TargetFile = Command.replace("cat", "").replace(" ", "").replace("Cat", "").replace("CAT", "");
			if (TargetFile == "") {
				AppendTerminal("Cannot open file - No file was specified.");
				CompleteAppends();
			} else {
				socket.emit("gameReq", {type: "openFile", code: currentGamecode, targetIP: TargetIP, fileName: TargetFile});
				AppendTerminal("Accessing file '" + TargetFile + "' ...");
			}
		}
	} else if (Command.toLowerCase().indexOf("forkbomb") === 0) {
		var TargetIP = document.getElementById("ipReadout").innerHTML.toString();
		if (TargetIP == "localhost" || TargetIP == "127.0.0.1" || TargetIP == null) {
			ForkBomb();
		} else {
			socket.emit("gameReq", {type: "fkLaunch", code: currentGamecode, targetIP: TargetIP});
		}
		
	} else if (Command.toLowerCase().indexOf("ls") === 0 || Command.toLowerCase().indexOf("dir") === 0) {
		var CompFound = false;
		var TargetIP = document.getElementById("ipReadout").innerHTML.toString();
		
		if (TargetIP == "localhost" || TargetIP == "127.0.0.1" || TargetIP == null) {
				AppendTerminal("\nls Failed - You are not connected to an external computer.");
		} else {

			var AllFiles = document.getElementsByClassName("objectName");
			AppendTerminal(" --------  Files on this Node  ------- ");
			for (a=0; a < AllFiles.length; a++) {
				AppendTerminal("\n" + AllFiles[a].innerHTML.replace("- ", ""));
			}
		}
		CompleteAppends();
	} else if (Command.toLowerCase().indexOf("del ") == 0 || Command.toLowerCase().indexOf("rm ") == 0) {
		var CompFound = false;
		var TargetIP = document.getElementById("ipReadout").innerHTML.toString();
		
		if (TargetIP == "localhost" || TargetIP == "127.0.0.1" || TargetIP == null) {
				AppendTerminal("\nDelete Failed - You are not connected to an external computer.");
				CompleteAppends();
		} else {
			
			var DelTarget = Command.replace("del ", "").replace("rm ", "");
			console.log("Aiming to delete: " + DelTarget);
				
			for (i=0; i < HackedComps.length; i++) {
				if (HackedComps[i].ip === TargetIP) {
					CompFound = HackedComps[i];
					break;
				}
			}
			if (CompFound !== false) {
				if (DelTarget.indexOf("*") == 0 || DelTarget.indexOf("*") == 1) {
					var AllFiles = document.getElementsByClassName("objectName");
					for (a=0; a < AllFiles.length; a++) {
						DeleteFile(AllFiles[a].innerHTML.replace("- ", ""), TargetIP);
					}
				} else {
					DeleteFile(DelTarget, TargetIP);
				}
			} else {
				AppendTerminal("\nDelete Failed - You don't have permission to perform this action.");
				CompleteAppends();
			}
		}
	} else if (Command.toLowerCase().indexOf("help") == 0) {
		var HelpParam = Command.toLowerCase().replace("help", "").replace(" ", "");
		AppendTerminal(" ----- " + HelpParam + " Help ----- ");
		//console.log(HelpParam);
		var HelpFound = false;
		for (b = 0; b < HelpMenu.length; b++) {
			if (HelpParam == "") {
				AppendTerminal("\n" + HelpMenu[b]);
				var HelpFound = true;
			} else {
				if (HelpMenu[b].indexOf(HelpParam) != -1) {
					AppendTerminal("\n" + HelpMenu[b]);
					var HelpFound = true;
					break;
				}
			}
		}
		
		if (HelpFound == false) {
			AppendTerminal("\nCommand Not Found in Help Database - Please try again!");
		}
		CompleteAppends();
	} else if (Command.toLowerCase().indexOf("connect ") == 0) {
		if (document.getElementById("ipReadout").innerHTML != "localhost" && document.getElementById("ipReadout").innerHTML != "127.0.0.1") {
			Disconnect();
			AppendTerminal("\n");
		}
		var TargetIP = Command.replace("connect ", "");
		ping(TargetIP);
	} else if (Command.toLowerCase().indexOf("wget") == 0) {
		var CompFound = false;
		var TargetFilename = Command.replace("wget", "").replace(" ", "", 1);
		var TargetIP = document.getElementById("ipReadout").innerHTML.toString();
		
		if (TargetIP !== null && TargetIP !== "127.0.0.1" && TargetIP !== "localhost") {
			for (i=0; i < HackedComps.length; i++) {
				if (HackedComps[i].ip === TargetIP) {
					CompFound = HackedComps[i];
					break;
				}
			}
			if (CompFound !== false) {
				DownloadFile(TargetFilename);
			} else {
				AppendTerminal(" Failed! - You do not have permission to perform this action.");
				CompleteAppends();
			}
		} else {
			AppendTerminal(" Failed! - You can't download from/to the same source.");
			CompleteAppends();
		}
	} else if (Command.toLowerCase().indexOf("nmap") != -1 || Command.toLowerCase().indexOf("probe") != -1) {
		if (document.getElementById("ipReadout").innerHTML == "null" || document.getElementById("ipReadout").innerHTML == "localhost") {
			AppendTerminal("Probe Failed - You are not connected to an an external computer.");
			CompleteAppends();
		} else {
			AppendTerminal("Security Analysis Started...");			
			LoadAnalysis();
			setTimeout(CompleteAppends(), 750);
		}
	} else if (Command.toLowerCase() === "dc" || Command.toLowerCase() === "disconnect") {
		Disconnect();
		CompleteAppends();
	} else if (Command.toLowerCase().indexOf("ping ") == 0) {
		var TargetIP = Command.replace("ping ", "");
		ping(TargetIP);
	} else if (Command.toLowerCase() === "hide" || Command.toLowerCase() === "exit") {
		toggleTerminal();
		CompleteAppends();
	} else if (Command.toLowerCase().indexOf("brutessh") == 0) {
		var TargetPort = Command.toLowerCase().replace("brutessh", "").replace(" ", "", 1);
		if (TargetPort == "22") {
			socket.emit("gameReq", {type: "portCrack", code: currentGamecode, pType: "ssh"});
		} else {
			AppendTerminal("BruteSSH Tool - Fail - Target Port is either closed or does not support this service.");
			CompleteAppends();
		}
	} else if (Command.toLowerCase().indexOf("ftpbounce") == 0) {
		var TargetPort = Command.toLowerCase().replace("ftpbounce", "").replace(" ", "", 1);
		if (TargetPort == "21") {
			socket.emit("gameReq", {type: "portCrack", code: currentGamecode, pType: "ftp"});
		} else {
			AppendTerminal("FTPBounce Tool - Fail - Target Port is either closed or does not support this service.");
			CompleteAppends();
		}
	} else if (Command.toLowerCase().indexOf("pwordcrack") == 0) {
		if (document.getElementById("ipReadout").innerHTML === "localhost" || document.getElementById("ipReadout").innerHTML === "127.0.0.1" || CurrentComp === null) {
			AppendTerminal("Crack Impossible - Not Connected to an external computer.");
			CompleteAppends();
		} else {
			if (CheckPorts() || CurrentComp.SecLvl == 0) {
				socket.emit("gameReq", {type: "portCrack", code: currentGamecode, pType: "pword"});
			} else {
				AppendTerminal("Crack Impossible - Required number of ports have not been opn'd.");
				CompleteAppends();
			}
		}
	} else if (Command.toLowerCase().indexOf("hack ") == 0) {
		var TargetPort = Command.toLowerCase().replace("hack ", "");
		var Successful = UnlockPort(TargetPort);
		if (Successful) {
			AppendTerminal("Hack Successful!");
		} else {
			AppendTerminal("Hack Unsuccessful! Port not available or active.");
		}
		CompleteAppends()
	} else {
		AppendTerminal("Command '" + Command + "' not recognised.");
		CompleteAppends();
	}
	Command = "";
	RefreshTerminal();
}

function LaunchPortCrack(TargetPort) {
	var CrackAnimation = document.getElementById("crackView");
	var old_element = document.getElementById("crackView");
	var viewPort = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(viewPort, old_element);
	
	var AnimationSource = viewPort.childNodes[3];
	var CrackingToolName = viewPort.childNodes[1].childNodes[0];
	
	var Error = false;
	console.log(viewPort.childNodes);
	if (TargetPort == "22") {
		AnimationSource.src = "resources/video/BruteSSH.mp4";
		CrackingToolName.innerHTML = "Brute SSH v1.0";
	} else if (TargetPort == "21") {
		AnimationSource.src = "resources/video/FTPBounce.mp4";
		CrackingToolName.innerHTML = "FTP Bounce v1.0";
	} else if (TargetPort == "1433") {
		AnimationSource.src = "resources/video/SQLInject.mp4";
		CrackingToolName.innerHTML = "SQL Inject v1.0";
	} else if (TargetPort == "pword") {
		AnimationSource.src = "resources/video/PasswordCrack.mp4";
		CrackingToolName.innerHTML = "Dict!on4ry Att4ck v2.1";
	} else {
		Error = true;
	}
	if (Error == false) {
		viewPort.style.animation = "notify-open 1s forwards";
		viewPort.style.display = "block";
		AnimationSource.onended = function() {
			UnlockPort(TargetPort);
			setTimeout(function() {
				viewPort.style.animation = "notify-close 1s forwards";
				setTimeout(function() {
					viewPort.style.display = "none";
				}, 1000);
			}, 100);
		}
	}
}


function DownloadFile(targetFilename) {
	AppendTerminal(" -------- WGET v1.1 -------- \n" + 
	" Getting file information... Please wait ... ");
	setTimeout(function() {
		AppendTerminal("\nDownloading File '" + targetFilename + "' ... ");
		var TargetIP = document.getElementById("ipReadout").innerHTML;
		socket.emit("gameReq", {type: "dlReq", code: currentGamecode, targetIP: TargetIP, filename: targetFilename});
	}, 350);
}

function DeleteFile(targetFilename, trgIP) {
	AppendTerminal("\nDeleting '" + targetFilename.toString() + "' ... ");
	socket.emit("gameReq", {type: "delReq", targetIp: trgIP, code: currentGamecode, filename: targetFilename});
	/*SingleLoop = setInterval(function() {
		AppendTerminal(".");
		pingCount++;
		if (pingCount > 10) {
			AppendTerminal("Failed! - No response from server.");
			CompleteAppends();
			clearInterval(SingleLoop);
		}
	}, 350);*/
}

function Disconnect() {
	AppendTerminal("Disconnected!");
	HideConnectedDialog();
	ConnectedPorts = [];
	refreshFileBrowser("blank");
	if (tmpCurrentGenre == "dramatic") {
		socket.emit("musicReq", {type: "changeTrack", gameCode: currentGamecode, genre: "chill"});
	}
	CurrentComp = null;
	document.getElementById("ipReadout").innerHTML = "localhost";
	hideNmap();
}

function UnlockComp() {
	HackedComps.push({name: CurrentComp.hostname, ip: CurrentComp.ip});
	/*
	if (CurrentComp !== null) {
		if (CheckPorts()) {
			HackedComps.push({name: CurrentComp.hostname, ip: CurrentComp.ip});
		} else {
			AppendTerminal("Crack Incomplete - Required number of ports have not been opened.");
			CompleteAppends();
		}
	} else {
		AppendTerminal("Crack Impossible - Not connected!");
		CompleteAppends();
	}*/
}

function UnlockPort(TargetPort) {
	if (TargetPort != "pword") {
		var Successful = false;
		for (i = 0; i < ConnectedPorts.length; i++) {
			if (ConnectedPorts[i].portNo == TargetPort) {
				Successful = true;
				ConnectedPorts[i].portStatus = "opened";
				RefreshPortsOutput(ConnectedPorts, false);
				break;
			}
		}
		if (CheckPorts() && CurrentWhitelist !== null) {
			CrackedWhitelists.push(CurrentWhitelist);
			AppendTerminal("\n ----- Whitelist Exploit Successful! ----- ");
			document.getElementById("lvlReadout").innerHTML = CrackedWhitelists.length;
			//Disconnect();
		}
		CompleteAppends();
		return Successful;
	} else {
		UnlockComp();
	}
}

function CheckPorts() {
	var Unlocked = 0;
	var Total = 0;
	for (i = 0; i < ConnectedPorts.length; i++) {
		console.log(ConnectedPorts[i]);
		if (ConnectedPorts[i].portStatus == "opened") {
			Unlocked += 1;
		}
		Total += 1;
	}
	if (Unlocked === Total && Total > 0) {
		return true;
	} else {
		return false;
	}
}


	