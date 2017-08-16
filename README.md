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
const PersistentObject = require('persistent-object');
const map = new PersistentObject('./map.db', null, {'disableInterval': true});
map['key'] = 'value';
map.flush();
map['key2'] = 'value2';
map.close();
```

## example 3 
The file update interval timer can also be set on initialization. This example sets the interval to 10s and disabling it later.

``` js
const PersistentObject = require('persistent-object');
const map = new PersistentObject('./map.db', null, {interval: 10000});
map['key'] = 'value';
map.setInterval(-1);
```

## example 4
Initialize persistent object with and existing object.

``` js 
const map = new PersistentObject('./map.db', {'key':'value'});
```

