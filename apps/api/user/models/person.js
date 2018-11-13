'use strict'
// const Promise = require('bluebird')
// const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

// async function hashPassword(Person, options){
// 	const SALT_FACTOR = 10
// 	if(!Person.changed('Password')){
// 		return
// 	}

// 	if(!Person.Cpassword)
// 		return Promise.reject({code:1002, msg:"Please confirm your password"});
// 	if(Person.Cpassword)
// 		if(Person.Password !== Person.Cpassword)
// 			return Promise.reject({code:1002, msg:"Passwords don't match"});
// 	return bcrypt.genSaltAsync(SALT_FACTOR)
// 		.then((salt)=>bcrypt.hashAsync(Person.dataValues.Password,salt, null))
// 		.then(hash=>{
// 			Person.setDataValue('Password', hash)
// 		})
// }

module.exports = (sequelize, DataTypes) => {
	const Person = sequelize.define('Person', {
		uid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV1,
			primaryKey: true
		},
		Name: {
			type: DataTypes.STRING, 
			allowNull: false,
            validate: {
            	 len: {
                    args: [3, 32],
                    msg: 'Please give us a correct name'
                }
            }
		},
		Gender: {
			type:DataTypes.ENUM('Male', 'Female'),
			defaultValue: 'Male'
		},
		IsActive: {
			type: DataTypes.BOOLEAN, 
			allowNull: false, 
			defaultValue: false
		}

	},
	{
		hooks: {
			//beforeCreate:hashPassword,
			//beforeUpdate:hashPassword,
			//beforeSave:hashPassword
		}

	})


	Person.associate = function (models) {
	    Person.hasMany(models.Github, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });
	    
	    Person.hasMany(models.Facebook, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

	    Person.hasMany(models.Google, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

		Person.hasMany(models.Emailprofile, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

	  //   Person.hasMany(models.AppPerson, {
	  //   	onDelete: "CASCADE",
	  //   	onUpdate: "CASCADE",
			// foreignKey: {
			// 	allowNull: false
			// }
	  //   }); 

	    Person.hasMany(models.FamilyMember, {
	    	onDelete: "CASCADE",
	    	onUpdate: "CASCADE",
			foreignKey: {
				allowNull: false
			}
	    });

	}


	 return Person;
}
