var exec = require('child_process').exec;

function run(cmd)
{
	cmd = 'node run.js "' + cmd.replace(/"/g, '\\"') + '"';
	exec(cmd, function(error, stdout, stderr)
	{
		stdout = stdout.trim();
		stderr = stderr.trim();
		if (stderr !== '')
		{
			stderr = stderr.split('\n')[3];
			console.log(stderr);
		}
		else
		{
			console.log(stdout);
		}
	});
}

setInterval(function()
{
	run('function test(x) { return  * x; }; test(4)');
}, 1000);