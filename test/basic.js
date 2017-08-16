const PersistentObject = require('../src/persistent-object');
const fs = require('fs');
const assert = require('assert');

const map = new PersistentObject('./map.db');

map['hello'] = 'world';

map.setInterval(10000);
map.flush();
map.close((err)=>{
	const reloadMap = new PersistentObject('./map.db');
	reloadMap['key2'] = 'value2';
	assert.deepEqual({'hello':'world', 'key2':'value2'}, reloadMap);
	console.log("test ok.");
	reloadMap.close();
	fs.unlinkSync('./map.db');
});




