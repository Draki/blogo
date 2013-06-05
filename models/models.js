var path = require('path');
var Sequelize = require('sequelize');
// Para usar SQLite o Postgress:

var sequelize = new Sequelize(// variables de entorno para Postgress y SQLite
process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
	dialect : process.env.DATABASE_DIALECT,
	protocol : process.env.DATABASE_PROTOCOL,
	port : process.env.DATABASE_PORT,
	host : process.env.DATABASE_HOST,
	storage : process.env.DATABASE_STORAGE,
	omitNull : true
});
// Importar la definicion de la clase Post desde post.js, y exportala a otros modulos
exports.Post = sequelize.import(path.join(__dirname, 'post'));
sequelize.sync();
// Sincroniza BD con la definición del modelo
