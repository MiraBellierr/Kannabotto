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

const { bot_prefix } = require('../config.json');
const timeoutxp = new Set();
const prefixes = require('../database/prefix.json');
const Models = require('../create-model');
const { getUserDataAndCreate, checkGuildDisable, checkBlacklist } = require('../functions');

module.exports = async (client, message) => {
	if (!prefixes[message.guild.id]) {
		prefixes[message.guild.id] = bot_prefix;
	}

	if (!message.guild.me.permissions.has('SEND_MESSAGES')) return;

	if (message.mentions.users.first() === client.user) message.reply(`My prefix for this guild is \`${prefixes[message.guild.id]}\`. Type \`${prefixes[message.guild.id]}help\` for more info about me. `);

	const prefix = prefixes[message.guild.id];
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	if (!message.guild) return;
	if (message.author.bot) return;
	if (!message.member) message.member = await message.guild.fetchMember(message);

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;

	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));

	try {
		if (command) {
			command.run(client, message, args);
		}
	}
	catch (error) {
		console.error(error);
		message.reply(`there was an error trying to execute that command! \n\`${error}\` Report it by joining our server: https://discord.gg/NcPeGuNEdc`);
	}

	if (await checkGuildDisable(message, 'economy')) return;
	if (await checkBlacklist(message, 'blacklist')) return;

	const Economy = Models.Economy();

	const economy = await getUserDataAndCreate(Economy, message.author.id);
	const xpAdd = Math.floor(Math.random() * 1) + 1;

	if (timeoutxp.has(message.author.id)) return;

	const Level = Models.Level();

	const level = await getUserDataAndCreate(Level, message.author.id);

	const curxp = level.get('xp');
	const curlvl = level.get('level');
	const nxtLvl = level.get('level') * 500;
	const levelupReward = economy.get('balance') + 1000;

	await Level.update({ xp: curxp + xpAdd }, { where: { userId: message.author.id } });
	await Economy.update({ bank: economy.get('bank') + 1 }, { where: { userId: message.author.id } });

	if(nxtLvl <= level.get('xp')) {
		await Level.update({ level: curlvl + 1 }, { where: { userId: message.author.id } });
		await Economy.update({ balance: levelupReward }, { where: { userId: message.author.id } });
	}

	timeoutxp.add(message.author.id);

	setTimeout(() => timeoutxp.delete(message.author.id), 20000);
};