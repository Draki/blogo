var models = require("../models/models.js");
var counter = require("./count");

exports.load = function(req, res, next, id) {
	models.Post.find({
		where : {
			id : Number(id)
		}
	}).success(function(post) {
		if (post) {
			req.post = post;
			next();
		} else {
			next("No existe el post con id=" + id + ".");
			// error
		}
	}).error(function(error) {
		next(error);
	});
};

// GET /posts
exports.index = function(req, res, next) {
	var format = req.params.format || "html";
	format = format.toLowerCase();
	models.Post.findAll({
		order : "updatedAt DESC"
	}).success(function(posts) {
		switch (format) {
			case "html":
			case "htm":
				res.render("posts/index", {
					posts : posts,
					visitas : counter.getCount()
				});
				break;
			case "json":
				res.send(posts);
				break;
			case "xml":
				res.send(posts_to_xml(posts));
				break;
			default:
				console.log("No se soporta el formato \"." + format + "\".");
				res.send(406);
		}
	}).error(function(error) {
		next(error);
	});
};

// GET /posts/33
exports.show = function(req, res, next) {
	res.render("posts/show", {
		post : req.post,
		visitas : counter.getCount()
	});
};

exports.new = function(req, res, next) {
	var post = models.Post.build({
		title : "Introduzca el titulo",
		body : "Introduzca el texto del articulo"
	});
	res.render("posts/new", {
		post : post,
		visitas : counter.getCount()
	});
};

// POST /posts
exports.create = function(req, res, next) {
	var post = models.Post.build({
		title : req.body.post.title,
		body : req.body.post.body,
		authorId : 0
	});
	var validate_errors = post.validate();
	if (validate_errors) {
		console.log("Errores de validacion:", validate_errors);
		req.flash("error", "Los datos del formulario son incorrectos.");
		for (var err in validate_errors) {
			req.flash("error", validate_errors[err]);
		};
		res.render("posts/new", {
			post : post,
			validate_errors : validate_errors,
			visitas : counter.getCount()
		});
		return;
	}
	post.save().success(function() {
		res.redirect("/posts");
	}).error(function(error) {
		next(error);
	});
};

// GET /posts/33/edit
exports.edit = function(req, res, next) {
	res.render("posts/edit", {
		post : req.post,
		visitas : counter.getCount()
	});
};

// PUT /posts/33
exports.update = function(req, res, next) {
	req.post.title = req.body.post.title;
	req.post.body = req.body.post.body;
	var validate_errors = req.post.validate();
	if (validate_errors) {
		console.log("Errores de validación:", validate_errors);
		req.flash("error", "Los datos del formulario son incorrectos.");
		for (var err in validate_errors) {
			req.flash("error", validate_errors[err]);
		};
		res.render("posts/edit", {
			post : req.post,
			validate_errors : validate_errors,
			visitas : counter.getCount()
		});
		return;
	}
	req.post.save(["title", "body"]).success(function() {
		res.redirect("/posts");
	}).error(function(error) {
		next(error);
	});
};

// DELETE /posts/33
exports.destroy = function(req, res, next) {
	console.log("ENTRANDO UNO!");
	req.post.destroy().success(function() {
		console.log("ENTRANDO DOS!");
		req.flash('success', 'Post eliminado con éxito.');
		res.redirect("/posts");
	}).error(function(error) {
		console.log("ENTRANDO TRES!");
		next(error);
	});
	console.log("ENTRANDO CUATRo!");
};

function posts_to_xml(posts) {
	var builder = require("xmlbuilder");
	var xml = builder.create("posts")
	for (var i in posts) {
		xml.ele("post").ele("id").txt(posts[i].id).up().ele("title").txt(posts[i].title).up().ele("body").txt(posts[i].body).up().ele("authorId").txt(posts[i].authorId).up().ele("createdAt").txt(posts[i].createdAt).up().ele("updatedAt").txt(posts[i].updatedAt);
	}
	return xml.end({
		pretty : true
	});
};

function post_to_xml(post) {
	var builder = require("xmlbuilder");
	if (post) {
		var xml = builder.create("post").ele("id").txt(post.id).up().ele("title").txt(post.title).up().ele("body").txt(post.body).up().ele("authorId").txt(post.authorId).up().ele("createdAt").txt(post.createdAt).up().ele("updatedAt").txt(post.updatedAt);
		return xml.end({
			pretty : true
		});
	} else {
		var xml = builder.create("error").txt("post " + id + " no existe");
		return xml.end({
			pretty : true
		});
	}
};

// GET /posts/search
exports.search = function(req, res, next) {
	var format = req.params.format || "html";
	format = format.toLowerCase();
	var busqueda = req.query.buscar;
	var string = "%" + busqueda.replace(/\s/g, "%") + "%";
	models.Post.findAll({
		where : ["title like ? OR body like ?", string, string],
		order : "updatedAt DESC"
	}).success(function(posts) {
		switch (format) {
			case "html":
			case "htm":
				res.render("posts/search", {
					posts : posts,
					busqueda : busqueda,
					visitas : counter.getCount()
				});
				break;
			case "json":
				res.send(posts);
				break;
			case "xml":
				res.send(posts_to_xml(posts));
				break;
			default:
				console.log("No se soporta el formato \"." + format + "\".");
				res.send(406);
		}
	}).error(function(error) {
		console.log("Error: No puedo listar los posts.");
		res.redirect("/");
	});
};
