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
const words = ['accountant', 'actor', 'actress', 'actuary', 'advisor', 'aide', 'ambassador', 'animator', 'archer', 'artist', 'astronaut', 'astronomer', 'athlete', 'attorney', 'auctioneer', 'author', 'babysitter', 'baker', 'ballerina', 'banker', 'barber', 'baseball player', 'basketball player', 'bellhop', 'biologist', 'blacksmith', 'bookkeeper', 'bowler', 'builder', 'butcher', 'butler', ' cab driver', 'calligrapher', 'captain', 'cardiologist', 'caregiver', 'carpenter', 'cartographer', 'cartoonist', 'cashier', 'catcher', 'caterer', 'cellist', 'chaplain', 'chauffeur', 'chef', 'chemist', 'clergyman', 'clergywoman', 'clerk', 'coach', 'cobbler', 'composer', 'concierge', 'consul', 'consul', 'constractor', 'cook', 'cop', 'coroner', 'courier', 'cryptographer', 'custodian', 'dancer', 'dentist', 'deputy', 'dermatologist', 'designer', 'detective', 'dictator', 'director', 'disc jockey', 'diver', 'doctor', 'doorman', 'driver', 'drummer', 'dry cleaner', 'ecologist', 'economist', 'editor', 'educator', 'electrician', 'emperor', 'empress', 'engineer', 'entertainer', 'entomologist', 'entrepreneur', 'executive', 'explorer', 'exporter', 'exterminator', 'extra', 'falconer', 'farmer', 'financier', 'firefighter', 'fisherman', 'flutist', 'football player', 'foreman', 'game designer', 'garbage man', 'gardener', 'gatherer', 'gemcutter', 'general', 'geneticist', 'geographer', 'geologist', 'golfer', 'governor', 'grover', 'guide', 'hairdresser', 'handyman', 'harpist', 'highway patrol', 'hobo', 'hunter', 'illustrator', 'requireer', 'instructor', 'intern', 'internist', 'interpreter', 'inventor', 'investigator', 'jailer', 'janitor', 'jester', 'jeweler', 'jockey', 'journalist', 'judge', 'karate teacher', 'laborer', 'landlord', 'landscaper', 'laundress', 'lawyer', 'lecturer', 'legal aide', 'librarian', 'librettist', 'lifeguard', 'linguist', 'lobbyist', 'locksmith', 'lyricist', 'magician', 'maid', 'mail carrier', 'manager', 'manufacturer', 'marine', 'marketer', 'mason', 'mathematician', 'mayor', 'mechanic', 'messenger', 'midwife', 'miner', 'model', 'monk', 'muralist', 'musician', 'navigator', 'negotiator', 'notary', 'novelist', 'nun', 'nurse', 'oboist', 'operator', 'ophthalmologist', 'optician', 'oracle', 'orderly', 'ornithologist', 'painter', 'paleontologist', 'paralegal', 'park ranger', 'pathologist', 'pawnbroker', 'peddler', 'pediatrician', 'percussionist', 'performer', 'pharmacist', 'philanthropist', 'philosopher', 'photographer', 'physician', 'physicist', 'pianist', 'pilot', 'pitcher', 'plumber', 'poet', 'police', 'policeman', 'policewoman', 'politician', 'president', 'prince', 'princess', 'principal', 'private', 'private detective', 'producer', 'professor', 'programmer', 'psychiatrist', 'psychologist', 'publisher', 'quarterback', 'quilter', 'radiologist', 'rancher', 'ranger', 'receptionist', 'referee', 'registrar', 'reporter', 'representative', 'researcher', 'restaurateur', 'retailer', 'retiree', 'sailor', 'salesperson', 'samurai', 'saxophonist', 'scholar', 'scientist', 'scout', 'scuba diver', 'seamstress', 'security guard', 'senator', 'sheriff', 'singer', 'smith', 'socialite', 'soldier', 'spy', 'star', 'statistician', 'stockbroker', 'street sweeper', 'student', 'surgeon', 'surveyor', 'swimmer', 'tailor', 'tax collector', 'taxi driver', 'taxidermist', 'teacher', 'technician', 'tennis player', 'test pilot', 'tiler', 'toolmaker', 'trader', 'trainer', 'translator', 'trash collector', 'travel agent', 'treasurer', 'truck driver', 'tutor', 'typist', 'umpire', 'undertaker', 'usher', 'valet', 'veteran', 'veterinarian', 'vicar', 'violinist', 'waiter', 'waitress', 'warden', 'warrior', 'watchmaker', 'weaver', 'welder', 'woodcarver', 'workman', 'wrangler', 'writer', 'xylophonist', 'yodeler', 'zookeeper', 'zoologist'];
const Models = require('../../create-model.js');
const { checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate, cooldown } = require('../../functions');

module.exports = {
	name: 'scramble',
	aliases: ['sc'],
	category: '[🎮] games',
	description: 'unscramble the scramble word. Won <a:jasminecoins:868105109748469780> 100 if you can guess it right.',
	example: `${bot_prefix}scramble`,
	run: async (client, message) => {
		const user = message.author.id;

		const Cooldown = Models.Cooldown();
		const Economy = Models.Economy();
		const Achievement = Models.Achievement();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkGuildDisable(message, 'games')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);
		if (await checkBlacklist(message, 'games')) return blacklistMessage(message);

		await createAllDataForNewUser(user);

		const economy = await getUserDataAndCreate(Economy, user);
		const achievement = await getUserDataAndCreate(Achievement, user);

		const timer = await cooldown('scramble', user, 15000);

		if (timer.bool) {
			message.reply(`**${message.author.username}**, please wait **${timer.seconds}s** till you can play again.`);
		}
		else {
			await Cooldown.update({ scramble: Date.now() }, { where: { userId: user } });

			const random = Math.floor(Math.random() * words.length);
			const word = words[random];
			const a1 = word.split(' ');

			if (!a1[1]) {
				const a = a1[0].split('');
				const n = a.length;

				for(let i = n - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					const tmp = a[i];
					a[i] = a[j];
					a[j] = tmp;
				}

				const scrambled = a.join('');
				const filter = m => message.author.id === m.author.id;
				const m = await message.reply(`${message.author.username}\nTheme: Job and Occupation\nUnscramble this scrambled word\n\`${scrambled}\``);

				const guess = await message.channel.awaitMessages({
					filter,
					max: 1,
					time: 30000,
				});

				if (!guess.size) {
					await message.reply(`Sorry, time is up! The answer was **${word}**`);
					return;
				}

				if (guess.first().content.toLowerCase() === word) {
					m.delete();

					await Economy.update({ balance: economy.get('balance') + 100 }, { where: { userId: user } });
					await Achievement.update({ scramble: achievement.get('scramble') + 1 }, { where: { userId: user } });

					message.reply(`You're correct! It was **${word}**. You won **<a:jasminecoins:868105109748469780> 100**.`);
				}
				else {
					m.delete();

					message.reply(`**${message.author.username}**, Too bad.. You couldn't guess it. The answer was **${word}**`);
				}
			}
			else {
				const a = a1[0].split('');
				const b = a1[1].split('');
				const n = a.length;
				const n1 = b.length;

				for(let i = n - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					const tmp = a[i];
					a[i] = a[j];
					a[j] = tmp;
				}

				for(let i = n1 - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					const tmp = b[i];
					b[i] = b[j];
					b[j] = tmp;
				}

				const scrambled = a.join('');
				const scrambled1 = b.join('');
				const scrambled2 = `${scrambled} ${scrambled1}`;
				const filter = m => message.author.id === m.author.id;
				const m = await message.reply(`${message.author.username}\nTheme: Job and Occupation\nUnscramble this scrambled word\n\`${scrambled2}\``);

				const guess = await message.channel.awaitMessages({
					filter,
					max: 1,
					time: 30000,
				});

				if (!guess.size) {
					await message.reply(`Sorry, time is up! The answer was **${word}**`);
					return;
				}

				if (guess.first().content.toLowerCase() === word) {
					m.delete();

					await Economy.update({ balance: economy.get('balance') + 100 }, { where: { userId: user } });

					message.reply(`You're correct! It was **${word}**. You won **<a:jasminecoins:868105109748469780> 100**.`);
				}
				else {
					m.delete();

					message.reply(`**${message.author.username}**, Too bad.. You couldn't guess it. The answer was **${word}**`);
				}
			}
		}
	},
};