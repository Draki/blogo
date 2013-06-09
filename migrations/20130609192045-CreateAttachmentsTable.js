module.exports = {
	up : function(migration, DataTypes, done) {
		migration.createTable('Attachments', {
			id : {
				type : DataTypes.INTEGER,
				allowNull : false,
				primaryKey : true,
				autoIncrement : true,
				unique : true
			},
			postId : {
				type : DataTypes.INTEGER,
				allowNull : false
			},
			public_id : {
				type : DataTypes.STRING,
				allowNull : false
			},
			url : {
				type : DataTypes.STRING,
				allowNull : false
			},
			filename : {
				type : DataTypes.STRING,
				allowNull : false
			},
			mime : {
				type : DataTypes.STRING,
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
		migration.dropTable('Attachments').complete(done);
	}
}