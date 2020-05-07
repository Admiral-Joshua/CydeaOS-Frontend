var end = new Date(Date.UTC(2018, 3, 1));
var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining() {
	var now = new Date();
	var nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var distance = end - nowUTC;
	var distance = end - nowUTC;
	if (distance < 0) {

		clearInterval(timer);
		document.getElementById('countdown-output').innerHTML = 'Welcome to CydeaOS!';
		setTimeout(function() {
			window.location.replace("index.html");
		}, 1500);
		return;
	}
	var days = Math.floor(distance / _day);
	var hours = Math.floor((distance % _day) / _hour);
	var minutes = Math.floor((distance % _hour) / _minute);
	var seconds = Math.floor((distance % _minute) / _second);
	
	var secondString = "";
	if (seconds > 9) {
		secondString = seconds.toString();
	} else {
		secondString = "0" + seconds.toString();
	}
	
	setTimeout(function() {
		// document.getElementById("countdown-output").innerHTML = "<em id='timeDial1' class='timeDial'>" + days.toString() + "</em>" + ":" + "<em id='timeDial2' class='timeDial'>" + hours.toString() + "</em>" + ':' + "<em id='timeDial3' class='timeDial'>" + minutes.toString() + "</em>" + ":" + "<em id='timeDial4' class='timeDial'>" + secondString + "</em>";
		document.getElementById("timeDial1").innerHTML = days.toString();
		document.getElementById("timeDial2").innerHTML = hours.toString();
		document.getElementById("timeDial3").innerHTML = minutes.toString();
		document.getElementById("timeDial4").innerHTML = secondString;
	}, 150);
	
	var timerOutput;
	var animationElements = [];
	
	animationElements.push("timeDial4");

	if (seconds === 59) {
		//timerOutput = document.getElementById("timeDial3");
		animationElements.push("timeDial3");
	}
	if (seconds === 59 && minutes === 0) {
		//timerOutput = document.getElementById("timeDial2");
		animationElements.push("timeDial2");
	}
	if (minutes === 0 && hours === 23) {
		//timerOutput = document.getElementById("timeDial1");
		animationElements.push("timeDial1");
	}
	
	for (i=0; i < animationElements.length; i++) {
		animateElement(animationElements[i].toString(), "0");		
	}
}

function animateElement(elementName, delay) {
	var timerOutput = document.getElementById(elementName);
	if (timerOutput.style.animation.indexOf("time-tick1") > -1) {
		timerOutput.style.animation = "time-tick2 .5s " + delay.toString() + "s forwards";
	} else {
		timerOutput.style.animation = "time-tick1 .5s " + delay.toString() + "s forwards";
	}
}

function initialAnimation() {
	elementNames = ['timeDial1','timeDial2','timeDial3','timeDial4'];
	for (i=0; i < elementNames.length; i++) {
		animateElement(elementNames[i], ".8");
	}
}
initialAnimation();

timer = setInterval(showRemaining, 1000);