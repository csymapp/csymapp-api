'use strict'

module.exports = (sequelize, DataTypes) => {
	const LoginAttempt = sequelize.define('LoginAttempt', {
		LoginAttemptId: {
			type: DataTypes.INTEGER,
	        autoIncrement: true,
	        primaryKey: true
        },
        Success: {
			type: DataTypes.BOOLEAN, 
			allowNull: false, 
			defaultValue: false
		},
        FromIP: {
			type: DataTypes.STRING(45), 
			allowNull: false, 
			defaultValue: false
		},
	},
	{
		hooks: {
			
		}

	})

	 return LoginAttempt;
}