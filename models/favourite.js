// Definicion del modelo Favourite:
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Favourite', {
		userId : {
			type : DataTypes.INTEGER,
			validate : {
				notEmpty : {
					msg : "El campo userId no puede estar vacío"
				}
			}
		},
		postId : {
			type : DataTypes.INTEGER,
			validate : {
				notEmpty : {
					msg : "El campo postId no puede estar vacío"
				}
			}
		}
	});
}