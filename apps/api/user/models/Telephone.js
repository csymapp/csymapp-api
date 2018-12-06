'use strict'
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs')),
phone = require('phone');


async function hashPin(user, options){
	const SALT_FACTOR = 10
	if(!user.changed('Pin')){
		return
	}

	if(!user.Cpin)
		return Promise.reject({code:1002, msg:JSON.stringify({Cpin:"Please confirm your pin"})});
	if(user.Cpin)
		if(user.Pin !== user.Cpin)
			return Promise.reject({code:1002, msg:JSON.stringify({Pin:"Pins don't match"})});
	return bcrypt.genSaltAsync(SALT_FACTOR)
		.then((salt)=>bcrypt.hashAsync(user.dataValues.Pin,salt, null))
		.then(hash=>{
			user.setDataValue('Pin', hash)
		})
}

module.exports = (sequelize, DataTypes) => {
	const Telephone = sequelize.define('Telephone', {
		puid: {
			type: DataTypes.INTEGER,
	        autoIncrement: true,
	        primaryKey: true
		},
		Telephone:{
			type: DataTypes.STRING(15).BINARY,
			unique: true,
			allowNull: false,
            validate: {
                // len: {
                //     args: [8,14],
                //     msg: JSON.stringify({Phone:'Please enter a valid phone number'})
                // },
                isUnique: function (value, next) {
					var self = this;
                    Telephone.find({where: {Telephone: value}})
                        .then(function (user) {
							if(user)
								return next(JSON.stringify({Phone:'Phone number already in use'}));
							else return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
				},
				isPhone: function (value, next) {
					if(phone(value).length === 0 )
						return JSON.stringify({Phone:'Please enter a valid phone number'})
					return next();
				}
            }
		},
		Pin: {
			type: DataTypes.STRING, 
			allowNull: false,
            validate: {
            	 len: {
                    args: [4, 4],
                    msg: 'Pin should be 4 characters.'
				},
				isNumeric: function (value, next) {
                    var self = this;
					if(!isNaN(value))return next();
					else next(JSON.stringify({Pin:'Please enter a numeric pin'}));
                }
            }
		},
		Code: {
			type: DataTypes.STRING, 
			allowNull: true,
		},
		Cpin: {
			type: DataTypes.VIRTUAL
		},
		IsActive: {
			type: DataTypes.BOOLEAN, 
			allowNull: false, 
			defaultValue: false
		},
		ProfilePic: DataTypes.STRING
	},
	{
		hooks: {
			beforeCreate:hashPin,
			beforeUpdate:hashPin,
			// beforeSave:hashPin
		}

	})

	Telephone.prototype.comparePin = async function(pin){
		return bcrypt.compareAsync(pin, this.Pin)
	}

	Telephone.associate = function (models) {
	    Telephone.hasMany(models.LoginAttempt, {
	    	onDelete: "CASCADE",
	      foreignKey: {
	        allowNull: true
			}
	    });
	}

	
	Telephone.associate = function (models) {
	    Telephone.hasMany(models.TelephoneCode, {
	    	onDelete: "CASCADE",
	      foreignKey: {
	        allowNull: true
			}
	    });
	}


	

	 return Telephone;
}
