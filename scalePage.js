//window.screen.width.toString() + "x" + window.screen.height.toString()
/*
ScreenResX = window.innerWidth * window.devicePixelRatio;
ScreenResY = window.innerHeight * window.devicePixelRatio;
TargetDocument = document.getElementById("ScaledContent");

var X_Modifier = parseFloat(ScreenResX / 1920, 2).toFixed(4);
var Y_Modifier = parseFloat(ScreenResY / 949, 2).toFixed(4);
//console.log("scale(" + X_Modifier.toString() + ", " + Y_Modifier.toString() + ")");
TargetDocument.style.transform = "scale(" + X_Modifier.toString() + ", " + Y_Modifier.toString() + ")";
*/

ScreenResX = window.screen.width;
ScreenResY = window.screen.height;
// * window.devicePixelRatio;
TargetDocument = document.getElementById("ScaledContent");

var X_Modifier = parseFloat(ScreenResX / 1920, 2).toFixed(5);
var Y_Modifier = parseFloat(ScreenResY / 1080, 2).toFixed(5);
if (X_Modifer < 1 && Y_Modifer < 1) {
	TargetDocument.style.transform = "scale(" + X_Modifier.toString() + ", " + Y_Modifier.toString() + ")";
}