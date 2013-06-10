var models = require('../models/models.js');
var crypto = require('crypto');
var counter = require('./count');
var util = require('util');

/*
 * Auto-loading con app.param
 */
exports.load = function(req, res, next, id) {
	models.User.find({
		where : {
			id : Number(id)
		}
	}).success(function(user) {
		if (user) {
			req.user = user;
			next();
		} else {
			req.flash('error', 'No existe el usuario con id=' + id + '.');
			next('No existe el usuario con id=' + id + '.');
		}
	}).error(function(error) {
		next(error);
	});
};

// ----------------------------------
// Rutas
// ----------------------------------
// GET /users
exports.index = function(req, res, next) {
	models.User.findAll({
		offset: req.pagination.offset,
		limit: req.pagination.limit,
		order : 'name'
	}).success(function(users) {
		res.render('users/index', {
			users : users,
			visitas : counter.getCount()
		});
	}).error(function(error) {
		next(error);
	});
};

// GET /users/33
exports.show = function(req, res, next) {
	res.render('users/show', {
		user : req.user,
		visitas : counter.getCount()
	});
};
// GET /users/new
exports.new = function(req, res, next) {
	var user = models.User.build({
		login : 'Tu login',
		name : 'Tu nombre',
		email : 'Tu email'
	});
	res.render('users/new', {
		user : user,
		visitas : counter.getCount()
	});
};
// GET /users/33/edit
exports.edit = function(req, res, next) {
	res.render('users/edit', {
		user : req.user,
		visitas : counter.getCount()
	});
};

// POST /users
exports.create = function(req, res, next) {
	var user = models.User.build({
		login : req.body.user.login,
		name : req.body.user.name,
		email : req.body.user.email,
	});
	// El login debe ser unico:
	models.User.find({
		where : {
			login : req.body.user.login
		}
	})// no se usa “built”, se busca en la BD
	.success(function(existing_user) {
		if (existing_user) {
			req.flash('error', "Error: El usuario \"" + req.body.user.login + "\" ya existe.");
			res.render('users/new', {
				user : user,
				validate_errors : {
					login : 'El usuario \"' + req.body.user.login + '\" ya existe.'
				},
				visitas : counter.getCount()
			});
			return;
		} else {
			var validate_errors = user.validate();
			// El password no puede estar vacio
			if (!req.body.user.password) {
				if (!validate_errors) {
					validate_errors = new Object();
				};
				validate_errors.password = 'El campo Password es obligatorio.';
			};
			if (validate_errors) {
				req.flash('error', 'Los datos del formulario son incorrectos.');
				for (var err in validate_errors) {
					req.flash('error', validate_errors[err]);
				};
				res.render('users/new', {
					user : user,
					validate_errors : validate_errors,
					visitas : counter.getCount()
				});
				return;
			};

			user.salt = createNewSalt();
			user.hashed_password = encriptarPassword(req.body.user.password, user.salt);
			user.save().success(function() {
				req.flash('success', 'Usuario creado con éxito.');
				res.redirect('/users');
			}).error(function(error) {
				next(error);
			});
		}
	}).error(function(error) {
		next(error);
	});
};

// PUT /users/33
exports.update = function(req, res, next) {
	//req.user.login = req.body.user.login;
	req.user.name = req.body.user.name;
	req.user.email = req.body.user.email;
	req.user.old_password = req.body.user.old_password;

	var validate_errors = req.user.validate();
	if (validate_errors) {
		console.log("Errores de validación:", validate_errors);
		req.flash('error', 'Los datos del formulario son incorrectos.');
		for (var err in validate_errors) {
			req.flash('error', validate_errors[err]);
		};
		res.render('users/edit', {
			user : req.user,
			validate_errors : validate_errors,
			visitas : counter.getCount()
		});
		return;
	}
	var fields_to_update = ['name', 'email'];
	if (req.body.user.password) {// ¿Cambio el password?
		console.log('Hay que actualizar el password');
		require('./user_controller').autenticar(req.session.user.login, req.user.old_password, function(error, user) {
			if (error) {
				if (util.isError(error)) {
					next(error);
				} else {
					req.flash('error', 'Se ha producido un error: ' + error);
					res.render('users/edit', {
						user : req.user,
						visitas : counter.getCount()
					});
				}
				return;
			}

			req.user.salt = createNewSalt();
			req.user.hashed_password = encriptarPassword(req.body.user.password, req.user.salt);
			fields_to_update.push('salt');
			fields_to_update.push('hashed_password');
		});
	}
	req.user.save(fields_to_update).success(function() {
		req.session.user.name = req.user.name;
		req.flash('success', 'Usuario actualizado con éxito.');
		res.redirect('/users');
	}).error(function(error) {
		next(error);
	});

};

// DELETE /users/33
exports.destroy = function(req, res, next) {
	var Sequelize = require('sequelize');
	var chainer = new Sequelize.Utils.QueryChainer
	// Obtener los posts
	req.user.getPosts().success(function(posts) {
		for (var i in posts) {
			// Eliminar un post
			chainer.add(posts[i].destroy());
		};
		req.user.getFavourites().success(function(favourites) {
			for (var i in favourites) {
				// Eliminar los favoritos asociados a este post
				chainer.add(favourites[i].destroy());
			};
			// Eliminar el usuario
			chainer.add(req.user.destroy());
			// Ejecutar el chainer
			chainer.run().success(function() {
				req.flash('success', 'Usuario eliminado con éxito.');
				res.redirect('/users');
			}).error(function(errors) {
				next(errors[0]);
			})
		}).error(function(error) {
			next(error);
		});
	}).error(function(error) {
		next(error);
	});
};

function createNewSalt() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
};
function encriptarPassword(password, salt) {
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
};
exports.autenticar = function(login, password, callback) {
	models.User.find({
		where : {
			login : login
		}
	}).success(function(user) {
		if (user) {
			if (user.hashed_password == "" && password == "") {
				callback(null, user);
				return;
			}
			var hash = encriptarPassword(password, user.salt);
			if (hash == user.hashed_password) {
				callback(null, user);
			} else {
				callback('Password erróneo.');
			};
		} else {
			callback('No existe ningún usuario registrado con ese login.');
		}
	}).error(function(err) {
		callback(err);
	});
};

/*
 * Comprueba que el usuario logeado es el usuario al
 * que se refiere esta ruta.
 */
exports.loggedUserIsUser = function(req, res, next) {
	if (req.session.user && ((req.session.user.id == req.user.id) || (req.session.user.login == "admin"))) {
		next();
	} else {
		console.log('Ruta prohibida: no soy el usuario logeado.');
		res.send(403);
	}
};

