'use strict'
const to = require('await-to-js').to
,passport = require('passport')
,csystem = require(__dirname+"/../../csystem").csystem
,{sequelize} = require(__dirname+"/../../csystem").models
,Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)
,moment = require('moment')

/*
 * log in
 * log out
 * link accounts
 * unlink accounts
 */

class Auth extends csystem{

	constructor() {
		super()
	}
	
	async loginUsingEmailProfile(req, res, next) {
		let __promisifiedPassportAuthentication = function () {
		    return new Promise((resolve, reject) => {
		        passport.authenticate('email', {session: false}, (err, user, info) => {
		        	if(user === false)return reject({"message": "No information given", status:422});
		        	if(err)return reject(err)
		        	res.json(user)
		        })(req, res, next)
		    })
		}

		return __promisifiedPassportAuthentication().catch((err)=>{
			// return Promise.reject(err)
			throw(err)
		})
	}
    
    async postedData(req, res, next) {
		let self = this;
		let body = req.body,
		path = req.params.v1;
		let [err, care] = []
		
		switch(path) {
			case "login":
				if(req.body.email) {
					[err, care] = await to(self.loginUsingEmailProfile(req, res, next));
					if(err) throw (err)
				}
				break;
		}
	}

	async github(req, res, next) {
		let self = this
		let [err, care, dontcare] = []
		
		let redirectUrl = req.query.redirecturl || req.query.redirect
		let token = req.query.token
		let returned = req.params.v2

		req.headers['content-type'] = 'application/json'
		req.headers['authorization'] = `bearer ${token}`
		;[err, care] = await to(self.isAuthenticated(res, req))
		// console.log(req.headers)
		let personuid;

		let __promisifiedPassportAuthentication = async function () {
		    return new Promise((resolve, reject) => {
		        passport.authenticate('github', { session:false}, async (errinner, user, info) => {
					if(errinner) return reject(errinner)
					
					if(returned) {
						if(err) {
							if(err.message === 'jwt expired' || err.message === 'invalid token') throw err 
							// not logged in; create new user

							// check for user who aleady had that email address, if he exists, then just add to that user
							;[err, care] = await to (Familyfe.EmailProfile.whichPersonwithEmailProfile({Email:user.emails[0].value.toLowerCase()}))
							if(err) throw (err)
							personuid = care.uid
							if (care === null) { // create user
								;[err, care] = await to (Familyfe.Person.beget({
									Name:user.displayName, 
									Gender: "Male",
									Githubs:{
										Email:user.emails[0].value.toLowerCase(), 
										gituid:user.id,
										IsActive:true,
										},
									IsActive:true,
									Families: [1]
								
								}))
								if(err) 
									if (err.msg !== 'PRIMARY must be unique') 
										return reject(err)
								// maybe account already exists...
							} else {
								let profile = {
									Email:user.emails[0].value.toLowerCase(), 
									gituid:user.id,
									IsActive:true,
									PersonUid:care.uid
								}
								;[err, care] = await to (Familyfe.GitProfile.addProfile(profile))
								if(err) 
									if (err.msg !== 'PRIMARY must be unique') 
										return reject(err)
							}
							

						} else {
							// user is logged in. Add profile to this user
							let profile = {
								Email:user.emails[0].value.toLowerCase(), 
								gituid:user.id,
								IsActive:true,
								PersonUid:care.uid
							}
							;[err, care] = await to (Familyfe.GitProfile.addProfile(profile))
							if(err) 
								if (err.msg !== 'PRIMARY must be unique') 
									return reject(err)
						}

						// create token for this user
						// res.json(user)

						;[err, care] =  await to (Familyfe.EmailProfile.whichPerson(personuid))
						if(err)return reject(err)
						let person = care
						person = JSON.parse(JSON.stringify(person))
						let token = passport.generateToken({id:person.uid});
						person.token = token
						if(redirectUrl) {
							(redirectUrl.indexOf('?') > -1)?redirectUrl += `&`: redirectUrl += `?`
							redirectUrl += `?token=${token}`
							res.redirect(`${redirectUrl}`);
						}
						else res.json(person)
					} 
					
					
		        })(req, res, next) 

		    })
		}

		return __promisifiedPassportAuthentication().catch((err)=>{
			// console.log(err)
			// return Promise.reject(err)
			throw(err)

		})

		
		
		res.json(care)
	}
	
	async getRq(req, res, next) {
		let self = this;
		let body = req.body,
		path = req.params.v1;
		let [err, care] = []
		
		switch(path) {
			case "github":
				[err, care] = await to(self.github(req, res, next));
				if(err) throw(err)
				break;
		}
	}

    async main(req, res, next){
		let self = this;
		let method = req.method;
		let [err, care] = [];
			
        // // console.log(method)
		switch(method) {
			case 'POST':
				;[err, care] = await to(self.postedData(req, res, next));
				if (err) throw err
				res.json(care)	
				break;
			case 'GET':
				;[err, care] = await to(self.getRq(req, res, next));
				if (err) throw err
				res.json(care)	
				break;
			case 'PATCH':
				;[err, care] = await to(self.patchGatewayTypes(req, res));
				if(err) throw(err)
				break;
			default:
				res.send('still building this sections');
		}
    }
    



}

module.exports = new Auth();