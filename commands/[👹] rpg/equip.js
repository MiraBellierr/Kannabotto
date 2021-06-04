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

const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model.js');

module.exports = {
	name: 'equip',
	description: 'equip the weapon that is in your bag',
	category: '[👹] rpg',
	example: `${bot_prefix}equip <weapon | none>`,
	usage: '<weapon | none>',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Bag = Models.Bag();
		const Player = Models.Player();

		if (!await Bag.findOne({ where: { userId: user } })) {
			await Bag.create({
				userId: user,
			});
		}
		const bag = await Bag.findOne({ where: { userId: user } });


		const player = await Player.findOne({ where: { userId: user } });

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!player) return message.channel.send(result);
		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}equip <weapon>\`.`);
		const content = args[0].toLowerCase();
		if (content === 'sword') {
			if (bag.get('sword') === 0) return message.channel.send(`**${message.author.username}**, You don't have this weapon.`);
			if (bag.get('weapon') === 'No Weapon') {
				await Bag.update({ weapon: '<:sword:843066591628492810> Sword' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:sword:843066591628492810> Sword to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:staff:843066639834021909> Staff') {
				await Bag.update({ weapon: '<:sword:843066591628492810> Sword' }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 10 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:sword:843066591628492810> Sword to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:shield:726977268760707142> Shield') {
				await Bag.update({ weapon: '<:sword:843066591628492810> Sword' }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') - 5 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:sword:843066591628492810> Sword to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '🏹 Bow') {
				await Bag.update({ weapon: '<:sword:843066591628492810> Sword' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 6 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 4 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:sword:843066591628492810> Sword to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<a:fireSword:843064948262305812> Fire Sword') {
				await Bag.update({ weapon: '<:sword:843066591628492810> Sword' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:sword:843066591628492810> Sword to ${player.get('name')}!`);
			}
			else {
				message.channel.send(`**${message.author.username}**, You are currently equipped this weapon!`);
			}
		}
		else if (content === 'staff') {
			if (bag.get('staff') === 0) return message.channel.send(`**${message.author.username}**, You don't have this weapon.`);
			if (bag.get('weapon') === 'No Weapon') {
				await Bag.update({ weapon: '<:staff:843066639834021909> Staff' }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:staff:843066639834021909> Staff to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:sword:843066591628492810> Sword') {
				await Bag.update({ weapon: '<:staff:843066639834021909> Staff' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 10 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:staff:843066639834021909> Staff to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:shield:726977268760707142> Shield') {
				await Bag.update({ weapon: '<:staff:843066639834021909> Staff' }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') - 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:staff:843066639834021909> Staff to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '🏹 Bow') {
				await Bag.update({ weapon: '<:staff:843066639834021909> Staff' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 6 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 4 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:staff:843066639834021909> Staff to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<a:fireSword:843064948262305812> Fire Sword') {
				await Bag.update({ weapon: '<:staff:843066639834021909> Staff' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:staff:843066639834021909> Staff to ${player.get('name')}!`);
			}
			else {
				message.channel.send(`**${message.author.username}**, You are currently equipped this weapon!`);
			}
		}
		else if (content === 'shield') {
			if (bag.get('shield') === 0) return message.channel.send(`**${message.author.username}**, You don't have this weapon.`);
			if (bag.get('weapon') === 'No Weapon') {
				await Bag.update({ weapon: '<:shield:726977268760707142> Shield' }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') + 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:shield:726977268760707142> Shield to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:sword:843066591628492810> Sword') {
				await Bag.update({ weapon: '<:shield:726977268760707142> Shield' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 10 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:shield:726977268760707142> Shield to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:staff:843066639834021909> Staff') {
				await Bag.update({ weapon: '<:shield:726977268760707142> Shield' }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') + 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:shield:726977268760707142> Shield to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '🏹 Bow') {
				await Bag.update({ weapon: '<:shield:726977268760707142> Shield' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 6 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 4 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') + 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:shield:726977268760707142> Shield to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<a:fireSword:843064948262305812> Fire Sword') {
				await Bag.update({ weapon: '<:shield:726977268760707142> Shield' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') + 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <:shield:726977268760707142> Shield to ${player.get('name')}!`);
			}
			else {
				message.channel.send(`**${message.author.username}**, You are currently equipped this weapon!`);
			}
		}
		else if (content === 'bow') {
			if (bag.get('bow') === 0) return message.channel.send(`**${message.author.username}**, You don't have this weapon.`);
			if (bag.get('weapon') === 'No Weapon') {
				await Bag.update({ weapon: '🏹 Bow' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 6 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 4 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped 🏹 Bow to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:sword:843066591628492810> Sword') {
				await Bag.update({ weapon: '🏹 Bow' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 10 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 6 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 4 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped 🏹 Bow to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:staff:843066639834021909> Staff') {
				await Bag.update({ weapon: '🏹 Bow' }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 10 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 6 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 4 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped 🏹 Bow to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:shield:726977268760707142> Shield') {
				await Bag.update({ weapon: '🏹 Bow' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 6 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 4 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') - 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped 🏹 Bow to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<a:fireSword:843064948262305812> Fire Sword') {
				await Bag.update({ weapon: '🏹 Bow' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') + 4 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 6 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped 🏹 Bow to ${player.get('name')}!`);
			}
			else {
				message.channel.send(`**${message.author.username}**, You are currently equipped this weapon!`);
			}
		}
		else if (content === 'fire-sword') {
			if (bag.get('swordFire') === 0) return message.channel.send(`**${message.author.username}**, You don't have this weapon.`);
			if (bag.get('weapon') === 'No Weapon') {
				await Bag.update({ weapon: '<a:fireSword:843064948262305812> Fire Sword' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <a:fireSword:843064948262305812> Fire Sword to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:sword:843066591628492810> Sword') {
				await Bag.update({ weapon: '<a:fireSword:843064948262305812> Fire Sword' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 10 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <a:fireSword:843064948262305812> Fire Sword to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:staff:843066639834021909> Staff') {
				await Bag.update({ weapon: '<a:fireSword:843064948262305812> Fire Sword' }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 10 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <a:fireSword:843064948262305812> Fire Sword to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:shield:726977268760707142> Shield') {
				await Bag.update({ weapon: '<a:fireSword:843064948262305812> Fire Sword' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 5 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') - 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <a:fireSword:843064948262305812> Fire Sword to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '🏹 Bow') {
				await Bag.update({ weapon: '<a:fireSword:843064948262305812> Fire Sword' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') + 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') + 5 }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 4 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 6 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped <a:fireSword:843064948262305812> Fire Sword to ${player.get('name')}!`);
			}
			else {
				message.channel.send(`**${message.author.username}**, You are currently equipped this weapon!`);
			}
		}
		else if (content === 'none') {
			if (bag.get('weapon') === '<a:fireSword:843064948262305812> Fire Sword') {
				await Bag.update({ weapon: 'No Weapon' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 5 }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped No Weapon to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:sword:843066591628492810> Sword') {
				await Bag.update({ weapon: 'No Weapon' }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped No Weapon to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:staff:843066639834021909> Staff') {
				await Bag.update({ weapon: 'No Weapon' }, { where: { userId: user } });
				await Player.update({ magicalAttack: player.get('magicalAttack') - 10 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped No Weapon to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '<:shield:726977268760707142> Shield') {
				await Bag.update({ weapon: 'No Weapon' }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 5 }, { where: { userId: user } });
				await Player.update({ magicalResistance: player.get('magicalResistance') - 5 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped No Weapon to ${player.get('name')}!`);
			}
			else if (bag.get('weapon') === '🏹 Bow') {
				await Bag.update({ weapon: 'No Weapon' }, { where: { userId: user } });
				await Player.update({ physicalResistance: player.get('physicalResistance') - 4 }, { where: { userId: user } });
				await Player.update({ physicalAttack: player.get('physicalAttack') - 6 }, { where: { userId: user } });
				message.channel.send(`**${message.author.username}**, you have equipped No Weapon to ${player.get('name')}!`);
			}
			else {
				message.channel.send(`**${message.author.username}**, You are currently equipped no weapon!`);
			}
		}
		else {
			message.channel.send(`**${message.author.username}**, You don't own that weapon!??`);
		}
	},
};