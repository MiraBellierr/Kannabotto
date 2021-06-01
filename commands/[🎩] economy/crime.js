const { bot_prefix } = require('../../config.json');
const { getCrimeSuccess, getCrimeFail } = require('../../functions');
const Discord = require('discord.js');
const Models = require('../../create-model');

module.exports = {
	name: 'crime',
	category: '[🎩] economy',
	description: 'Do some bad works and get coins',
	example: `${bot_prefix}crime`,
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

			const answers = ['success', 'failed'];

			const answer = answers[Math.floor(Math.random() * answers.length)];


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

			if (economy.get('balance') < 1) return message.channel.send(`**${message.author.username}**, You need at least <a:JasmineCoins:718067589984551042> 1 to be able to do crime.`);
			const timeOut = 60000;

			const lastCrime = await cooldown.get('crime');
			if (lastCrime !== null && timeOut - (Date.now() - lastCrime) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastCrime));
				message.channel.send(`**${message.author.username}**, Please wait **${timeObj.seconds}s** until you can do crime again.`);
			}
			else {
				await Cooldown.update({ crime: Date.now() }, { where: { userId: user } });
				await Achievement.update({ crime: achievement.get('crime') + 1 }, { where: { userId: user } });

				if (answer === 'success') {
					const curBal = economy.get('balance');
					const random = Math.ceil((0.05 * curBal));
					await Economy.update({ balance: curBal + random }, { where: { userId: user } });
					const coins = `<a:JasmineCoins:718067589984551042> ${random.toLocaleString()}`;
					message.channel.send(`${message.author.username}, ${getCrimeSuccess(coins)}`);
				}
				if (answer === 'failed') {
					const curBal = economy.get('balance');
					const random = Math.floor(0.05 * curBal);
					await Economy.update({ balance: curBal - random }, { where: { userId: user } });
					const coins = `<a:JasmineCoins:718067589984551042> ${random.toLocaleString()}`;
					message.channel.send(`${message.author.username}, ${getCrimeFail(coins)}`);
				}
			}
		});
	},
};