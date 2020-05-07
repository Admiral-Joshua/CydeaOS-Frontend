
var AnalysisMenu = document.getElementById("compAnalysis");

var analysisOutput = document.getElementById("analysisProcess");
var scanImg = document.getElementById("scanImg");
var analysisTxt1 = document.getElementById("analysisText");

var resultsOutput = document.getElementById("resultData");
var portsContainer = document.getElementById("portsContainer");

function hideNmap() {
	//AnalysisMenu.style.animation = "fade-out 1s forwards";
	
	setTimeout(function() {
		AnalysisMenu.style.display = "none";
		analysisOutput.style.display = "none";
		resultsOutput.style.display = "none";
	}, 200);
}

function LoadAnalysis() {
	hideNmap();
	analysisTxt1.innerHTML = "Analysing System...";
	setTimeout(function() {
		//AnalysisMenu.style.display = "block";
		//AnalysisMenu.style.animation = "notify-open 1s forwards";
		DisplayStatus = "secAnalysis";
		RefreshDisplay();
	}, 300);
	setTimeout(function() {
		analysisOutput.style.display = "block";
		scanImg.style.animation = "img-zoom-in 1s forwards";
		analysisTxt1.style.display = "block";
		analysisTxt1.style.animation = "fade-in 1s forwards";
	}, 500); 
	setTimeout(function() {
		CompleteAnalysis();
	}, 6500);
}

function CompleteAnalysis() {
	scanImg.style.animation = "img-zoom-out 1s forwards";
	analysisTxt1.innerHTML = "Analysis Complete!";
	setTimeout(function() {
		analysisTxt1.style.animation = "fade-out 1s forwards";
		setTimeout(function() {
			analysisOutput.style.display = "none";
			resultsOutput.style.animation = "fade-in 1s forwards";
			resultsOutput.style.display = "block";
		}, 1000);
	}, 900);
	
	setTimeout(function() {
		RefreshPortsOutput(ConnectedPorts, true);
	}, 1500);
}

function RefreshPortsOutput(PortArray, animate) {
	portsContainer.innerHTML = "";
	for (i = 0; i < PortArray.length; i++) {
		var portOutput = document.createElement("p");
		if (animate) {
			portOutput.style.opacity = "0";
			portOutput.style.animation = ("fade-in .5s " + (i / 2).toString() + "s forwards").toString();
		} else {
			portOutput.style.opacity = "1";
		}
		if (PortArray[i].portStatus == "opened") {
			portOutput.className = "portReadout unlocked";
			portOutput.innerHTML = " Port#" + PortArray[i].portSvc.toString() + " - " + PortArray[i].portNo.toString() + ' <em class="portSmallTxt">		-OPND</em>';		
		} else {
			portOutput.className = "portReadout locked";
			if (PortArray[i].portSvc.indexOf("BTrnt") != -1) {
				portOutput.innerHTML = " Port#" + PortArray[i].portSvc.toString() + " - " + PortArray[i].portNo.toString() + ' <em class="portSmallTxt">	-LCKD</em>';		
			} else {
				portOutput.innerHTML = " Port#" + PortArray[i].portSvc.toString() + " - " + PortArray[i].portNo.toString() + ' <em class="portSmallTxt">		-LCKD</em>';		
			}
		}
		portsContainer.appendChild(portOutput);
	}
}

var KnownPorts = [
	{SvcName: "SSH", SvcNo: "22"},
	{SvcName: "DNS", SvcNo: "53"},
	{SvcName: "BTrnt", SvcNo: "6008"},
	{SvcName: "SQL", SvcNo: "1443"},
	{SvcName: "SMTP", SvcNo: "25"},
	{SvcName: "DHCP", SvcNo:"546"},
	{SvcName: "FTP", SvcNo: "21"}
];

function LoadPorts(ReceivedPortArray) {
	var NewPortArray = [];
	
	for (i=0; i < ReceivedPortArray.length; i++) {
		var PortFound = false;
		for (x=0; x < KnownPorts.length; x++) {
			if (KnownPorts[x].SvcNo == ReceivedPortArray[i]) {
				NewPortArray.push({portNo: ReceivedPortArray[i], portSvc: KnownPorts[x].SvcName, portStatus: "locked"});
				var PortFound = true;
				break;
			}
		}
		if (PortFound == false) {
			NewPortArray.push({portNo: ReceivedPortArray[i], portSvc: "N/A", portStatus: "locked"});
		}
	}
	return NewPortArray;
}

function GeneratePorts(NumOfPorts) {
	var PossiblePorts = [{SvcName: "SSH", SvcNo: "22"},
		{SvcName: "DNS", SvcNo: "53"},
		{SvcName: "BTrnt", SvcNo: "6008"},
		{SvcName: "SQL", SvcNo: "1443"},
		{SvcName: "SMTP", SvcNo: "25"},
			{SvcName: "DHCP", SvcNo:"546"}];
	var NewPortArray = [];
	if (NumOfPorts > PossiblePorts.length - 1) {
		NumOfPorts = PossiblePorts.length - 1;
	}
	for (i=0; i < NumOfPorts; i++) {
		var IndexNo = Math.floor(Math.random() * (PossiblePorts.length - 1));
		NewPortArray.push({portNo: PossiblePorts[IndexNo].SvcNo, portSvc: PossiblePorts[IndexNo].SvcName, portStatus: "locked"});
		PossiblePorts.splice(IndexNo, 1);
	}
	return NewPortArray;
}