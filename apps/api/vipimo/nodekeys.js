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


	async node(req, res, next) {
		// let self = this;
		// let method = req.method;

		// switch(method) {
		// 	case 'POST':
		// 		await self.datafromNode(req, res);
		// 		break;
		// 	case 'GET':
		// 		await self.datatoNode(req, res);
		// 		break;
		// 	default:
		// 		res.send('still building this sections');
		// }
	}

	async main(req, res) {
		let self = this;
		let method = req.method;
		res.send('starting working on nodes...')

		switch(method) {
			case 'POST':
				await self.datafromNode(req, res);
				break;
			case 'GET':
				await self.datatoNode(req, res);
				break;
			default:
				res.send('still building this sections');
		}
	}

}

module.exports = new nodesource();