'use strict'
const to = require('await-to-js').to,
passport = require('passport'),
csystem = require(__dirname+"/../../csystem").csystem,
{sequelize} = require(__dirname+"/../../csystem").models,
Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize),
Node = require(__dirname+"/nodes"),
Nodetypes = require(__dirname+"/nodetypes"),
NodeSources = require(__dirname+"/nodesources"),
NodeTechnologies = require(__dirname+"/nodetechnologies"),
Nodeencoding = require(__dirname+"/nodeencodings"),
UnregisteredNode = require(__dirname+"/unregisterednode"),
NodeData = require(__dirname+"/nodedatas")

class vipimo extends csystem {

	constructor() {
		super()
	}

	async createNewGateway(body) {
		let tmp = {};
		if(body.mac) 
			tmp.MAC = body.mac;
		if(body.location) 
			tmp.Location = body.location;
		if(body.addr) 
			tmp.HumanReadable = body.addr;
		if(body.GatewayTypeId) 
			tmp.GatewayTypeGatewayTypeId = body.GatewayTypeId;


		let [err, care] = await to(sequelize.models.Gateway.create(tmp))
		// console.log(err)
		// console.log(care)

		if (err) 
			if(err.errors[0].message !== 'MAC must be unique')
				throw(err)
		console.log('passed errpr point...')
		;[err, care] = await to(sequelize.models.Gateway.findOne({where:{MAC:body.mac},
			include: [{
		        model: sequelize.models.GatewayType
		    }]
		}))
		if (err) throw(err)
		let {MAC, LastSeen, Location, IP, HumanReadable, GatewayType} = care.dataValues
		return {MAC, LastSeen, Location, IP, addr:HumanReadable, GatewayType: {Type:GatewayType.Type}};
	}

	async nowUpdateGateway(body, mac) {
		let tmp = {};
		if(body.mac) 
			tmp.MAC = body.mac;
		if(body.location) 
			tmp.Location = body.location;
		if(body.addr) 
			tmp.HumanReadable = body.addr;
		if(body.GatewayTypeId) 
			tmp.GatewayTypeGatewayTypeId = body.GatewayTypeId;


		let [err, care] = await to(sequelize.models.Gateway.update(tmp, {where:{MAC:mac}}))
		if (err) 
			if(err.errors[0].message !== 'MAC must be unique')
				throw(err)
		;[err, care] = await to(sequelize.models.Gateway.findOne({where:{MAC:body.mac},
			include: [{
		        model: sequelize.models.GatewayType
		    }]
		}))
		if (err) throw(err)
		let {MAC, LastSeen, Location, IP, HumanReadable, GatewayType} = care.dataValues
		return {MAC, LastSeen, Location, IP, addr:HumanReadable, GatewayType: {Type:GatewayType.Type}};
	}




	async updateGatewayTime(req) {
		let mac = req.params.v2;
		let body = req.body;
		let IP = body.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		let [err, care] = await to(sequelize.models.Gateway.update({LastSeen:sequelize.literal('CURRENT_TIMESTAMP'), IP}, {where:{MAC:mac}}))
		if (err) 
			if(err.errors[0].message !== 'MAC must be unique')
				throw(err)
		;[err, care] = await to(sequelize.models.Gateway.findOne({where:{MAC:mac}}))
		if (err) throw(err)
		let {MAC, LastSeen} = care.dataValues
		return {MAC, LastSeen};
	}



	async updateGateway(req, res) {
		let self = this
		let body = req.body;
		let params = req.params;		
		let mac = params.v2;
		
		if (mac) {
			let [err, care] = await to(self.nowUpdateGateway(body, mac))
			if (err) throw err
			res.json(care)
		} else {
			throw ('Missing parameters')
		}
		
	}
	
	async datafromGateway(req, res) {
		let self = this
		let body = req.body;
		// console.log(body)
		// let mac = body.body;
		let params = req.params;
		// console.log(params)
		

		let mac = params.v2;
		
		if (mac) {
			let [err, care] = await to(self.updateGatewayTime(req))
			if (err) throw err
			res.json(care)
		} else {
			mac = body.mac;
			let [err, care] = await to(self.createNewGateway(body))
			if (err) throw err
			res.json(care)
		}
		
	}

	async datatoGateway(req, res) {
		let self = this
		let params = req.params;
		let mac = params.v2;
		let body = req.body

		let [err, care] = [];
		
		if (mac) {
			;[err, care] = await to(sequelize.models.Gateway.findOne({where:{MAC:mac},
			include: [{
		        model: sequelize.models.GatewayType
		    }]
		}))
		if (err) throw(err)
		if (care === null) return res.json({})
		let {MAC, LastSeen, Location, IP, HumanReadable, GatewayType} = care.dataValues
		res.json( {MAC, LastSeen, Location, IP, addr:HumanReadable, GatewayType: {Type:GatewayType.Type}});
		} else {
			;[err, care] = await to(sequelize.models.Gateway.findAll({
				include: [{
			        model: sequelize.models.GatewayType
			    }]
			}));
			if (err) throw err
			sequelize.models.Gateway.findAll({
				include: [{
			        model: sequelize.models.GatewayType
			    }]
			}).then(function(gateways){
				let results = [];
				for(let i in gateways) {
					// let {MAC, LastSeen} = gateways[i].dataValues;
					let {MAC, LastSeen, Location, IP, HumanReadable, GatewayType} = gateways[i].dataValues;
					results.push( {MAC, LastSeen, Location, IP, addr:HumanReadable, GatewayType: {Type:GatewayType.Type}});
					// results.push({MAC, LastSeen})
				}
				res.json(results)
			})
		}
		
	}

	async gateway(req, res, next) {
		let self = this;
		let method = req.method;

		switch(method) {
			case 'POST':
				await self.datafromGateway(req, res);
				break;
			case 'PATCH':
				await self.updateGateway(req, res);
				break;

			case 'GET':
				await self.datatoGateway(req, res);
				break;
			default:
				res.send('still building this sections');
		}
	}

	async node(req, res, next) {
		await Node.main(req, res)
	}

	async nodetype(req, res, next) {
		await Nodetypes.main(req, res)
	}

	async nodesource(req, res, next) {
		await NodeSources.main(req, res)
	}

	async nodetechnology(req, res, next) {
		await NodeTechnologies.main(req, res)
	}

	async nodeencoding(req, res, next) {
		await Nodeencoding.main(req, res)
	}

	async unregisterednode(req, res, next) {
		await UnregisteredNode.main(req, res)
	}

	async nodedata(req, res, next) {
		await NodeData.main(req, res)
	}



	async github(req, res, next) {
		let self = this
		let [err, care, dontcare] = [];
		let method = req.method;
		console.log(method)
		let params = req.body;
		console.log(body)
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

	async createNewGatewayType(req, res) {
		let self = this;
		let body = req.body;
		let {channels, type} = req.body;
		let [err, care] = await to(sequelize.models.GatewayType.create({Type:type, Channels:channels}))
		if(err)
			console.log(err)
		if (err) 
			if(err.errors[0].message !== 'Type must be unique')
				throw(err)
		;[err, care] = await to(sequelize.models.GatewayType.findOne({where:{Type:type}}))
		if (err) throw(err)
		let {GatewayTypeId, Type, Channels} = care.dataValues
		return {GatewayTypeId, Type, Channels};
	}

	async getGatewayTypes(req, res) {
		let self = this
		let params = req.params;
		let idOrType = params.v2;

		let [err, care] = [];
		
		if (idOrType) {
			let where = {}
			if (isNaN(idOrType)) 
				where.Type = idOrType
			else
				where.GatewayTypeId = idOrType;
			;[err, care] = await to(sequelize.models.GatewayType.findOne({where:where}))
			if (care === null) {
				return res.json({})
			}
			if (err) throw err
			let {GatewayTypeId, Type, Channels} = care.dataValues
			res.json({GatewayTypeId, Type, Channels})
		} else {
			;[err, care] = await to(sequelize.models.GatewayType.findAll());
			if (err) throw err
			sequelize.models.GatewayType.findAll().then(function(gateways){
				let results = [];
				for(let i in gateways) {
					let {GatewayTypeId, Type, Channels} = gateways[i].dataValues;
					results.push({GatewayTypeId, Type, Channels})
				}
				res.json(results)
			})
		}
	}

	async patchGatewayTypes(req, res) {
		let self = this
		let params = req.params;
		let idOrType = params.v2;
		let body = req.body;

		let [err, care] = [];
		
		if (idOrType) {
			let where = {}
			let updates = {}
			if (isNaN(idOrType)) 
				where.Type = idOrType
			else
				where.GatewayTypeId = idOrType;
			if(body.type)
				updates.Type = body.type
			if(body.channels)
				updates.Channels = body.channels
			;[err, care] = await to(sequelize.models.GatewayType.update(updates,{where:where}))
			if (care === null) {
				return res.json({})
			}
			if(err) throw (err);
			if(where.GatewayTypeId === undefined) {
				where = {}
				if(updates.Type){
					where.Type = updates.Type
				}
			}

			;[err, care] = await to(sequelize.models.GatewayType.findOne({where:where}))
			if (care === null) {
				return res.json({})
			}
			if (err) throw err
			let {GatewayTypeId, Type, Channels} = care.dataValues
			res.json({GatewayTypeId, Type, Channels})
		} else {
			throw ('Missing parameter: Type/id')
		}
	}


	async gatewaytype(req, res){
		// res.send("type")
		let self = this;
		let method = req.method;
		let [err, care] = [];
			

		switch(method) {
			case 'POST':
				;[err, care] = await to(self.createNewGatewayType(req, res));
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


	async protected(req, res, next)
	{
		let self = this
		self.isMethodAllowed(req, ["GET"]);
		let __promisifiedPassportAuthentication = function () {
		    return new Promise((resolve, reject) => {
		        passport.authenticate('jwt', {session: false}, (err, user, info) => {
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
			throw(err)
		})
	}

	async main(req, res, next) {
		let self = this
		let endpoints = await self.getRoutes(__dirname)
		res.json(endpoints)
	}


}

module.exports = vipimo