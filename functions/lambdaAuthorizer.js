'use strict';

const { tokenValidation } = require("../lib/ddb");

module.exports.handler = async (event) => {
	try{
		const { authorizationToken } = event;
		const data = await tokenValidation(authorizationToken.split(':')[0], authorizationToken.split(':')[1])
		const response = {
			isAuthorized: true,
			resolverContext: {
				username: data.username
			},
			deniedFields: [],
			ttlOverride: 10,
		};
		return response;
	}catch(err){
		return {
			isAuthorized: false
		};
	}
};
