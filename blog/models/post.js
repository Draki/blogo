// Definicion del modelo Post:
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Post', {
		authorId : {
			type : DataTypes.INTEGER,
			validate : {
				notEmpty : {
					msg : "El campo autor no puede estar vacio"
				}
			}
		},
		title : {
			type : DataTypes.STRING,
			validate : {
				notEmpty : {
					msg : "El campo del titulo no puede estar vacio"
				}
			}
		},
		body : {
			type : DataTypes.TEXT,
			validate : {
				notEmpty : {
					msg : "El cuerpo del post no puede estar vacio"
				}
			}
		}
	});
}