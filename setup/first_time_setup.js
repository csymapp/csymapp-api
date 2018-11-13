/*
 * File:     first_time_setup.js
 * Author:   Brian Onang'o
 * Company:  Csyber Systems
 * Website:  http://familyfe.csymapp.com
 * E-mail:   brian@cseco.co.ke, surgbc@gmail.com, brian@csymapp.com
 * Created:	Feb 2018
 *
 * Description
 * This script is used for setting up the databases and default users when setting up familyfe-challenge for the first time
 *
 T
*/

'use strict'
const dotenv = require('dotenv');
const chalk = require('chalk');
const to = require('await-to-js').to;
const Promptly = require('promptly');

const csystem = require(__dirname+'/../apps/csystem').csystem
const globalConfig = require(__dirname+'/../apps/csystem').globalConfig
const {sequelize} = require(__dirname+'/../apps/csystem').models
const Familyfe = require(__dirname+'/../modules/node-familyfe')(sequelize)

class firstTimeSetup extends csystem
{
	constructor()
	{
		super()
	}


	async first_time_setup()
	{
		let self = this
		let [err, dontcare, care] = [];

		// //sync db
		;[err, dontcare] = await to (self.dbSync(true))
		if(err) throw (err)

		console.log('Setting up Apps');
		;[err, care] = await to(Familyfe.apps.setupallapps())

		if(err){
			console.log(err)
			if(err) throw (err)
		}

		console.log('Setting up system families')
		;[err, care] = await to(Familyfe.Family.create({
			FamilyName:'World',
	    	hierarchyLevel:null,
	    	parentFamilyId: null
		}))
		if(err){
			console.log(err)
			if(err) throw (err)
		}

		let FamilyId = care;
		console.log(`Installing apps for ${FamilyId}`)
		
		;[err, care] = await to(Familyfe.apps.installAppsforFamily({
			FamilyId,
	    	Apps:'all'
		}))
		if(err){
			console.log(err)
			if(err) throw (err)
		}

		console.log('setting up test family')
		;[err, care] = await to(Familyfe.Family.create({
			FamilyName:'TestFamily',
	    	hierarchyLevel:null,
	    	parentFamilyId: null
		}))
		if(err){
			console.log(err)
			if(err) throw (err)
		}

		FamilyId = care;
		console.log(`Installing apps for ${FamilyId}`)
		
		;[err, care] = await to(Familyfe.apps.installAppsforFamily({
			FamilyId,
	    	Apps:'all'
		}))
		if(err){
			console.log(err)
			if(err) throw (err)
		}

		// await Familyfe.apps.installAppsforAllFamilies({
		// 	FamilyId,
	 //    	Apps:'all'
		// })
		console.log(`Creating Users`)

		
		// ;[err, care] = await to(Familyfe.apps.installAppsforFamily())
		
		/*
		 * installing apps:
		 	4. installfornewUser
		 		
		 	3. modifyuserRoles

		 	2. setUp a singleApp
		 		affect only its models...
		 		from request, or from other testFile..

		 	..................1. set also app to be disabled....
		 */

		let rootEmail = globalConfig.get('/rootEmail');
		console.log(`rootEmail: ${rootEmail}`);
		;[err, care] = await to(self.rootPassword())
		if(err)return Promise.reject(err)
		let rootPassword = care;
		console.log(`password: ${rootPassword}`)

		;[err, care] = await to (Familyfe.World.create({
			Name:"Brian Onang'o Admin", 
			Gender: "Male",
			Emailprofiles:{
				Email:rootEmail.toLowerCase(), 
				Password:rootPassword, 
				Cpassword:rootPassword, 
				IsActive:true,
				},
			IsActive:true,
			Families: [2, 1, 0]
		}));
		if(err){
			console.log(err)
			return Promise.reject(err)
		}

		let rootuid = care.uid;
		
		// ;[err, care] = await to(Familyfe.apps.createAppGroupsofuser(uid, 'csystem', ['nobody', 'root'])) // 0 is all apps

		let guestEmail = globalConfig.get('/guestEmail');
		;[err, care] = await to (Familyfe.Person.beget({
			Name:"Brian Onang'o Guest", 
			Gender: "Male",
			Emailprofiles:{
				Email:guestEmail.toLowerCase(), 
				Password:rootPassword, 
				Cpassword:rootPassword, 
				IsActive:true,
				},
			IsActive:true,
			Families: [2, 1]
		}))
		
		if(err){
			console.log(err)
			return Promise.reject(err)
		}
		let guestuid = care.uid;
		/*
			Add user to world.......................................................*
			Add user to some other family...... if it is given......................*


			Create user roles.......................................................*

			// create endpoints for apps...
				familyfe
				api/csystem
				vipimo
				hymnal
				ropebot

				user_accout_management
		*/

		console.log('creating Roles in World for rootUser');
		;[err, care] = await to(Familyfe.Family.getApps(1))
		if(err){
			console.log(err)
			throw (err)
		}
		let tmproles = care,
			roles = [];
		console.log(roles)
		;[err, care] = await to(Familyfe.Family.getMember(1, rootuid))
		// get memberId
		if(err){
			console.log(err)
			throw (err)
		}
		// console.log(care)
		let memberId = care

		for(let i in tmproles){
			// console.log(tmproles[i].App.Roles)
			for(let j in tmproles[i].App.Roles)
				roles.push(tmproles[i].App.Roles[j].RoleId)
		}
		console.log(roles)
		;[err, care] = await to(Familyfe.Family.createRolesforMember(memberId, roles))
		if(err){
			console.log(err)
			throw (err)
		}


		console.log('creating Roles in World for guestUser');
		;[err, care] = await to(Familyfe.Family.getspecificMemberRoleforFamily(1, "nobody"))
		if(err){
			console.log(err)
			throw (err)
		}
		tmproles = care
		roles = [];
		console.log(roles)
		;[err, care] = await to(Familyfe.Family.getMember(1, guestuid))
		// get memberId
		if(err){
			console.log(err)
			throw (err)
		}
		// console.log(care)
		memberId = care
		for(let i in tmproles){
			// console.log(tmproles[i].App.Roles)
			for(let j in tmproles[i].App.Roles)
				roles.push(tmproles[i].App.Roles[j].RoleId)
		}
		console.log(roles)
		;[err, care] = await to(Familyfe.Family.createRolesforMember(memberId, roles))
		if(err){
			console.log(err)
			throw (err)
		}

		return true
	}

	async rootPassword ()
	{	
		let password, dontcare, err;
		if(process.env.ENV === "development" || process.env.ENV === "dev")
        {
        	password = globalConfig.get('/rootEmail')
            return password
        }
        const validator = function (value) {
		    if (value.length < 5) {
		        throw new Error('Password less than 5 characters');
		    }
		    return value;
		};
		 
		// password = await Promptly.password('Root user password(atleast 5 characters): ', { validator ,replace: '*'});
		password = await Promptly.password('Root user password(atleast 5 characters): ', { validator});
        return password
	}

	async createAdmin()
	{

	}
}



let setup = async () => {
	let setup = new firstTimeSetup;
	let [err, dontcare] = await to( setup.first_time_setup(false));
	if(err)
	{
		console.log(chalk.red('✗ Set up failed'));
		process.exit(1)
	}
	console.log(chalk.green('✓ Done setting up'));
	process.exit(0)
}

setup()
