'use strict'
const to = require('await-to-js').to,
passport = require('passport'),
csystem = require(__dirname+"/../csystem").csystem,
{sequelize} = require(__dirname+"/../csystem").models
,Familyfe = require(__dirname+'/../../modules/node-familyfe')(sequelize)
,Role = require(__dirname+"/role/")
,Family = require(__dirname+"/family/")
,Member = require(__dirname+"/member/")

class familyfe extends csystem {

	constructor() {
		super()
	}


	async main(req, res, next) {
		let self = this
		let endpoints = await self.getRoutes(__dirname)
		res.json(endpoints)
    }
    
    async role(req, res, nex) {
        let [err, care] = [];
        ;[err, care] = await to(Role.main(req, res));
        if(err) throw (err)
    }

    async family(req, res, next) {
        let [err, care] = [];
        ;[err, care] = await to(Family.main(req, res, next));
        if(err) throw (err)
    }

    async member(req, res, next) {
        let [err, care] = [];
        ;[err, care] = await to(Member.main(req, res, next));
        if(err) throw (err)
    }
}

module.exports = familyfe
