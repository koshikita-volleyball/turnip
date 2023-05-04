import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });
AWS.config.apiVersions = {
  s3: "2006-03-01",
};

export default AWS;
