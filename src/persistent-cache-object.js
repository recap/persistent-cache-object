"use strict";
const fs = require('fs');
const md5 = require('js-md5');
const _ = require('underscore');
const stringify = require('json-stable-stringify');


var PersistObject = function(file, object, options, cb) {
	class PersistObject extends Object {
		constructor(o) {
			super();
			if (o) {
				Object.keys(o).forEach(k => {
					this[k] = o[k];
				});
			}
			return this;
		}
	}

	function clear(cb) {
		object = {};
		flush(cb);
	}

	function set(data, cb) {
		object = data;
		flush(cb);
	}

	function lock() {
		const cb = arguments[arguments.length - 1];
		const timeout = (arguments.length > 1) ? arguments[0] : undefined;
		const lockFile = file + '.lock';
		const l = setInterval(() => {
			l._repeat = 500;
			fs.open(lockFile, 'wx', (err, fd) => {
				if (!err) {
					clearInterval(l);
					if (timeout) {
						setTimeout(() => {
							unlock();
						}, timeout);
					}
					cb(null, true);
				}
			});
		}, 0);
	}

	function unlock(cb) {
		const lockFile = file + '.lock';
		fs.unlink(lockFile, (err) => {
			//whatever
		});
	}

	function save(cb) {
		const data = stringify(object);
		try {
			fs.writeFileSync(file, data);
			if (cb) {
				cb(null, true);
			}
			return;
		} catch (error) {
			if (cb) {
				cb(error, null);
			} else {
				throw error;
			}
			return;
		}
	}

	function flush(cb) {
		const currentHash = md5(stringify(object));
		if (hash !== currentHash) {
			hash = currentHash;
			save(cb);
		} else if (cb) {
			cb(null, true);
		}

	}

	function close(cb) {
		clearInterval(interval);
		flush(cb);
	}

	function reload(cb) {
		const objectFromFile = fs.readFileSync(file, 'utf-8');
		const savedObject = JSON.parse(objectFromFile);
		
		if (savedObject) {
			const savedKeys = Object.keys(savedObject);
			const thisObjectKeys = Object.keys(object);
			const diff = _.difference(thisObjectKeys, savedKeys);
			diff.forEach((key) => {
				delete object[key];
			});
			savedKeys.forEach((key) => {
				object[key] = savedObject[key];
			});
		}

		if (cb) {
			cb(null, true);
		}
	}

	if (!file) {
		throw Error("no file given!");
	}

	let tries = 0;
	while(tries <= 5) {
		try {
			tries++;
			const objectFromFile = fs.readFileSync(file, 'utf-8');
			const loadedObject = objectFromFile ? JSON.parse(objectFromFile) : {};
			object = new PersistObject(loadedObject);
			break;
		} catch (e) {
			if (e.code === "ENOENT") {
				object = new PersistObject(object || {});
				save();
				break;
			} else {
				if (tries > 5) {
					throw e;
				}
			}
		}
	}

	PersistObject.prototype.close = close;
	PersistObject.prototype.flush = flush;
	PersistObject.prototype.clear = clear;
	PersistObject.prototype.set = set;
	PersistObject.prototype.lock = lock;
	PersistObject.prototype.unlock = unlock;
	PersistObject.prototype.reload = reload;

	PersistObject.prototype.setInterval = function(intervalStep) {
		if (intervalStep === -1) {
			clearInterval(interval);
		}
		if (!isNaN(intervalStep)) {
			clearInterval(interval);
			interval = setInterval(() => {
				flush();
			}, intervalStep);
		}
	};


	let intervalTime = (options && options.interval) ? options.interval : 5000;
	const noInterval = (options && options.disableInterval);
	let hash = md5(stringify(object));

	let interval = (!noInterval) ? (setInterval(() => {
		flush();
	}, intervalTime)) : null;

	return object;
};

module.exports = PersistObject;
