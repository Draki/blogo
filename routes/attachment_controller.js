var models = require('../models/models.js');
var cloudinary = require('cloudinary');
var fs = require('fs');
var path = require('path');
/*
 * Auto-loading con app.param
 */
exports.load = function(req, res, next, id) {
	models.Attachment.find({
		where : {
			id : Number(id)
		}
	}).success(function(attachment) {
		if (attachment) {
			req.attachment = attachment;
			next();
		} else {
			req.flash('error', 'No existe ningún adjunto con id=' + id + '.');
			next('No existe ningún adjunto con id=' + id + '.');
		}
	}).error(function(error) {
		next(error);
	});
};

// GET /posts/33/attachments
exports.index = function(req, res, next) {
	models.Attachment.findAll({
		where : {
			postId : req.post.id
		},
		order : 'updatedAt DESC'
	}).success(function(attachments) {
		res.render('attachments/index', {
			attachments : attachments,
			post : req.post,
					visitas : counter.getCount()
		});
	}).error(function(error) {
		next(error);
	});
};

// GET /posts/33/attachments/new
exports.new = function(req, res, next) {
	res.render('attachments/new', {
		post : req.post,
					visitas : counter.getCount()
	});
};

// POST /posts/33/attachments
exports.create = function(req, res, next) {
	var upfile = req.files.adjunto;
	// fichero precargado
	// Tamaño debe ser != 0
	if (!upfile || upfile.size == 0) {
		req.flash('error', 'El adjunto no existe o vacío.');
		res.redirect('/posts/' + req.post.id);
		return;
	}
	// Tamaño maximo 500KB
	var max_adj_size_in_KB = 500;
	if (upfile.size > max_adj_size_in_KB * 1024) {
		req.flash('error', 'Tamaño máximo permitido es ' + max_adj_size_in_KB + 'KB.');
		res.redirect('/posts/' + req.post.id);
		return;
	}
	var out_stream = cloudinary.uploader.upload_stream(function(result) {
		fs.unlink(upfile.path);
		// borrar fichero subido

		if (!result.error) {
			var attachment = models.Attachment.build({
				public_id : result.public_id,
				url : result.url,
				filename : upfile.name,
				mime : upfile.type,
				postId : req.post.id
			});
			attachment.save()// guarda campos en la tabla
			.success(function() {
				req.flash('success', 'Adjunto subido con éxito.');
				res.redirect('/posts/' + req.post.id);
			}).error(function(error) {
				next(error);
			});
		} else {
			req.flash('error', result.error.message);
			res.redirect('/posts/' + req.post.id);
		}
	}, {
		resource_type : 'raw',
		format : path.extname(upfile.name).replace('.', '')
	});

	fs.createReadStream(req.files.adjunto.path, {
		encoding : 'binary'
	}).on('data', function(data) {
		out_stream.write(data);
	}).on('end', function() {
		out_stream.end();
	}).on('error', function(error) {
		out_stream.end();
	})
};

// DELETE /posts/33/attachments/66
exports.destroy = function(req, res, next) {
	// Borrar el fichero en Cloudinary.
	cloudinary.api.delete_resources(req.attachment.public_id, function(result) {
	}, {
		resource_type : 'raw'
	});
	// Borrar entrada en la base de datos.
	req.attachment.destroy().success(function() {
		req.flash('success', 'Adjunto eliminado con éxito.');
		res.redirect('/posts/' + req.post.id);
	}).error(function(error) {
		next(error);
	});
};
