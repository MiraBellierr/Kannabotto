const EventEmitter = require('events');

class Time extends EventEmitter {
	constructor(time) {
		super();

		this.time = new Date(time);
	}
	getCurrentMinutes() {
		return new Date(Date.now()).getMinutes();
	}
	start() {
		setInterval(() => {
			if (this.time.getMinutes() !== this.getCurrentMinutes()) {
				this.emit('time', new Date(Date.now()));

				this.time = new Date();
			}
		}, 1000);

	}
}

module.exports = Time;
