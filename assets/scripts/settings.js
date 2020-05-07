var MusicVolumeInput = document.getElementById("musicVol");
var SfxVolumeInput = document.getElementById("sfxVol");

function TempModify() {
	document.getElementById("musicVolOut").innerHTML = MusicVolumeInput.value;
	document.getElementById("sfxVolOut").innerHTML = SfxVolumeInput.value;
	Music1.volume = MusicVolumeInput.value;
	Music2.volume = MusicVolumeInput.value;
}
function TempModify2() {
	document.getElementById("musicVolOut").innerHTML = MusicVolumeInput.value;
	document.getElementById("sfxVolOut").innerHTML = SfxVolumeInput.value;
	Music1.volume = MusicVolumeInput.value;
	Music2.volume = MusicVolumeInput.value;
	MusicVolume = MusicVolumeInput.value;
	SfxVolume = SfxVolumeInput.value;
	setTimeout(function() {
		PlaySFX("resources/audio/IncomingConn.wav");
	}, 150);
}


function ApplyAudioChanges() {
	localStorage.setItem("musicVol", MusicVolumeInput.value);
	localStorage.setItem("sfxVol", SfxVolumeInput.value);
	//document.getElementById("settingsMenu").innerHTML += '<p class="inputLbl changesSaved">Changes Saved!</p>';
	LoadSettings();
	alert("Changes Saved!");
	HideSettings();
	/*setTimeout(function() {
		var ElementsToRemove = document.getElementsByClassName("changesSaved");
		for (i = 0; i < ElementsToRemove.length; i++) {
			ElementsToRemove[i].parentNode.removeChild(ElementsToRemove[i]);
		}
	}, 2500);*/
}

var SettingsMenu = document.getElementById("settingsMenu");

function HideSettings() {
	SettingsMenu.style.animation = "notify-close 2s forwards";
	setTimeout(function() {
		SettingsMenu.style.display = "none";
		document.getElementById("settingsLink").onclick = function() {
			ShowSettings();
		};
	}, 1800);
	ShowMainMenu();
}

function ShowSettings() {
	HideMainMenu();
	RefreshAccSettings();
	ShowInputForm("passwordChange");
	setTimeout(function() {
		SettingsMenu.style.animation = "notify-open 2s forwards";
		SettingsMenu.style.display = "block";
		setTimeout(function() {
			document.getElementById("settingsLink").onclick = function() {
				HideSettings();
			};
		}, 1800);
	}, 1200);
}

function ShowInputForm(TargetID) {
	var TargetForm = document.getElementById(TargetID);
	document.getElementById("passwordChange").style.animation = "fade-out 1s forwards";
	document.getElementById("emailChange").style.animation = "fade-out 1s forwards";
	document.getElementById("usernameChange").style.animation = "fade-out 1s forwards";
	setTimeout(function() {
		document.getElementById("usernameChange").style.display = "none";
		document.getElementById("passwordChange").style.display = "none";
		document.getElementById("emailChange").style.display = "none";
		setTimeout(function() {
			TargetForm.style.display = "block";
			TargetForm.style.animation = "fade-in 2s forwards";
		}, 125);
	}, 850);
	if (TargetID.indexOf("password") !== -1) {
		document.getElementById("nav1").className = "navLink-selected";
		document.getElementById("nav2").className = "navLink";
		document.getElementById("nav3").className = "navLink";
	} else if (TargetID.indexOf("email") !== -1) {
		document.getElementById("nav1").className = "navLink";
		document.getElementById("nav2").className = "navLink";
		document.getElementById("nav3").className = "navLink-selected";
	} else if (TargetID.indexOf("user") !== -1) {
		document.getElementById("nav1").className = "navLink";
		document.getElementById("nav2").className = "navLink-selected";
		document.getElementById("nav3").className = "navLink";
	}
}

function submitNewUsername() {
	var OldPass = document.getElementById("usernameInputChange2").value;
	var NewUser = document.getElementById("usernameInputChange").value;
	socket.emit("loginReq", {type: "updateUser", username: CurrentAccount, password: OldPass, newUser: NewUser});
}

function submitNewPassword() {
	var OldPass = document.getElementById("passwdInputChange").value;
	var NewPass = document.getElementById("passwdInputChange2").value;
	var NewPass2 = document.getElementById("passwdInputChange3").value;
	if (NewPass !== NewPass2) {
		alert("Password Change Failed - Your new passwords do not match!");
	} else {
		socket.emit("loginReq", {type: "updatePass", username: CurrentAccount, password: OldPass, newPass: NewPass});
	}
}

function submitNewEmail() {
	var OldPass = document.getElementById("emailInputChange2").value;
	var NewEmail = document.getElementById("emailInputChange").value;
	if (NewPass !== NewPass2) {
		alert("Password Change Failed - Your new passwords do not match!");
	} else {
		socket.emit("loginReq", {type: "updateEmail", username: CurrentAccount, password: OldPass, newMail: NewPass});
	}
}

var CurrentAccount = sessionStorage.getItem("activeUser");

function RefreshAccSettings() {
	//document.getElementById("notLoggedIn").style.display = "block";
	//document.getElementById("notLoggedIn").innerHTML = "<br/><br/><br/><br/>Under Construction...";
	
	CurrentAccount = sessionStorage.getItem("activeUser");
	
	
	if (CurrentAccount === "" || CurrentAccount === null) {
		document.getElementById("notLoggedIn").style.display = "block";
		document.getElementById("accNameSetHeader").innerHTML = "";
	} else {
		document.getElementById("notLoggedIn").style.display = "none";
		document.getElementById("accNameSetHeader").innerHTML = CurrentAccount;
		socket.emit("loginReq", {type: "getImage", username: CurrentAccount.toString(), source: "settings"});
	}
}

function ShowIconUpdatePage() {
	//HideMainMenu();
	HideSettings();
	setTimeout(function() {
		window.location.href = "set-icon.html";
	},  1100);
}

socket.on("loginRes", function(msg) {
	console.log(msg);
	if (msg.type == "imageRes" && msg.source === "settings") {
		document.getElementById("settingsIcon").src = msg.imageSrc;
	}
});

/*function ToggleSettings() {
	if (SettingsMenu.style.animation.indexOf("notify-close") === -1 || SettingsMenu.style.display !== "none") {
		HideSettings();
	} else {
		ShowSettings();		
	}
}
ToggleSettings();*/