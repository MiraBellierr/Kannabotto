module.exports = (client, closeEvent, id) => {
	console.log(`[WARN] SHARD DISCONNECT\ncloseEvent: ${closeEvent}\nid: ${id}`);
};