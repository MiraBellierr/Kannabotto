module.exports = {
	canModifyQueue(member) {
		const { channel } = member.voice;
		const botChannel = member.guild.me.voice.channel;

		if (channel !== botChannel) {
			return false;
		}

		return true;
	},
};