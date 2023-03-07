'use strict';

module.exports.handler = async(event, context, callback) => {
  try{
    const body = JSON.parse(event.body);
    const data = {
      sessionToken: 'abc'
    }
    callback(null, data)
  }catch(err){
    callback(err)
  }
}