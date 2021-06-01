const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './database/database.sqlite',
});

module.exports = {
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
			commonFish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			uncommonFish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			rareFish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			legendaryFish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			hunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			commonHunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			uncommonHunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			rareHunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			mythicalHunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			legendaryHunt: {
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
				defaultValue: 500,
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
			fishingRod: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			huntingRifle: {
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
			commonFish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			uncommonFish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			rareFish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			legendaryFish: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			commonHunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			uncommonHunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			rareHunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			mythicalHunt: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false,
			},
			legendaryHunt: {
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
			swordFire: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
		});
		Bag.sync();

		return Bag;
	},
};