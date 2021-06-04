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