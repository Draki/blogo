var models = require('../models/models.js');
var counter = require("./count");

// GET /users/:userid/favourites
exports.index = function(req, res, next) {
	models.Favourite.findAll({
		where : {
			userId : req.param.userId
		}
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

// PUT  /users/:userid/favourites/:postid
exports.create = function(req, res, next) {
	var favourite = models.Favourite.build({
		userId : req.session.user.id,
		postId : req.params.postid
	});
	favourite.save().success(function() {
		req.flash('success', 'Post marcado como favorito.');
		res.redirect('/posts/' + req.params.postId);
	}).error(function(error) {
		next(error);
	});
};

// DELETE  /users/:userid/favourites/:postid
exports.destroy = function(req, res, next) {
	models.Favourite.find({
		where : {
			userId : req.session.user.id,
			postId : req.params.postid
		}
	}).success(function(favourite) {
		favourite.destroy();
		req.flash('success', 'Post marcado como NO favorito');
		res.redirect('/posts/' + req.post.id);
	}).error(function(error) {
		next(error);
	});
}
