'use strict'
const to = require('await-to-js').to
const passport = require('passport');

const csystem = require(__dirname+"/../../csystem").csystem;
const {sequelize} = require(__dirname+"/../../csystem").models
const Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)

class auth extends csystem {

	constructor() {
		super()
	}

	async facebook(req, res, next) {
		let self = this
		let withcallback = req.params.v2;
		// if(withcallback === 'callback')
		// {

		// 	//what will we do there???
		// }
		// console.log(req.params);
		// return;
		let [err, care, dontcare] = []
		self.isMethodAllowed(req, ["GET"]);
		// care = await self.isAuthenticated(req,res)

		let __promisifiedPassportAuthentication = function () {
		    return new Promise((resolve, reject) => {
		        passport.authenticate('facebook', { scope: ['email', 'public_profile'] , session:false}, (err, user, info) => {
		        	console.log("returned facebook")
		        	if(err)return reject(err)
		        	res.json(user)
		        })(req, res, next) 

		        // passport.authenticate('facebook', )
		    })
		}

		return __promisifiedPassportAuthentication().catch((err)=>{
			// return Promise.reject(err)
			throw(err)

		})

		
		
		res.json(care)
	}


	async github(req, res, next) {
		let self = this
		let [err, care, dontcare] = []
		self.isMethodAllowed(req, ["GET"]);
		// care = await self.isAuthenticated(req,res)

		let __promisifiedPassportAuthentication = function () {
		    return new Promise((resolve, reject) => {

		        passport.authenticate('github', { session:false}, (err, user, info) => {
		        	console.log("returned github")
		        	if(err)return reject(err)
		        	res.json(user)
		        })(req, res, next) 

		        // passport.authenticate('facebook', )
		    })
		}

		return __promisifiedPassportAuthentication().catch((err)=>{
			// return Promise.reject(err)
			throw(err)

		})

		
		
		res.json(care)
	}


	async login(req, res, next) {
		let self = this
		self.isMethodAllowed(req, ["GET"]);
		let __promisifiedPassportAuthentication = function () {
		    return new Promise((resolve, reject) => {
		        passport.authenticate('local', {session: false}, (err, user, info) => {
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




	async google(req, res, next)	//not implemented
	{
		let self = this
		let [err, care, dontcare] = []
		self.isMethodAllowed(req, ["GET"]);
		res.send("google")
	}


	async protected(req, res, next)
	{
		let self = this
		self.isMethodAllowed(req, ["GET"]);
		let __promisifiedPassportAuthentication = function () {
		    return new Promise((resolve, reject) => {
		        passport.authenticate('jwt', {session: false}, (err, user, info) => {
		        	// console.log(info)
		        	if(info) {
		        		info.status = 422
		        		return reject(info)
		        	}
		        	if(err)return reject(err)
		        	if(user === false)return reject({"message": "No information given", status:422});
		        	res.json(user)
		        })(req, res, next) 
		    })
		}

		return __promisifiedPassportAuthentication().catch((err)=>{
			// return Promise.reject(err)
			throw(err)
		})
	}

	/*
	 * use this to 
	 *	1. register
	 *	2. list users
	 *	3. update users
	 *	4. delete users
	 *	
	 */
	 /*
	  * routes:
	  *		/main
	  *		/register 
	  */
	async main(req, res, next) {
		let self = this
		let endpoints = await self.getRoutes(__dirname)
		res.json(endpoints)
	}


}

module.exports = auth