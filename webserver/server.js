
var connect = require('connect');
var app = connect().use(connect.static(__dirname + '/public'));
var server = app.listen(8080);
var io = require('socket.io').listen(server);
io.set('log level', 1);

var clients = [];
var robot = {};
var timePerClient = 50;
var timeLeft = 0;
var latestXSlider = {xSlider: 0};
var latestYSlider = {ySlider: 0};

io.sockets.on('connection', function (socket) {
	socket.on('init', function (data) {
		// figure out if this connection is robot or client.
		if (data.type == 'robot') {
			robot = this;
			console.log('connect robot: ' + data.ip);
		} else {
			// add new client
			clients.push(this);
			
			// send it latest control data
			socket.emit('controls', latestXSlider);
			socket.emit('controls', latestYSlider);
			
			// if it's the first client, give it control and start its timer
			if (this == clients[0]) {
				timeLeft = timePerClient;
			}
		}
	}); 

	socket.on('controls', function(data) {
		// if the message is from the robot or first-in-line client, emit
		if (this == robot || this == clients[0]) {
			console.log(data);
			
			if ('xSlider' in data) latestXSlider = data;
			if ('ySlider' in data) latestYSlider = data;
			
			socket.broadcast.emit('controls', data);
		}
	});
	
	socket.on('sensors', function(data) {
		// if sensor data received from robot, emit to clients
		if (this == robot) {
			console.log(data);
			socket.broadcast.emit('sensors', data);
		}
	});
	
	socket.on('disconnect', function() {
		if (this == clients[0]) {
			timeLeft = timePerClient;
		} 

		clients.splice(clients.indexOf(socket), 1);
		console.log('disconnect browser, total: ' + clients.length);
	});
});

function setTimer() {
	setTimeout(function() { setTimer(); }, 1000);
	if (clients.length == 0) return;
	//console.log("timer: " + timeLeft);
	
	// notify clients of time remaining
	for (var i = 0; i < clients.length; i++) {
		clients[i].emit('timer', { 'timeLeft': timeLeft, 'clientsAhead': i, 'timePerClient': timePerClient });
	}
	
	if (timeLeft == 0) {
		// kick user (unless it's the last user)
		if (clients.length != 1)
			clients[0].disconnect(true);
		
		// instead - move user to the back of the queue
		//timeLeft = timePerClient;
		//clients.push(clients[0]);
		//clients.splice(0, 1);
	} else {
		// count down
		timeLeft--;
	}
}

setTimer();
