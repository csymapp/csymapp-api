'use strict'
const to = require('await-to-js').to
,passport = require('passport')
,csystem = require(__dirname+"/../../csystem").csystem
,{sequelize} = require(__dirname+"/../../csystem").models
,Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)
,moment = require('moment')
, { Entropy } = require('entropy-string')
, entropy = new Entropy({ total: 1e6, risk: 1e9 })

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

	getIp(req) {
		let ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0]

		ip = ip.split(':').slice(-1)[0];
		return ip;
	}

	async LogloginAttempt(req, data) {
		let self = this
		let ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0]

		ip = ip.split(':').slice(-1)[0];
		data.FromIP = ip
		sequelize.models.LoginAttempt.create(data)
		
	}
	
	async loginUsingEmailProfile(req, res, next) {
		let self = this
		let __promisifiedPassportAuthentication = function () {
		    return new Promise((resolve, reject) => {
		        passport.authenticate('email', {session: false}, (err, user, info) => {
		        	if(user === false)return reject({"message": "No information given", status:422});
					if(err){
						if(err.emailid) {
							self.LogloginAttempt(req, {Success: false, "PersonUid": err.uid, "EmailprofileEmailuid": err.emailid})
						}
						return reject(err)
					}
					let emailid = user.emailid
					user = user.person
					self.LogloginAttempt(req, {Success: true, "PersonUid": user.uid, "EmailprofileEmailuid": emailid})
					res.json(user)
					
					//

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

	async token(req, res, next) {
		let self = this
		let [err, care, dontcare] = []
		req.headers['content-type'] = 'application/json'
		console.log(req.headers)
		if(!req.headers.Authorization && !req.headers.authorization)
			if(req.query.token)
				req.headers['authorization'] = `bearer ${req.query.token}`
			else if(req.body.token)
			req.headers['authorization'] = `bearer ${req.body.token}`
		// console.log(req.headers)
		// console.log(req.query)
		// console.log(req.body)
		;[err, care] = await to(self.isAuthenticated(res, req))
		if(err) throw (err)
		
		res.json(care)
	}
	async github(req, res, next) {
		let self = this
		let err, care, dontcare
		;[err, care, dontcare] = []
		
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
					// if(returned) {
						// let err = err1
						if(err) {
							if(err.message === 'jwt expired' || err.message === 'invalid token') throw err 
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
								if(Object.keys(care).length === 0) {
									let password = entropy.string();
									;[err, care] = await to (Familyfe.Person.beget({
										Name:user.displayName, 
										Gender: "Male",
										Emailprofiles:{
											Email:user.emails[0].value.toLowerCase(), 
											Password:password,
											Cpassword:password, 
											IsActive:false,
											},
										Githubs:{
											Email:user.emails[0].value.toLowerCase(), 
											gituid:user.id,
											IsActive:true,
											ProfilePic: user.photos[0].value
											},
										IsActive:true,
										Families: [1]
									
									}))
									if(err) throw(err)
								}
								let profile = {
									Email:user.emails[0].value.toLowerCase(), 
									gituid:user.id,
									IsActive:true,
									PersonUid:care.uid,
									ProfilePic: user.photos[0].value
								}
								personuid = care.uid;
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
								PersonUid:care.uid,
								ProfilePic: user.photos[0].value
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

						// log login
						;[err, care] = await to(Familyfe.GitProfile.whichGitProfile({Email: user.emails[0].value.toLowerCase()}))
						self.LogloginAttempt(req, {Success: true, "PersonUid": person.uid, "GithubGituid": care.gituid})

						if(redirectUrl) {
							(redirectUrl.indexOf('?') > -1)?redirectUrl += `&`: redirectUrl += `?`
							redirectUrl += `token=${token}`
							res.redirect(`${redirectUrl}`);
						}
						else res.json(person)
					// } 
					
					
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

	async google(req, res, next) {
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
		        passport.authenticate('google', { session:false}, async (errinner, user, info) => {
					if(errinner) return reject(errinner)
					
					// if(returned) {
					// 	if(err) {
					// 		if(err.message === 'jwt expired' || err.message === 'invalid token') throw err 
					// 		// not logged in; create new user

					// 		// check for user who aleady had that email address, if he exists, then just add to that user
					// 		;[err, care] = await to (Familyfe.EmailProfile.whichPersonwithEmailProfile({Email:user.emails[0].value.toLowerCase()}))
					// 		if(err) throw (err)
					// 		personuid = care.uid
					// 		if (care === null) { // create user
					// 			;[err, care] = await to (Familyfe.Person.beget({
					// 				Name:user.displayName, 
					// 				Gender: "Male",
					// 				Githubs:{
					// 					Email:user.emails[0].value.toLowerCase(), 
					// 					gituid:user.id,
					// 					IsActive:true,
					// 					},
					// 				IsActive:true,
					// 				Families: [1]
								
					// 			}))
					// 			if(err) 
					// 				if (err.msg !== 'PRIMARY must be unique') 
					// 					return reject(err)
					// 			// maybe account already exists...
					// 		} else {
					// 			let profile = {
					// 				Email:user.emails[0].value.toLowerCase(), 
					// 				gituid:user.id,
					// 				IsActive:true,
					// 				PersonUid:care.uid
					// 			}
					// 			;[err, care] = await to (Familyfe.GitProfile.addProfile(profile))
					// 			if(err) 
					// 				if (err.msg !== 'PRIMARY must be unique') 
					// 					return reject(err)
					// 		}
							

					// 	} else {
					// 		// user is logged in. Add profile to this user
					// 		let profile = {
					// 			Email:user.emails[0].value.toLowerCase(), 
					// 			gituid:user.id,
					// 			IsActive:true,
					// 			PersonUid:care.uid
					// 		}
					// 		;[err, care] = await to (Familyfe.GitProfile.addProfile(profile))
					// 		if(err) 
					// 			if (err.msg !== 'PRIMARY must be unique') 
					// 				return reject(err)
					// 	}

					// 	// create token for this user
					// 	// res.json(user)

					// 	;[err, care] =  await to (Familyfe.EmailProfile.whichPerson(personuid))
					// 	if(err)return reject(err)
					// 	let person = care
					// 	person = JSON.parse(JSON.stringify(person))
					// 	let token = passport.generateToken({id:person.uid});
					// 	person.token = token
					// 	if(redirectUrl) {
					// 		(redirectUrl.indexOf('?') > -1)?redirectUrl += `&`: redirectUrl += `?`
					// 		redirectUrl += `?token=${token}`
					// 		res.redirect(`${redirectUrl}`);
					// 	}
					// 	else res.json(person)
					// } 
					
					
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
	
	async facebook(req, res, next) {
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

		console.log('na facebook')
		// process.exit();

		let __promisifiedPassportAuthentication = async function () {
		    return new Promise((resolve, reject) => {
		        passport.authenticate('facebook', { session:false}, async (errinner, user, info) => {
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
									Name:user.name.givenName + user.name.familyName, 
									Gender: "Male",
									Facebooks:{
										Email:user.emails[0].value.toLowerCase(), 
										fbuid:user.id,
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
									fbuid:user.id,
									IsActive:true,
									PersonUid:care.uid
								}
								;[err, care] = await to (Familyfe.FbProfile.addProfile(profile))
								if(err) 
									if (err.msg !== 'PRIMARY must be unique') 
										return reject(err)
							}
							

						} else {
							// user is logged in. Add profile to this user
							let profile = {
								Email:user.emails[0].value.toLowerCase(), 
								fbuid:user.id,
								IsActive:true,
								PersonUid:care.uid
							}
							;[err, care] = await to (Familyfe.FbProfile.addProfile(profile))
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
			case "google":
				[err, care] = await to(self.google(req, res, next));
				if(err) throw(err)
				break;
			case "facebook":
				[err, care] = await to(self.facebook(req, res, next));
				if(err) throw(err)
				break;
			case "token":
				[err, care] = await to(self.token(req, res, next));
				if(err) throw(err)
				break;
		}
	}

    async main(req, res, next){
		let self = this;
		let method = req.method;
		let [err, care] = [];

		let ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0].split(':').slice(-1)[0];
			
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