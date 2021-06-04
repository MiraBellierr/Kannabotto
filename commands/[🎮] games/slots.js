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
function shuffle(array) {
	const arr = array.slice(0);
	for(let i = arr.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}
const Models = require('../../create-model.js');

module.exports = {
	name: 'slots',
	aliases: ['slot', 'sl'],
	category: '[🎮] games',
	description: 'Play the slot machine.',
	example: `${bot_prefix}slots <amount>`,
	usage: '<amount>',
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

			const slots = ['🐹', '🐶', '🐵', '🐱', '🐸', '🐻', '🐰'];
			if (!args[0]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}slots <amount>\`.`);
			if (isNaN(args[0])) return message.channel.send(`**${message.author.username}**, Please enter a valid number!`);
			if (args[0] > 10000 || args[0] < 100) return message.channel.send(`**${message.author.username}**, You can only bet from 100-10,000 only`);
			if(economy.get('balance') < args[0]) return message.channel.send(`**${message.author.username}**, You don't have that much coins in your pocket!`);
			const timeOut = 15000;
			const lastSlots = await cooldown.get('slots');
			if (lastSlots !== null && timeOut - (Date.now() - lastSlots) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastSlots));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.seconds}s** till you can play again.`);
			}
			else {
				await Cooldown.update({ slots: Date.now() }, { where: { userId: user } });
				const amount = parseInt(args[0]);

				const arr1 = shuffle(slots);
				const arr2 = shuffle(slots);
				const arr3 = shuffle(slots);
				const thisMes = await message.channel.send(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[0]} : ${arr3[2]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
      `);

				for(let i = 0; i < 5; i++) {
					arr1.push(arr1.shift());
					arr2.push(arr2.shift());
					arr3.push(arr3.shift());

					await setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[0]} : ${arr2[1]} : ${arr3[0]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
          `), 800);

					setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[1]} : ${arr3[2]}
      ${arr1[0]} : ${arr2[1]} : ${arr3[2]} **«**
      ${arr1[2]} : ${arr2[0]} : ${arr3[1]}
      **-----------------**
          `), 1000);

					if (arr1[1] === arr2[1] && arr1[1] === arr3[1] || arr2[1] === arr1[1] && arr2[1] === arr3[1] || arr3[1] === arr2[1] && arr3[1] === arr1[1]) {
						const random = 5 * amount;
						await Achievement.update({ slots: achievement.get('slots') + 1 }, { where: { userId: user } });
						const curBal = economy.get('balance');
						await Economy.update({ balance: curBal + random }, { where: { userId: user } });

						return setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[0]} : ${arr3[2]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
      | : : : **WIN** : : : |
      **${message.author.username}** used <a:JasmineCoins:718067589984551042> ${amount.toLocaleString()} and won <a:JasmineCoins:718067589984551042> ${random.toLocaleString()}
		  `), 2500);

					}
					if (arr1[1] === arr2[1] || arr1[1] === arr2[1] || arr2[1] === arr1[1] || arr2[1] === arr2[3] || arr3[1] === arr1[1] || arr3[1] === arr2[1]) {
						const random = 2 * amount;
						await Achievement.update({ slots: achievement.get('slots') + 1 }, { where: { userId: user } });
						const curBal = economy.get('balance');
						await Economy.update({ balance: curBal + random }, { where: { userId: user } });
						return setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[0]} : ${arr3[2]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
      | : : : **WIN** : : : |
      **${message.author.username}** used <a:JasmineCoins:718067589984551042> ${amount.toLocaleString()} and won <a:JasmineCoins:718067589984551042> ${random.toLocaleString()}
		  `), 2500);

					}
					const curbal = economy.get('balance');
					await Economy.update({ balance: curbal - amount }, { where: { userid: user } });

					return setTimeout(() => thisMes.edit(`
      **[ 🎰 | SLOTS ]**
      **-----------------**
      ${arr1[2]} : ${arr2[0]} : ${arr3[2]}
      ${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
      ${arr1[0]} : ${arr2[2]} : ${arr3[0]}
      **-----------------**
      | : : : **LOST** : : : |
      **${message.author.username}** used <a:JasmineCoins:718067589984551042> ${amount.toLocaleString()} and lost everything.
		  `), 2500);

				}
			}
		});
	},
};