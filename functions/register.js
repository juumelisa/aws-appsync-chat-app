'use strict';

const { registerUser } = require("../lib/ddb");

module.exports.handler = async(event, context, callback) => {
  try{
    await registerUser(event);
    callback(null, {
      username: event.username,
      error: 0,
      message: 'Success'
    })
  }catch(err){
    console.log('Error: ', err);
    return callback(null, {
      username: '',
      error: 1,
      message: String(err)
    })
  }
}