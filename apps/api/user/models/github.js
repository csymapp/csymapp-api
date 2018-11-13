'use strict'
const Promise = require('bluebird')

module.exports = (sequelize, DataTypes) => {
	const Github = sequelize.define('Github', {
		gituid: {
			type: DataTypes.STRING(126),
			primaryKey: true
		},
		token: DataTypes.STRING,
		Name: DataTypes.STRING,
		Email: DataTypes.STRING
	},
	{
		hooks: {
			// beforeCreate:hashPassword,
			// beforeUpdate:hashPassword,
			//beforeSave:hashPassword
		}

	})


	
	// Github.associate = function (models) {
	//     Github.belongsTo(models.User, {
	//     	 as: 'Github',
	//     	onDelete: "CASCADE",
	//       foreignKey: {
	//         allowNull: false
	// 		}
	//     });
	// }

	// Github.associate = function (models) {
	//     Github.hasOne(models.User, {
	//     	as: 'Github',
	//     	onDelete: "CASCADE",
	//       foreignKey: {
	//         allowNull: false
	// 	}
	//     });
	// }
	

	 return Github;
}
