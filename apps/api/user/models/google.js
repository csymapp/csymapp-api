'use strict'
const Promise = require('bluebird')

module.exports = (sequelize, DataTypes) => {
	const Google = sequelize.define('Google', {
		guid: {
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

	Google.associate = function (models) {
	    Google.hasMany(models.LoginAttempt, {
	    	onDelete: "CASCADE",
	      foreignKey: {
	        allowNull: true
			}
	    });
	}


	// Google.associate = function (models) {
	//     Google.belongsTo(models.User, {
	//     	onDelete: "CASCADE",
	//       foreignKey: {
	//         allowNull: false
	// 		}
	//     });

	// }

	return Google;
}
