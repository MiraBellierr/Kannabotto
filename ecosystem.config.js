module.exports = {
	apps : [{
		name: 'kanna',
		script: 'index.js',
		watch: true,
		watch_delay: 1000,
		ignore_watch: ['node_modules', 'database', 'images'],
	}],
};
