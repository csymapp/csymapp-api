'use strict'
const to = require('await-to-js').to,
passport = require('passport'),
csystem = require(__dirname+"/../csystem").csystem,
{sequelize} = require(__dirname+"/../csystem").models
,Familyfe = require(__dirname+'/../../modules/node-familyfe')(sequelize)
,User = require(__dirname+"/user")
,Auth = require(__dirname+"/auth")

class csymapp extends csystem {

	constructor() {
		super()
	}


	async main(req, res, next) {
		let self = this
		let endpoints = await self.getRoutes(__dirname)
		res.json(endpoints)
    }
    
    async user(req, res, nex) {
        let [err, care] = [];
        ;[err, care] = await to(User.main(req, res));
        if(err) throw (err)
    }

    async auth(req, res, next) {
        let [err, care] = [];
        ;[err, care] = await to(Auth.main(req, res, next));
        if(err) throw (err)
    }


}

module.exports = csymapp
