'use strict';

module.exports.handler = async (event) => {
	try{
		const { authorizationToken } = event;
		const response = {
			isAuthorized: false,
			resolverContext: {
				username: '',
				groups: []
			},
			deniedFields: [],
			ttlOverride: 10,
		};
    switch(authorizationToken){
      case 'Miley':
        response.isAuthorized = true;
        response.resolverContext.username = 'Miley'
        break;
      case 'Sean':
        response.isAuthorized = true;
        response.resolverContext.username = 'Sean'
        break;
      default:
        response.isAuthorized = false
    }
		return response;
	}catch(err){
		return {
			isAuthorized: false
		};
	}
};
