'use strict'
module.exports = (sequelize, DataTypes) => {
	const App = sequelize.define('App', {
		AppId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		AppName: {
			type: DataTypes.STRING(32), 
			allowNull: false,
			unique: true,
            validate: {
            	 len: {
                    args: [3, 32],
                    msg: 'Please give us a valid app name'
                }
            }
		},
		AutoInstall: {
			type:DataTypes.BOOLEAN,
			allowNull: false, 
			defaultValue: true
		},
		Enabled: {
			type:DataTypes.BOOLEAN,
			allowNull: false, 
			defaultValue: true
		}
	},
	{
		hooks: {
			
		}

	})


	App.associate = function (models) {
	    App.hasMany(models.InstalledApp, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

	    App.hasMany(models.Role, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });
	}


	 return App;
}
