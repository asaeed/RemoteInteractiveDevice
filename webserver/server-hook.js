
var app = require('http').createServer(hookHandler),
	spawn = require('child_process').spawn;

app.listen(8081);
console.log("Listening on port 8081");

function hookHandler (req, res) {
	console.log("handle hook");
	var redeploy = spawn('bash', ['pull_and_deploy.sh'], { stdio: 'inherit' });
	//redeploy.stdout.on('data', function(data){console.log('stdout: ' + data)});
	//redeploy.stderr.on('data', function(data){console.log('stderr: ' + data)});
	redeploy.on('exit', function(data){console.log('exit code: ' + data)});
}