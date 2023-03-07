const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient , PutCommand, GetCommand} = require('@aws-sdk/lib-dynamodb');
const ddbClient = new DynamoDBClient();

const marshallOptions = {
	convertEmptyValues: false,
	removeUndefinedValues: true,
	convertClassInstanceToMap: false
};

const unmarshallOptions = {
	wrapNumbers: false
};

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
	marshallOptions,
	unmarshallOptions
});

const registerUser = async(props) => {
  try{
    if(props.password != props.repeatPassword){
      callback('Password not same')
    }
    const password = await bcrypt.hash(props.password, 8);
    delete props.password;
    const params = {
      TableName: process.env.USER_TABLE_NAME,
      Item: {
        username: props.username,
        password
      },
      ConditionExpression: 'attribute_not_exists(username)'
    };
    await ddbDocClient.send(new PutCommand(params));
  }catch(err){
    if(String(err).startsWith('ConditionalCheckFailedException:')) return Promise.reject('Username exist');
    return Promise.reject(err);
  }
}

const login = async(props) => {
  try{
    const params = {
      TableName: process.env.USER_TABLE_NAME,
      Key: {
        username: props.username
      }
    }
    const { Item } = await ddbDocClient.send(new GetCommand(params));
    if(Item){
      const isValidPassword = await bcrypt.compare(props.password, Item.password);
      if(!isValidPassword){
        return Promise.reject('Wrong credentials');
      }else{
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const paramsToken = {
          TableName: process.env.SESSION_TOKEN_TABLE_NAME,
          Item: {
            username: props.username,
            sessionToken,
            TTL: parseInt(new Date().getTime()/1000) + 86400,
          }
        };
        const a = await ddbDocClient.send(new PutCommand(paramsToken));
        return `${props.username}:${sessionToken}`;
      }
    }else{
      return Promise.reject('Wrong credentials');
    }
  }catch(err){
    return Promise.reject(err);
  }
}

const tokenValidation = async(username, sessionToken) => {
  try{
    const params = {
      TableName: process.env.SESSION_TOKEN_TABLE_NAME,
      Key: {
        username,
        sessionToken
      }
    }
    const { Item } = await ddbDocClient.send(new GetCommand(params));
    if(!Item) return Promise.reject('Invalid token');
    return Item;
  }catch(err){
    return Promise.reject(err);
  }
}

module.exports = {
  registerUser,
  login,
  tokenValidation
}