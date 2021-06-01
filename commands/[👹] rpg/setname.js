const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'setname',
	aliases: ['name', 'sn'],
	description: 'Set a name of your character',
	category: '[👹] rpg',
	example: `${bot_prefix}setname <name>`,
	usage: '<name>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Player = Models.Player();

		const player = await Player.findOne({ where: { userId: user } });

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!player) return message.channel.send(result);
		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}setname <name>\`.`);

		const name = args.join(' ');
		await Player.update({ name: name }, { where: { userId: user } });

		message.channel.send(`**${message.author.username}**, Your character name has been set!`);
	},
};