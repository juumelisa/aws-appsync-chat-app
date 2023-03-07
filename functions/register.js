'use strict';

module.exports.handler = async(event, context, callback) => {
  try{
    const body = JSON.parse(event.body);
    callback(null, {
      username: event.username
    })
  }catch(err){
    return callback(err)
  }
}