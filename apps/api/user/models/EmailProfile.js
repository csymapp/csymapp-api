'use strict'
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

async function hashPassword(user, options){
	const SALT_FACTOR = 10
	if(!user.changed('Password')){
		return
	}

	if(!user.Cpassword)
		return Promise.reject({code:1002, msg:"Please confirm your password"});
	if(user.Cpassword)
		if(user.Password !== user.Cpassword)
			return Promise.reject({code:1002, msg:"Passwords don't match"});
	return bcrypt.genSaltAsync(SALT_FACTOR)
		.then((salt)=>bcrypt.hashAsync(user.dataValues.Password,salt, null))
		.then(hash=>{
			user.setDataValue('Password', hash)
		})
}

module.exports = (sequelize, DataTypes) => {
	const Emailprofile = sequelize.define('Emailprofile', {
		emailuid: {
			type: DataTypes.INTEGER,
	        autoIncrement: true,
	        primaryKey: true
		},
		Email:{
			type: DataTypes.STRING(126).BINARY,
			unique: true,
			allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Please provide a valid email address.'
                },
                len: {
                    args: [1,254],
                    msg: 'Please enter an email address shorter than 254 characters'
                },
                isUnique: function (value, next) {
                    var self = this;
                    Emailprofile.find({where: {email: value}})
                        .then(function (user) {
                            // reject if a different user wants to use the same email
                            if (user && self.uid !== user.uid) {
                                return next('Email already in use');
                            }
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            }
		},
		Password: {
			type: DataTypes.STRING, 
			allowNull: false,
            validate: {
            	// isNotNull: {		//deprecated, don't use
	            //      args: true,
	            //      msg: "Please enter a password"
	            // },
            	 len: {
                    args: [6, 32],
                    msg: 'Please make your password at least 6 characters long.'
                }
            }
		},
		Cpassword: {
			type: DataTypes.VIRTUAL
		},
		IsActive: {
			type: DataTypes.BOOLEAN, 
			allowNull: false, 
			defaultValue: false
		}
	},
	{
		hooks: {
			beforeCreate:hashPassword,
			beforeUpdate:hashPassword,
			//beforeSave:hashPassword
		}

	})

	Emailprofile.prototype.comparePass = async function(password){
		return bcrypt.compareAsync(password, this.Password)
	}

	// Emailprofile.associate = function (models) {
	//     Emailprofile.belongsTo(models.User, {
	//     	onDelete: "CASCADE",
	//       foreignKey: {
	//         allowNull: false
	// 		}
	//     });

	// }
	

	 return Emailprofile;
}
