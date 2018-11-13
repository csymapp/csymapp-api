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
		Email: DataTypes.STRING
	},
	{
		hooks: {
			// beforeCreate:hashPassword,
			// beforeUpdate:hashPassword,
			//beforeSave:hashPassword
		}

	})


	// Facebook.associate = function (models) {
	//     Facebook.belongsTo(models.User, {
	//     	onDelete: "CASCADE",
	//       foreignKey: {
	//         allowNull: false
	// 		}
	//     });

	// }

	 return Facebook;
}
