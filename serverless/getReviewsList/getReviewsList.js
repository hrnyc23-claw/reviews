const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

const { processReviewsData } = require('./helpers/processReviewsData.js');

const defaultCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10
};

exports.handler = (event, context, callback) => {

  let page = event.queryStringParameters ? event.queryStringParameters.page : undefined;
  let count = event.queryStringParameters ? event.queryStringParameters.count : undefined;
  let sort = event.queryStringParameters ? event.queryStringParameters.sort : undefined;

  let product_id = event.pathParameters.product_id;

  const done = (err, response) => {
    let res = err ? null : processReviewsData(response.Items, page, count, sort, product_id);
    
    callback(null, {
    statusCode: err ? 500 : 200,
    body: err ? err.message : JSON.stringify(res),
    headers: defaultCorsHeaders,
    isBase64Encoded: false
  })};

  const params = {
    TableName: "productreviews",
    IndexName: "id-index-copy",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
        ":id": parseInt(event.pathParameters.product_id)
    },
  };

  if (event.httpMethod === 'GET') {
    dynamo.query(params, done)
  } else {
    done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
}