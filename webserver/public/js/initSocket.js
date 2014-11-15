
//var socket = io.connect('http://node.labsmb.com:8080');
var socket = io.connect();

socket.on('connect', function () {
	socket.emit('init', { my: 'data' });
});

socket.on('controls', function(data) {
	console.log(data);
	for(var item in data) { 
		controls[item].value(data[item]);
	}
});

socket.on('sensors', function(data) {
	console.log(data);
	for(var item in data) { 
		sensors[item].value(data[item]);
		//$("#motion-gauge").data("kendoRadialGauge").value(10);
	}
});

socket.on('timer', function(data) {
	//console.log(data);
	if (data.clientsAhead == 0)
		document.getElementById('timeLeft').innerHTML = 'Timeout in: ' + data.timeLeft;
	else
		document.getElementById('timeLeft').innerHTML = 'Wait time: ' + ((data.clientsAhead - 1) * data.timePerClient + data.timeLeft);
	document.getElementById('clientsAhead').innerHTML = 'Users ahead: ' + data.clientsAhead;
	
	// enable/disable controls according to timer data
	if (data.clientsAhead == 0) {
		for (var item in controls)
			controls[item].enable(true);
	} else {
		for (var item in controls)
			controls[item].enable(false);
	}
});