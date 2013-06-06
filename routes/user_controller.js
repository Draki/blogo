var models = require('../models/models.js');
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
		order : 'name'
	}).success(function(users) {
		res.render('users/index', {
			users : users
		});
	}).error(function(error) {
		next(error);
	});
};

// GET /users/33
exports.show = function(req, res, next) {
	res.render('users/show', {
		user : req.user
	});
};
// GET /users/new
exports.new = function(req, res, next) {
	var user = model.user.build({
		login : 'Tu login',
		name : 'Tu nombre',
		email : 'Tu email'
	});
	res.render('users/new', {
		user : user
	});
};
// GET /users/33/edit
exports.edit = function(req, res, next) {
	res.render('users/edit', {
		user : req.user
	});
};

// POST /users
exports.create = function(req, res, next) {
	var user = models.User.build({
		login : req.body.user.login,
		name : req.body.user.name,
		email : req.body.user.email,
		hashed_password : '',
		salt : ''
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
				}
			});
			return;
		} else {
			var validate_errors = user.validate();
			if (validate_errors) {
				req.flash('error', 'Los datos del formulario son incorrectos.');
				for (var err in validate_errors) {
					req.flash('error', validate_errors[err]);
				};
				res.render('users/new', {
					user : user,
					validate_errors : validate_errors
				});
				return;
			}
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
	// req.user.login = req.body.user.login;
	req.user.name = req.body.user.name;
	req.user.email = req.body.user.email;
	var validate_errors = req.user.validate();
	if (validate_errors) {
		console.log("Errores de validación:", validate_errors);
		req.flash('error', 'Los datos del formulario son incorrectos.');
		for (var err in validate_errors) {
			req.flash('error', validate_errors[err]);
		};
		res.render('users/edit', {
			user : req.user,
			validate_errors : validate_errors
		});
		return;
	}
	req.user.save(['name', 'email'])// se guardan solo los campos espècificados
	.success(function() {
		req.flash('success', 'Usuario actualizado con éxito.');
		res.redirect('/users');
	}).error(function(error) {
		next(error);
	});
};

// DELETE /users/33
exports.destroy = function(req, res, next) {
	req.user.destroy().success(function() {
		req.flash('success', 'Usuario eliminado con éxito.');
		res.redirect('/users');
	}).error(function(error) {
		next(error);
	});
}; 