const Discord = require('discord.js');
const urban = require('urban');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'urban',
	description: 'Send a definition about a word',
	aliases: ['ud'],
	example: `${bot_prefix}urban <word>`,
	category: '[✨] utility',
	usage: '<word>',
	run: (client, message, args) => {
		if (!message.channel.nsfw) return message.channel.send(`**${message.author.username}**, This command only can be used in nsfw channel.`);
		if (!args.length) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}urban <word>\``);

		urban(args).first(json => {

			if (!json) {
				return message.channel.send({
					embed: {
						'description': 'Nothing found :sweat: ',
						'color': 0xFF2222,
					},
				});
			}

			const embed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setColor(0x56aaff)
				.setDescription(json.definition)
				.addField('Example', json.example)
				.addField('Upvotes', json.thumbs_up, true)
				.addField('Downvotes', json.thumbs_down, true)
				.setFooter(`Written by ${json.author}`)
				.setTimestamp()
				.setTitle(json.word);

			message.channel.send(embed);

		});
	},
};