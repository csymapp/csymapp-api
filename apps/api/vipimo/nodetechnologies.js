'use strict'
const to = require('await-to-js').to,
passport = require('passport'),
csystem = require(__dirname+"/../../csystem").csystem,
{sequelize} = require(__dirname+"/../../csystem").models,
Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)

class nodetechnology extends csystem {

	constructor() {
		super()
	}

	async createNodeTechnology(req, res) {
		let body = req.body;
		let technology = body.technology;
		// let description = body.description;

		let insert = {
			Technology: technology
		}

		let [err, care] = await to(sequelize.models.NodeTechnology.create(insert))

		console.log(err)
		if(err)
			throw err;

		
		if (err) 
			if(err.errors[0].message !== 'Technology must be unique')
				throw(err)
		if(care === null) return res.json({})
		let {NodeTechnologyId, Technology} = care.dataValues 
		res.json({NodeTechnologyId, Technology})
		return;
	}

	async editNodeTechnology(req, res) {

		let body = req.body;
		let technology = body.technology || null;
		// let description = body.description || null;

		let insert = {}

		if (technology !== null) insert.Technology = technology
		// if (description !== null) insert.Description = description


		let params = req.params;
		let idOrTechnology = params.v2;

		let [err, care] = [];
		
		if (idOrTechnology) {
			let where = {}
			if (isNaN(idOrTechnology)) 
				where.Technology = idOrTechnology
			else
				where.NodeTechnologyId = idOrTechnology;
			console.log(where)
			console.log(insert)
			;[err, care] = await to(sequelize.models.NodeTechnology.update(insert,{where:where}))
			if (err) throw err

			if(insert.Technology) {
				where.Technology = insert.Technology
			}
			// console.log(where)
			;[err, care] = await to(sequelize.models.NodeTechnology.findOne({where:where}))

			if (care === null) {
				return res.json({})
			}
			if (err) throw err

			let {NodeTechnologyId, Technology} = care.dataValues
			res.json({NodeTechnologyId, Technology})
		} else {
			throw 'Missing parameters'
		}

		return;
	}

	async getNodeTechnologys(req, res) {
		let self = this
		let params = req.params;
		let idOrTechnology = params.v2;

		let [err, care] = [];
		
		if (idOrTechnology) {
			let where = {}
			if (isNaN(idOrTechnology)) 
				where.Technology = idOrTechnology
			else
				where.NodeTechnologyId = idOrTechnology;
			;[err, care] = await to(sequelize.models.NodeTechnology.findOne({where:where}))
			if (care === null) {
				return res.json({})
			}
			if (err) throw err
			let {NodeTechnologyId, Technology} = care.dataValues
			res.json({NodeTechnologyId, Technology})
		} else {
			;[err, care] = await to(sequelize.models.NodeTechnology.findAll());
			if (err) throw err
			sequelize.models.NodeTechnology.findAll().then(function(nodes){
				let results = [];
				for(let i in nodes) {
					let {NodeTechnologyId, Technology} = nodes[i].dataValues;
					results.push({NodeTechnologyId, Technology})
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
				await self.createNodeTechnology(req, res);
				break;
			case 'GET':
				await self.getNodeTechnologys(req, res);
				break;
			case 'PATCH':
				await self.editNodeTechnology(req, res);
				break;
			default:
				res.send('still building this sections');
		}
	}

}

module.exports = new nodetechnology();