const { bot_prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'rules',
	description: 'Rules for you when you use Jasmine',
	category: '[✨] utility',
	example: `${bot_prefix}rules`,
	run: async (client, message) => {
		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Jasmine Rules')
			.setColor('RANDOM')
			.setThumbnail(client.user.avatarURL({ dynamic: true }))
			.setDescription(`By using Jasmine, you agree to these rules. If you break any rules, we reserve the right to blacklist you from Jasmine. Use \`${prefixes[message.guild.id]}report\` to report a user that you found is breaking these rules.`)
			.addFields(
				{ name: '**1️⃣ Userbots, spamming, and macros**', value: '------ Userbotting, macros, scripts and anything else used to automate running commands and helping you to solve any puzzles in any games commands are strictly forbidden. On top of this, massive amounts of spam is not allowed and will be punished with the same severity.' },
				{ name: '**2️⃣ Sharing exploits**', value: '------ Sharing exploits/bugs with other users is forbidden. Please report all bugs to staff on Jasmine\'s Support Server (Jasmine Headquarter) so we can fix it as soon as possible.' },
				{ name: '**3️⃣ Coins storage account/farming account**', value: '------ Using "alt" accounts to farm or store coins is forbidden.' },
				{ name: '**4️⃣ Scam, sales, trading**', value: '------ Using bot currency (or any of the bot\'s features) to scam, trade for, or sell anything is forbidden.' },
				{ name: '**5️⃣ Discord TOS and guidelines**', value: '------ The Discord TOS and Discord Community Guidelines also are enforcable through our bot.' },
			)
			.setTimestamp();

		message.channel.send(embed);
	},
};