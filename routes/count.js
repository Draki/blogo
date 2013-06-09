
var cont = 0;
exports.count_mw = function(){
        return function (req,res,next){
                if ((req.path != '/images/bg.jpg')
                	&&(req.path != '/stylesheets/style.css')
                	&&(req.path != '/misc/movie.mp4')
                	&&(req.path != '/stylesheets/bootstrap.min.css')
                	&&(req.path != '/js/bootstrap.min.js')) {
			cont++;
		}
                console.log("Visitas: " + cont);
                next();
        }
}
exports.getCount = function (){
        return cont;
}