function translateWildCards(rawData) {
	var outputData = rawData.replace(/#BINARYLARGE#/gi, generateBinary(1500));
	outputData = outputData.replace(/#BINARYSMALL/gi, generateBinary(700));
	outputData = outputData.replace(/#RANDOMIP4#/gi, generateIP("ipv4"));
	outputData = outputData.replace(/#RANDOMIP6#/gi, generateIP("ipv6"));
	
	return outputData;
}
var tryCount = 0;
/*(function generateIP(ipType){
	var outputIP = "";
	if (ipType.toString().toLowerCase() == "ipv4") {
		for (i = 0; i < 4; i++) {
			outputIP += getRandomInt(0, 255).toString()
			if (i < 3) {
				outputIP += ".";
			}
		}
	} else if (ipType.toString().toLowerCase() == "ipv6") {
		for (i = 0; i < 8; i++) {
			outputIP += getRandomInt(0, 65535).toString(16);
			if (i < 7) {
				outputIP += ":";
			}
		}
	}
	if (nodeIPs.indexOf(outputIP) == -1) {
		tryCount = 0;
		return outputIP;
	} else {
		tryCount++;
		if (tryCount < 4) {
			generateIP(ipType);
		} else {
			return "0000:0000:0000:0000:0000:0000:0000:0000";
		}
	}
}*/

function generateBinary(digitNumber) {
	var binaryData = "";
	for (i = 0; i < digitNumber; i++) { 
		binaryData += getRandomInt(0, 1).toString();
	}
	return binaryData;
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}