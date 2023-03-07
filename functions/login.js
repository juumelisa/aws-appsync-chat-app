'use strict';

const { login } = require("../lib/ddb");

module.exports.handler = async(event, context, callback) => {
  try{
    const sessionToken = await login(event)
    const data = {
      sessionToken,
      error: 0,
      message: 'Success'
    }
    callback(null, data)
  }catch(err){
    callback(null, {
      sessionToken: '',
      error: 1,
      message: String(err)
    })
  }
}