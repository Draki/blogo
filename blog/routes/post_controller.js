// GET /posts
exports.index = function(req, res, next) {
	res.end("Listado de todos los Posts.");
};
// GET /posts/33
exports.show = function(req, res, next) {
	res.end("Ver el post " + req.params['postid'] + ".");
};
// GET /posts/new
exports.new = function(req, res, next) {
	res.end("Obtener formulario para crear un nuevo posts.");
};
// POST /posts
exports.create = function(req, res, next) {
	res.end("Crear un nuevo post.");
};
// GET /posts/33/edit
exports.edit = function(req, res, next) {
	res.end("Obtener formulario para editar el post " + req.params['postid'] + ".");
};
// PUT /posts/33
exports.update = function(req, res, next) {
	res.end("Actualizar el post " + req.params['postid'] + ".");
};
// DELETE /posts/33
exports.destroy = function(req, res, next) {
	res.end("Borrar el post " + req.params['postid'] + ".");
}; 