const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const { getMember } = require('../../functions');
const Models = require('../../create-model');

module.exports = {
	name: 'balance',
	aliases: ['bal', 'money', 'cash'],
	category: '[🎩] economy',
	description: 'Shows user balance',
	example: `${bot_prefix}balance [mention | id | username]`,
	usage: '[mention | id | username]',
	run: async (client, message, args) => {

		const user = getMember(message, args.join(' ')).user || message.author;

		const Disable = Models.Disable();
		const Blacklist = Models.Blacklist();
		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Economy = Models.Economy();

		if (!await Disable.findOne({ where: { guildId: message.guild.id } })) {
			await Disable.create({
				guildId: message.guild.id,
			});
		}
		const disable = await Disable.findOne({ where: { guildId: message.guild.id } });

		const warn = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('This command is disabled for this guild')
			.setDescription('This is most likely because this guild has broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();

		if (disable.get('economy') === 1) return message.channel.send(warn);


		if (!await Blacklist.findOne({ where: { userId: message.author.id } })) {
			await Blacklist.create({
				userId: message.author.id,
			});
		}
		const blacklist = await Blacklist.findOne({ where: { userId: message.author.id } });

		const warn1 = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('You have been blacklisted from this command')
			.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();

		if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);


		if (!await Cooldown.findOne({ where: { userId: user.id } })) {
			await Cooldown.create({
				userId: user.id,
			});
		}


		if (!await Inventory.findOne({ where: { userId: user.id } })) {
			await Inventory.create({
				userId: user.id,
			});
		}
		const inventory = await Inventory.findOne({ where: { userId: user.id } });


		if (!await Economy.findOne({ where: { userId: user.id } })) {
			await Economy.create({
				userId: user.id,
			});
		}
		const economy = await Economy.findOne({ where: { userId: user.id } });

		const moneyEmbed = new Discord.MessageEmbed()
			.setAuthor(`${user.username}'s balance`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setColor('YELLOW')
			.setFooter('https://patreon.com/jasminebot', client.user.displayAvatarURL())
			.setDescription(`**Pocket:** <a:JasmineCoins:718067589984551042> ${economy.get('balance').toLocaleString()}\n**Bank:** <a:JasmineCoins:718067589984551042> ${economy.get('bank').toLocaleString()}/${economy.get('totalBank').toLocaleString()}\n**Total:** <a:JasmineCoins:718067589984551042> ${(economy.get('balance') + economy.get('bank')).toLocaleString()}\n**Multiplier:** ${inventory.get('bunny').toFixed(2)}%`);
		message.channel.send(moneyEmbed);
	},
};