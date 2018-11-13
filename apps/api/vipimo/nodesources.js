'use strict'
const to = require('await-to-js').to,
passport = require('passport'),
csystem = require(__dirname+"/../../csystem").csystem,
{sequelize} = require(__dirname+"/../../csystem").models,
Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)

class nodesource extends csystem {

	constructor() {
		super()
	}

	async createNodeSource(req, res) {
		let body = req.body;
		let source = body.source;
		// let description = body.description;

		let insert = {
			Source: source
		}

		let [err, care] = await to(sequelize.models.NodeSource.create(insert))

		console.log(err)
		if(err)
			throw err;

		
		if (err) 
			if(err.errors[0].message !== 'Source must be unique')
				throw(err)
		if(care === null) return res.json({})
		let {NodeSourceId, Source} = care.dataValues 
		res.json({NodeSourceId, Source})
		return;
	}

	async editNodeSource(req, res) {

		let body = req.body;
		let source = body.source || null;
		// let description = body.description || null;

		let insert = {}

		if (source !== null) insert.Source = source
		// if (description !== null) insert.Description = description


		let params = req.params;
		let idOrSource = params.v2;

		let [err, care] = [];
		
		if (idOrSource) {
			let where = {}
			if (isNaN(idOrSource)) 
				where.Source = idOrSource
			else
				where.NodeSourceId = idOrSource;
			// console.log(where)
			;[err, care] = await to(sequelize.models.NodeSource.update(insert,{where:where}))
			if (err) throw err

			if(insert.Source) {
				where.Source = insert.Source
			}
			// console.log(where)
			;[err, care] = await to(sequelize.models.NodeSource.findOne({where:where}))

			if (care === null) {
				return res.json({})
			}
			if (err) throw err

			let {NodeSourceId, Source} = care.dataValues
			res.json({NodeSourceId, Source})
		} else {
			throw 'Missing parameters'
		}

		return;
	}

	async getNodeSources(req, res) {
		let self = this
		let params = req.params;
		let idOrSource = params.v2;

		let [err, care] = [];
		
		if (idOrSource) {
			let where = {}
			if (isNaN(idOrSource)) 
				where.Source = idOrSource
			else
				where.NodeSourceId = idOrSource;
			;[err, care] = await to(sequelize.models.NodeSource.findOne({where:where}))
			if (care === null) {
				return res.json({})
			}
			if (err) throw err
			let {NodeSourceId, Source} = care.dataValues
			res.json({NodeSourceId, Source})
		} else {
			;[err, care] = await to(sequelize.models.NodeSource.findAll());
			if (err) throw err
			sequelize.models.NodeSource.findAll().then(function(nodes){
				let results = [];
				for(let i in nodes) {
					let {NodeSourceId, Source} = nodes[i].dataValues;
					results.push({NodeSourceId, Source})
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
				await self.createNodeSource(req, res);
				break;
			case 'GET':
				await self.getNodeSources(req, res);
				break;
			case 'PATCH':
				await self.editNodeSource(req, res);
				break;
			default:
				res.send('still building this sections');
		}
	}

}

module.exports = new nodesource();