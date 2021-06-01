const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const Models = require('../../create-model');

module.exports = {
	name: 'daily',
	category: '[🎩] economy',
	description: 'Daily coins reward',
	example: `${bot_prefix}daily`,
	run: async (client, message) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;

			const Disable = Models.Disable();
			const Blacklist = Models.Blacklist();
			const Cooldown = Models.Cooldown();
			const Inventory = Models.Inventory();
			const Economy = Models.Economy();
			const Achievement = Models.Achievement();

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


			if (!await Economy.findOne({ where: { userId: user } })) {
				await Economy.create({
					userId: user,
				});
			}
			const economy = await Economy.findOne({ where: { userId: user } });


			if (!await Achievement.findOne({ where: { userId: user } })) {
				await Achievement.create({
					userId: user,
				});
			}
			const achievement = await Achievement.findOne({ where: { userId: user } });

			const curcoins = economy.get('balance');


			const timeOut = 8.64e+7;
			let amount = 1000;

			if (message.member.roles.cache.has('844070100763541504')) amount = 2000;

			const lastdaily = await cooldown.get('daily');
			if (lastdaily !== null && timeOut - (Date.now() - lastdaily) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastdaily));
				message.channel.send(`**${message.author.username}**, Please wait **${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s** until you can claim your next daily again.`);
			}
			else {
				await Cooldown.update({ daily: Date.now() }, { where: { userId: user } });
				await Achievement.update({ daily: achievement.get('daily') + 1 }, { where: { userId: user } });
				await Economy.update({ balance: curcoins + amount }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, Here's your daily <a:JasmineCoins:718067589984551042> ${amount.toLocaleString()}. Come back again tomorrow!`);
			}
		});
	},
};
