const core = require('@actions/core');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const req = {required: true}

const AWS_ACCESS_KEY_ID = core.getInput('aws_access_key_id', req);
const AWS_SECRET_ACCESS_KEY = core.getInput('aws_secret_access_key', req);
const AWS_REGION = core.getInput('aws_region');
const AWS_BUCKET = core.getInput('aws_bucket', req);
const FILE_PATH = core.getInput('file_path', req);
const FILE_MIME_TYPE = core.getInput('file_mime_type');
const DEST_DIR = core.getInput('dest_dir') || shortid();

credentials = new aws.Credentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
aws.config.update({ region: AWS_REGION , credentials: credentials});

const fileStream = fs.createReadStream(FILE_PATH);

const uploadParams = {
  Bucket: AWS_BUCKET,
  Key: path.join(DEST_DIR, path.basename(FILE_PATH)),
  Body: fileStream,
  ACL: 'public-read',
  ContentType: FILE_MIME_TYPE
};

s3 = new aws.S3({apiVersion: '2006-03-01'});
s3.upload(uploadParams, function (err, data) {
  if (err) {
    core.error(err);
    core.setFailed(err.message);
  } if (data) {
    core.info(`Uploaded - ${data.Key}`);
    core.info(`Located - ${data.Location}`);
    core.setOutput('object_key', data.Key);
    core.setOutput('object_location', data.Location);
  }
});