var pejs = require('pejs');
var root = require('root');
var rex = require('rex');
var common = require('common');
var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var crypto = require('crypto');
var marked = require('marked');
var less = require('less');

var DB_CONNECTION = ''+fs.readFileSync('dbpass.txt');
var db = require('mongojs').connect(DB_CONNECTION, ['tmp']);

var app = root('auth');
var template = pejs('./app');

app.use(root.json);
app.use(root.query);

app.use('/js', rex('app', {
	dependencies: {
		jQuery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'
	}
}));
app.fn('response.render', function(filename, options) {
	var self = this;

	template.render(filename, options, function(err, data) {
		if (err) return self.next(err.code !== 'ENOENT' && err);
		self.setHeader('content-type', 'text/html; charset=utf-8');
		self.end(data);
	});
});

app.use('/css/base.css', function(req, res, next) {
	var parser = new(less.Parser);

	fs.readFile('./app/base.css', 'utf-8', function(err, data) {
		if (err) return next(err);

		parser.parse(data, function(err, tree) {
			if (err) return next(err);

			try {
				data = tree.toCSS();				
			} catch (err) {
				return next(new Error('Line '+err.line+': '+err.message));
			}

			res.setHeader('content-type', 'text/css; charset=utf-8');
			res.setHeader('content-length', Buffer.byteLength(data));
			res.end(data);
		});
	});
});
app.get('/', function(req, res, onerror) {
	res.render('index.html');
});
app.get('/static/*', function(req, res, onerror) {
	// TODO - add real static middleware
	fs.readFile('public/'+req.params.wildcard, function(err, data) {
		if (err) {
			onerror(err);
			return;
		}

		res.end(data);
	});
});

app.listen(9009);