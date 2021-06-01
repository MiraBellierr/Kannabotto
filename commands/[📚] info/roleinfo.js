const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'roleinfo',
	aliases: ['role'],
	category: '[📚] info',
	description: 'Returns role information',
	example: `${bot_prefix}roleinfo <role name>`,
	usage: '<role name>',
	run: async (client, message, args) => {

		const role = args.join(' ');
		if(!role) return message.reply('Specify a role!');
		const gRole = message.guild.roles.cache.get(role) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(role)) || message.mentions.roles.first();
		if(!gRole) return message.reply('Couldn\'t find that role.');


		message.guild.members.fetch().then(members => {
			const memberCount = members.filter(member => member.roles.cache.has(gRole.id)).size;

			const status = {
				false: 'No',
				true: 'Yes',
			};

			const roleemebed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('Role Information')
				.setDescription(`**• ID:** ${gRole.id}\n**• Name:** ${gRole.name}\n**• Mention:** ${gRole}\n**• Hex:** ${gRole.hexColor.toUpperCase()}\n**• Members with this role:** ${memberCount}\n**• Position:** ${gRole.position}\n**• Hoisted status:** ${[gRole.hoist]}\n**• Mentionable:** ${status[gRole.mentionable]}\n**• Managed:** ${status[gRole.managed]}`)
				.setColor('#00ff00')
				.setThumbnail(message.guild.iconURL)
				.setTimestamp()
				.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));

			message.channel.send(roleemebed);
		});
	},
};