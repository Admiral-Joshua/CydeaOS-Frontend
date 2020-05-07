function MainCountdown() {
	var Countdown = 3;
	var Readout = document.getElementById("countReadout");
	var countDownLoop = setInterval(function() {
		if (Countdown > -1) {
			if (Countdown > 0) {
				Readout.innerHTML = Countdown.toString();
			} else {
				Readout.innerHTML = "GO!";
			}
			if (Readout.style.animation.indexOf("count1") != -1) {
				Readout.style.animation = "count2 1s 1";
			} else {
				Readout.style.animation = "count1 1s 1";
			}
			Countdown--;
		} else {
			clearInterval(countDownLoop);
		}
	}, 1000);
}