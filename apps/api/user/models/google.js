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
		Email: DataTypes.STRING
	},
	{
		hooks: {
			// beforeCreate:hashPassword,
			// beforeUpdate:hashPassword,
			//beforeSave:hashPassword
		}

	})


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
