'use strict'
const Promise = require('bluebird')

module.exports = (sequelize, DataTypes) => {
	const Twitter = sequelize.define('Twitter', {
		tuid: {
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


	Twitter.associate = function (models) {
	    Twitter.hasMany(models.LoginAttempt, {
	    	onDelete: "CASCADE",
	      foreignKey: {
	        allowNull: true
			}
	    });
	}

	 return Twitter;
}
