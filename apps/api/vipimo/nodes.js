'use strict'
const to = require('await-to-js').to,
passport = require('passport'),
csystem = require(__dirname+"/../../csystem").csystem,
{sequelize} = require(__dirname+"/../../csystem").models,
Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)

class nodetype extends csystem {

	constructor() {
		super()
	}

	async createNode(req, res) {
		let body = req.body;
		let _NodeAddr = body.nodeaddr;
		let _Activation = body.activation;
		let _AppSKey = body.appskey;
		let _NwkSKey = body.nwkskey;
		let _AppEUI = body.appeui;
		let _AppKey = body.appkey;
		let _DevEUI = body.deveui;
		let _NodeEncodingNodeEncodingId = body.nodeencodingid;
		let _NodeTechnologyNodeTechnologyId = body.nodetechnologyid;
		let _NodeSourceNodeSourceId = body.nodesourceid;
		let _NodeTypeNodeTypeId = body.nodetypeid;

		let insert = {	}
		if(_NodeAddr) insert.NodeAddr = _NodeAddr
		if(_Activation) insert.Activation = _Activation
		if(_AppSKey) insert.AppSKey = _AppSKey
		if(_NwkSKey) insert.NwkSKey = _NwkSKey
		if(_AppEUI) insert.AppEUI = _AppEUI
		if(_AppKey) insert.AppKey = _AppKey
		if(_DevEUI) insert.DevEUI = _DevEUI
		if(_NodeEncodingNodeEncodingId) insert.NodeEncodingNodeEncodingId = _NodeEncodingNodeEncodingId
		if(_NodeTechnologyNodeTechnologyId) insert.NodeTechnologyNodeTechnologyId = _NodeTechnologyNodeTechnologyId
		if(_NodeSourceNodeSourceId) insert.NodeSourceNodeSourceId = _NodeSourceNodeSourceId
		if(_NodeTypeNodeTypeId) insert.NodeTypeNodeTypeId = _NodeTypeNodeTypeId

		let [err, care] = await to(sequelize.models.Node.create(insert))

		try {
		
		if (err) 
			if(err.errors[0].message !== 'NodeAddr must be unique')
				throw(err)
		} catch(error) {
			throw err
		}


		;[err, care] = await to(sequelize.models.Node.findOne({
			where:{NodeAddr:_NodeAddr},
			include: [
			{
		        model: sequelize.models.NodeType
		    },
		    {
		        model: sequelize.models.NodeSource
		    },
		    {
		        model: sequelize.models.NodeTechnology
		    },
		    {
		        model: sequelize.models.NodeEncoding
		    }

		    ]
		}))
		// console.log(care)
		// console.log(err)
		if(err)
			throw err;
		if(care === null) return res.json({})
		res.json(care.dataValues)
		return;
	}

	async editNode(req, res) {

		let self = this
		let params = req.params;
		let idOrType = params.v2;
		let NodeAddr = idOrType

		let [err, care] = [];
		
		if (idOrType) {
			let where = {}
			where.NodeAddr = idOrType

			let body = req.body;
			// let _NodeAddr = body.nodeaddr;
			let _Activation = body.activation;
			let _AppSKey = body.appskey;
			let _NwkSKey = body.nwkskey;
			let _AppEUI = body.appeui;
			let _AppKey = body.appkey;
			let _DevEUI = body.deveui;
			let _NodeEncodingNodeEncodingId = body.nodeencodingid;
			let _NodeTechnologyNodeTechnologyId = body.nodetechnologyid;
			let _NodeSourceNodeSourceId = body.nodesourceid;
			let _NodeTypeNodeTypeId = body.nodetypeid;

			let insert = {	}
			// if(_NodeAddr) insert.NodeAddr = _NodeAddr /// can't modify NodeAddr
			if(_Activation) insert.Activation = _Activation
			if(_AppSKey) insert.AppSKey = _AppSKey
			if(_NwkSKey) insert.NwkSKey = _NwkSKey
			if(_AppEUI) insert.AppEUI = _AppEUI
			if(_AppKey) insert.AppKey = _AppKey
			if(_DevEUI) insert.DevEUI = _DevEUI
			if(_NodeEncodingNodeEncodingId) insert.NodeEncodingNodeEncodingId = _NodeEncodingNodeEncodingId
			if(_NodeTechnologyNodeTechnologyId) insert.NodeTechnologyNodeTechnologyId = _NodeTechnologyNodeTechnologyId
			if(_NodeSourceNodeSourceId) insert.NodeSourceNodeSourceId = _NodeSourceNodeSourceId
			if(_NodeTypeNodeTypeId) insert.NodeTypeNodeTypeId = _NodeTypeNodeTypeId

			
			;[err, care] = await to(sequelize.models.Node.update(insert,{where:{NodeAddr}}))
			if (err) throw err

			;[err, care] = await to(sequelize.models.Node.findOne({
						where:{NodeAddr:idOrType},
						include: [
						{
					        model: sequelize.models.NodeType
					    },
					    {
					        model: sequelize.models.NodeSource
					    },
					    {
					        model: sequelize.models.NodeTechnology
					    },
					    {
					        model: sequelize.models.NodeEncoding
					    }

					    ]
					}))
			if (care === null) {
				return res.json({})
			}
			if (err) throw err

			res.json(care.dataValues)
			return;


		} else {
			throw 'Missing parameters'
		}
	}

	async getNodes(req, res) {
		let self = this
		let params = req.params;
		let idOrType = params.v2;

		let [err, care] = [];
		
		if (idOrType) {
			let where = {}
			where.NodeAddr = idOrType

			;[err, care] = await to(sequelize.models.Node.findOne({
						where:{NodeAddr:idOrType},
						include: [
						{
					        model: sequelize.models.NodeType
					    },
					    {
					        model: sequelize.models.NodeSource
					    },
					    {
					        model: sequelize.models.NodeTechnology
					    },
					    {
					        model: sequelize.models.NodeEncoding
					    }

					    ]
					}))
			if (care === null) {
				return res.json({})
			}
			if (err) throw err

			res.json(care.dataValues)
			return;


		} else {
			;[err, care] = await to(sequelize.models.Node.findAll());
			if (err) throw err
			sequelize.models.Node.findAll({
				include: [
						{
					        model: sequelize.models.NodeType
					    },
					    {
					        model: sequelize.models.NodeSource
					    },
					    {
					        model: sequelize.models.NodeTechnology
					    },
					    {
					        model: sequelize.models.NodeEncoding
					    }

					    ]
			}).then(function(nodes){
				let results = [];
				for(let i in nodes) {
					// let {NodeId, Type, Description} = nodes[i].dataValues;
					results.push(nodes[i].dataValues)
				}
				res.json(results)
			})
		}
	}

	async main(req, res) {
		let self = this;
		let method = req.method;
		switch(method) {
			case 'POST':
				await self.createNode(req, res);
				break;
			case 'GET':
				await self.getNodes(req, res);
				break;
			case 'PATCH':
				await self.editNode(req, res);
				break;
			default:
				res.send('still building this sections');
		}
	}

}

module.exports = new nodetype();