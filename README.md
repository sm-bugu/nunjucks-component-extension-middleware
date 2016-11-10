nunjucks-component-extension-middleware
------

nunjucks-component-extension for express or connect

## options

1. viewPath: view path, this is required.
2. config: nunjucks config, default watch is true, this is not required.

## use case

```js

var path = require('path');
var express = require('express');
var app = express();


app.use(require('nunjucks-component-extension-middleware')(path.join(__dirname, 'views'), {
	noCache: true
}));

```

then, you can use nunjucks and [nunjucks-component-extension](https://github.com/sm-bugu/nunjucks-component-extension) !
