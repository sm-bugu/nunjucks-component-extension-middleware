var fs = require('fs');
var path = require('path');
var nunjucks = require('nunjucks');
var nunjucksComponentExtension = require('nunjucks-component-extension');
var extend = Object.assign || require('util')._extend;


function render(filePath) {
    return new Promise(function (resolve, reject) {
        fs.exists(filePath, function (exists) {
            if (exists) {
                nunjucks.render(filePath, function (err, str) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(str);
                    }
                });
            } else {
                reject();
            }

        });
    });
}

module.exports = function (viewPath, options) {

	if (!viewPath) {
		throw new Error('viewPath is required!')
	}

	var env = new nunjucks.configure(viewPath, extend({
	    watch: true
	}, options));

	env.addExtension('ComponentExtension', nunjucksComponentExtension);

	return function (req, res, next) {
	    var url = req.url;
	    var filePath = path.join(viewPath, url);

	    // 兼容 /
	    if (path.extname(url) == '') {
	    	url = path.join(url, 'index.html')
	    }
	    // 说明是.html后缀
	    if (path.extname(url) === '.html') {

	        render(filePath).then(function (str) {
	            var buf = new Buffer(str);

	            res.charset = res.charset || 'utf-8';
	            res.setHeader('Content-Type', res.getHeader('Content-Type') || 'text/html');
	            res.setHeader('Content-Length', buf.length);
	            res.end(buf);
	        }).catch(function (e) {
	            if (e) {
	            	console.log(e.stack)
	                res.writeHead(500, {'Content-Type': 'text/plain'});
	                res.end(e.stack);
	            } else {
	                res.writeHead(404, {'Content-Type': 'text/plain'});
	                res.end('404 error! File not found.');
	            }
	        });

	    } else {
	        next();
	    }
	}
}