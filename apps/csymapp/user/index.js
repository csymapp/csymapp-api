'use strict'
const to = require('await-to-js').to
,passport = require('passport')
,csystem = require(__dirname+"/../../csystem").csystem
,{sequelize} = require(__dirname+"/../../csystem").models
,Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)
,config = require(__dirname+'/../../../config/config.system')
,moment = require('moment')
,isphone = require('phone')
, { Entropy, charset8 } = require('entropy-string')
, entropy = new Entropy({ total: 1e6, risk: 1e9 })

class User extends csystem{

	constructor() {
		super()
	}
    
    async createNew(req, res) {
		let self = this;
		let uid = req.params.v1
		let [err, care] = []

		let isLogged ;
		let body = JSON.parse(JSON.stringify(req.body))

		if(!body.profile)
			body.profile = 'Email'
		body.email = body.email || ''
		body.phone = body.phone || ''
		body.pin = body.pin || ''
		body.phone = isphone(body.phone)[0]
		// body.Cpin = body.Cpin || ''
		// body.phone = body.phone || ''

		body.profile = body.profile.toLowerCase()

		;[err, care] = await to(self.isAuthenticated(res, req))
		
		if(err)  {
			if(err.message === 'jwt expired' || err.message === 'invalid token') throw err
			body.phone = isphone(body.phone)[0]
			// if phone
			if(body.profile === 'phone') {
				[err, care] = await to (Familyfe.Person.beget({
					Name: body.Name || "Anonymous User", 
					Gender: body.Gender || "Male",
					Telephones:{
						Telephone:body.phone, 
						Pin:body.pin, 
						Cpin:body.cpin,
						IsActive:false,
						},
					IsActive:true,
					Families: [2]
				}))
				if(err) throw (err)

				let [err1, care1] = await to (Familyfe.TelephoneProfile.whichTelephoneProfile({Telephone:body.phone}))
				if(err1) throw err1;
				if(care1 === null) throw ({ status:422, message:"User does not exist"})
				let puid = care1.puid;
				entropy.use(charset8)
				let Code = entropy.string().substring(0, 6);
				;[err1, care1] = await to (Familyfe.TelephoneProfile.createTelephoneCode({TelephonePuid:puid, Code}))
				if(err1) throw err1;
			// if email=> default
			} else {
				[err, care] = await to (Familyfe.Person.beget({
					Name: body.Name || "Anonymous User", 
					Gender: body.Gender || "Male",
					Emailprofiles:{
						Email:body.email.toLowerCase() || '', 
						Password:body.password, 
						Cpassword:body.cpassword, 
						IsActive:false,
						},
					IsActive:true,
					Families: [2]
				}))
				if(err) throw err
				entropy.use(charset8)
				let Code = entropy.string().substring(0, 8);
				let [err1, care1] = await to (Familyfe.EmailProfile.whichEmailProfile({Email:body.email.toLowerCase() || ''}))
				if(err1) throw err1;
				let euid = care1.emailuid
				, activationPath = config.get('/APPROOT') + '/csymapp/emailprofile/' + Code 
				, redirect = req.query.redirecturl || req.query.redirect || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
				activationPath += '?redirect=' + redirect
				;[err1, care1] = await to ( Familyfe.EmailProfile.emailActivation({Code,EmailprofileEmailuid:euid}, body.email.toLowerCase() || '', activationPath))
			}
			if(err) throw err
			let useruid = care.uid;
			console.log('creating Roles in World for new user');
			;[err, care] = await to(Familyfe.Family.getMember(2, useruid))
			if(err) throw (err)
			let memberId = care
			;[err, care] = await to(Familyfe.Family.getspecificMemberRoleforFamily(2, "nobody"))
			if(err){
				// console.log(err)
				throw (err)
			}
			let tmproles = care
			let roles = [];
			if(err){
				console.log(err)
				throw (err)
			}
			for(let i in tmproles){
				for(let j in tmproles[i].App.Roles)
					roles.push(tmproles[i].App.Roles[j].RoleId)
			}
			;[err, care] = await to(Familyfe.Family.getspecificMemberRoleforFamily(1, "user"))
			if(err){
				throw (err)
			}
			tmproles = care
			for(let i in tmproles){
				for(let j in tmproles[i].App.Roles)
					roles.push(tmproles[i].App.Roles[j].RoleId)
			}

			console.log(roles)
			;[err, care] = await to(Familyfe.Family.createRolesforMember(memberId, roles))
			if(err){
				throw (err)
			}

			;[err, care] = await to (Familyfe.EmailProfile.whichPerson(useruid))
			if(err) throw (err)
			res.json(care)
		} else { // user is logged in
			let myuid = care.uid 
			let addtoUser = req.params.v1
			if (addtoUser !== myuid) {
				throw ({ status:422, message:"can't set for another user"})
			}
			if(addtoUser) {
				// this user has to be yourself,,, unless of course you are an admin in csystem family...
				// 
				// if phone
				if(body.profile === 'phone')
					[err, care] = await to (Familyfe.TelephoneProfile.addProfile({
						Telephone:body.phone, 
						Pin:body.pin, 
						Cpin:body.cpin,
						IsActive:true,
						PersonUid: myuid
					}))
				// if email=> default
				else
					[err, care] = await to (Familyfe.EmailProfile.addProfile({
						Email:body.email.toLowerCase() || '', 
						Password:body.password, 
						Cpassword:body.cpassword, 
						IsActive:true,
						PersonUid: myuid
					}))
				if(err)throw err
				;[err, care] = await to (Familyfe.EmailProfile.whichPerson(myuid))
				if(err) throw (err)
				res.json(care)
			}

		}
		
	}
	
	
    async getUser(req, res) {
		let self = this;
		let uid = req.params.v1
		let [err, care] = []

		let isLogged ;
		let body = req.body

		;[err, care] = await to(self.isAuthenticated(res, req))
		
		if(err)
			 throw err
		let myuid = care.uid 
		let checkUser = req.params.v1
		if (checkUser !== myuid) {
			throw ({ status:422, message:"can't check for another user"})
		}

		if(checkUser) {
			// this user has to be yourself,,, unless of course you are an admin in csystem family...
			// 
			;[err, care] = await to (Familyfe.EmailProfile.whichPerson(checkUser))
			if(err) throw (err)
			res.json(care)
		}
		
	}
	


    async main(req, res){
		// res.send("type")
		let self = this;
		let method = req.method;
		let [err, care] = [];
			
		switch(method) {
			case 'POST':
				;[err, care] = await to(self.createNew(req, res));
				if (err) throw err
				res.json(care)	
				break;
			case 'GET':
				;[err, care] = await to(self.getUser(req, res));
				if(err) throw(err)
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

module.exports = new User();