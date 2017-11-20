const PersistentObject = require('../src/persistent-cache-object');
const fs = require('fs');
const assert = require('assert');

const map = new PersistentObject('./map.db', null, {'disableInterval': true});
const myArgs = process.argv.slice(2);

let count = 0;
Object.keys(map).forEach((i) => {
	count++;

});

console.log(count);

