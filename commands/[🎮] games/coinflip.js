const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'coinflip',
	aliases: ['cf'],
	category: '[🎮] games',
	description: 'bet your coins on coinflip and get double reward if you win',
	example: `${bot_prefix}coinflip <heads | tails> <bet>`,
	usage: '<heads | tails> <bet>',
	run: async (client, message, args) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;

			const Disable = Models.Disable();
			const Blacklist = Models.Blacklist();
			const Economy = Models.Economy();
			const Cooldown = Models.Cooldown();
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
			if (disable.get('games') === 1) return message.channel.send(warn);


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
			if (blacklist.get('games') === 1) return message.channel.send(warn1);


			if (!await Economy.findOne({ where: { userId: user } })) {
				await Economy.create({
					userId: user,
				});
			}
			const economy = await Economy.findOne({ where: { userId: user } });


			if (!await Cooldown.findOne({ where: { userId: user } })) {
				await Cooldown.create({
					userId: user,
				});
			}
			const cooldown = await Cooldown.findOne({ where: { userId: user } });


			if (!await Achievement.findOne({ where: { userId: user } })) {
				await Achievement.create({
					userId: user,
				});
			}
			const achievement = await Achievement.findOne({ where: { userId: user } });

			if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}coinflip <heads | tails> <bet>\`.`);
			if (!args[1]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}coinflip <heads | tails> <bet>\`.`);
			const content = args[0].toLowerCase();
			if (isNaN(args[1])) return message.channel.send(`**${message.author.username}**, please make sure you bet with real coins after this.`);
			if (args[1] < 1 || args[1] > 1000) return message.channel.send(`**${message.author.username}**, You can bet from 1-1,000 only`);
			if (economy.get('balance') < args[1]) return message.channel.send(`**${message.author.username}**, you don't even have that much coins in your pocket to bet.`);
			const timeOut = 15000;
			const lastCoinflip = await cooldown.get('coinflip');
			if (lastCoinflip !== null && timeOut - (Date.now() - lastCoinflip) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastCoinflip));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.seconds}s** till you can play again.`);
			}
			else {
				await Cooldown.update({ coinflip: Date.now() }, { where: { userId: user } });

				if (content === 'heads') message.channel.send(`**${message.author.username}**, you chose ${content}`);
				else if (content === 'tails') message.channel.send(`**${message.author.username}**, you chose ${content}`);
				else return message.channel.send(`**${message.author.username}**, you can only choose \`heads\` or \`tails\`.`);
				const flip = ['heads', 'tails'];
				const botChoice = flip[Math.floor(Math.random() * flip.length)];
				const m = await message.channel.send('*Flipping coin...*');
				if (content === botChoice) {
					await Achievement.update({ coinflip: achievement.get('coinflip') + 1 }, { where: { userId: user } });
					await Economy.update({ balance: economy.get('balance') + parseInt(args[1]) }, { where: { userId: user } });
					setTimeout(() => m.edit(`*Flipping coin...* its **${botChoice}**! You won <a:JasmineCoins:718067589984551042> ${(args[1]).toLocaleString()}`), 3000);
				}
				else {
					await Economy.update({ balance: economy.get('balance') - parseInt(args[1]) }, { where: { userId: user } });
					setTimeout(() => m.edit(`*Flipping coin...* its **${botChoice}**! You lost <a:JasmineCoins:718067589984551042> ${(args[1]).toLocaleString()}`), 3000);
				}
			}
		});
	},
};