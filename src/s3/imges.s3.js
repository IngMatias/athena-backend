import { s3 } from "../configs/minio.config.js";

const MINIO_COURSE_IMAGE_BUCKET = process.env.MINIO_COURSE_IMAGE_BUCKET;

const init = async () => {
  const bucket = MINIO_COURSE_IMAGE_BUCKET;
  try {
    await s3.headBucket({ Bucket: bucket }).promise();
  } catch (err) {
    if (err.statusCode === 404) {
      await s3.createBucket({ Bucket: bucket }).promise();
    }
  }
};

init();

export const getImagesUrls = async (coursesIds) => {
  const urls = await Promise.all(
    coursesIds.map(async (courseId) => {
      try {
        await s3
          .headObject({
            Bucket: MINIO_COURSE_IMAGE_BUCKET,
            Key: courseId,
          })
          .promise();
        return {
          [courseId]: `${MINIO_COURSE_IMAGE_BUCKET}/${courseId}`,
        };
      } catch (error) {
        if (error.code === "NotFound") {
          return { [courseId]: "" };
        }
        throw error;
      }
    })
  );

  return Object.assign({}, ...urls);
};

export const getStreamImage = (courseId) => {
  return s3
    .getObject({
      Bucket: MINIO_COURSE_IMAGE_BUCKET,
      Key: courseId,
    })
    .createReadStream();
};

export const setImage = async (courseId, image) => {
  const params = {
    Bucket: MINIO_COURSE_IMAGE_BUCKET,
    Key: courseId,
    Body: image,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  await s3.putObject(params).promise();

  return {
    imageUrl: `${MINIO_COURSE_IMAGE_BUCKET}/${courseId}`,
  };
};
