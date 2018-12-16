'use strict'
const to = require('await-to-js').to
,passport = require('passport')
,csystem = require(__dirname+"/../../csystem").csystem
,{sequelize} = require(__dirname+"/../../csystem").models
,Familyfe = require(__dirname+'/../../../modules/node-familyfe')(sequelize)

class App extends csystem{

	constructor() {
		super()
    }
    
    async getApps(req, res) {
        let appIdorName = req.params.v1
        , [err, care] = []
        , self = this

        // list apps
        if(!appIdorName) {
            [err, care] = await to(Familyfe.apps.getAllApps(true));
            if(err) throw err
            return care
        }
        // list single app
        ;[err, care] = await to(Familyfe.apps.getAllApps(true, {AppId: appIdorName}));
        if(err) throw err
        if(!Object.keys(care).length) {
            ;[err, care] = await to(Familyfe.apps.getAllApps(true, {AppName: appIdorName}));
            if(err) throw err
        }
        return care
    }

    async main(req, res){
		let self = this;
		let method = req.method;
		let [err, care] = [];
			
		switch(method) {
            case 'GET': 
                // res.send('listing apps.')
                ;[err, care] = await to(self.getApps(req, res));
                if (err) throw err
                res.json(care)	
                break;
			case 'PATCH':
				;[err, care] = await to(self.patchTelephoneProfile(req, res));
				if (err) throw err
				res.json(care)	
				break;	
					
			case 'POST':
				;[err, care] = await to(self.PostTelephoneProfile(req, res));
				if (err) throw err
				res.json(care)	
				break;	
					
			case 'DELETE':
				;[err, care] = await to(self.deleteTelephoneProfile(req, res));
				if (err) throw err
				res.json(care)	
				break;
			
			default:
				res.send('still building this sections');
		}
    }
    



}

module.exports = new App();