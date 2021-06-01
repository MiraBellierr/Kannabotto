const { MessageEmbed } = require('discord.js');
const { getMember } = require('../../functions.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'love',
	aliases: ['affinity'],
	category: '[🧩] fun',
	description: 'Calculates the love affinity you have for another person.',
	example: `${bot_prefix}love [mention | id | username]`,
	usage: '[mention | id | username]',
	run: async (client, message, args) => {
		// Get a member from mention, id, or username
		let person = getMember(message, args.join());

		if (!person || message.author.id === person.id) {
			person = message.guild.members.cache
				.filter(m => m.id !== message.author.id)
				.random();
		}
		const id = parseInt(message.author.id);
		const id2 = parseInt(person.user.id);
		const idPlusid2 = (id + id2).toString();
		const idPlusid2Array = idPlusid2.split('0');
		const multi = '0'.repeat(idPlusid2Array[0].length);
		const plus = '1' + multi;
		const plusint = parseInt(plus);
		const love = (idPlusid2Array[0] / plusint) * 100;
		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '🖤'.repeat(10 - loveIndex);

		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }))
			.setColor('#ffb6c1')
			.addField(`☁ **${person.displayName}** loves **${message.member.displayName}** this much:`,
				`💟 ${Math.floor(love)}%\n\n${loveLevel}`);

		message.channel.send(embed);
	},
};