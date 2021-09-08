module.exports = {
	name: 'ping',
	description: 'pong',
	category: '[✨] utility',
	run: async (client, interaction) => {
		interaction.reply(`pong! ${client.ws.ping}ms`);
	},
};