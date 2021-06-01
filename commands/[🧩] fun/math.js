const { create, all } = require('mathjs');
const math = create(all);

const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'math',
	category: '[🧩] fun',
	description: 'Math functions',
	example: `${bot_prefix}math <expressions>`,
	usage: '<expressions>',
	run: async (client, message, args) => {

		if (!args[0]) return message.channel.send(`**${message.author.username}**, Please enter an expressions!`);
		const limitedEvaluate = math.evaluate;
		math.require({
			createUnit: function() { throw new Error('Function createUnit is disabled'); },
			parse: function() { throw new Error('Function parse is disabled'); },
			simplify: function() { throw new Error('Function simplify is disabled'); },
			derivative: function() { throw new Error('Function derivative is disabled'); } },
		{ override: true });

		const argument = args.join(' ');
		const result = limitedEvaluate(argument);
		message.channel.send(`📝 ${argument} = **${result}**`);

	},
};