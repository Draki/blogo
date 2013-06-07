
var cont = 0;
exports.count_mw = function(){
        return function (req,res,next){
                cont++;
                console.log("Visitas: " + cont);
                next();
        }
}
exports.getCount = function (){
        return cont;
}