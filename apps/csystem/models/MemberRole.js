'use strict'
module.exports = (sequelize, DataTypes) => {
	const MemberRole = sequelize.define('MemberRole', {
		MemberRoleId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}
	},
	{
		hooks: {
			
		}

	})


	 return MemberRole;
}
