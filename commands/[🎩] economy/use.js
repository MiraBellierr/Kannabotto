const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');
const Models = require('../../create-model.js');

module.exports = {
	name: 'use',
	category: '[🎩] economy',
	description: 'Use an item',
	example: `${bot_prefix}use <item> [amount]`,
	usage: '<item> [amount]',
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
		const cooldown = await Cooldown.findOne({ where: { userId: user } });

		if (!await Inventory.findOne({ where: { userId: user } })) {
			await Inventory.create({
				userId: user,
			});
		}
		const inventory = await Inventory.findOne({ where: { userId: user } });


		if (!await Economy.findOne({ where: { userId: user } })) {
			await Economy.create({
				userId: user,
			});
		}
		const economy = await Economy.findOne({ where: { userId: user } });

		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}use <item>\`.`);
		const content = args[0].toLowerCase();
		let amount = parseInt(args[1]);
		if (!amount) amount = 1;
		if (isNaN(amount)) return message.channel.send(`**${message.author.username}**, please provide a real amount of item you want to buy.`);

		if (content === 'bear') {
			const timeout = 3.6e+6;
			const lastBear = await cooldown.get('bear');
			if (lastBear !== null && timeout - (Date.now() - lastBear) > 0) return message.channel.send(`**${message.author.username}**, This item is still active.`);
			if (inventory.get('bear') < 1) return message.channel.send(`**${message.author.username}**, you don't have this item in your inventory`);
			await Cooldown.update({ bear: Date.now() }, { where: { userId: user } });
			await Inventory.update({ bear: inventory.get('bear') - 1 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, you activated **<a:bearymad:719100025363234817> Bear**. Your Xp has been boosted by 50% for 1 hour.`);
		}
		else if (content === 'guard') {
			const timeout = 4.32e+7;
			const lastGuard = await cooldown.get('guard');
			if (lastGuard !== null && timeout - (Date.now() - lastGuard) > 0) return message.channel.send(`**${message.author.username}**, This item is still active.`);
			if (inventory.get('guard') < 1) return message.channel.send(`**${message.author.username}**, You don't have this item in your inventory.`);
			await Cooldown.update({ guard: Date.now() }, { where: { userId: user } });
			await Inventory.update({ guard: inventory.get('guard') - 1 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, you activated <:bearcop:843071040480608307> **Guard**. now people can't rob you for 12 hours.`);
		}
		else if (content === 'dog') {
			if (inventory.get('dog') < amount) return message.channel.send(`**${message.author.username}**, You don't have this item in your inventory.`);
			await Inventory.update({ dog: inventory.get('dog') - amount }, { where: { userId: user } });
			await Economy.update({ totalBank: economy.get('totalBank') + 1000 * amount }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, you used **${amount}** <:doggo:843068555201216512> **Dog**. Your bank has been expanded by ${(1000 * amount).toLocaleString()}.`);
		}
		else if (content === 'bunny') {
			if (inventory.get('bunny2') < 1) return message.channel.send(`**${message.author.username}**, you don't have this item in your inventory.`);
			await Inventory.update({ bunny2: inventory.get('bunny2') - 1 }, { where: { userId: user } });
			await Inventory.update({ bunny: inventory.get('bunny') + 0.25 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, you used **${amount}** <a:MyMelodyHeart:719100623328378901> **Bunny** and your multiplier has increased by 0.25%`);
		}
		else {
			return message.channel.send(`**${message.author.username}**, You can't use this item.`);
		}
	},
};