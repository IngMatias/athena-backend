import aws from "aws-sdk";

const MINIO_HOST = process.env.MINIO_HOST;
const MINIO_PORT = process.env.MINIO_PORT;
const MINIO_USERNAME = process.env.MINIO_USERNAME;
const MINIO_PASSWORD = process.env.MINIO_PASSWORD;

export const s3 = new aws.S3({
  endpoint: `${MINIO_HOST}:${MINIO_PORT}`,
  accessKeyId: MINIO_USERNAME,
  secretAccessKey: MINIO_PASSWORD,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});
