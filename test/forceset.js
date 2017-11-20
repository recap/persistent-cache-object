const PersistentObject = require('../src/persistent-cache-object');
const fs = require('fs');
const assert = require('assert');

const map = new PersistentObject('./map.db', null, {'disableInterval': true});

map['somekey'] = 'somevalue';
map.flush();
map.set({'key': 1});

map.close((err)=>{
	const reloadMap = new PersistentObject('./map.db', null, {'disableInterval': true});
	if (Object.keys(reloadMap).length === 1 && reloadMap.key === 1) {
		console.log("test ok.");
	}
	reloadMap.close();
});




