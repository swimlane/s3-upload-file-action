# Upload file to S3 ☁️

This action uploads single file to AWS S3 by [public read](https://docs.aws.amazon.com/AmazonS3/latest/dev
/WebsiteAccessPermissionsReqd.html).

## Usage

### `workflow.yml` Example

Place in a `.yml` file such as this one in your `.github/workflows` folder. [Refer to the documentation on workflow YAML syntax here.](https://help.github.com/en/articles/workflow-syntax-for-github-actions)

```yaml
name: Upload to S3

on: [pull_request]

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: swimlane/s3-upload-file-action@master
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY}}
          aws_bucket: ${{ secrets.AWS_BUCKET }}
          file_path: 'dist/swimlane-python.pyz'
          file_mime_type: 'application/zip'
          dest_dir: 'python_releases'
```
## Action inputs

The following settings must be passed as environment variables as shown in the example. Sensitive information, especially `aws_key_id` and `aws_secret_access_key`, should be [set as encrypted secrets](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) — otherwise, they'll be public to anyone browsing your repository's source code

| name                    | description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `aws_access_key_id`     | (Required) Your AWS Access Key. |
| `aws_secret_access_key` | (Required) Your AWS Secret Access Key.  |
| `aws_bucket`            | (Required) The name of the bucket you're upload to.          |
| `dest_dir`              | (Optional) The destination directory in S3.<br /> If this field is omitted a [shortid](https://github.com/dylang/shortid) will be generated |
| `file_path`             | File to upload.   |
| `file_mime_type`        | File mime type, plain/text etc    |

> To upload to the root directory, set `destination_dir: '/'`

## Action outputs

| name               | description          |
| ------------------ | ---------------------|
| `object_key`       | Uploaded object key. |
| `object_location`  | Object Location.     |
