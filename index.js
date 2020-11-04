const core = require('@actions/core');
const S3 = require('aws-sdk/clients/s3');
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

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
})

const fileStream = fs.createReadStream(FILE_PATH);
const aws_file_path = path.join(DEST_DIR, path.basename(FILE_PATH))
  .replace(/\\/g, '/');

const uploadParams = {
  Bucket: AWS_BUCKET,
  Key: aws_file_path,
  Body: fileStream,
  ACL: 'public-read',
  ContentType: FILE_MIME_TYPE
};

s3.upload(uploadParams, function (err, data) {
  if (err) {
    core.error(err);
    core.setFailed(err.message);
  } if (data) {
    core.info(`Uploaded: ${data.Key}`);
    core.info(`Located: ${data.Location}`);
    core.setOutput('object_key', data.Key);
    core.setOutput('object_location', data.Location);
  }
});