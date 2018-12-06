'use strict'

module.exports = (sequelize, DataTypes) => {
	const EmailCode = sequelize.define('EmailCode', {
		EmailCodeId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		Code: {
			type: DataTypes.STRING(12).BINARY,
			allowNull: false
		},
		Sent: {
			type: DataTypes.BOOLEAN, 
			allowNull: false, 
			defaultValue: false
		}
	},
	{
		hooks: {
			
		}

	})

	return EmailCode;
}
