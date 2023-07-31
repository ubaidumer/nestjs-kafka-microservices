import { HttpException, Injectable } from '@nestjs/common';
import { configService } from '../config/config';
import * as AWS from 'aws-sdk';

// AWS services file where we will handle all AWS related funtionality
@Injectable()
export class AwsService {
  // s3 object for file management
  s3: AWS.S3;
  // the folder where private files are saved
  bucketName: string;
  // the folder where public files are saved
  publicBucketName: string;

  // Initializing all required envs
  constructor() {
    this.publicBucketName = configService.get('AWS_S3_PUBLIC_BUCKET_NAME');
    this.bucketName = configService.get('AWS_S3_BUCKET_NAME');
    const region = configService.get('AWS_S3_REGION_NAME');
    const accessKeyId = configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY');
    this.s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });
  }

  // Fetch url a private file url
  async getUploadUrl(key: string, contentType: string) {
    const url = await this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60,
      ContentType: contentType,
    });
    return {
      url,
      key,
    };
  }

  // Upload a private file into s3 bucket
  async uploadFile(
    file: Express.Multer.File,
    userid: string,
    folderName: 'product' | 'content',
  ) {
    try {
      const { originalname, mimetype, buffer } = file;
      const key = `${folderName}/${userid}/${Date.now()}-${originalname}`;
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      };
      return await this.s3.upload(params).promise();
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  // Upload a public file into s3 bucket
  async uploadPublicFile(
    file: Express.Multer.File,
    userid: string,
    folderName: 'profile',
  ) {
    const { originalname, mimetype, buffer } = file;
    const key = `${folderName}/${userid}-${Date.now()}-${originalname}`;
    const params = {
      Bucket: this.publicBucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    };
    return await this.s3.upload(params).promise();
  }

  // fetch a private file
  async getFile(file: string, userId: string, vault: 'legal' | 'digital') {
    const params = {
      Bucket: this.bucketName,
      Key: `${vault}/${userId}/${file}`,
    };
    await this.s3
      .getObjectAttributes({
        ...params,
        ObjectAttributes: ['ObjectSize'],
      })
      .promise();
    return this.s3.getObject(params).createReadStream();
  }

  // delete a private file
  async deleteFile(key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };
    const isFileExist = await this.isFileExist(key);
    if (isFileExist) return await this.s3.deleteObject(params).promise();
  }

  // delete a public file
  async deletePublicFile(file: string, folderName: 'profile') {
    const params = {
      Bucket: this.publicBucketName,
      Key: `${folderName}/${file}`,
    };
    return await this.s3.deleteObject(params).promise();
  }
  async isFileExist(key: string) {
    const exists = await this.s3
      .headObject({
        Bucket: this.bucketName,
        Key: key,
      })
      .promise()
      .then(
        () => true,
        (err) => {
          if (err.code === 'NotFound') {
            return false;
          }
          throw err;
        },
      );
    return exists;
  }

  // copy a private file from another source
  async copyFile(keyToCopy: string, newKey: string) {
    await this.s3
      .copyObject({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${keyToCopy}`,
        Key: newKey,
      })
      .promise();
  }

  // move the copied file into a source
  async moveFile(keyToCopy: string, newKey: string) {
    const isFileExist = await this.isFileExist(keyToCopy);
    if (isFileExist) {
      await this.copyFile(keyToCopy, newKey);
      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: keyToCopy,
        })
        .promise();
    }
  }
}
