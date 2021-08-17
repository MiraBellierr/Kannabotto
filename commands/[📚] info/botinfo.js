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

const Discord = require('discord.js');
const { formatDate } = require('../../functions.js');
const { bot_prefix } = require('../../config.json');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const drive = osu.drive;
const mem = osu.mem;
const os = osu.os;
const si = require('systeminformation');


module.exports = {
	name: 'botinfo',
	aliases: ['bot'],
	category: '[📚] info',
	example: `${bot_prefix}botinfo`,
	description: 'Returns bot information',
	run: async (client, message) => {
		const m = await message.channel.send('*Loading...*');
		const clientApp = await client.fetchApplication();
		const owner = client.users.cache.get(clientApp.owner.id);

		const cpuCount = cpu.count();
		let cpuUsagePercentage;
		let driveInfo;
		let memInfo;
		let osInfo;
		let processor;
		await cpu.usage().then(cpuPercentage => {
			cpuUsagePercentage = cpuPercentage;
		});
		await drive.info().then(info => {
			driveInfo = info;
		});
		await mem.info().then(info => {
			memInfo = info;
		});
		await os.oos().then(info => {
			osInfo = info;
		});
		await si.cpu()
			.then(data => processor = data)
			.catch(error => console.error(error));

		let totalSeconds = (client.uptime / 1000);
		const days = Math.floor(totalSeconds / 86400);
		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const minutes = Math.floor(totalSeconds / 60);
		const uptime = `${days} days, ${hours} hours, ${minutes} minutes`;

		m.delete();
		const embed = new Discord.MessageEmbed()
			.setAuthor('Bot Information')
			.setThumbnail(client.user.avatarURL())
			.setColor('#DA70D6')
			.setDescription(`**• Developer:** ${owner.tag}\n**• Tag:** ${client.user.tag}\n**• Cached Members:** ${client.users.cache.size.toLocaleString()}\n**• Total Members:** ${client.guilds.cache.map(guild => guild.memberCount).reduce((accumulator, currentValue) => accumulator + currentValue).toLocaleString()}\n**• Total Servers:** ${client.guilds.cache.size.toLocaleString()}\n**• Total Shards:** ${client.shard.count.toLocaleString()}\n**• Total Channels:** ${client.channels.cache.size.toLocaleString()}\n**• Total Emojis:** ${client.emojis.cache.size.toLocaleString()}\n**• Created At:** ${formatDate(client.user.createdAt)}\n**• Library:** Discord.js v${Discord.version}\n**• Database:** SQlite3\n**• JRE:** Node ${process.version}\n**• Websocket Status:** ${client.ws.status}\n**• Websocket Ping:** ${client.ws.ping.toLocaleString()}ms\n**• CPU Count:** ${cpuCount}\n**• CPU Usage:** ${cpuUsagePercentage.toFixed(2)}%\n**• Drive Usage:** ${driveInfo.usedGb}GB (${driveInfo.usedPercentage}%)\n**• Memory Usage:** ${(memInfo.usedMemMb / 1000).toFixed(2)}GB (${(100 - memInfo.freeMemPercentage).toFixed(2)}%)\n**• Operating System:** ${osInfo}\n**• Processor:** ${processor.manufacturer} ${processor.brand}\n**• Ready At:** ${formatDate(client.readyAt)}\n**• Uptime:** ${uptime}`);

		message.channel.send(embed);
	},
};