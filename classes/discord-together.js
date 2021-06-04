const axios = require('axios');
const defaultApplications = {
	youtube: '755600276941176913',
	poker: '755827207812677713',
	betrayal: '773336526917861400',
	fishing: '814288819477020702',
	chess: '832012586023256104',
};

class DiscordTogether {
	constructor(client, applications = defaultApplications) {
		if (!client) throw new SyntaxError('Invalid Discord.Client');

		this.client = client;
		this.applications = { ...defaultApplications, ...applications };
	}
	async createTogetherCode(voiceChannelId, option) {
		const returnData = {
			code: 'none',
		};

		if (option && this.applications[option.toLowerCase()]) {
			const applicationID = this.applications[option.toLowerCase()];

			try {
				await axios({
					method: 'post',
					url: `https://discord.com/api/v8/channels/${voiceChannelId}/invites`,
					headers: {
						Authorization: `Bot ${this.client.token}`,
						'Content-Type': 'application/json',
					},
					data: JSON.stringify({
						max_age: 86400,
						max_uses: 0,
						target_application_id: applicationID,
						target_type: 2,
						temporary: false,
						validate: null,
					}),
				}).then(res => {
					console.log(res.data);
					if (!res.data.code) {
						throw new Error('An error occured while retrieving data');
					}
					returnData.code = `https://discord.com/invite/${res.data.code}`;
				});
			}
			catch (e) {
				console.log(e);
			}
			return returnData;
		}
		else {
			throw new SyntaxError('Invalid option');
		}
	}
}

module.exports = DiscordTogether;