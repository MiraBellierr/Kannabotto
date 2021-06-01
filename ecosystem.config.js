module.exports = {
	apps : [{
		name: 'jasmine',
		script: 'index.js',
		watch: true,
		watch_delay: 1000,
		ignore_watch: ['node_modules', 'database'],
	}],
};
