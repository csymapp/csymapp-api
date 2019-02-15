'use strict'
const to = require('await-to-js').to
,passport = require('passport')
,csystem = require(__dirname+"/../../csystem").csystem
,{sequelize} = require(__dirname+"/../../csystem").models
,Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)

class Family extends csystem{

	constructor() {
		super()
    }

    async main(req, res){
		let self = this;
		let method = req.method;
		let [err, care] = []
		,body = req.body
		, ttbody = {}

		for(let i in body)ttbody[i.toLowerCase()] = body[i]
		req.ttbody = ttbody
		
		;[err, care] = await to(self.isAuthenticated(res, req))
		if(err) throw err;
		let authuid = care.uid
		req.authuid = authuid
        			
		switch(method) {
            case 'POST':
				;[err, care] = await to(self.postFamily(req, res));
				if (err) throw err
				res.json(care)	
				break;
			
            case 'PUT':
				;[err, care] = await to(self.putFamily(req, res));
				if (err) throw err
				res.json(care)	
				break;
			
            case 'DELETE':
				;[err, care] = await to(self.deleteFamily(req, res));
				if (err) throw err
				res.json(care)	
				break;
			
            case 'GET':
				;[err, care] = await to(self.getFamily(req, res));
				if (err) throw err
				res.json(care)	
				break;
			
			
			default:
				res.status(422).json({error:{method:`${method} not supported`}});
		}
    }

    async postFamily(req, res) {
		let ancestorFamily = req.params.v1 || 2 // put in default into World family
		,body = req.body
		, ttbody =  req.ttbody
		, authuid = req.authuid
		, [err, care] = []
		, familyName = ttbody.familyname

		if(!familyName)throw ({ status:422, message:{Permission: `Please provide family name`}})

		let [_err,csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({AppName:"csystem"}, "root", ancestorFamily, authuid)) // or any higher family...
		if(_err)throw ({ status:422, message:{Permission: `You are not allowed to modify family ${ancestorFamily}`}})
		if(!csyAdmin)throw ({ status:422, message:{Permission: `You are not allowed to modify family ${ancestorFamily}`}})

		;[err, care] = await to(Familyfe.Family.getFamilyHierarchy(ancestorFamily))
		if(err)throw err
		let parentHierarchy = care;

		;[err, care] = await to(Familyfe.Family.create({
			FamilyName:familyName,
	    	hierarchyLevel:parentHierarchy+1,
	    	parentFamilyId: ancestorFamily
		}))
		if(err){
			throw err
		}
		;[err, care] = await to(Familyfe.Family.getFathers(care))
		if(err) throw err
		return care		
	}
	
	
    async putFamily(req, res) {
		let familyId = req.params.v1
		,body = req.body
		, ttbody =  req.ttbody
		, authuid = req.authuid
		, [err, care] = []
		, familyName = ttbody.familyname

		if(!familyId)throw ({ status:422, message:{Permission: `Please provide familyid`}})
		if(!familyName)throw ({ status:422, message:{Permission: `Please provide family name`}})

		let [_err,csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({AppName:"csystem"}, "root", familyId, authuid))
		if(_err)throw ({ status:422, message:{Permission: `You are not allowed to modify family ${familyId}`}})
		if(!csyAdmin)throw ({ status:422, message:{Permission: `You are not allowed to modify family ${familyId}`}})


		;[err, care] = await to(Familyfe.Family.update({FamilyName:familyName}, {FamilyId:familyId}))
		if(err){
			throw err
		}
		return care		
	}
	
    async deleteFamily(req, res) {
		let familyId = req.params.v1
		,body = req.body
		, ttbody =  req.ttbody
		, authuid = req.authuid
		, [err, care] = []

		if(!familyId)throw ({ status:422, message:{Permission: `Please provide familyid`}})

		let [_err,csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({AppName:"csystem"}, "root", familyId, authuid))
		if(_err)throw ({ status:422, message:{Permission: `You are not allowed to modify family ${familyId}`}})
		if(!csyAdmin)throw ({ status:422, message:{Permission: `You are not allowed to modify family ${familyId}`}})

		familyId = parseInt(familyId)
		if(familyId === 1 || familyId === 2)throw ({ status:422, message:{Permission: `No one is allowed to delete family ${familyId}`}})

		;[err, care] = await to(Familyfe.Family.delete({FamilyId:familyId}))
		if(err){
			throw err
		}
		return care		
	}
    async getFamily(req, res) {
		let familyId = req.params.v1
		,body = req.body
		, ttbody =  req.ttbody
		, authuid = req.authuid
		, [err, care] = []

		if(!familyId)throw ({ status:422, message:{Permission: `Please provide familyid`}})

		familyId = parseInt(familyId)
		let [_err,csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({AppName:"csystem"}, "root", familyId, authuid))
		if(_err)throw ({ status:422, message:{Permission: `You are not allowed to view family ${familyId}`}})
		if(!csyAdmin)throw ({ status:422, message:{Permission: `You are not allowed to view family ${familyId}`}})

		let direction = ttbody.direction || 'down'
		if(direction === 'down')
			[err, care] = await to(Familyfe.Family.getChildren(familyId))
		else [err, care] = await to(Familyfe.Family.getFathers(familyId))
		if(err){
			throw err
		}
		return care		
	}
	


}

module.exports = new Family();