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
const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
	name: 'joke',
	category: '[🧩] fun',
	description: 'Get a random joke',
	example: `${bot_prefix}joke`,
	run: async (client, message) => {
		axios({
			method: 'get',
			url: 'https://official-joke-api.appspot.com/jokes/random',
		}).then(res => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(`${res.data.type}'s joke`, client.user.avatarURL())
				.setDescription(`${res.data.setup}\n${res.data.punchline}`)
				.setColor('#CD1C6C')
				.setTimestamp();

			message.reply({ embeds: [embed] });
		}).catch(err => message.reply(`An error occurred \`${err}\``));
	},
};