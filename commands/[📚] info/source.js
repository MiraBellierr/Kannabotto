const beautify = require('beautify');
const { bot_prefix } = require('../../config.json');
const getSource = require('get-source');
module.exports = {
	name: 'source',
	aliases: ['s'],
	description: 'send a source code',
	example: `${bot_prefix}source <path to file>`,
	usage: '<path to file>',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') {
			return message.channel.send('You\'re not the owner of me!!')
				.then(m => m.delete(5000));
		}
		const dir = args[0];
		const file = args[1];
		const dirType = {
			m: '[🛠] moderation',
			meme: '[🤣] meme',
			u: '[✨] utility',
			e: '[🎩] economy',
			g: '[🎮] games',
			l: '[🎮] level',
			i: '[📚] info',
			im: '[📷] image manipulation',
			p: '[📸] picture',
			a: '[🤺] actions',
			f: '[🧩] fun',
			c: '[😷] corona',
			r: '[👹] rpg',
		};
		const source = getSource (`./commands/${dirType[dir]}/${file}.js`);
		message.channel.send(`path: \`${source.path}\`\n\`\`\`js\n${beautify(source.text, { format: 'js' })}\`\`\``, { split: { prepend: `\`\`\`js\n${beautify(message, { format: 'js' })}`, append: '```' } });
	},
};