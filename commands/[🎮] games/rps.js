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

const { MessageEmbed } = require('discord.js');
const { promptMessage, checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const chooseArr = ['🗻', '📰', '✂'];
const Models = require('../../create-model.js');

module.exports = {
	name: 'rps',
	category: '[🎮] games',
	description: 'Rock Paper Scissors game. React to one of the emojis to play the game.',
	example: `${bot_prefix}rps <bet>`,
	usage: '<bet>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkGuildDisable(message, 'games')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);
		if (await checkBlacklist(message, 'games')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		if (!args[0]) return message.reply(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}rps <bet>\`.`);
		if (isNaN(args[0])) return message.reply(`**${message.author.username}**, only numbers accepted as an argument!`);
		if (args[0] < 1 || args[0] > 10000) return message.reply(`**${message.author.username}**, Please choose numbers between 1-10000 only`);
		if (args[0] > economy.get('balance')) return message.reply(`**${message.author.username}**, You don't have that much coins in your pocket!`);

		const timer = await cooldown('rps', user, 15000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** till you can play again.`);
		}
		else {
			await Cooldown.update({ rps: Date.now() }, { where: { userId: user } });

			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setColor('#CD1C6C')
				.setFooter(message.guild.me.displayName, client.user.displayAvatarURL())
				.setDescription('Add a reaction to one of these emojis to play the game!')
				.setTimestamp();

			const m = await message.reply({ embeds: [embed] });

			const reacted = await promptMessage(m, message.author, 30, chooseArr);

			const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

			const result = await getResult(reacted, botChoice);

			embed
				.setDescription('')
				.addField(result, `${reacted} vs ${botChoice}`);

			m.edit({ embeds: [embed] });
		}

		async function getResult(me, clientChosen) {
			if ((me === '🗻' && clientChosen === '✂') || (me === '📰' && clientChosen === '🗻') || (me === '✂' && clientChosen === '📰')) {
				await Achievement.update({ rps: achievement.get('rps') + 1 }, { where: { userId: user } });
				await Economy.update({ balance: economy.get('balance') + parseInt(args[0]) }, { where: { userId: user } });

				return `You won <a:jasminecoins:868105109748469780> ${args[0].toLocaleString()}!`;
			}
			else if (me === clientChosen) {
				return 'It\'s a tie, coins has been returned back!';
			}
			else {
				await Economy.update({ balance: economy.get('balance') - parseInt(args[0]) }, { where: { userId: user } });

				return `You lost <a:jasminecoins:868105109748469780> ${args[0].toLocaleString()}!`;
			}
		}
	},
};