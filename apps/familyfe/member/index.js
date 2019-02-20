'use strict'
const to = require('await-to-js').to,
	passport = require('passport'),
	csystem = require(__dirname + "/../../csystem").csystem,
	{
		sequelize
	} = require(__dirname + "/../../csystem").models,
	Familyfe = require(__dirname + '/../../../modules/node-familyfe')(sequelize)

class Member extends csystem {

	constructor() {
		super()
	}

	async main(req, res) {
		let self = this;
		let method = req.method;
		let [err, care] = [], body = req.body, ttbody = {}

		for (let i in body) ttbody[i.toLowerCase()] = body[i]
		req.ttbody = ttbody

		;
		[err, care] = await to(self.isAuthenticated(res, req))
		if (err) throw err;
		let authuid = care.uid
		req.authuid = authuid

		switch (method) {
			case 'POST':
				[err, care] = await to(self.postMember(req, res));
				if (err) throw err
				res.json(care)
				break;

			// case 'PATCH':
			// 	;
			// 	[err, care] = await to(self.patchApp(req, res));
			// 	if (err) throw err
			// 	res.json(care)
			// 	break;

			case 'GET':
				[err, care] = await to(self.getMember(req, res));
				if (err) throw err
				res.json(care)
				break;
			
			case 'DELETE':
				[err, care] = await to(self.deleteMember(req, res));
				if (err) throw err
				res.json(care)
				break;


			default:
				res.status(422).json({
					error: {
						method: `${method} not supported`
					}
				});
		}
	}

	async deleteMember(req, res) {
		let familyid = req.params.v1,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = [],
			self = this
			, uid = ttbody.uid

		if (familyid === undefined)throw ({
			status: 422,
			message: {
				familyid: `Please provide familyid`
			}
		})
		if (!uid)throw ({
			status: 422,
			message: {
				uid: `Please provide uid`
			}
		})
		if (!parseInt(familyid)) throw ({
			status: 422,
			message: {
				familyid: `Please provide a valid familyid`
			}
		})

		let [_err, csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({
			AppName: "csystem"
		}, "root", parseInt(familyid), authuid))
		if (_err) throw ({
			status: 422,
			message: {
				Permission: `You are not allowed to modify family ${familyid}`
			}
		})
		if (!csyAdmin) throw ({
			status: 422,
			message: {
				Permission: `You are not allowed to modify family ${familyid}`
			}
		})
		;[err, care] = await to(Familyfe.Family.deleteMember(parseInt(familyid), uid));
		if(err) throw err
		return care
	}
	
	async postMember(req, res) {
		let familyid = req.params.v1,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = [],
			self = this
			, uid = ttbody.uid

		if (familyid === undefined)throw ({
			status: 422,
			message: {
				familyid: `Please provide familyid`
			}
		})
		if (!uid)throw ({
			status: 422,
			message: {
				uid: `Please provide uid`
			}
		})
		if (!parseInt(familyid)) throw ({
			status: 422,
			message: {
				familyid: `Please provide a valid familyid`
			}
		})

		let [_err, csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({
			AppName: "csystem"
		}, "root", parseInt(familyid), authuid))
		if (_err) throw ({
			status: 422,
			message: {
				Permission: `You are not allowed to modify family ${familyid}`
			}
		})
		if (!csyAdmin) throw ({
			status: 422,
			message: {
				Permission: `You are not allowed to modify family ${familyid}`
			}
		})
		;[err, care] = await to(Familyfe.Family.addMember(parseInt(familyid), uid));
		if(err) throw err
		return care
	}


	async getMember(req, res) {
		let familyid = req.params.v1,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = [],
			self = this
			// , familyid = ttbody.familyid

		if (familyid === undefined)throw ({
			status: 422,
			message: {
				familyid: `Please provide familyid`
			}
		})
		if (!parseInt(familyid)) throw ({
			status: 422,
			message: {
				familyid: `Please provide a valid familyid`
			}
		})

		let [_err, csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({
			AppName: "csystem"
		}, "root", parseInt(familyid), authuid))
		if (_err) throw ({
			status: 422,
			message: {
				Permission: `You are not allowed to modify family ${familyid}`
			}
		})
		if (!csyAdmin) throw ({
			status: 422,
			message: {
				Permission: `You are not allowed to modify family ${familyid}`
			}
		})
		;[err, care] = await to(Familyfe.Family.getMembers(parseInt(familyid)));
		if(err) throw err
		return care
	}




}

module.exports = new Member();