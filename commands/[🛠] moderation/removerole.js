const { bot_prefix } = require('../../config.json');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'removerole',
	category: '[🛠] moderation',
	example: `${bot_prefix}removerole <mention | id | username> <role>`,
	description: 'remove role from member',
	usage: '<mention | id | username> <role>',
	run: async (client, message, args) => {

		if (!message.member.hasPermission('MANAGE_ROLES', { checkAdmin: true, checkOwner: true })) return message.channel.send('You don\'t have `MANAGE_ROLES` permission to do that!').then(m => m.delete({ timeout: 5000 }));
		if (!message.guild.me.hasPermission('MANAGE_ROLES', { checkAdmin: true, checkOwner: true })) return message.channel.send('I don\'t have `MANAGE_ROLES` permission to assign a member a role.').then(m => m.delete({ timeout: 5000 }));
		const rMember = getMember(message, args[0]);
		if (!args[0]) return message.channel.send(`The right syntax is \`${prefixes[message.guild.id]}removerole <mention | id | user> <role>\`.`);
		if (!rMember) return message.channel.send('The user can\'t be found.');

		const role = args.slice(1).join(' ');
		if(!role) return message.channel.send('Please specify a role!');
		const gRole = message.guild.roles.cache.get(role) || message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(role));
		if(!gRole) return message.channel.send('Couldn\'t find that role.');

		if(!rMember.roles.cache.has(gRole.id)) return message.channel.send(`**${gRole.name}** can't be found on this user`);
		await (rMember.roles.remove(gRole.id));

		await message.channel.send(`Successfully removed **${gRole.name}** role from **${rMember.user.username}**.`);

	},
};