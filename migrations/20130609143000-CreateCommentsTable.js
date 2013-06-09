module.exports = {
	up : function(migration, DataTypes, done) {
		// add altering commands here
		migration.createTable('Comments', {
			id : {
				type : DataTypes.INTEGER,
				allowNull : false,
				primaryKey : true,
				autoIncrement : true,
				unique : true
			},
			authorId : {
				type : DataTypes.INTEGER,
				allowNull : false
			},
			postId : {
				type : DataTypes.INTEGER,
				allowNull : false
			},
			body : {
				type : DataTypes.TEXT,
				allowNull : false
			},
			createdAt : {
				type : DataTypes.DATE,
				allowNull : false
			},
			updatedAt : {
				type : DataTypes.DATE,
				allowNull : false
			}
		}, {
			sync : {
				force : true
			}
		}).complete(done);
	},
	down : function(migration, DataTypes, done) {
		// add reverting commands here
		migration.dropTable('Comments').complete(done);
	}
}