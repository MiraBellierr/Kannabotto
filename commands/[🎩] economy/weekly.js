const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const Models = require('../../create-model.js');

module.exports = {
	name: 'weekly',
	category: '[🎩] economy',
	description: 'Weekly coins reward',
	example: `${bot_prefix}weekly`,
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

			const guild = client.guilds.cache.get('684084513403699314');
			const patron = guild.members.cache.get(message.author.id);
			if (!patron) return message.channel.send(`**${message.author.username}**, This command is accessible for Tier 1 Supporter only and must join our support server.`);
			if (!patron.roles.cache.get('723772988276867102')) return message.channel.send(`**${message.author.username}**, This command is accessible for Tier 1 Supporter only.`);


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


			const timeOut = 6.048e+8,
				amount = 10000;

			const lastweekly = await cooldown.get('weekly');
			if (lastweekly !== null && timeOut - (Date.now() - lastweekly) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastweekly));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s** until you can claim your next weekly again.`);
			}
			else {
				await Cooldown.update({ weekly: Date.now() }, { where: { userId: user } });
				await Achievement.update({ weekly: achievement.get('weekly') + 1 }, { where: { userId: user } });
				await Economy.update({ balance: curcoins + amount }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, Here's your weekly <a:JasmineCoins:718067589984551042> ${amount.toLocaleString()}. Come back again next week!`);
			}
		});
	},
};
