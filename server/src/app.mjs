
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export const lambdaHandler = async (event, context) => {
  try {
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        message: 'hello world',
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const goodbyeHandler = async (event, context) => {
  try {
    return {
      'statusCode': 200,
      headers: CORS_HEADERS,
      'body': JSON.stringify({
        message: 'good bye',
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
