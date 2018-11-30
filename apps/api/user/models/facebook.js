'use strict'
const Promise = require('bluebird')

module.exports = (sequelize, DataTypes) => {
	const Facebook = sequelize.define('Facebook', {
		fbuid: {
			type: DataTypes.STRING(126),
			primaryKey: true
		},
		token: DataTypes.STRING,
		Name: DataTypes.STRING,
		Email: DataTypes.STRING,
		ProfilePic: DataTypes.STRING,
		IsActive: {
			type: DataTypes.BOOLEAN, 
			allowNull: false, 
			defaultValue: false
		},
	},
	{
		hooks: {
			// beforeCreate:hashPassword,
			// beforeUpdate:hashPassword,
			//beforeSave:hashPassword
		}

	})


	Facebook.associate = function (models) {
	    Facebook.hasMany(models.LoginAttempt, {
	    	onDelete: "CASCADE",
	      foreignKey: {
	        allowNull: true
			}
	    });
	}

	 return Facebook;
}
