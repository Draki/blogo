// Definicion del modelo Attachment:
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Attachment', {
		postId : {
			type : DataTypes.INTEGER,
			validate : {
				notEmpty : {
					msg : "El campo postId no puede estar vacío"
				}
			}
		},
		public_id : {
			type : DataTypes.STRING, // identificador público del fichero
			validate : {
				notEmpty : {
					msg : "El campo public_id no puede estar vacío"
				}
			}
		},
		url : {
			type : DataTypes.STRING,
			validate : {
				notEmpty : {
					msg : "El campo url no puede estar vacío"
				}
			}
		},
		filename : {
			type : DataTypes.STRING,
			validate : {
				notEmpty : {
					msg : "El campo filename no puede estar vacío"
				}
			}
		},
		mime : {
			type : DataTypes.STRING,
			validate : {
				notEmpty : {
					msg : "El campo mime no puede estar vacío"
				}
			}
		}
	});
}