"use strict";
const fs = require('fs');
const md5 = require('js-md5');
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

	if (!file) {
		throw Error("no file given!");
	}

	try {
		const objectFromFile = fs.readFileSync(file, 'utf-8');
		const loadedObject = objectFromFile ? JSON.parse(objectFromFile) : {};
		object = new PersistObject(loadedObject);
	} catch (e) {
		if (e.code === "ENOENT") {
			object = new PersistObject(object || {});
			save();
		} else {
			throw e;
		}
	}

	PersistObject.prototype.close = close;
	PersistObject.prototype.flush = flush;
	PersistObject.prototype.clear = clear;
	PersistObject.prototype.set = set;
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
