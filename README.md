## darner.js

A node.js client for [darner](https://github.com/wavii/darner).

## Install

```shell
npm install darner
```

## Usage

```javascript
var darner = require('darner');
var dc = darner.connect(22133, 'localhost');

dc.set('foo', 'bar');

dc.get('foo', function(err, reply){
  if (err) console.error(err)
  else console.log(reply);
});

dc.stats(function(err, stats){
  console.log('%j', stats);
});

dc.quit();
```

## TODO

 - multiple connections
 - type casting
 - clean up parser
 - gracefull quiting
 - benchmark something
 - lots more...

## Notes

To run the tests, be sure to install [darner](https://github.com/wavii/darner).

## Attribution

  - [node-memcached](https://github.com/3rd-Eden/node-memcached) - some RegExp parsing goodies.

## License

(The MIT License)

Copyright (c) 2012 Garrett Johnson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.