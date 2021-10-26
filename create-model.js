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

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './database/database.sqlite',
});

module.exports = {
	Session: function() {
		const Session = sequelize.define('Session', {
			sid: {
				type: Sequelize.STRING,
				primaryKey: true,
			},
			userId: Sequelize.STRING,
			expires: Sequelize.DATE,
			data: Sequelize.TEXT,
		});
		Session.sync();

		return Session;
	},
	UserSchema: function() {
		const UserSchema = sequelize.define('User', {
			discordId: {
				type: Sequelize.STRING,
				unique: true,
			},
			discordTag: {
				type: Sequelize.STRING,
			},
			avatar: {
				type: Sequelize.STRING,
			},
			guilds: {
				type: Sequelize.ARRAY(Sequelize.JSON),
			},
		});
		UserSchema.sync();

		return UserSchema;
	},
	Disable: function() {
		const Disable = sequelize.define('disable', {
			guildId: {
				type: Sequelize.STRING,
				unique: true,
			},
			economy: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			games: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			reason1: {
				type: Sequelize.TEXT,
				defaultValue: 'None',
			},
			reason2: {
				type: Sequelize.INTEGER,
				defaultValue: 'None',
			},
		});
		Disable.sync();

		return Disable;
	},
	Achievement: function() {
		const Achievement = sequelize.define('achievement', {
			userId: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			beg: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			youtube: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			website: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			product: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			media: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			crime: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			daily: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			fish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			junk: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			tuna: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			goldfish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			squid: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			whale: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			hunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			rabbit: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			turkey: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			pig: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			deer: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			dragon: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			rob: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			transfer: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			gifted: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			weekly: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			work: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			coinflip: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			hangman: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			green: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			black: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			red: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			rps: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			scramble: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			slots: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
		});
		Achievement.sync();

		return Achievement;
	},
	Economy: function() {
		const Economy = sequelize.define('economy', {
			userId: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			balance: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			bank: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			totalBank: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
		});
		Economy.sync();

		return Economy;
	},
	Player: function() {
		const Player = sequelize.define('player', {
			userId: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			start: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			name: Sequelize.TEXT,
			class: Sequelize.STRING,
			level: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			xp: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			totalXp: {
				type: Sequelize.BIGINT,
				defaultValue: 100,
				allowNull: false,
			},
			rank: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			health: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			physicalAttack: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			magicalAttack: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			physicalResistance: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			magicalResistance: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			speed: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			image: Sequelize.TEXT,
			battle: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			won: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			tie: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			lost: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
		});
		Player.sync();

		return Player;
	},
	Inventory: function() {
		const Inventory = sequelize.define('inventory', {
			userId: {
				type: Sequelize.STRING,
				unique: true,
			},
			bunny: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			dog: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			'fishing-rod': {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			'hunting-rifle': {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			laptop: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			pickaxe: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			junk: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			tuna: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			'goldfish': {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			squid: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			whale: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			rabbit: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			turkey: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			pig: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			deer: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			dragon: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			iron: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			copper: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			gold: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			bauxite: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			manganese: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			bear: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			guard: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			bunny2: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
		});
		Inventory.sync();

		return Inventory;
	},
	Level: function() {
		const Level = sequelize.define('level', {
			userId: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			xp: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			level: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
		});
		Level.sync();

		return Level;
	},
	Blacklist: function() {
		const Blacklist = sequelize.define('blacklist', {
			userId: {
				type: Sequelize.STRING,
				unique: true,
			},
			blacklist: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			games: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			reason1: Sequelize.TEXT,
			reason2: Sequelize.TEXT,
		});
		Blacklist.sync();

		return Blacklist;
	},
	Cooldown: function() {
		const Cooldown = sequelize.define('cooldown', {
			userId: {
				type: Sequelize.STRING,
				unique: true,
			},
			work: Sequelize.INTEGER,
			crime: Sequelize.INTEGER,
			daily: Sequelize.INTEGER,
			fish: Sequelize.INTEGER,
			dig: Sequelize.INTEGER,
			hunt: Sequelize.INTEGER,
			rob: Sequelize.INTEGER,
			gotRobbed: Sequelize.INTEGER,
			weekly: Sequelize.INTEGER,
			beg: Sequelize.INTEGER,
			business: Sequelize.INTEGER,
			hangman: Sequelize.INTEGER,
			roulette: Sequelize.INTEGER,
			rps: Sequelize.INTEGER,
			slots: Sequelize.INTEGER,
			scramble: Sequelize.INTEGER,
			coinflip: Sequelize.INTEGER,
			guard: Sequelize.INTEGER,
			bear: Sequelize.INTEGER,
			battle: Sequelize.INTEGER,
			train: Sequelize.INTEGER,
		});
		Cooldown.sync();

		return Cooldown;
	},
	Bag: function() {
		const Bag = sequelize.define('bag', {
			userId: {
				type: Sequelize.STRING,
				unique: true,
			},
			weapon: {
				type: Sequelize.TEXT,
				defaultValue: 'No Weapon',
				allowNull: false,
			},
			sword: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			staff: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			shield: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			bow: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			'fire-sword': {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
		});
		Bag.sync();

		return Bag;
	},
	Images: function() {
		const Images = sequelize.define('image', {
			data: {
				type: Sequelize.JSON,
			},
		});
		Images.sync();

		return Images;
	},
};