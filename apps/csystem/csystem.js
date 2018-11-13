'use strict'

const {sequelize} = require(__dirname+'/models')
const to = require('await-to-js').to,
	sentenceCase = require('sentence-case'),
	passport = require('passport'),
	fse = require('fs-extra');

class Csystem
{
	constructor()
	{
		
	}

	async dbSync(force = false)
	{
		let [err, dontcare] = []
		;[err, dontcare] = await to(sequelize.sync({force:force}))
		if(err)
		{
			console.log(err)
			return Promise.reject(new Error(err.name));
		}
		return true;
	}

	async setup(req, res)
	{
		// let self = this;
		// self.req = req;
		// self.res = res;
		// self.setappfromurl();
		// self.init(req, res, function(err, results){
		// 	Apps.padlock(self.user, self.app,  self.req.params.method, self.req.method)
		// 	self.defaultpage = Apps.Attributes.defaultpage
		// 	self.json = Apps.Attributes.json
		// 	self.status = Apps.Attributes.status
		// 	console.log(`SET WITH ${self.defaultpage}, ${self.app}, ${self.req.params.method}`)
		// 	if(self.defaultpage === false)return callback("Disallowed");
		// 	callback()
		// });
		return true;
	}

	isMethodAllowed(req, methods)
	{
		
		if(methods.includes(req.method) === false)throw ({message: "Method not allowed", status: 405})
		return true;
	}

	makeMePrivate(req)
	{
		let self = this;
		self.isMethodAllowed(req, [0])
	}

	trimReq(req)
	{
		return { method:0, params:req.params, body:req.body}
	}

	sentenceCase(params)
	{
		let ret = {}
		for(let i in params)ret[sentenceCase(i.toLowerCase())] = params[i]
		return ret
	}

	async isAuthenticated(req, res) {
		let self = this
		let __promisifiedPassportAuthentication = function () {
		    return new Promise((resolve, reject) => {
		    	passport.authenticate('jwt', {session: false}, (err, user, info) => {
		        	if(err)return reject(err)
		        	if(info)return reject({message:info.message, status:422})
		        	// res.json(user)
		        	return resolve(user)
		        })(req, res) 
		    })
		}

		return __promisifiedPassportAuthentication().catch((err)=>{
			throw(err)
		})
	}


	async getRoutes(path){
		return new Promise((resolve, reject)=>{
			let endpoints = []
			fse
			.readdirSync(path+'/')
			.filter((modelfile) =>
				modelfile.indexOf('.') < 0
			)
			.forEach((file)=>{
				endpoints.push('/'+file)
			})
				let ret = {
					Routes:endpoints
				}
				resolve(ret)
			})
	}

	// async _try(func, wait = true)
	// {
	// 	let [err, dontcare, care] = [];

	// 	if(wait === false)
	// 		[err, care] = func
	// 	else
	// 		[err, care] = await to(func)
	// 	console.log(err)
	// 	console.log(err)
	// 	console.log(err)
	// 	console.log(err)
	// 	if(err) throw ("err")
	// 	console.log(err)
	// 	// try {
	// 	// 	if(wait === false)
	// 	// 		[err, care] = func
	// 	// 	else
	// 	// 		[err, care] = await to(func)

	// 	// }catch(err) {
	// 	// 	console.log("thre some error...")
	// 	// 	console.log(err)
	// 	// }
	// }

}

module.exports = Csystem
// module.exports.csystem_ = new Csystem