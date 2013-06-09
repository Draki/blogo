// Definicion del modelo Comment:
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Comment', {
		authorId : {
			type : DataTypes.INTEGER,
			validate : {
				notEmpty : {
					msg : "El campo authorId no puede estar vacío"
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
		},
		body : {
			type : DataTypes.TEXT,
			validate : {
				notEmpty : {
					msg : "El cuerpo del comentario no puede estar vacío"
				}
			}
		}
	});
}