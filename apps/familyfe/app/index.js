'use strict'
const to = require('await-to-js').to,
	passport = require('passport'),
	csystem = require(__dirname + "/../../csystem").csystem,
	{
		sequelize
	} = require(__dirname + "/../../csystem").models,
	Familyfe = require(__dirname + '/../../../modules/node-familyfe')(sequelize)

class App extends csystem {

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
				;
				[err, care] = await to(self.postApp(req, res));
				if (err) throw err
				res.json(care)
				break;

			case 'PATCH':
				;
				[err, care] = await to(self.patchApp(req, res));
				if (err) throw err
				res.json(care)
				break;

			case 'GET':
				[err, care] = await to(self.getApp(req, res));
				if (err) throw err
				res.json(care)
				break;
			
			case 'DELETE':
				[err, care] = await to(self.deleteApp(req, res));
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

	async postApp(req, res) {
		let appid = req.params.v1,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = [],
			familyid = ttbody.familyid

		if (!appid) throw ({
			status: 422,
			message: {
				appid: `Please provide appid`
			}
		})
		if (!ttbody.familyid) throw ({
			status: 422,
			message: {
				familyid: `Please provide familyid`
			}
		})
		
		if (!parseInt(appid)) throw ({
			status: 422,
			message: {
				appid: `Please provide a valid appid`
			}
		})
		if (!parseInt(ttbody.familyid)) throw ({
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

		// Install app for familyid
		;[err, care] = await to(Familyfe.Apps.installforFamily(parseInt(appid), familyid));
		if(err) throw err
		return care
	}

	
	async deleteApp(req, res) {
		let appid = req.params.v1,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = [],
			familyid = ttbody.familyid

		if (!appid) throw ({
			status: 422,
			message: {
				appid: `Please provide appid`
			}
		})
		if (!ttbody.familyid) throw ({
			status: 422,
			message: {
				familyid: `Please provide familyid`
			}
		})
		
		if (!parseInt(appid)) throw ({
			status: 422,
			message: {
				appid: `Please provide a valid appid`
			}
		})
		if (!parseInt(ttbody.familyid)) throw ({
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

		// Install app for familyid
		;[err, care] = await to(Familyfe.Apps.deletefromFamily(parseInt(appid), familyid));
		if(err) throw err
		return care
	}



	async patchApp(req, res) {
		let appid = req.params.v1,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = []

		if (!appid) throw ({
			status: 422,
			message: {
				appid: `Please provide appid`
			}
		})
		

		let [_err, csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({
			AppName: "csystem"
		}, "root", 1, authuid))
		if (_err) throw ({
			status: 422,
			message: {
				Permission: `You are not allowed to modify app ${appid}`
			}
		})
		if (!csyAdmin) throw ({
			status: 422,
			message: {
				Permission: `You are not allowed to modify app ${appid}`
			}
		})

		let updates = {}
		if(ttbody.enabled !== undefined) {
			if(ttbody.enabled !== false && ttbody.enabled !== true) throw ({
				status: 422,
				message: {
					Enabled: `Invalid ${ttbody.enabled} for Enabled`
				}})
			updates["Enabled"] = ttbody.enabled
		}
		
		// try{
		
		;[err, care] = await to(Familyfe.Apps.update(updates, {
			AppId: appid
		}))
		if (err) {
			throw err
		}
		return care
	}

	
	async getApp(req, res) {
		let familyId = req.params.v1,
			body = req.body,
			ttbody = req.ttbody,
			authuid = req.authuid,
			[err, care] = [],
			self = this
		// try{

		// if(!familyId) { 
		// list all apps in the system,using filters in ttbody
		let where = {},
			whereInner = {};
		if (ttbody.appid) where['AppId'] = ttbody.appid
		if (ttbody.appname) where['AppName'] = ttbody.appname
		if (ttbody.enabled !== undefined) where['Enabled'] = ttbody.enabled
		// if familyid, then user ought to be member of that family. Otherwise if user is csyadmin, then just show everything, otherwise show only numbers
		if (ttbody.familyid) whereInner['FamilyFamilyId'] = ttbody.familyid;
		[err, care] = await to(Familyfe.Apps.getAllAppsv1(where, whereInner));
		if (err) throw err
		if (care === undefined) return {}

		care = JSON.parse(JSON.stringify(care))

		for (let i in care)
			care[i].numFamilies = care[i].InstalledApps.length

		let [err1, care1] = await to(self.isAuthenticated(res, req))
		let myuid = care1.uid
		if (ttbody.familyid) {
			let [_err, csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({
				AppName: "csystem"
			}, "root", parseInt(ttbody.familyid), myuid))
			if (_err) throw ({
				status: 500,
				message: {
					Permission: "Unknown error. Please try again"
				}
			})

			if (!csyAdmin)
				throw ({
					status: 422,
					message: {
						Permission: `You are not allowed to view family ${ttbody.familyid}`
					}
				})
		} else {
			let [_err, csyAdmin] = await to(Familyfe.Family.memberHasRoleinFamilyforApp({
				AppName: "csystem"
			}, "root", 1, myuid))
			if (_err) throw ({
				status: 500,
				message: {
					Permission: "Unknown error. Please try again"
				}
			})

			if (!csyAdmin) {
				care = JSON.parse(JSON.stringify(care, (k, v) => (k === 'InstalledApps') ? undefined : v))
			} else {

			}

		}
		return care
		
	}



}

module.exports = new App();