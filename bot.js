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
const { TOKEN, bot_prefix, db } = require('./config.json');
const fs = require('fs');
const timeoutxp = new Set();
const prefixes = require('./database/prefix.json');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './database/database.sqlite',
});

const { GiveawaysManager } = require('discord-giveaways');
const PrivilegedIntents = {
	GUILD_PRESENCES: 'GUILD_PRESENCES',
	GUILD_MEMBERS: 'GUILD_MEMBERS',
};
const client = new Client({
	allowedMentions: { parse: ['users'] },
	ws: {
		intents: [
			'GUILDS',
			'DIRECT_MESSAGES',
			'DIRECT_MESSAGE_REACTIONS',
			'DIRECT_MESSAGE_TYPING',
			'GUILD_BANS',
			'GUILD_EMOJIS',
			'GUILD_INTEGRATIONS',
			'GUILD_INVITES',
			PrivilegedIntents.GUILD_MEMBERS,
			'GUILD_MESSAGES',
			'GUILD_MESSAGE_REACTIONS',
			'GUILD_MESSAGE_TYPING',
			'GUILD_VOICE_STATES',
			'GUILD_WEBHOOKS',
		],
	},
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
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');

['command', 'event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});

const voidbots = require('./post/voidbots');
const discordlabs = require('./post/discordlabs');
const blist = require('./post/blist');
const botlistSpace = require('./post/botlist.space');
const botsfordiscord = require('./post/botsfordiscord');
const discordbotlist = require('./post/discordbotlist');
const botlistme = require('./post/botlist.me');
const discordbots = require('./post/discord.bots');
const topgg = require('./post/top.gg');
const dbeu = require('discord-botlist-api');
const dbapi = new dbeu.Client();
const paradisebots = require('./post/paradisebots');
const disforge = require('./post/disforge');
const discordextremelist = require('./post/discordextremelist');

dbapi.on('ready', () => {
	console.log('[LOG] DiscordBotList stats posted!');
	setInterval(() => {
		dbapi.postData(client.guilds.cache.size, client.shard.count);
	}, 1.8e+6);
});
dbapi.login(db, '636748567586930728');

setInterval(function() {
	voidbots(client);
	discordlabs(client);
	blist(client);
	botlistSpace(client);
	botsfordiscord(client);
	discordbotlist(client);
	botlistme(client);
	discordbots(client);
	topgg(client);
	paradisebots(client);
	disforge(client);
	discordextremelist(client);
}, 1.8e+6);

const Topgg = require('@top-gg/sdk');
const express = require('express');

const app = express();

const webhook = new Topgg.Webhook('656432');

app.post('/dblwebhook', webhook.listener(async vote => {
	const Economy = sequelize.define('economy', {
		userId: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		balance: {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false,
		},
		bank: {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false,
		},
		totalBank: {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false,
		},
	});
	Economy.sync();
	if (!await Economy.findOne({ where: { userId: vote.user } })) {
		await Economy.create({
			userId: vote.user,
		});
	}
	const economy = await Economy.findOne({ where: { userId: vote.user } });
	const voteReward = economy.get('balance') + 500;

	const channel = client.channels.cache.get('726344072197046312');
	client.users.fetch(vote.user).then(async user => {
		await Economy.update({ balance: voteReward }, { where: { userId: vote.user } });

		const embed = new MessageEmbed()
			.setTitle('Thank you for voting!')
			.setColor('#ff1493')
			.setThumbnail('https://cdn.discordapp.com/attachments/710732218254753842/845169239979589651/1383_bunny_holding_hearts.png')
			.setDescription(`\`${user.tag} (${vote.user})\` just voted!\n${user.tag} received <a:JasmineCoins:718067589984551042> 500\n\nYou can vote on top.gg [here](https://top.gg/bot/636748567586930728/vote) every 12 hours!`)
			.setFooter('Thank you for your support!');
		channel.send(embed);
		user.send('Thank for voting! You have received <a:JasmineCoins:718067589984551042> 500!').catch(console.error);
	});


}));

app.listen(8000);

client.on('message', async message => {
	if (message.author.bot) return;
	const Disable = sequelize.define('disable', {
		guildId: {
			type: Sequelize.STRING,
			unique: true,
		},
		economy: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		games: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		reason1: {
			type: Sequelize.TEXT,
			defaultValue: 'None',
		},
		reason2: {
			type: Sequelize.INTEGER,
			defaultValue: 'None',
		},
	});
	Disable.sync();
	if (!await Disable.findOne({ where: { guildId: message.guild.id } })) {
		await Disable.create({
			guildId: message.guild.id,
		});
	}
	const disable = await Disable.findOne({ where: { guildId: message.guild.id } });


	if (disable.get('economy') === 1) return;

	const Blacklist = sequelize.define('blacklist', {
		userId: {
			type: Sequelize.STRING,
			unique: true,
		},
		blacklist: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		games: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	});
	Blacklist.sync();
	if (!await Blacklist.findOne({ where: { userId: message.author.id } })) {
		await Blacklist.create({
			userId: message.author.id,
		});
	}
	const blacklist = await Blacklist.findOne({ where: { userId: message.author.id } });

	if (blacklist.get('blacklist') === 1) return;

	const Economy = sequelize.define('economy', {
		userId: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		balance: {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false,
		},
		bank: {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false,
		},
		totalBank: {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false,
		},
	});
	Economy.sync();
	if (!await Economy.findOne({ where: { userId: message.author.id } })) {
		await Economy.create({
			userId: message.author.id,
		});
	}
	const economy = await Economy.findOne({ where: { userId: message.author.id } });

	const xpAdd = Math.floor(Math.random() * 1) + 1;
	if (timeoutxp.has(message.author.id)) return;

	const Level = sequelize.define('level', {
		userId: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		xp: {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false,
		},
		level: {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false,
		},
	});
	Level.sync();
	if (!await Level.findOne({ where: { userId: message.author.id } })) {
		await Level.create({
			userId: message.author.id,
		});
	}
	const level = await Level.findOne({ where: { userId: message.author.id } });

	const curxp = level.get('xp');
	const curlvl = level.get('level');
	const nxtLvl = level.get('level') * 500;
	const levelupReward = economy.get('balance') + 1000;
	await Level.update({ xp: curxp + xpAdd }, { where: { userId: message.author.id } });
	if(nxtLvl <= level.get('xp')) {
		await Level.update({ level: curlvl + 1 }, { where: { userId: message.author.id } });
		await Economy.update({ balance: levelupReward }, { where: { userId: message.author.id } });
	}

	timeoutxp.add(message.author.id);
	setTimeout(() => timeoutxp.delete(message.author.id), 20000);
});

client.on('message', message => {

	if (!prefixes[message.guild.id]) {
		prefixes[message.guild.id] = bot_prefix;
	}
	if (message.author.bot) return;
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
		const num = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		const randomNum = num[Math.floor(Math.random() * num.length)];
		const randomLevel = Math.floor((Math.random() * 200) + 1);
		const channel = message.guild.channels.cache.get(redirectChannel[message.guild.id].channel);
		if (!channel) return;
		if (randomNum === 1) {
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
				if (err) return channel.send(`An error occured \`${err}\``);
			});
			const embed = new MessageEmbed()
				.setAuthor('A wild boss appears!', message.author.displayAvatarURL({ dynamic: true }))
				.setColor('RANDOM')
				.setTitle(`Level ${randomLevel} ${character.name}`)
				.addField('Stats', `**• Health:** ${(character.health + randomLevel) * 100}\n**• Physical Attack:** ${character.physical_attack + randomLevel}\n**• Magical Attack:** ${character.magical_attack + randomLevel}\n**• physical Resistance:** ${character.physical_resistance + randomLevel}\n**• Magical Resistance:** ${character.magical_resistance + randomLevel}\n**• Speed:** ${character.speed + randomLevel}`)
				.setImage(character.image)
				.setFooter(`Type "${prefixes[message.guild.id]}battle boss" to challenge this boss`);

			channel.send(embed);
		}
		else {
			return;
		}
	}
});

client.login(TOKEN);