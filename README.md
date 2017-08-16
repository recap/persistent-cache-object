#persistent-object
A simple JSON auto persistent object using files.

`const PeristentObject = require('persistent-object');`

`const map = new PersistentObject('./map.db');``

`map['key'] = 'value';`

`map.close();` 
