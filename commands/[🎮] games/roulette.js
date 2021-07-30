// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { bot_prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const prefixes = require('../../database/prefix.json');
function isOdd(num) {
	if ((num % 2) == 0) return false;
	else if ((num % 2) == 1) return true;
}
const Models = require('../../create-model.js');

module.exports = {
	name: 'roulette',
	aliases: ['rl'],
	category: '[🎮] games',
	description: 'Allows you to spend your balance on a game of Roulette.',
	example: `${bot_prefix}roulette <black/red/green> <amount>`,
	usage: '<black/red/green> <amount>',
	run: async (client, message, args) => {
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

			const warn = new MessageEmbed()
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

			const warn1 = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('You have been blacklisted from this command')
				.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
				.setTimestamp();


			if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);
			if (blacklist.get('games') === 1) return message.channel.send(warn1);


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

			let colour = args[0];
			let money = parseInt(args[1]);


			if (!money) return message.channel.send(`Usage: \`${prefixes[message.guild.id]}roulette <black, red, green> <amount>\`\nPick any of the colours you want... but some are more likely than others...\n\`Black is for Even numbers\`... and \`Red is for odd\`... both of these will provide you with \`1x\` your original amount.\nTake a risk and pick \`Green\` and you can get \`14x\` the amount of money... however the probability is \`1/37\`.`);
			if (isNaN(money)) return message.channel.send(`**${message.author.username}**, Please enter a valid number!`);
			if (money > 1000 || money < 1) return message.channel.send(`**${message.author.username}**, You can only bet from 1-1,000 only.`);
			if (economy.get('balance') < money) return message.channel.send(`**${message.author.username}**, You don't have that much coins in your pocket!`);
			if (!colour) return message.channel.send(`**${message.author.username}**, You can only bet on Black (1x), Red (1x), or Green (14x).`);
			const timeOut = 15000;
			const lastRoulette = await cooldown.get('roulette');
			if (lastRoulette !== null && timeOut - (Date.now() - lastRoulette) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastRoulette));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.seconds}s** till you can play again.`);
			}
			else {
				await Cooldown.update({ roulette: Date.now() }, { where: { userId: user } });

				colour = colour.toLowerCase();
				const msg = await message.channel.send(`You bet on ${colour} with <a:jasminecoins:868105109748469780> ${money}. Please wait 10 seconds...`);
				if (colour == 'b' || colour.includes('black')) colour = 0;
				else if (colour == 'r' || colour.includes('red')) colour = 1;
				else if (colour == 'g' || colour.includes('green')) colour = 2;
				else return message.channel.send(`**${message.author.username}**, You can only bet on Black (1x), Red (1x), or Green (14x).`);

				const random = Math.floor(Math.random() * 37);
				setTimeout(async function game() {

					if (random == 0 && colour == 2) {
						money *= 14;
						await Achievement.update({ green: achievement.get('green') + 1 }, { where: { userId: user } });
						const curBal1 = economy.get('balance');
						await Economy.update({ balance: curBal1 + money }, { where: { userid: user } });
						msg.delete();
						message.channel.send(`**${message.author.username}**, 💚 **JACKPOT** You won <a:jasminecoins:868105109748469780> ${money.toLocaleString()} 💚 | The Number was **${random}**`);
					}
					else if (isOdd(random) && colour == 1) {
						money = money * 1;
						await Achievement.update({ red: achievement.get('red') + 1 }, { where: { userId: user } });
						const curBal2 = economy.get('balance');
						await Economy.update({ balance: curBal2 + money }, { where: { userId: user } });
						msg.delete();
						message.channel.send(`**${message.author.username}**, 🔴 You won <a:jasminecoins:868105109748469780> ${money.toLocaleString()} 🔴 | The Number was **${random}**`);
					}
					else if (!isOdd(random) && colour == 0 && random > 0) {
						money = money * 1;
						await Achievement.update({ black: achievement.get('black') + 1 }, { where: { userId: user } });
						const curBal3 = economy.get('balance');
						await Economy.update({ balance: curBal3 + money }, { where: { userId: user } });
						msg.delete();
						message.channel.send(`**${message.author.username}**, ⚫ You won <a:jasminecoins:868105109748469780> ${money.toLocaleString()} ⚫| The Number was **${random}**`);
					}
					else {
						const curBal4 = economy.get('balance');
						await Economy.update({ balance: curBal4 - money }, { where: { userId: user } });
						msg.delete();
						message.channel.send(`**${message.author.username}**, You sadly lost <a:jasminecoins:868105109748469780> ${money.toLocaleString()} | The Number was **${random}**`);
					}
				}, 10000);
			}
		});
	},
};