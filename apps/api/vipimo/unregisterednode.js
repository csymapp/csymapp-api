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

	async createUnregisteredNodeEntry(req, res) {
		let NodeAddr = req.params.v2
		let body = req.body;
		let mac = body.mac;
		let Data = body.data;
		let rssi = body.rssi;
		let snr = body.snr;
		let frequency = body.frequency;
		let bandwidth = body.bandwidth;
		let spreadingFactor = body.sf;


		let [err, care] = [];

		;[err, care] = await to(sequelize.models.Gateway.findOne({where:{MAC:mac}}))
		if (err)
			throw err;
		if (care.dataValues.length === 0)
			throw 'unrecognised gateway'
		let GatewayGatewayId = care.dataValues.GatewayId;

		let insert = {
			RSSI:rssi,
			SNR: snr,
			frequency: frequency,
			bandwidth:bandwidth,
			spreadingFactor: spreadingFactor
		}

		;[err, care] = await to(sequelize.models.NodeSignal.create(insert))

		// console.log(err)
		if(err)
			throw err;

		
		// console.log(care);
		let NodeSignalId = care.dataValues.NodeSignalId;

		insert = {
			NodeAddr,
			Data,
			GatewayGatewayId,
			NodeSignalNodeSignalId: NodeSignalId,
		}

		// console.log(insert)
		;[err, care] = await to(sequelize.models.UnregistredNode.create(insert))

		if(care === null) return res.json({})
		// let {NodeEncodingId, Encoding} = care.dataValues 
		// res.json({NodeEncodingId, Encoding})
		res.json({})
		return;
	}

	async main(req, res) {
		let self = this;
		let method = req.method;
		switch(method) {
			case 'POST':
				await self.createUnregisteredNodeEntry(req, res);
				break;
			// case 'GET':
			// 	await self.getNodeEncodings(req, res);
			// 	break;
			// case 'PATCH':
			// 	await self.editNodeEncoding(req, res);
			// 	break;
			default:
				res.send('still building this sections');
		}
	}

}

module.exports = new nodeencoding();