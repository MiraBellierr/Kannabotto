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

const { Client, Collection, MessageEmbed } = require('discord.js');
const { TOKEN, bot_prefix, authtopggwebhook } = require('./config.json');
const fs = require('fs');
const prefixes = require('./database/prefix.json');
const Sequelize = require('sequelize');
new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './database/database.sqlite',
});
const Models = require('./create-model');
const emojis = require('./database/emojis.json');

const { GiveawaysManager } = require('./discord-giveaways/index');
const PrivilegedIntents = {
	GUILD_PRESENCES: 'GUILD_PRESENCES',
	GUILD_MEMBERS: 'GUILD_MEMBERS',
};
const client = new Client({
	allowedMentions: { parse: ['users'] },
	intents: [
		'GUILDS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS',
		'DIRECT_MESSAGE_TYPING',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_INTEGRATIONS',
		'GUILD_INVITES',
		PrivilegedIntents.GUILD_MEMBERS,
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'GUILD_MESSAGE_TYPING',
		'GUILD_VOICE_STATES',
		'GUILD_WEBHOOKS',
	],
});
client.giveawaysManager = new GiveawaysManager(client, {
	storage: './database/giveaways.json',
	updateCountdownEvery: 5000,
	default: {
		botsCanWin: false,
		embedColor: '#DDA0DD',
		reaction: '🎉',
	},
});

client.snipeMap = new Map();
client.queue = new Map();
client.items = new Map();
client.weapons = new Map();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');

['command', 'event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});

const topgg = require('./post/top.gg');

setInterval(function() {
	topgg(client);
}, 1.8e+6);

const Topgg = require('@top-gg/sdk');
const express = require('express');
const { createAllDataForNewUser, getUserDataAndCreate } = require('./functions');

const app = express();

const webhook = new Topgg.Webhook(authtopggwebhook);

// vote reward
app.post('/dblwebhook', webhook.listener(async vote => {
	const Economy = Models.Economy();

	await createAllDataForNewUser(vote.user);

	const economy = await getUserDataAndCreate(Economy, vote.user);

	let reward = 500;

	const dayToday = new Date(Date.now()).getDay();

	if (dayToday === 0 || dayToday === 6) {
		reward = 1000;
	}

	const voteReward = economy.get('balance') + reward;

	const channel = client.channels.cache.get('870151501950091264');

	client.users.fetch(vote.user).then(async user => {
		await Economy.update({ balance: voteReward }, { where: { userId: vote.user } });

		const embed = new MessageEmbed()
			.setTitle('Thank you for voting!')
			.setColor('#ff1493')
			.setThumbnail('https://cdn.discordapp.com/attachments/710732218254753842/845169239979589651/1383_bunny_holding_hearts.png')
			.setDescription(`\`${user.tag} (${vote.user})\` just voted!\n${user.tag} received <a:jasminecoins:868105109748469780> ${reward === 1000 ? '1000 (doubled on weekend)' : '500'}\n\nYou can vote on top.gg [here](https://top.gg/bot/867048396358549544/vote) every 12 hours!`)
			.setFooter('Thank you for your support!');
		channel.send({ embeds: [embed] });
		user.send(`Thank for voting! You just received <a:jasminecoins:868105109748469780> 500! ${reward === 1000 ? '\nBut hey, it\'s weekend, you received another <a:jasminecoins:868105109748469780> 500' : ''}`).catch((e) => console.log(e));
	});


}));

app.listen(81);

// boss spawner
client.on('messageCreate', async message => {

	if (message.author.bot) return;
	if (!message.guild) return;

	const redirectChannel = require('./database/redirect.json');
	const characters = require('./database/characters.json');

	if (!redirectChannel[message.guild.id]) {
		redirectChannel[message.guild.id] = {
			channel: 'none',
		};
	}

	if (redirectChannel[message.guild.id].channel === 'none') {
		return;
	}
	else {
		const Player = Models.Player();
		const findPlayersLevel = await Player.findAll({ order: [['level', 'DESC']], limit: 1, attributes: ['level'] });
		const highestLevelplayer = findPlayersLevel[0];

		// 3% chance to spawn a boss in this guild
		const spawnSuccess = Math.random() < 0.03;
		const randomLevel = Math.floor((Math.random() * highestLevelplayer.get('level')) + 1);
		const channel = message.guild.channels.cache.get(redirectChannel[message.guild.id].channel);

		if (!channel) return;

		if (spawnSuccess) {
			const random_character = require('./database/randomCharacter.json');

			if (!random_character[message.guild.id]) {
				random_character[message.guild.id] = {
					id: 'none',
					level: 'none',
					defeat: true,
				};
			}
			const character = characters[Math.floor(Math.random() * characters.length)];

			random_character[message.guild.id].id = character.id;
			random_character[message.guild.id].level = randomLevel;
			random_character[message.guild.id].defeat = false;

			fs.writeFile('./database/randomCharacter.json', JSON.stringify(random_character, null, 2), (err) => {
				if (err) return channel.send(`An error occured \`${err}\``).catch(e => console.log(e));
			});

			if (!prefixes[message.guild.id]) {
				prefixes[message.guild.id] = bot_prefix;
			}

			const embed = new MessageEmbed()
				.setAuthor('A wild boss appears!', message.author.displayAvatarURL({ dynamic: true }))
				.setColor('RANDOM')
				.setTitle(`Level ${randomLevel} ${character.name}`)
				.addField('__Character Stats__', `**• ${emojis.health} Health:** ${(character.health + randomLevel) * 100}\n**• ${emojis.pa} Physical Attack:** ${character.physical_attack + randomLevel}\n**• ${emojis.ma} Magical Attack:** ${character.magical_attack + randomLevel}\n**• ${emojis.pr} physical Resistance:** ${character.physical_resistance + randomLevel}\n**• ${emojis.mr} Magical Resistance:** ${character.magical_resistance + randomLevel}\n**• ${emojis.speed} Speed:** ${character.speed + randomLevel}`)
				.setImage(character.image)
				.setFooter(`Type "${prefixes[message.guild.id]}battle boss" to challenge this boss`);

			channel.send({ embeds: [embed] }).catch(e => console.log(e));
		}
		else {
			return;
		}
	}
});

client.login(TOKEN);