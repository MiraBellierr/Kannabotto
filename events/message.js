const { bot_prefix } = require('../config.json');
const timeoutxp = new Set();
const prefixes = require('../database/prefix.json');
const Models = require('../create-model');

module.exports = async (client, message) => {
	if (!prefixes[message.guild.id]) {
		prefixes[message.guild.id] = bot_prefix;
	}

	if (message.mentions.users.first() === client.user) message.channel.send(`My prefix for this guild is \`${prefixes[message.guild.id]}\`. Type \`${prefixes[message.guild.id]}help\` for more info about me. `);

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
		message.reply(`there was an error trying to execute that command! \n\`${error}\` Report it by using \`${prefixes[message.guild.id]}suggest\`.`);
	}

	const totalBankAdd = Math.floor(Math.random() * 1) + 5;
	if (timeoutxp.has(message.author.id)) return;

	const Economy = Models.Economy();
	if (!await Economy.findOne({ where: { userId: message.author.id } })) {
		await Economy.create({
			userId: message.author.id,
		});
	}
	const economy = await Economy.findOne({ where: { userId: message.author.id } });

	const curTotalBank = economy.get('totalBank');
	await Economy.update({ totalBank: curTotalBank + totalBankAdd }, { where: { userId: message.author.id } });

	timeoutxp.add(message.author.id);
	setTimeout(() => timeoutxp.delete(message.author.id), 60000);
};