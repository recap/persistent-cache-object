const PersistentObject = require('../src/persistent-cache-object');
const fs = require('fs');
const assert = require('assert');

const map = new PersistentObject('./map.db', null, {'disableInterval': true});
const myArgs = process.argv.slice(2);
const something = myArgs[0] ? myArgs[0] : Math.floor(Math.random() * 100);


map.lock(() => {
	map.reload();
	map[something] = something;
	map.flush();
	map.unlock();
});
