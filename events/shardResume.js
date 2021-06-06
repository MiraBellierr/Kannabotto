module.exports = (client, id, replayedEvent) => {
	console.log(`[LOG] Shard ${id} is resuming`);
	console.log(`[LOG] Replayed Event: ${replayedEvent}`);
};