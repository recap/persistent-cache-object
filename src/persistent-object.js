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

	function save(cb) {
		const data = stringify(object);
		fs.writeFile(file, data, (err) => {
			if (err && !cb) throw err;
			if (err && cb) cb(err, null);
			if (cb) cb(null, true);
			return;
		});
	}

	function flush(cb) {
		const currentHash = md5(stringify(object));
		if (hash !== currentHash) {
			hash = currentHash;
			save(cb);
		} else if(cb) {
			cb(null, true);
		}	
		
	}

	function close(cb) {
		clearInterval(interval);
		flush(cb);
	}

	if (!file) {
		throw Error("no file given!");
		return null;
	}

	try {
		const objectFromFile = fs.readFileSync(file, 'utf-8');
		object = new PersistObject(JSON.parse(objectFromFile));
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

	const intervalTime = (options && options.interval) ? options.interval : 5000;
	const noInterval = (options && options.disableInterval)
	let hash = md5(stringify(object));

	const interval = (!noInterval) ? (setInterval(() => {
		flush();
	}, intervalTime)) : null;

	return object;
}

module.exports = PersistObject;
