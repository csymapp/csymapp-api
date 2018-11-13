'use strict'
const to = require('await-to-js').to,
passport = require('passport'),
csystem = require(__dirname+"/../../csystem").csystem,
{sequelize} = require(__dirname+"/../../csystem").models,
Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize),
moment = require('moment')

class nodeData extends csystem {

	constructor() {
		super()
	}

	async insertintoDigital1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Digital1.create(insert))
		if(err) throw err;
		return care.dataValues.Digital1Id;
	}
	async insertintoDigital2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Digital2.create(insert))
		if(err) throw err;
		return care.dataValues.Digital2Id;
	}
	async insertintoDigital3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Digital3.create(insert))
		if(err) throw err;
		return care.dataValues.Digital3Id;
	}
	async insertintoDigital4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Digital4.create(insert))
		if(err) throw err;
		return care.dataValues.Digital4Id;
	}

	async insertintoAnalog1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Analog1.create(insert))
		if(err) throw err;
		return care.dataValues.Analog1Id;
	}
	async insertintoAnalog2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Analog2.create(insert))
		if(err) throw err;
		return care.dataValues.Analog2Id;
	}
	async insertintoAnalog3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Analog3.create(insert))
		if(err) throw err;
		return care.dataValues.Analog3Id;
	}
	async insertintoAnalog4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Analog4.create(insert))
		if(err) throw err;
		return care.dataValues.Analog4Id;
	}

	async insertintoTemperature1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Temperature1.create(insert))
		if(err) throw err;
		return care.dataValues.Temperature1Id;
	}
	async insertintoTemperature2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Temperature2.create(insert))
		if(err) throw err;
		return care.dataValues.Temperature2Id;
	}
	async insertintoTemperature3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Temperature3.create(insert))
		if(err) throw err;
		return care.dataValues.Temperature3Id;
	}
	async insertintoTemperature4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Temperature4.create(insert))
		if(err) throw err;
		return care.dataValues.Temperature4Id;
	}
	async insertintoBattery(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Battery.create(insert))
		if(err) throw err;
		return care.dataValues.BatteryId;
	}

	async insertintoHumidity1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Humidity1.create(insert))
		if(err) throw err;
		return care.dataValues.Humidity1Id;
	}
	async insertintoHumidity2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Humidity2.create(insert))
		if(err) throw err;
		return care.dataValues.Humidity2Id;
	}
	async insertintoHumidity3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Humidity3.create(insert))
		if(err) throw err;
		return care.dataValues.Humidity3Id;
	}
	async insertintoHumidity4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Humidity4.create(insert))
		if(err) throw err;
		return care.dataValues.Humidity4Id;
	}

	async insertintoPressure1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Pressure1.create(insert))
		if(err) throw err;
		return care.dataValues.Pressure1Id;
	}
	async insertintoPressure2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Pressure2.create(insert))
		if(err) throw err;
		return care.dataValues.Pressure2Id;
	}
	async insertintoPressure3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Pressure3.create(insert))
		if(err) throw err;
		return care.dataValues.Pressure3Id;
	}
	async insertintoPressure4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Pressure4.create(insert))
		if(err) throw err;
		return care.dataValues.Pressure4Id;
	}

	async insertintoWater1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Water1.create(insert))
		if(err) throw err;
		return care.dataValues.Water1Id;
	}
	async insertintoWater2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Water2.create(insert))
		if(err) throw err;
		return care.dataValues.Water2Id;
	}
	async insertintoWater3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Water3.create(insert))
		if(err) throw err;
		return care.dataValues.Water3Id;
	}
	async insertintoWater4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Water4.create(insert))
		if(err) throw err;
		return care.dataValues.Water4Id;
	}

	async insertintoRainfall1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Rainfall1.create(insert))
		if(err) throw err;
		return care.dataValues.Rainfall1Id;
	}
	async insertintoRainfall2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Rainfall2.create(insert))
		if(err) throw err;
		return care.dataValues.Rainfall2Id;
	}
	async insertintoRainfall3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Rainfall3.create(insert))
		if(err) throw err;
		return care.dataValues.Rainfall3Id;
	}
	async insertintoRainfall4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.Rainfall4.create(insert))
		if(err) throw err;
		return care.dataValues.Rainfall4Id;
	}

	async insertintoWindSpeed1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.WindSpeed1.create(insert))
		if(err) throw err;
		return care.dataValues.WindSpeed1Id;
	}
	async insertintoWindSpeed2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.WindSpeed2.create(insert))
		if(err) throw err;
		return care.dataValues.WindSpeed2Id;
	}
	async insertintoWindSpeed3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.WindSpeed3.create(insert))
		if(err) throw err;
		return care.dataValues.WindSpeed3Id;
	}
	async insertintoWindSpeed4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.WindSpeed4.create(insert))
		if(err) throw err;
		return care.dataValues.WindSpeed4Id;
	}

	async insertintoWindDirection1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.WindDirection1.create(insert))
		if(err) throw err;
		return care.dataValues.WindDirection1Id;
	}
	async insertintoWindDirection2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.WindDirection2.create(insert))
		if(err) throw err;
		return care.dataValues.WindDirection2Id;
	}
	async insertintoWindDirection3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.WindDirection3.create(insert))
		if(err) throw err;
		return care.dataValues.WindDirection3Id;
	}
	async insertintoWindDirection4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.WindDirection4.create(insert))
		if(err) throw err;
		return care.dataValues.WindDirection4Id;
	}

	async insertintoDigitalState1(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.DigitalState1.create(insert))
		if(err) throw err;
		return care.dataValues.DigitalState1Id;
	}
	async insertintoDigitalState2(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.DigitalState2.create(insert))
		if(err) throw err;
		return care.dataValues.DigitalState2Id;
	}
	async insertintoDigitalState3(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.DigitalState3.create(insert))
		if(err) throw err;
		return care.dataValues.DigitalState3Id;
	}
	async insertintoDigitalState4(data) {
		let insert = {
			Data:data
		}
		let [err, care] = await to(sequelize.models.DigitalState4.create(insert))
		if(err) throw err;
		return care.dataValues.DigitalState4Id;
	}


	async createNodeDataEntry(req, res) {
		let self = this
		let NodeAddr = req.params.v2
		let body = req.body;
		let mac = body.mac;
		let Data = body.data;
		let rssi = body.rssi;
		let snr = body.snr;
		let frequency = body.frequency;
		let bandwidth = body.bandwidth;
		let spreadingFactor = body.sf;
		let FrameCount = body.FrameCounter;


		let [err, care] = [];

		;[err, care] = await to(sequelize.models.Gateway.findOne({where:{MAC:mac}}))
		if (err)
			throw err;
		if (care.dataValues.length === 0)
			throw 'unrecognised gateway'
		let GatewayGatewayId = care.dataValues.GatewayId;

		;[err, care] = await to(sequelize.models.Node.findOne({where:{NodeAddr:NodeAddr}}))
		if (err)
			throw err;
		if (care.dataValues.length === 0)
			throw 'unrecognised node'
		let NodeNodeId = care.dataValues.NodeId;

		let insert = {
			RSSI:rssi,
			SNR: snr,
			frequency: frequency,
			bandwidth:bandwidth,
			spreadingFactor: spreadingFactor
		}
		;[err, care] = await to(sequelize.models.NodeSignal.create(insert))
		if(err)
			throw err;

		let NodeSignalId = care.dataValues.NodeSignalId;

		insert = {
			NodeNodeId,
			GatewayGatewayId,
			NodeSignalNodeSignalId: NodeSignalId,
			FrameCount
		}

		for(let item in body) {
			switch(item) {
				case 'D1':
					 [err, care] = await to(self.insertintoDigital1(body.D1))
					if(care) insert.Digital1Digital1Id = care
					break;
				case 'D2':
					 [err, care] = await to(self.insertintoDigital2(body.D2))
					if(care) insert.Digital2Digital2Id = care
					break;
				case 'D3':
					 [err, care] = await to(self.insertintoDigital3(body.D3))
					if(care) insert.Digital3Digital3Id = care
					break;
				case 'D4':
					 [err, care] = await to(self.insertintoDigital4(body.D4))
					if(care) insert.Digital4Digital4Id = care
					break;
				case 'T1':
					 [err, care] = await to(self.insertintoTemperature1(body.T1))
					if(care) insert.Temperature1Temperature1Id = care
					break;
				case 'T2':
					 [err, care] = await to(self.insertintoTemperature2(body.T2))
					if(care) insert.Temperature2Temperature2Id = care
					break;
				case 'T3':
					 [err, care] = await to(self.insertintoTemperature3(body.T3))
					if(care) insert.Temperature3Temperature3Id = care
					break;
				case 'T4':
					 [err, care] = await to(self.insertintoTemperature4(body.T4))
					if(care) insert.Temperature4Temperature4Id = care
					break;
				case 'A1':
					 [err, care] = await to(self.insertintoAnalog1(body.A1))
					if(care) insert.Analog1Analog1Id = care
					break;
				case 'A2':
					 [err, care] = await to(self.insertintoAnalog2(body.A2))
					if(care) insert.Analog2Analog2Id = care
					break;
				case 'A3':
					 [err, care] = await to(self.insertintoAnalog3(body.A3))
					if(care) insert.Analog3Analog3Id = care
					break;
				case 'A4':
					 [err, care] = await to(self.insertintoAnalog4(body.A4))
					if(care) insert.Analog4Analog4Id = care
					break;
				case 'H1':
					 [err, care] = await to(self.insertintoHumidity1(body.H1))
					if(care) insert.Humidity1Humidity1Id = care
					break;
				case 'H2':
					 [err, care] = await to(self.insertintoHumidity2(body.H2))
					if(care) insert.Humidity2Humidity2Id = care
					break;
				case 'H3':
					 [err, care] = await to(self.insertintoHumidity3(body.H3))
					if(care) insert.Humidity3Humidity3Id = care
					break;
				case 'H4':
					 [err, care] = await to(self.insertintoHumidity4(body.H4))
					if(care) insert.Humidity4Humidity4Id = care
					break;
				case 'P1':
					 [err, care] = await to(self.insertintoPressure1(body.P1))
					if(care) insert.Pressure1Pressure1Id = care
					break;
				case 'P2':
					 [err, care] = await to(self.insertintoPressure2(body.P2))
					if(care) insert.Pressure2Pressure2Id = care
					break;
				case 'P3':
					 [err, care] = await to(self.insertintoPressure3(body.P3))
					if(care) insert.Pressure3Pressure3Id = care
					break;
				case 'P4':
					 [err, care] = await to(self.insertintoPressure4(body.P4))
					if(care) insert.Pressure4Pressure4Id = care
					break;
				case 'W1':
					 [err, care] = await to(self.insertintoWater1(body.W1))
					if(care) insert.Water1Water1Id = care
					break;
				case 'W2':
					 [err, care] = await to(self.insertintoWater2(body.W2))
					if(care) insert.Water2Water2Id = care
					break;
				case 'W3':
					 [err, care] = await to(self.insertintoWater3(body.W3))
					if(care) insert.Water3Water3Id = care
					break;
				case 'W4':
					 [err, care] = await to(self.insertintoWater4(body.W4))
					if(care) insert.Water4Water4Id = care
					break;
				case 'R1':
					 [err, care] = await to(self.insertintoRainfall1(body.R1))
					if(care) insert.Rainfall1Rainfall1Id = care
					break;
				case 'R2':
					 [err, care] = await to(self.insertintoRainfall2(body.R2))
					if(care) insert.Rainfall2Rainfall2Id = care
					break;
				case 'R3':
					 [err, care] = await to(self.insertintoRainfall3(body.R3))
					if(care) insert.Rainfall3Rainfall3Id = care
					break;
				case 'R4':
					 [err, care] = await to(self.insertintoRainfall4(body.R4))
					if(care) insert.Rainfall4Rainfall4Id = care
					break;
				case 'WD1':
					 [err, care] = await to(self.insertintoWindDirection1(body.WD1))
					if(care) insert.WindDirection1WindDirection1Id = care
					break;
				case 'WD2':
					 [err, care] = await to(self.insertintoWindDirection2(body.WD2))
					if(care) insert.WindDirection2WindDirection2Id = care
					break;
				case 'WD3':
					 [err, care] = await to(self.insertintoWindDirection3(body.WD3))
					if(care) insert.WindDirection3WindDirection3Id = care
					break;
				case 'WD4':
					 [err, care] = await to(self.insertintoWindDirection4(body.WD4))
					if(care) insert.WindDirection4WindDirection4Id = care
					break;
				case 'WS1':
					 [err, care] = await to(self.insertintoWindSpeed1(body.WS1))
					if(care) insert.WindSpeed1WindSpeed1Id = care
					break;
				case 'WS2':
					 [err, care] = await to(self.insertintoWindSpeed2(body.WS2))
					if(care) insert.WindSpeed2WindSpeed2Id = care
					break;
				case 'WS3':
					 [err, care] = await to(self.insertintoWindSpeed3(body.WS3))
					if(care) insert.WindSpeed3WindSpeed3Id = care
					break;
				case 'WS4':
					 [err, care] = await to(self.insertintoWindSpeed4(body.WS4))
					if(care) insert.WindSpeed4WindSpeed4Id = care
					break;
					case 'DS1':
					[err, care] = await to(self.insertintoDigitalState1(body.DS1))
				   if(care) insert.DigitalState1DigitalState1Id = care
				   break;
			   case 'DS2':
					[err, care] = await to(self.insertintoDigitalState2(body.DS2))
				   if(care) insert.DigitalState2DigitalState2Id = care
				   break;
			   case 'DS3':
					[err, care] = await to(self.insertintoDigitalState3(body.DS3))
				   if(care) insert.DigitalState3DigitalState3Id = care
				   break;
			   case 'DS4':
					[err, care] = await to(self.insertintoDigitalState4(body.DS4))
				   if(care) insert.DigitalState4DigitalState4Id = care
				   break;
				case 'B':
					;[err, care] = await to(self.insertintoBattery(body.B))
					if(care) insert.BatteryBatteryId = care
					break;

			}
		}

		// console.log(insert)
		// console.log(body)
		;[err, care] = await to(sequelize.models.NodeData.create(insert))

		if(care === null) return res.json({})
		// let {NodeEncodingId, Encoding} = care.dataValues 
		// res.json({NodeEncodingId, Encoding})
		res.json({})
		return;
	}

	async getNodeDataEntry(req, res) {
		let self = this;
		let body = req.body;
		let nodes = body.nodes;
		let select = {};
		let lastseconds = body.lastseconds;
		let lastminutes = body.lastminutes;
		let lasthours = body.lasthours;
		let lastdays = body.lastdays;
		let lastweeks = body.lastweeks;
		let lastmonths = body.lastmonths;
		let lastyears = body.lastyears;
		let fromdate = body.fromdate
		let todate = body.todate
		let limit = body.limit
		let nodeaddr = body.nodeaddr

		// console.log(body);

		if(lastseconds) 
			select['DataTime'] = {gte:moment().subtract(lastseconds, 'seconds').toDate()}
		if(lastminutes)
			select['DataTime'] = {gte:moment().subtract(lastminutes, 'minutes').toDate()}
		if(lasthours)
			select['DataTime'] = {gte:moment().subtract(lasthours, 'hours').toDate()}
		if(lastdays)
			select['DataTime'] = {gte:moment().subtract(lastdays, 'days').toDate()}
		if(lastweeks)
			select['DataTime'] = {gte:moment().subtract(lastweeks, 'weeks').toDate()}
		if(lastmonths)
			select['DataTime'] = {gte:moment().subtract(lastmonths, 'months').toDate()}
		if(lastyears)
			select['DataTime'] = {gte:moment().subtract(lastyears, 'years').toDate()}

		if(fromdate)
			select['DataTime'] = {gte:moment(fromdate)}
		if(todate)
			select['DataTime'] = {gte:moment(todate)}
		

		let [err, care] = [];
		let nodeId;

		if(nodeaddr) {
			[err, care] = await to(sequelize.models.Node.findOne({where:
				{'NodeAddr': nodeaddr}
			}))
			if(err)
				throw err
			if(care === null)
				return res.json({})
			if(Object.keys(care).length === 0)
				return res.json({})

			nodeId = care.dataValues['NodeId']
		}

		let options = {
			where:select
		}

		if(limit)
			options['limit'] = limit

		options['order'] = [['DataTime', 'DESC']]

		if(nodeId)
			select['NodeNodeId'] = nodeId

		let include = [
			{model: sequelize.models.Analog1},
			{model: sequelize.models.Analog2},
			{model: sequelize.models.Analog3},
			{model: sequelize.models.Analog4},
			{model: sequelize.models.Battery},
			{model: sequelize.models.NodeSignal},
			{model: sequelize.models.Digital1},
			{model: sequelize.models.Digital2},
			{model: sequelize.models.Digital3},
			{model: sequelize.models.Digital4},
			{model: sequelize.models.DigitalState1},
			{model: sequelize.models.DigitalState2},
			{model: sequelize.models.DigitalState3},
			{model: sequelize.models.DigitalState4},
			{model: sequelize.models.Temperature1},
			{model: sequelize.models.Temperature2},
			{model: sequelize.models.Temperature3},
			{model: sequelize.models.Temperature4},
			{model: sequelize.models.Water1},
			{model: sequelize.models.Water2},
			{model: sequelize.models.Water3},
			{model: sequelize.models.Water4},
			{model: sequelize.models.WindDirection1},
			{model: sequelize.models.WindDirection2},
			{model: sequelize.models.WindDirection3},
			{model: sequelize.models.WindDirection4},
			{model: sequelize.models.WindSpeed1},
			{model: sequelize.models.WindSpeed2},
			{model: sequelize.models.WindSpeed3},
			{model: sequelize.models.WindSpeed4},
			{model: sequelize.models.Rainfall1},
			{model: sequelize.models.Rainfall2},
			{model: sequelize.models.Rainfall3},
			{model: sequelize.models.Rainfall4},
			{model: sequelize.models.Gateway, attributes: ["MAC"]},
			{model: sequelize.models.Node, attributes: ["NodeAddr"]},

			{model: sequelize.models.Pressure1},
			{model: sequelize.models.Pressure2},
			{model: sequelize.models.Pressure3},
			{model: sequelize.models.Pressure4},
			{model: sequelize.models.Humidity1},
			{model: sequelize.models.Humidity2},
			{model: sequelize.models.Humidity3},
			{model: sequelize.models.Humidity4}
		]

		options['include'] = include


		if(!nodes)
			[err, care] = await to(sequelize.models.NodeData.findAll(options))

		console.log(select)
		// console.log('err')
		// console.log(err)

		// console.log(care)
		care = JSON.stringify(care)
		care = JSON.parse(care)
		// try{
		// care = self.removeProps(care, 'createdAt');
		// }catch(err){
		// 	console.log(err)
		// }

		const removeEmpty = (obj) => {
		  const o = JSON.parse(JSON.stringify(obj)); // Clone source oect.

		  Object.keys(o).forEach(key => {
		    if (o[key] && typeof o[key] === 'object')
		      o[key] = removeEmpty(o[key]);  // Recurse.
		    else if (o[key] === undefined || o[key] === null)
		      delete o[key]; // Delete undefined and null.
		    else
		      o[key] = o[key];  // Copy value.
		  });

		  return o; // Return new object.
		};

		care = removeEmpty(care)
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'createdAt')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'updatedAt')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Analog1Analog1Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Analog2Analog2Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Analog3Analog3Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Analog4Analog4Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'BatteryBatteryId')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Digital1Digital1Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Digital2Digital2Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Digital3Digital3Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Digital4Digital4Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'DigitalState1DigitalState1Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'DigitalState2DigitalState2Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'DigitalState3DigitalState3Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'DigitalState4DigitalState4Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Temperature1Temperature1Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Temperature2Temperature2Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Temperature3Temperature3Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Temperature4Temperature4Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Water1Water1Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Water2Water2Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Water3Water3Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Water4Water4Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Rainfall1Rainfall1Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Rainfall2Rainfall2Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Rainfall3Rainfall3Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'Rainfall4Rainfall4Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'WindDirection1WindDirection1Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'WindDirection2WindDirection2Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'WindDirection3WindDirection3Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'WindDirection4WindDirection4Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'WindSpeed1WindSpeed1Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'WindSpeed2WindSpeed2Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'WindSpeed3WindSpeed3Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'WindSpeed4WindSpeed4Id')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'NodeNodeId')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'GatewayGatewayId')? undefined : v))

		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'GatewayTypeGatewayTypeId')? undefined : v))
		care = JSON.parse(JSON.stringify(care, (k,v) => (k === 'GatewayId')? undefined : v))

		// Object.keys(care).forEach((key) => (care[key] == null) && delete care[key]);



		res.json(care)
	}

	async main(req, res) {
		let self = this;
		let method = req.method;
		// res.send('starting working on nodes...')
		// console.log('starting nodeData work')

		switch(method) {
			case 'POST':
				await self.createNodeDataEntry(req, res);
				break;
			// case 'GET':
			// 	await self.datatoNode(req, res);
			// 	break;
			case 'GET':
				await self.getNodeDataEntry(req, res);
				break;
			default:
				res.send('still building this sections');
		}
	}

}

module.exports = new nodeData();