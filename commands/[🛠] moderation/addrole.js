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
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'addrole',
	category: '[🛠] moderation',
	example: `${bot_prefix}addrole <mention | id | username> <role>`,
	description: 'Add role to member',
	usage: '<mention | id | username> <role>',
	run: async (client, message, args) => {

		if (!message.member.hasPermission('MANAGE_ROLES', { checkAdmin: true, checkOwner: true })) return message.channel.send('You don\'t have `MANAGE_ROLES` permission to do that!').then(m => m.delete({ timeout: 5000 }));
		if (!message.guild.me.hasPermission('MANAGE_ROLES', { checkAdmin: true, checkOwner: true })) return message.channel.send('I don\'t have `MANAGE_ROLES` permission to assign a member a role.').then(m => m.delete({ timeout: 5000 }));
		const rMember = await getMember(message, args[0]);
		if (!args[0]) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}addrole <mention | id | user> <role>\`.`);
		if (!rMember) return message.channel.send('The user can\'t be found.');

		const role = args.slice(1).join(' ');
		if (!role) return message.channel.send('Please specify a role!');
		const gRole = message.guild.roles.cache.get(role) || message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(role));
		if (!gRole) return message.channel.send('Couldn\'t find that role.');

		if (rMember.roles.cache.has(gRole.id)) return message.channel.send('This user already have that role.');
		await (rMember.roles.add(gRole.id)).catch(e => console.log(`[WARN] ${e.message} in ${e.filename} [${e.lineNumber}, ${e.columnNumber}]`));

		await message.channel.send(`Successfully gave **${rMember.user.username}** the **${gRole.name}** role!`);

	},
};