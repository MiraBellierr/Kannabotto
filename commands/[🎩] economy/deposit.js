const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const Models = require('../../create-model');

module.exports = {
	name: 'deposit',
	aliases: ['dep'],
	category: '[🎩] economy',
	description: 'Deposit your money to the bank',
	example: `${bot_prefix}deposit <amount | all>`,
	usage: '<amount | all>',
	run: async (client, message, args) => {
		const user = message.author.id;

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


		if (!await Cooldown.findOne({ where: { userId: user } })) {
			await Cooldown.create({
				userId: user,
			});
		}


		if (!await Inventory.findOne({ where: { userId: user } })) {
			await Inventory.create({
				userId: user,
			});
		}


		if (!await Economy.findOne({ where: { userId: user } })) {
			await Economy.create({
				userId: user,
			});
		}
		const economy = await Economy.findOne({ where: { userId: user } });

		const curSpace = economy.get('totalBank') - economy.get('bank');

		if (args[0] == 'all') {
			if (curSpace === 0) return message.channel.send(`**${message.author.username}**, You don't have any space in your bank for you to deposit.`);
			if(economy.get('balance') <= 0) return message.channel.send(`**${message.author.username}**, You don't have any coins to deposit`);
			const curbal = economy.get('balance');
			if (curSpace > economy.get('balance')) {
				await Economy.update({ bank: economy.get('bank') + economy.get('balance') }, { where: { userId: user } });
				await Economy.update({ balance: 0 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, You have deposited <a:JasmineCoins:718067589984551042> ${curbal.toLocaleString()} into your bank`);

			}
			else {
				await Economy.update({ bank: economy.get('bank') + curSpace }, { where: { userId: user } });
				await Economy.update({ balance: economy.get('balance') - curSpace }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, You have deposited <a:JasmineCoins:718067589984551042> ${curSpace.toLocaleString()} into your bank`);
			}
		}
		else if (isNaN(args[0])) {
			return message.channel.send(`**${message.author.username}**, You have to deposit real amount of coins into your bank`);
		}
		else {
			if (!args[0]) return message.channel.send(`**${message.author.username}**, you need to specify an amount to deposit`);
			if (args[0] > curSpace) return message.channel.send(`**${message.author.username}**, You don't have enough space in your bank for you to deposit that amount.`);
			if (curSpace === 0) return message.channel.send(`**${message.author.username}**, You don't have any space in your bank for you to deposit.`);
			if (args[0] < 1) return message.channel.send(`**${message.author.username}**, nope, only positive integers are allowed to be deposited.`);
			if (economy.get('balance') < args[0]) return message.channel.send(`**${message.author.username}**, You don't have that much money`);
			const money = parseInt(args[0]);
			await Economy.update({ bank: economy.get('bank') + money }, { where: { userId: user } });
			await Economy.update({ balance: economy.get('balance') - money }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have deposited <a:JasmineCoins:718067589984551042> ${money.toLocaleString()} into your bank`);
		}
	},
};