'use strict'
const to = require('await-to-js').to
,passport = require('passport')
,csystem = require(__dirname+"/../../csystem").csystem
,{sequelize} = require(__dirname+"/../../csystem").models
,Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)
,moment = require('moment')

class Profile extends csystem{

	constructor() {
		super()
	}
    
    async patchGoogleProfile(req, res) {
		let self = this;
		let guid = req.params.v1
		let [err, care] = []
		;[err, care] = await to(self.isAuthenticated(res, req))
		if(err) throw err;
		let authuid = care.uid
		console.log(req.body)
		;[err, care] = await to (Familyfe.GoogleProfile.whichPersonwithGuid(guid))
		if(care === null) throw ({ status:422, message:"can't set for another user"})
		let uidtoMod = care.uid;
		console.log(`${authuid} vs ${uidtoMod}`)
		if(authuid !== uidtoMod)throw ({ status:422, message:"can't set for another user"})
		
		if (authuid !== uidtoMod) {
			throw ({ status:422, message:"can't set for another user"})
		}

		
		let data = JSON.parse(JSON.stringify(req.body))
		;[err, care] = await to (Familyfe.GoogleProfile.update(data, {guid:guid}))
		if(err) throw (err)
		;[err, care] = await to (Familyfe.EmailProfile.whichPerson(uidtoMod))
		if(err) throw (err)
		res.json(care)
    }

	
    async deleteGoogleProfile(req, res) {
		let self = this;
		let guid = req.params.v1
		
		let [err, care] = []
		;[err, care] = await to(self.isAuthenticated(res, req))
		if(err) throw err;
		let authuid = care.uid
		;[err, care] = await to (Familyfe.GoogleProfile.whichPersonwithGuid(guid))
		if(care === null) throw ({ status:422, message:"can't set for another user"})
		let uidtoMod = care.uid;
		
		if(authuid !== uidtoMod)throw ({ status:422, message:"can't set for another user"})

		if (authuid !== uidtoMod) {
			throw ({ status:422, message:"can't set for another user"})
		}

		let data = JSON.parse(JSON.stringify(req.body))
		;[err, care] = await to (Familyfe.GoogleProfile.delete({guid:guid}))

		;[err, care] = await to (Familyfe.EmailProfile.whichPerson(uidtoMod))
		// console.log(care)
		if(err) throw (err)
		res.json(care)
    }



    async main(req, res){
		let self = this;
		let method = req.method;
		let [err, care] = [];
			
		switch(method) {
			case 'PATCH':
				;[err, care] = await to(self.patchGoogleProfile(req, res));
				if (err) throw err
				res.json(care)	
				break;			
			case 'DELETE':
				;[err, care] = await to(self.deleteGoogleProfile(req, res));
				if (err) throw err
				res.json(care)	
				break;
			
			default:
				res.send('still building this sections');
		}
    }
    



}

module.exports = new Profile();