'use strict'
const to = require('await-to-js').to
,passport = require('passport')
,csystem = require(__dirname+"/../../csystem").csystem
,{sequelize} = require(__dirname+"/../../csystem").models
,Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)
,moment = require('moment')
, { Entropy, charset8 } = require('entropy-string')
, entropy = new Entropy({ total: 1e6, risk: 1e9 })
,isphone = require('phone')
// ,moment = require('moment')

class Profile extends csystem{

	constructor() {
		super()
	}
    
    async patchTelephoneProfile(req, res) {
		let self = this;
		let phoneid = req.params.v1
		,body = req.body
		body.Code = body.code || body.Code
		body.code = body.Code
		let [err, care] = []
		// ;[err, care] = await to(self.isAuthenticated(res, req))
		// if(err) throw err;
		// let authuid = care.uid
		// ;[err, care] = await to (Familyfe.TelephoneProfile.whichPersonwithTelephoneProfile({puid:phoneid}))
		// if(care === null) throw ({ status:422, message:"can't set for another user"})
		// let uidtoMod = care.uid;
		// if(authuid !== uidtoMod)throw ({ status:422, message:"can't set for another user"})

		// if (authuid !== uidtoMod) {
		// 	throw ({ status:422, message:"can't set for another user"})
		// }

		let data;
		// console.log(body)
		if(body.IsActive === true) {
			;[err, care] = await to (Familyfe.TelephoneProfile.whichTelephoneProfilewithCode({puid:phoneid},body.Code))
			if(care === null || !Object.keys(care).length) throw ({ status:422, message:JSON.stringify({Code:"Wrong Code"})})
		}
		
		data = JSON.parse(JSON.stringify(req.body))
		;[err, care] = await to (Familyfe.TelephoneProfile.update(data, {puid:phoneid}))
		await to (Familyfe.TelephoneProfile.deleteCode(body.Code))
		if(err) throw (err)
		;[err, care] = await to (Familyfe.TelephoneProfile.whichPerson(uidtoMod))
		
		if(err) throw (err)
		res.json(care)
    }

	
    async deleteTelephoneProfile(req, res) {
		let self = this;
		let puid = req.params.v1
		
		let [err, care] = []
		;[err, care] = await to(self.isAuthenticated(res, req))
		if(err) throw err;
		let authuid = care.uid
		;[err, care] = await to (Familyfe.TelephoneProfile.whichPersonwithTelephoneProfile({puid:puid}))
		if(care === null) throw ({ status:422, message:"can't set for another user"})
		let uidtoMod = care.uid;
		
		if(authuid !== uidtoMod)throw ({ status:422, message:"can't set for another user"})

		if (authuid !== uidtoMod) {
			throw ({ status:422, message:"can't set for another user"})
		}

		let data = JSON.parse(JSON.stringify(req.body))
		;[err, care] = await to (Familyfe.TelephoneProfile.delete({puid:puid}))

		;[err, care] = await to (Familyfe.TelephoneProfile.whichPerson(uidtoMod))
		// console.log(care)
		if(err) throw (err)
		res.json(care)
    }
    async getTelephoneProfile(req, res) {
		let self = this;
		let phone = req.params.v1
		phone = isphone(phone)
		
		let [err, care] = []
        ;[err, care] = await to (Familyfe.TelephoneProfile.whichTelephoneProfile({Telephone:phone}))
        if(err) throw err;
        if(care === null) throw ({ status:422, message:"User does not exist"})
        // if(Object.keys(care).length === 0) throw ({ status:422, message:"User does not exist"})
        let puid = care.puid;

        entropy.use(charset8)
        let Code = entropy.string().substring(0, 6);

        ;[err, care] = await to (Familyfe.TelephoneProfile.createTelephoneCode({TelephonePuid:puid, Code}))
        if(err) throw err;
        
		return {puid}
	}
	
	
    async PostTelephoneProfile(req, res) {
		let self = this;
		let body = req.body
		let [err, care] = []

		body.type = body.type || 'register'
		// console.log(body)

		body.phone = isphone(body.phone)[0]

		if(body.type === 'login') {
			;[err, care] = await to (Familyfe.TelephoneProfile.whichTelephoneProfilewithCode({Telephone:body.phone}, body.code))
			if(err) throw { message: JSON.stringify({Code:'Wrong code.'})}
			if(!Object.keys(care).length) throw { message: JSON.stringify({Code:'Wrong code.'})}
			;[err, care] = await to(care.comparePin(body.pin))
			if(err) throw { message: JSON.stringify({Pin:'Wrong pin.'})}
			if(care === false) throw { message: JSON.stringify({Pin:'Wrong pin.'})}

			;[err, care] = await to (Familyfe.TelephoneProfile.whichTelephoneProfile({Telephone:body.phone}))

			if(!care.IsActive) {
				// activate
				await to (Familyfe.TelephoneProfile.update({IsActive:true}, {Telephone:body.phone}))
				// throw { message: JSON.stringify({Phone:'Phone Number is deactivated. Please activate.'})}
			}
			;[err, care] =  await to (Familyfe.EmailProfile.whichPerson(care.PersonUid))
			let person = care
			person = JSON.parse(JSON.stringify(person))
			let token = passport.generateToken({id:person.uid});
			person.token = token
			await to (Familyfe.TelephoneProfile.deleteCode(body.code))
			res.json(person)
		}
		
		else {
			// ;[err, care] = await to(self.isAuthenticated(res, req))
			// if(err) throw err;
			// let authuid = care.uid
			;[err, care] = await to (Familyfe.TelephoneProfile.whichTelephoneProfile({Telephone:body.phone}))
			if(err) throw err;
			if(care === null) throw ({ status:422, message:"User does not exist"})
			if(Object.keys(care).length === 0) throw ({ status:422, message:"User does not exist"})
			let puid = care.puid;

			entropy.use(charset8)
			let Code = entropy.string().substring(0, 6);

			;[err, care] = await to (Familyfe.TelephoneProfile.createTelephoneCode({TelephonePuid:puid, Code}))
			if(err) throw err;
			
			// 
			res.json({puid})
		}
	}

    async main(req, res){
		let self = this;
		let method = req.method;
		let [err, care] = [];
			
		switch(method) {
            case 'GET': 
                ;[err, care] = await to(self.getTelephoneProfile(req, res));
                if (err) throw err
                res.json(care)	
                break;		
                break;
			case 'PATCH':
				;[err, care] = await to(self.patchTelephoneProfile(req, res));
				if (err) throw err
				res.json(care)	
				break;	
					
			case 'POST':
				;[err, care] = await to(self.PostTelephoneProfile(req, res));
				if (err) throw err
				res.json(care)	
				break;	
					
			case 'DELETE':
				;[err, care] = await to(self.deleteTelephoneProfile(req, res));
				if (err) throw err
				res.json(care)	
				break;
			
			default:
				res.send('still building this sections');
		}
    }
    



}

module.exports = new Profile();