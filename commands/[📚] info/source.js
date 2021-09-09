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

const beautify = require('beautify');
const { bot_prefix } = require('../../config.json');
const getSource = require('get-source');
const fs = require('fs');
const { PaginateContent } = require('../../Pagination');

module.exports = {
	name: 'source',
	aliases: ['s'],
	description: 'send a source code',
	example: `${bot_prefix}source <command name>`,
	usage: '<command name>',
	run: async (client, message, args) => {
		if (!args[0]) return message.reply('Please state a command name to be pulled');

		fs.readdirSync('./commands').forEach(dir => {
			fs.readdirSync(`./commands/${dir}`).forEach(async file => {
				if (file === `${args[0]}.js`) {
					const source = getSource(`./commands/${dir}/${file}`);
					const splitString = [];
					let i = 0;
					while (i < source.text.length) {
						splitString.push(source.text.slice(i, i + 1200));
						i = i + 1200;
					}

					const splitStringMap = splitString.map((str, index) => `Path: \`${source.path}\`\n\`\`\`js\n${beautify(str, { format: 'js' })}\n\`\`\`\nPage ${index + 1}/${splitString.length}`);

					const paginated = new PaginateContent.DiscordJS.Paginate(client, message, splitStringMap);
					await paginated.init();
				}
			});

		});
	},
};