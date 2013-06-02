
/*
 * GET home page.
 */

var counter = require('./count'); 

exports.index = function(req, res){
  res.render('index', { visitas: counter.getCount() });
};