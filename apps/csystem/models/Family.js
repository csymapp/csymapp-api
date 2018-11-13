'use strict'
module.exports = (sequelize, DataTypes) => {
	const Family = sequelize.define('Family', {
		FamilyId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		FamilyName: {
			type: DataTypes.STRING(32),
			allowNull: false
		}
	},
	{
		hooks: {
			
		}

	})


	Family.isHierarchy();

	Family.associate = function (models) {
	    Family.hasMany(models.FamilyMember, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

	    Family.hasMany(models.InstalledApp, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

	}

	 return Family;
}
