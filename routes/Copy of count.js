
var cont = 0;
exports.count_mw  = function() {
	return function(req, res, next) {
		if (req.path == '/') {
			cont++;
		}
		res.locals.cont = cont;
		next();
	};
}; 
