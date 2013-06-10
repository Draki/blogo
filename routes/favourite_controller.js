var models = require('../models/models.js');
var counter = require("./count");

// GET /users/:userid/favourites
exports.index = function(req, res, next) {
	var format = req.params.format || "html";
	format = format.toLowerCase();
	models.Favourite.findAll({
		where : {
			userId : req.session.user.id
		},
		offset: req.pagination.offset,
		limit: req.pagination.limit,
		order : "updatedAt DESC",
		include : [{
			model : models.User,
			as : 'Author'
		}, models.Favourite]
	}).success(function(posts) {
		models.Favourite.findAll({
			order : 'updatedAt DESC'
		}).success(function(favourites) {

			switch (format) {
				case "html":
				case "htm":
					res.render("posts/index", {
						posts : posts,
						visitas : counter.getCount(),
						favourites : favourites
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
		res.redirect('/posts/' + req.post.id);
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