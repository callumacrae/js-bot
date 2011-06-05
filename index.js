var exec = require('child_process').exec,
	IRC = require('irc'),
	config = require('./config');

irc = new IRC(config);

irc.on(/^:([^ !]+)![^!@]+@[^@ ]+ PRIVMSG (#[^ ]+) :js> (.+)$/, function(info)
{
	run(info[1], info[2], info[3]);
})

function run(nick, chan, cmd)
{
	cmd = 'node run.js "' + cmd.replace(/"/g, '\\"') + '"';
	exec(cmd, function(error, stdout, stderr)
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

		irc.raw('PRIVMSG ' + chan + ' :' + nick + ': ' + output);
	});
}