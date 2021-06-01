const { ShardingManager } = require('discord.js');
const { TOKEN } = require('./config.json');
const manager = new ShardingManager('./bot.js', { token: TOKEN });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();