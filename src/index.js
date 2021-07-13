const aws = require('aws-sdk');
const s3 = new aws.S3();

const destBucket = process.env.DEST_BUCKET;

exports.handler = main;

function main(event, context, lambdaCallback) {
  // Fail on mising data
  if (!destBucket) {
    context.fail('Error: Environment variable DEST_BUCKET missing');
    return;
  }

  console.log(event);
  
  let newId = event.path.replace('/uploader/', '');
  let { body: image } = event;

  // Get the body data
  if (event.isBase64Encoded) {
    console.log('body is base-64 encoded');
    image = Buffer.from(image, 'base64');
  }

  put(destBucket, newId, image)
    .then(() => {
      const message = 'Saved ' + destBucket + ':' + newId;
      console.log(message);
      done(200, JSON.stringify({ message: message }), 'application/json', lambdaCallback);
    })
    .catch((error) => {
      console.error(error);
      done(500, '{"message":"error saving"}', 'application/json', lambdaCallback);
    });

}
// We're done with this lambda, return to the client with given parameters
function done(statusCode, body, contentType, lambdaCallback, isBase64Encoded = false) {
  lambdaCallback(null, {
    statusCode: statusCode,
    isBase64Encoded: isBase64Encoded,
    body: body,
    headers: {
      'Content-Type': contentType
    }
  });
}

// Create a promise to put the data in the s3 bucket
function put(destBucket, destKey, data) {
  return new Promise((resolve, reject) => {
    s3.putObject({
      Bucket: destBucket,
      Key: destKey,
      Body: data
    }, (err, data) => {
      if (err) {
        console.error('Error putting object: ' + destBucket + ':' + destKey);
        return reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
