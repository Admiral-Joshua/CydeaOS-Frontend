function openWindow(windowname) {
    //var containerElement = document.getElementsByClassName(windowname + "-container")[0];
	var containerElement = document.getElementById(windowname);
    if (containerElement != null) {
		console.log(containerElement.childNodes);
        var targetWindow = containerElement.childNodes[0];
        targetWindow.style.display = "block";
        targetWindow.style.animation = "open-window 0.8s forwards";
        var targetContents = targetWindow.childNodes[0];
        setTimeout(function() {
            targetContents.style.display = "block";
            targetContents.style.animation = "fade-in .5s forwards";
        }, 500);
        //console.log(containerElement.childNodes[1]);
    }
}

//activeWindowColor = "rgb(10, 40, 70)";
//inactiveWindowColor = "rgb(20, 20, 22)";

var windowReadout = document.getElementById("activeWindowReadout");

function makeActive(windowId) {
	//console.log("make active called on window with id: '" + windowId + "'");
	if (windowId.indexOf("window") != -1) {
		for (let window of windows) {
			if (window.id == windowId) {
				//console.log(window.domObject.childNodes[0]);
				window.domObject.childNodes[0].style.backgroundColor = "var(--game-active-window)";
				if (windowId != "none" && windowReadout.innerHTML.indexOf(window.title) == -1) {
					changeMainTitle("CydeaOS - " + window.title);
				}
			} else {
				window.domObject.childNodes[0].style.backgroundColor = "var(--game-inactive-window)";
			}
		}
	}
	if (windowId == "none" && windowReadout.innerHTML.indexOf("CydeaOS - ") != -1) {
		changeMainTitle("CydeaOS")
	}
}



function changeMainTitle(newText) {
	
	windowReadout.style.animation = "fade-out .2s forwards";
	setTimeout(function() {
		windowReadout.innerHTML = newText;
		windowReadout.style.animation = "fade-in .2s forwards";
	}, 200);
}

var lastMousePos = {x: 0, y: 0};

/*function updateWindowMove(windowId, e) {
	if (windowId.indexOf("window") != -1) {
		for (let window of windows) {
			if (window.id == windowId) {
				if (window.move == true) {
					let deltaX = e.clientX - lastMousePos.x;
					let deltaY = e.clientY - lastMousePos.y;
					if ((deltaX != 0) && (deltaY != 0)) {
						//console.log(window);
						//console.log(window.domObject);
						let windowNewX = parseInt(window.domObject.style.left.replace("px", "")) + deltaX;
						let windowNewY = parseInt(window.domObject.style.top.replace("px", "")) + deltaY;
						window.domObject.style.left = windowNewX.toString() + "px";
						window.domObject.style.top = windowNewY.toString() + "px";
						lastMousePos.x = e.clientX;
						lastMousePos.y = e.clientY;
					}
				}
			}
		}
	}
}*/

function updateWindowMove(e) {
	for (let window of windows) {
		if (window.move == true) {
			let deltaX = e.clientX - lastMousePos.x;
			let deltaY = e.clientY - lastMousePos.y;
			if ((deltaX != 0) && (deltaY != 0)) {
				//console.log(window);
				//console.log(window.domObject);
				let windowNewX = parseInt(window.domObject.style.left.replace("px", "")) + deltaX;
				let windowNewY = parseInt(window.domObject.style.top.replace("px", "")) + deltaY;
				window.domObject.style.left = windowNewX.toString() + "px";
				window.domObject.style.top = windowNewY.toString() + "px";
				lastMousePos.x = e.clientX;
				lastMousePos.y = e.clientY;
			}
		}
	}
}

//var activeWindow = "countdown";

var windows = [{id: "countdown-1", domObject: document.getElementById("countdown"), active: true}];

function closeWindow(windowId) {
	for (i = 0; i < windows.length; i++) {
		if (windows[i].id == windowId) {
			let containerElement = windows[i].domObject;
			var targetWindow = containerElement.childNodes[0];
			var targetContents = targetWindow.childNodes[0];
			targetContents.style.animation = "fade-out .5s forwards";
			setTimeout(function() {
				targetContents.style.display = "none";
				targetWindow.style.animation = "close-window .8s forwards";
				setTimeout(function() {
					targetWindow.style.display = "none";
					windows[i].domObject.parentNode.removeChild(windows[i].domObject);
					windows.splice(i, 1);
					//containerElement.parentNode.removeChild(containerElement);
				}, 500);
			}, 250);
			//console.log(containerElement.childNodes[1]);
			
			break;
		}
	}
	makeActive("none");
}

function enableWindowMove(windowId, e) {
	for (let window of windows) {
		if (window.id == windowId) {
			window.move = true;
		} /*else {
			window.move = false;
		}*/
	}
	lastMousePos.x = e.clientX;
	lastMousePos.y = e.clientY;
}
function disableWindowMove(windowId) {
	for (let window of windows) {
		if (window.id == windowId) {
			window.move = false;
		}
	}
}

document.onmousemove = function(e) {
	updateWindowMove(event);
	e.handled = true;
};
document.getElementsByClassName("background-container")[0].onclick = function() { //
	makeActive("none");
};

function createWindowContent(contentType, windowId) {
	//Window Contents
	let windowContents = document.createElement("div");
	windowContents.className = "windowContents";
	
	//Titlebar
	let titlebar = document.createElement("p");
	titlebar.className = "titlebar";
	windowContents.appendChild(titlebar);
	
	titlebar.onmousedown = function(e) {
		enableWindowMove("window-" + windowId, event);
		e.handled = true;
	};
	titlebar.onmouseup = function(e) {
		disableWindowMove("window-" + windowId);
		e.handled = true;
	};
	/*titlebar.onmousemove = function() {
		updateWindowMove("window-" + windowId, event);
	};*/
	
	let closeButton = document.createElement("p");
	closeButton.className = "closeButton";
	closeButton.innerHTML = "X";
	closeButton.onclick = function() {
		closeWindow("window-" + windowId);
	};
	windowContents.appendChild(closeButton);
	
	if (contentType == "terminal") {
		titlebar.innerHTML = "Terminal";
		/*titlebar.onmousedown = function() {
			startWindowMove(windows[windows.length - 1], event);
		};*/
		
		//Terminal Contents
		let consoleForm = document.createElement("form");
		consoleForm.id = "console-form-" + windowId.toString();
		consoleForm.className = "terminal-console-form";
		let consoleInput = document.createElement("textarea");
		consoleInput.id = "consoleInput-" + countWindowOfType("terminal");
		consoleInput.className = "consoleInput";
		consoleInput.spellcheck = false;
		consoleInput.value = "Terminal>";
		let consoleSubmit = document.createElement("input");
		consoleSubmit.type = "submit";
		consoleSubmit.className = "invisible";
		
		// Handling Terminal Events
		// The key down event on a terminal's console.
		consoleInput.onkeydown = function(event) {
			handleTerminalInput(this, event);
		};
		// The submit event occured when the user hits the enter key in the console.
		consoleForm.submit = function() {
			/*event.preventDefault();
			event.stopPropagation();*/
			var lastLine = this.childNodes[0].value.split("\n");
			lastLine = lastLine[lastLine.length - 1];
			ProcessCommand(this, lastLine);
			return false;
		};
		
		
		
		//Populate form + window contents
		consoleForm.appendChild(consoleInput);
		consoleForm.appendChild(consoleSubmit);
		windowContents.appendChild(consoleForm);
	} else if (contentType == "file-browser") {
		titlebar.innerHTML = "File Browser";
		
		//File Browser Contents
		let filesContainer = document.createElement("div");
		filesContainer.id = "files-container-" + windowId.toString();
		
	} else if (contentType == "web browser") {
		titlebar.innerHTML = "Web Browser";
		
		// Web Browser Contents
		let webContent = document.createElement("div");
		webContent.id = "web-content-" + windowId.toString();
		
		let webBrowser = document.createElement("iframe");
		//webBrowser.src = "data:text/html;charset=utf-8,%3Ch1$3EHello%20from%20the%web%20browser$3Ch1$3E";
		webBrowser.srcdoc = "<html><body><h2 style='color: white;'>CydeaOS Greets you from the web browser (BETA)</h2></body></html>";
		webBrowser.className = "webBrowser-actual";
		
		// Populate our web viewer
		webContent.appendChild(webBrowser);
		
		// Populate the Window
		windowContents.appendChild(webContent);
	}
	
	return windowContents;
}

function createWindow(contentsType) {
	let newWindowId = windows.length.toString();
	
	//container element
	
	let windowContainer = document.createElement("div");
	windowContainer.className = "terminal-container";
	windowContainer.onmouseenter = function() {
		makeActive("window-" + newWindowId);
	};
	// Assign default size and position.
	windowContainer.style.width = "580px";
	windowContainer.style.height = "340px";
	windowContainer.style.left = (500 + (10 * windows.length)).toString() + "px";
	windowContainer.style.top = (400 + (8 * windows.length)).toString() + "px";
	//Assign ID value
	windowContainer.id = "window-" + newWindowId.toString();
	
	//gameWindow (the coloured backdrop)
	let gameWindow = document.createElement("div");
	gameWindow.className = "gameWindow activeWindow";
	
	let windowContents = createWindowContent(contentsType, newWindowId);
	
	//Populate the gameWindow
	gameWindow.appendChild(windowContents);
	
	//Populate the container
	windowContainer.appendChild(gameWindow);
	
	// Add completed terminal to the body
	document.body.appendChild(windowContainer);
	
	let newWindowObj = {
		id: "window-" + newWindowId,
		title: capitalizeFirstLetter(contentsType),
		active: true,
		move: false,
		domObject: windowContainer
	}
	
	console.log("TERMINALS CHILD NODES ARE ");
	console.log(newWindowObj.domObject.childNodes);
	
	if (contentsType == "terminal") {
		newWindowObj.CommandHistory = [];
		newWindowObj.HistoryPointer = 0;
		newWindowObj.terminalActual = newWindowObj.domObject.childNodes[0].childNodes[0].childNodes[2].childNodes[0];
	}
	
	// Add this window to our little list...
	windows.push(newWindowObj);
	
	openWindow(windowContainer.id);
	makeActive(newWindowId);
	
	if (appDrawer.style.display == "block") {
		toggleAppsDrawer();
	}
}



/*function createNewTerminal() {
	 HTML CODE FOR FOR A TERMINAL
	<div class="terminal-container">
		<div class="gameWindow activeWindow">
			<div class="windowContents terminalContents">
				<p class="terminal-title titlebar">Terminal</p>
				<form id="terminalProcessor">
					<!--onKeyUp="releaseTerminalKey(event)" onKeyDown="handleTerminalKey(event)"-->
					<textarea autocomplete="off" autocorrect="off" autocapitalize="off" onKeyDown="handleTerminalInput(event)" spellcheck="false" id="terminal1">Terminal></textarea>
					<input type="submit" class="invisible" />
				</form>
			</div>
		</div>
	</div>
	
	
	//terminal container
	let terminalContainer = document.createElement("div");
	terminalContainer.className = "terminal-container";
	// Assign default size and position.
	terminalContainer.style.width = "580px";
	terminalContainer.style.height = "400px";
	terminalContainer.style.left = "350px";
	terminalContainer.style.top = "400px";
	//Assign ID value
	terminalContainer.id = "terminal-" + countWindowOfType("terminal");
	
	//gameWindow (the coloured backdrop)
	let gameWindow = document.createElement("div");
	gameWindow.className = "gameWindow activeWindow";
	
	//Window Contents
	let windowContents = document.createElement("div");
	windowContents.className = "windowContents";
	
	//Titlebar
	let titlebar = document.createElement("p");
	titlebar.className = "titlebar";
	titlebar.innerHTML = "Terminal";
	titlebar.onmousedown = function() {
		startWindowMove(windows[windows.length - 1], event);
	};
	
	//Terminal Contents
	let consoleInput = document.createElement("textarea");
	consoleInput.id = "consoleInput-" + countWindowOfType("terminal");
	consoleInput.className = "consoleInput";
	let consoleSubmit = document.createElement("input");
	consoleSubmit.type = "submit";
	consoleSubmit.className = "invisible";
	
	//Populate window contents
	windowContents.appendChild(titlebar);
	windowContents.appendChild(consoleInput);
	windowContents.appendChild(consoleSubmit);
	
	//Populate the gameWindow
	gameWindow.appendChild(windowContents);
	
	//Populate the container
	terminalContainer.appendChild(gameWindow);
	
	// Add completed terminal to the body
	document.body.appendChild(terminalContainer);
	
	// Add this window to our little list...
	windows.push({type: "terminal",
	active: true,
	domObject: terminalContainer,
	positionX: 350,
	positionY: 400,
	sizeX: 580,
	sizeY: 450,
	moving: false});
	
	openWindow(terminalContainer.id);
}*/

var oldMousePos;

function startWindowMove(targetWindow, e) {
	//console.log(targetId);
	console.log(targetWindow);
	console.log(e);

	
	
	/*let targetElement = document.getElementById(targetId);
	if (targetElement != null) {
		oldMousePos = [e.clientX, e.clientY];
	}*/
}

function moveWindow() {
	
}

function countWindowOfType(type) {
	let count = 0;
	for (let window of windows) {
		if (window.type == type) {
			count += 1;
		}
	}
	return count;
}


function updateWindows() {
	
}