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

	async createNodeType(req, res) {
		let body = req.body;
		let type = body.type;
		let description = body.description;

		let insert = {
			Type: type,
			Description: description
		}

		let [err, care] = await to(sequelize.models.NodeType.create(insert))

		console.log(err)
		if(err)
			throw err;

		
		if (err) 
			if(err.errors[0].message !== 'Type must be unique')
				throw(err)
		if(care === null) return res.json({})
		let {NodeTypeId, Type, Description} = care.dataValues
		res.json({NodeTypeId, Type, Description})
		return;
	}

	async editNodeType(req, res) {

		let body = req.body;
		let type = body.type || null;
		let description = body.description || null;

		let insert = {}

		if (type !== null) insert.Type = type
		if (description !== null) insert.Description = description


		let params = req.params;
		let idOrType = params.v2;

		let [err, care] = [];
		
		if (idOrType) {
			let where = {}
			if (isNaN(idOrType)) 
				where.Type = idOrType
			else
				where.NodeTypeId = idOrType;
			console.log(where)
			;[err, care] = await to(sequelize.models.NodeType.update(insert,{where:where}))
			if (err) throw err

			if(insert.Type) {
				where.Type = insert.Type
			}
			console.log(where)
			;[err, care] = await to(sequelize.models.NodeType.findOne({where:where}))

			if (care === null) {
				return res.json({})
			}
			if (err) throw err

			let {NodeTypeId, Type, Description} = care.dataValues
			res.json({NodeTypeId, Type, Description})
		} else {
			throw 'Missing parameters'
		}

		return;
	}

	async getNodeTypes(req, res) {
		let self = this
		let params = req.params;
		let idOrType = params.v2;

		let [err, care] = [];
		
		if (idOrType) {
			let where = {}
			if (isNaN(idOrType)) 
				where.Type = idOrType
			else
				where.NodeTypeId = idOrType;
			;[err, care] = await to(sequelize.models.NodeType.findOne({where:where}))
			if (care === null) {
				return res.json({})
			}
			if (err) throw err
			let {NodeTypeId, Type, Description} = care.dataValues
			res.json({NodeTypeId, Type, Description})
		} else {
			;[err, care] = await to(sequelize.models.NodeType.findAll());
			if (err) throw err
			sequelize.models.NodeType.findAll().then(function(nodes){
				let results = [];
				for(let i in nodes) {
					let {NodeTypeId, Type, Description} = nodes[i].dataValues;
					results.push({NodeTypeId, Type, Description})
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
				await self.createNodeType(req, res);
				break;
			case 'GET':
				await self.getNodeTypes(req, res);
				break;
			case 'PATCH':
				await self.editNodeType(req, res);
				break;
			default:
				res.send('still building this sections');
		}
	}

}

module.exports = new nodetype();