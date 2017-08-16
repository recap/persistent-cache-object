# persistent-object
A simple JSON auto persistent object using files.

## example 1

``` js 
const PersistentObject = require('persistent-object');
const map = new PersistentObject('./map.db');
map['key'] = 'value';
map.close();
```
## example 2
By default the persistent object will update the file every 5 seconds only if the object has changed since. This can be controlled or disabled when 
initializing the Object. `flush()` must be used to manually write to file.

``` js
const PersistentObject = require('persistent-object', null, {'disableInterval': true});
const map = new PersistentObject('./map.db');
map['key'] = 'value';
map.flush();
map['key2'] = 'value2';
map.close();
```

## example 3 
The file update interval timer can also be set on initialization. Setting the interval to 10s.

``` js
const PersistentObject = require('persistent-object', null, {interval: 10000});
const map = new PersistentObject('./map.db');
map['key'] = 'value';
map.setInterval(-1);
```
