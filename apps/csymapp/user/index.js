'use strict'
const to = require('await-to-js').to
,passport = require('passport')
,csystem = require(__dirname+"/../../csystem").csystem
,{sequelize} = require(__dirname+"/../../csystem").models
,Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)
,moment = require('moment')

class User extends csystem{

	constructor() {
		super()
    }
    
    async createNew(req, res) {
		let self = this;
		let uid = req.params.v1
		let [err, care] = []

		let isLogged ;
		let body = req.body

		;[err, care] = await to(self.isAuthenticated(res, req))
		
		if(err)  {
			if(err.message === 'jwt expired' || err.message === 'invalid token') throw err
			;[err, care] = await to (Familyfe.Person.beget({
				Name: body.Name || "Anonymous User", 
				Gender: body.Gender || "Male",
				Emailprofiles:{
					Email:body.email.toLowerCase() || '', 
					Password:body.password, 
					Cpassword:body.cpassword, 
					IsActive:true,
					},
				IsActive:true,
				Families: [1]
			}))
			if(err) throw err
			let useruid = care.uid;
			console.log('creating Roles in World for new usert');
			;[err, care] = await to(Familyfe.Family.getMember(1, useruid))
			if(err) throw (err)
			let memberId = care
			;[err, care] = await to(Familyfe.Family.getspecificMemberRoleforFamily(1, "nobody"))
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
			// console.log(req.params)
			// console.log(care)
			let myuid = care.uid 
			let addtoUser = req.params.v1
			if (addtoUser !== myuid) {
				throw ({ status:422, message:"can't set for another user"})
			}
			if(addtoUser) {
				// this user has to be yourself,,, unless of course you are an admin in csystem family...
				// 
				;[err, care] = await to (Familyfe.EmailProfile.addProfile({
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
				;[err, care] = await to(self.getGatewayTypes(req, res));
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