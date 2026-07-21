const Minio = require("minio");

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: Number(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

const initBucket = async () => {
    const bucket = process.env.MINIO_BUCKET;

    if (!(await minioClient.bucketExists(bucket))) {
        await minioClient.makeBucket(bucket);
    }
};

module.exports = {
    minioClient,
    initBucket,
};