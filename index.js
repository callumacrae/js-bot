var exec = require('child_process').exec,
	IRC = require('irc'),
	config = require('./config');

if (process.argv[2])
{
	config.server.addr = process.argv[2];
}
if (process.argv[3])
{
	config.chans = [process.argv[3]];
}
if (process.argv[4])
{
	config.user.nick = process.argv[4];
}

irc = new IRC(config);

irc.on(/^:([^ !]+)![^!@]+@[^@ ]+ PRIVMSG (#[^ ]+) :js> (.+)$/, function(info)
{
	run(info[1], info[2], info[3]);
})

function run(nick, chan, cmd)
{
	cmd = 'node run.js "' + cmd.replace(/"/g, '\\"') + '"';
	exec(cmd, {timeout: 4000}, function(error, stdout, stderr)
	{
		stderr = stderr.trim();
		if (stderr !== '')
		{
			stderr = stderr.split('\n')[3];
			var output = stderr;
		}
		else
		{
			var output = stdout.trim();
		}

		if (error && error.signal === 'SIGTERM')
		{
			var output = 'Maximum execution time exceeded.';
		}

		irc.raw('PRIVMSG ' + chan + ' :' + nick + ': ' + output);
	});
}