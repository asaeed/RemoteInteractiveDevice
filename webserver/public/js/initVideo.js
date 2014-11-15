
// Show loading notice
var canvas = document.getElementById('videoCanvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#444';
ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);

// Setup the WebSocket connection and start the player
var client = new WebSocket( 'ws://livestream.labsmb.com:8084/' );
var player = new jsmpeg(client, {canvas:canvas});