const { bot_prefix } = require('../../config.json');
const DiscordTogether = require('../../classes/discord-together');

module.exports = {
	name: 'watch2gether',
	aliases: ['watch'],
	description: 'watch youtube, play poker, chess, betrayal and fishing together in voice channel',
	example: `${bot_prefix}watch2gether <youtube | poker | chess | betrayal | fishing>`,
	usage: '<youtube | poker | chess | betrayal | fishing>',
	run: async (client, message, args) => {
		if (!message.member.voice) return message.channel.send('Please join the voice channel first.');
		try {
			client.discordTogether = new DiscordTogether(client);

			client.discordTogether.createTogetherCode(message.member.voice.channelID, args[0]).then(async invite => {
				return message.channel.send(`${invite.code}`);
			});
		}
		catch (e) {
			return message.channel.send(e.message);
		}
	},
};