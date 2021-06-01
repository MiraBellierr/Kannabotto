const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'eval',
	aliases: ['e'],
	description: 'Evaluates the code you put in',
	example: `${bot_prefix}eval <code to eval>`,
	usage: '<code to eval>',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') {
			return message.channel.send('You\'re not the owner of me!!')
				.then(m => m.delete(5000));
		}

		if (!args[0]) {
			message.channel.send('You need to evaluate _**SOMETHING**_, please?')
				.then(m => m.delete(5000));
		}
		const clean = text => {
			if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
			else {return text;}
		};
		try {
			const code = args.join(' ');
			let evaled = eval(code);

			if (typeof evaled !== 'string') {evaled = require('util').inspect(evaled);}

			message.channel.send(clean(evaled), { split: true, code:'xl' });
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	},
};