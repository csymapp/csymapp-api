'use strict'
const to = require('await-to-js').to,
	passport = require('passport'),
	csystem = require(__dirname + "/../../csystem").csystem,
	{
		sequelize
	} = require(__dirname + "/../../csystem").models,
	Familyfe = require(__dirname + '/../../../modules/node-familyfe')(sequelize)

class MemberRole extends csystem {

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
				[err, care] = await to(self.postRole(req, res));
				if (err) throw err
				res.json(care)
				break;

			case 'GET':
				[err, care] = await to(self.getRole(req, res));
				if (err) throw err
				res.json(care)
				break;
			
			case 'DELETE':
				[err, care] = await to(self.deleteRole(req, res));
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

	async deleteRole(req, res) {
		let familyid = req.params.v1,
			memberId = req.params.v2,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = [],
			self = this
			, roleid = ttbody.roleid

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
		if (memberId === undefined)throw ({
			status: 422,
			message: {
				familyid: `Please provide memberId`
			}
		})
		if (!parseInt(memberId)) throw ({
			status: 422,
			message: {
				familyid: `Please provide a valid memberId`
			}
		})
		if (roleid === undefined)throw ({
			status: 422,
			message: {
				familyid: `Please provide roleid`
			}
		})
		if (!parseInt(roleid)) throw ({
			status: 422,
			message: {
				familyid: `Please provide a valid roleid`
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

		// check that member exists in family
		;[_err, csyAdmin] = await to(Familyfe.Family.memberBelongstoFamily(parseInt(familyid), parseInt(memberId)))
		if(_err)throw _err
		if(!csyAdmin) throw ({
			status: 422,
			message: {
				memberid: `Member ${memberId} is not a member of family ${familyid}`
			}
		})

		// check that roles belongs to app installed for family
		;[_err, csyAdmin] = await to(Familyfe.Family.appisInstalledforFamily(parseInt(familyid),parseInt(roleid)))
		if(_err)throw _err
		if(!csyAdmin) throw ({
			status: 422,
			message: {
				roleid: `App for role ${roleid} is not installed for family ${familyid}`
			}
		})
		// check that member does not have role already
		;[_err, csyAdmin] = await to(Familyfe.Family.getMemberRoles(parseInt(memberId), {RoleId:parseInt(roleid)}))
		if(_err)throw _err
		// console.log(csyAdmin)
		if(!csyAdmin) throw ({
			status: 422,
			message: {
				memberid: `Member ${memberId} deos not have role ${roleid}`
			}
		})
		
		;[err, care] = await to(Familyfe.Family.deleteRoleforMember(parseInt(memberId), parseInt(roleid)));
		if(err) throw err
		return care
	}
	
	async postRole(req, res) {
		let familyid = req.params.v1,
			memberId = req.params.v2,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = [],
			self = this
			, roleid = ttbody.roleid

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
		if (memberId === undefined)throw ({
			status: 422,
			message: {
				familyid: `Please provide memberId`
			}
		})
		if (!parseInt(memberId)) throw ({
			status: 422,
			message: {
				familyid: `Please provide a valid memberId`
			}
		})
		if (roleid === undefined)throw ({
			status: 422,
			message: {
				familyid: `Please provide roleid`
			}
		})
		if (!parseInt(roleid)) throw ({
			status: 422,
			message: {
				familyid: `Please provide a valid roleid`
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

		// check that member exists in family
		;[_err, csyAdmin] = await to(Familyfe.Family.memberBelongstoFamily(parseInt(familyid), parseInt(memberId)))
		if(_err)throw _err
		if(!csyAdmin) throw ({
			status: 422,
			message: {
				memberid: `Member ${memberId} is not a member of family ${familyid}`
			}
		})

		// check that roles belongs to app installed for family
		;[_err, csyAdmin] = await to(Familyfe.Family.appisInstalledforFamily(parseInt(familyid),parseInt(roleid)))
		if(_err)throw _err
		if(!csyAdmin) throw ({
			status: 422,
			message: {
				roleid: `App for role ${roleid} is not installed for family ${familyid}`
			}
		})
		// check that member does not have role already
		;[_err, csyAdmin] = await to(Familyfe.Family.getMemberRoles(parseInt(memberId), {RoleId:parseInt(roleid)}))
		if(_err)throw _err
		// console.log(csyAdmin)
		if(csyAdmin) throw ({
			status: 422,
			message: {
				memberid: `Member ${memberId} already has role ${roleid}`
			}
		})
		
		;[err, care] = await to(Familyfe.Family.createRoleforMember(parseInt(memberId), parseInt(roleid)));
		if(err) throw err
		return care
	}


	async getRole(req, res) {
		let familyid = req.params.v1,
			memberId = req.params.v2,
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
		if (memberId === undefined)throw ({
			status: 422,
			message: {
				familyid: `Please provide memberId`
			}
		})
		if (!parseInt(memberId)) throw ({
			status: 422,
			message: {
				familyid: `Please provide a valid memberId`
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
		;[_err, csyAdmin] = await to(Familyfe.Family.memberBelongstoFamily(parseInt(familyid), parseInt(memberId)))
		if(_err)throw _err
		if(!csyAdmin) throw ({
			status: 422,
			message: {
				memberid: `Member ${memberId} is not a member of family ${familyid}`
			}
		})
		;[err, care] = await to(Familyfe.Family.getMemberRoles(memberId));
		if(err) throw err
		return care
	}

}

module.exports = new MemberRole();