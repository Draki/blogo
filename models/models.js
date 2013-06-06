// Modelos ORM
var path = require('path');
var Sequelize = require('sequelize');
// Usar BBDD definida en variables de entorno:
var sequelize = new Sequelize(
	process.env.DATABASE_NAME, 
	process.env.DATABASE_USER, 
	process.env.DATABASE_PASSWORD, {
		dialect : process.env.DATABASE_DIALECT,
		protocol : process.env.DATABASE_PROTOCOL,
		port : process.env.DATABASE_PORT,
		host : process.env.DATABASE_HOST,
		storage : process.env.DATABASE_STORAGE,
		omitNull : true
});
// Importar la definicion de los modelos:
// - Post desde post.js.
// - User desde user.js.
// Y que este modulo exporte los modelos:
exports.Post = sequelize.import(path.join(__dirname, 'post'));
exports.User = sequelize.import(path.join(__dirname, 'user')); 
sequelize.sync();
// Sincroniza BD con la definición del modelo