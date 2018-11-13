'use strict'
const to = require('await-to-js').to,
passport = require('passport'),
csystem = require(__dirname+"/../../csystem").csystem,
{sequelize} = require(__dirname+"/../../csystem").models,
Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)

class nodeencoding extends csystem {

	constructor() {
		super()
	}

	async createNodeEncoding(req, res) {
		let body = req.body;
		let encoding = body.encoding;
		// let description = body.description;

		let insert = {
			Encoding: encoding
		}

		let [err, care] = await to(sequelize.models.NodeEncoding.create(insert))

		console.log(err)
		if(err)
			throw err;

		
		if (err) 
			if(err.errors[0].message !== 'Encoding must be unique')
				throw(err)
		if(care === null) return res.json({})
		let {NodeEncodingId, Encoding} = care.dataValues 
		res.json({NodeEncodingId, Encoding})
		return;
	}

	async editNodeEncoding(req, res) {

		let body = req.body;
		let encoding = body.encoding || null;
		// let description = body.description || null;

		let insert = {}

		if (encoding !== null) insert.Encoding = encoding
		// if (description !== null) insert.Description = description


		let params = req.params;
		let idOrEncoding = params.v2;

		let [err, care] = [];
		
		if (idOrEncoding) {
			let where = {}
			if (isNaN(idOrEncoding)) 
				where.Encoding = idOrEncoding
			else
				where.NodeEncodingId = idOrEncoding;
			console.log(where)
			console.log(insert)
			;[err, care] = await to(sequelize.models.NodeEncoding.update(insert,{where:where}))
			if (err) throw err

			if(insert.Encoding) {
				where.Encoding = insert.Encoding
			}
			// console.log(where)
			;[err, care] = await to(sequelize.models.NodeEncoding.findOne({where:where}))

			if (care === null) {
				return res.json({})
			}
			if (err) throw err

			let {NodeEncodingId, Encoding} = care.dataValues
			res.json({NodeEncodingId, Encoding})
		} else {
			throw 'Missing parameters'
		}

		return;
	}

	async getNodeEncodings(req, res) {
		let self = this
		let params = req.params;
		let idOrEncoding = params.v2;

		let [err, care] = [];
		
		if (idOrEncoding) {
			let where = {}
			if (isNaN(idOrEncoding)) 
				where.Encoding = idOrEncoding
			else
				where.NodeEncodingId = idOrEncoding;
			;[err, care] = await to(sequelize.models.NodeEncoding.findOne({where:where}))
			if (care === null) {
				return res.json({})
			}
			if (err) throw err
			let {NodeEncodingId, Encoding} = care.dataValues
			res.json({NodeEncodingId, Encoding})
		} else {
			;[err, care] = await to(sequelize.models.NodeEncoding.findAll());
			if (err) throw err
			sequelize.models.NodeEncoding.findAll().then(function(nodes){
				let results = [];
				for(let i in nodes) {
					let {NodeEncodingId, Encoding} = nodes[i].dataValues;
					results.push({NodeEncodingId, Encoding})
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
				await self.createNodeEncoding(req, res);
				break;
			case 'GET':
				await self.getNodeEncodings(req, res);
				break;
			case 'PATCH':
				await self.editNodeEncoding(req, res);
				break;
			default:
				res.send('still building this sections');
		}
	}

}

module.exports = new nodeencoding();