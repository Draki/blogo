/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), http = require('http'), path = require('path'), partials = require('express-partials'), counter = require('./routes/count'), postController = require('./routes/post_controller.js'), util = require('util'), userController = require('./routes/user_controller.js'), sessionController = require('./routes/session_controller.js');

var app = express();

app.use(partials());
app.use(counter.count_mw());

// all environments
app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(require('connect-flash')());
	app.use(sessionController.sessionTimeout);	
	
	//Helper dinamico
	app.use(function(req, res, next) {
		// Hacer visible req.flash() en las vistas
		res.locals.flash = function() {
			return req.flash()
		};
		// Hacer visible req.session en las vistas
		res.locals.session = req.session;
		next();
	});

		
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(app.router);

	app.use(function(err, req, res, next) {
		if (util.isError(err)) {
			next(err);
		} else {
			console.log(err);
			req.flash('error', err);
			res.redirect('/');
		}
	});

});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
} else {
	app.use(express.errorHandler());
}

app.locals.escapeText = function(text) {
	return String(text).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '<br>');
};

// Autoload
app.param('postid', postController.load);

// Routes
app.get('/', routes.index);

app.get('/posts.:format?', postController.index);
app.get('/posts/new', sessionController.requiresLogin, postController.new);
app.get('/posts/:postid([0-9]+).:format?', postController.show);
app.post('/posts', sessionController.requiresLogin, postController.create);
app.get('/posts/:postid([0-9]+)/edit', sessionController.requiresLogin, postController.edit);
app.put('/posts/:postid([0-9]+)', sessionController.requiresLogin, postController.update);
app.delete ('/posts/:postid([0-9]+)', sessionController.requiresLogin, postController.destroy);
app.get('/posts/search', postController.search);

app.param('userid', userController.load);
app.get('/users', userController.index);
app.get('/users/new', userController.new);
app.get('/users/:userid([0-9]+)', userController.show);
app.post('/users', userController.create);
app.get('/users/:userid([0-9]+)/edit', sessionController.requiresLogin, userController.edit);
app.put('/users/:userid([0-9]+)', sessionController.requiresLogin, userController.update);
app.delete ('/users/:userid([0-9]+)', sessionController.requiresLogin, userController.destroy);

app.get('/login', sessionController.new);
app.post('/login', sessionController.create);
app.get('/logout', sessionController.destroy);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
