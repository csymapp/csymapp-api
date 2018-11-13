/*
 * file: User.js
 * Required to read users
 */
//const bcrypt = require('bcrypt-nodejs');
// const crypto = require('crypto');
// const MongoModels = require('mongo-models');
// const mongoose = require('mongoose');
const fse = require('fs-extra');
// const Joi = require('joi');
const Async = require('async');
const path = require('path');
const to = require('await-to-js').to;

// var Schema = mongoose.Schema,
//     ObjectId = Schema.ObjectId;


// const allappsSchemao = new Schema({
//     appname:{
//         type: String, 
//         unique: true 
//     },
//     enabled: [{
//         group:String,
//         enabled:Boolean
//     }]
// })

// const allappsSchema = Joi.object().keys({
//     _id: Joi.object(),
//     appname: Joi.string().required(),
//     enabled: Joi.object().keys({
//         group: Joi.string(),
//         enabled: Joi.boolean()
//     }),
//     timeCreated: Joi.date()
// });




class appsConfig
{

	constructor (sequelize) {
		let self = this;
		self.sequelize = sequelize
	}

    async setupallapps()
    {
        let self = this;
        let _root = __dirname+"/../../apps/";
        let [err, care] = [];
        //console.log("setting up all apps")

        let configFiles = []

        fse
		.readdirSync(__dirname+'/../../apps/')
		.forEach((file)=>{
			let configFolder = path.join(_root, file, 'config')
			
			try
			{
				fse
				.readdirSync(configFolder)
				.filter((configfile) =>
					configfile === 'index.js'
				)
				.forEach((configfile)=>{
					configFiles.push(path.join(configFolder, configfile));
				})
				console.log(`ConfigFolder: ${configFolder}`)

			} catch(err){}

			let innerConfig = path.join(_root, file);
			fse
			.readdirSync(innerConfig)
			.forEach((file)=>{
				configFolder = path.join(innerConfig, file, 'config')
				// console.log(`checking files in ${configFolder}`)
				try
				{
					fse
					.readdirSync(configFolder)
					.filter((configfile) =>
						configfile === 'index.js'
					)
					.forEach((configfile)=> {
						configFiles.push(path.join(configFolder, configfile));
					})
					console.log(`ConfigFolder: ${configFolder}`)
				}catch(err){}
			})
		})

		// console.log('finished reading....')
		// console.log(configFiles)
		// let self = this;

		async function createRoles(role, appId, appName, canuninstall) {
			;[err, care] = await to(self.sequelize.models.Role.create({
		    	Role:role,
		    	AppAppId: appId,
		    	UniqueRole: `${appName}${role}`,
		    	canUninstall:canuninstall[role]
		    }))
		    // console.log('role')
		    let roleId;
		    if (err) {	// role already exists
		    	;[err, care] = await to(self.sequelize.models.Role.findOne({where:{Role:role}}));
		    	roleId = care.dataValues.RoleId;
		    } else {
		    	roleId = care.dataValues.RoleId;
		    }
		    let ret = {};
		    ret[roleId] = role;
		    return ret;
		    // return {groupId:role};
		 }



		async function createApps(path) {
			let thisappconfig = require(path);
		    let appname = thisappconfig.get("/name")
		    let groups = thisappconfig.get("/groups")
		    let canuninstall = thisappconfig.get("/canuninstall")
		    let enabled = thisappconfig.get("/enabled")
		    let Enabled = thisappconfig.get("/Enabled")
		    let AutoInstall = thisappconfig.get("/AutoInstall")
		    // console.log(enabled)
		    // console.log(Enabled)

		    ;[err, care] = await to(self.sequelize.models.App.create({
		    	AppName:appname,
		    	AutoInstall: AutoInstall,
		    	Enabled: Enabled
		    }))

		    if (err) throw (err.errors);
		    let AppId = care.dataValues.AppId;	// for a single app
		    // console.log(appname)
		    // console.log(groups)
		    // console.log(canuninstall)
		   
		    // let promises = groups.map(createRoles);
		    let promises = groups.map( function(x) { return createRoles(x, AppId, appname, canuninstall); })
			;[err, care] = await to(Promise.all(promises));

			if (err) throw (err)

			let tmpGroups = {};
			for(let i in care) {
				for (let j in care[i]) {
					tmpGroups[j] = care[i][j];
				}
			}

			// console.log(care);

			let groupNames = [], groupIds = [];
			
			for( let i in tmpGroups) {
				groupIds.push(i)
				groupNames.push(care[i])
				// tmpGroups[i] = care[i].dataValues
			}
			// let groupsDate = care;

			// console.log(enabled)
			
			// async function createAppsGroups1(groupId) {
			// 	let appGroupData = {
			// 		AppAppId: AppId,
			// 		RoleGroupId: groupId,
			// 		Enabled: enabled[tmpGroups[groupId]],
			// 		canUninstall: canuninstall[tmpGroups[groupId]]

			// 	}
			// 	// console.log(appGroupData)
			// 	let [err, care] = await to(self.sequelize.models.AppGroup.create(appGroupData))

			// }

			// promises = groupIds.map(createAppsGroups1);
			// ;[err, care] = await to(Promise.all(promises));
		 //    return [err, care[0]];
		 	return true;
		}

		console.log('Now setting up apps');
		console.log(configFiles)
		let promises = configFiles.map(createApps);
		;[err, care] = await to(Promise.all(promises));
		console.log(err)
		if (err) throw (err)
		return true;
        
    }


    async getAllApps () {
		let self = this;
		let appIds = []
    	let [err, care] = await to(self.sequelize.models.App.findAll());
		for(let i in care) {
			appIds.push(care[i].dataValues.AppId)
		}
		return appIds
	}


    async installAppsforFamily(options){
    	let self = this;
    	let app = options.Apps;
    	let FamilyId = options.FamilyId
    	let appIds = [];
    	if(app === 'all') {
    		let [err, care] = await to(appIds = self.getAllApps());
    		appIds = care;
    	} else {
    		if (typeof app === 'number')
    			appIds.push(app)
    		else appIds = app
    	}

    	async function installforFamily(appid, FamilyId) {
    		//
    		// console.log(`${FamilyId}::${appid}`)
    		let [err, care] = []
    		// try{
    		
    		;[err, care] = await to(self.sequelize.models.InstalledApp.findOne({where:{
    			AppAppId:appid,
    			FamilyFamilyId:FamilyId
    			}
    		}))
    		if(care === null) {
				;[err, care] = await to(self.sequelize.models.InstalledApp.create({
					AppAppId:appid,
					FamilyFamilyId:FamilyId
				}))
			}
    	}
    	let promises = appIds.map(function(appid){return installforFamily(appid, FamilyId)})
		let [err, care] = await to(Promise.all(promises))
		return [err, care];
    }

    async getAllFamilies() {
    	let self = this;
		let familyIds = []
    	let [err, care] = await to(self.sequelize.models.Family.findAll());
		for(let i in care) {
			familyIds.push(care[i].dataValues.FamilyId)
		}
		return familyIds
    }

    async installAppsforAllFamilies(options) {
    	let self = this;
    	let familyIds = [];
    	let [err, care] = [];
    	
       	;[err, care] = await to(self.getAllFamilies());
    	familyIds = care;
    	
    	let promises = familyIds.map(function(familyId){ options.FamilyId=familyId; return self.installAppsforFamily(options)})
		;[err, care] = await to(Promise.all(promises))
		return [err, care];
    }

    async createAppGroupsofuser(whichuser, whichApp, whichGroups){
    	let self = this;
    	let groups = typeof whichGroups === 'string'? [whichGroups] : whichGroups;
    	// which app???
    	let appIds = [];
    	if (whichApp === 0) {
    		let [err, care] = await to(self.sequelize.models.App.findAll());
    		for(let i in care) {
    			appIds.push(care[i].dataValues.AppId)
    		}
    		// console.log(err)
    		// console.log(care)

    	} else {
    		let [err, care] = await to(self.sequelize.models.App.findOne({where:{AppName: whichApp}}))
    		appIds.push(care.dataValues.AppId)
    	}

    	// create groups for each app
    	async function createGroupsforApp (appid) {

    		async function appGroups(group) {
	    		// find the groupid to use
	    		let [err, care] = [];
	    		// try{
	    		;[err, care] = await to(self.sequelize.models.Role.find({where: {Group: group}, 
	    			include: [{
				        model: self.sequelize.models.AppGroup,
				        where: {'AppAppId': appid},
				        attributes: ['AppGroupId']
				    }], 

	    		}))
	    		let AppGroupId = care.dataValues.AppGroups[0].dataValues.AppGroupId


	    		let data = {
	    			AppGroupAppGroupId: AppGroupId,
	    			UserUid: whichuser,
	    			Installed: true
	    		}

	    		// get appId
	    		;[err, care] = await to(self.sequelize.models.AppUser.create(data));
				// console.log(err)
				return [err, care];
	    	}

    		let promises = groups.map(appGroups)
    		let [err, care] = await to(Promise.all(promises))
    		return [err, care];
    	}

    	// async function getAppIds() {

    	// } 

       	let promises = appIds.map(createGroupsforApp);
    	let [err, care] = await to(Promise.all(promises));
    	return [err, care];

    }
    
    static setuponeapps(app, callback)
    {
        let self = this;
        let _root = __dirname+"/../../../config/";

        self.collection = 'allapps';
        self.schema = allappsSchema;


        Async.auto({//
            drop: function(done){
               done()
            },
            create:["drop", function(results, done){
                let items = fse.readdirSync(_root);
                while(items.pop());
                items.push(app)
                Async.eachSeries(Object.keys(items), function (i, next){ 
                    if(items[i] == "." || items[i] == "..")next();
                    if(items[i].split(".").length > 1)next();
                    let appname = items[i];

                    let thisappconfig = require(_root + appname+"/config.js")
                    let enabled = thisappconfig.get("/enabled")
                    let displayname = thisappconfig.get("/displayname")
                    const document = {
                            appname: appname,
                            enabled: enabled,
                            timeCreated: new Date()
                        };
                    self.insertOne(document, function(err, results){
                        next()
                    });
                 }, function(err) {
                   done();
                }); 
            }]
        }, (err, results) => {
            if (err) {
                return callback(err);
            }

            callback(null);
        });

        
    }
    

    static getallapps(callback){
        let self = this;
        self.collection = 'allapps';
        self.schema = allappsSchema;
        self.find(function(err, results){
            callback(err, results)
        });

       // return {}
    }
//User = mongoose.model('User', userSchema);
}


module.exports = appsConfig;