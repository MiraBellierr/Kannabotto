const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'sphere',
	description: 'Calculate the volume and surface area of sphere',
	example: `${bot_prefix}sphere <radius>`,
	usage: '<radius>',
	category: '[🧩] fun',
	run: (client, message, args) => {

		if (!args.length) {
			return message.reply('You didn\'t provide radius!\n\n**NOTE**:\n- This command is to calculate the volume and the surface area of sphere using the radius entered by the user\n- This is my first command I created when I started developing this bot.');
		}
		else if (isNaN(args[0])) {
			message.reply('That doesn\'t seem to be a valid number!');
		}
		else if (args.length > 1) {
			message.reply('Please choose only one number!');
		}
		else {
			const radius = Math.round(args[0]);

			const diameter = Math.round(2 * radius);
			const volume = Math.round(1.333 * 3.142 * radius * radius * radius);
			const area = Math.round(4 * 3.142 * radius * radius);

			const embed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle(`Radius is ${args[0]}`)
				.addField('Diameter:', diameter, true)
				.addField('Volume Of Sphere:', volume, true)
				.addField('Surface Area Of Sphere', area, true)
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		}
	},
};