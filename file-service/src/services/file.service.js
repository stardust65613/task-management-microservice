const fileRepository = require("../repositories/file.repository");
const { FileType } = require("@prisma/client");
const FileEvent = require("../rabbitmq/constants");
const { publish } = require("../rabbitmq/publisher");
const path = require("path");
const { randomUUID } = require("crypto");
const { minioClient } = require("../config/minio");

const UploadFile = async (file, uploadedBy, data) => {
    if (!file) {
        throw new Error("File is required");
    }

    const { type } = data;

    if (
        type !== undefined &&
        type !== null &&
        !Object.values(FileType).includes(type)
    ) {
        throw new Error("Invalid file type");
    }

    const extension = path.extname(file.originalname);

    const objectName = `${Date.now()}-${randomUUID()}${extension}`;

    const bucket = process.env.MINIO_BUCKET;

    await minioClient.putObject(
        bucket,
        objectName,
        file.buffer,
        file.size,
        {
            "Content-Type": file.mimetype,
        }
    );

    const createdFile = await fileRepository.create({
        uploadedBy,
        originalName: file.originalname,
        objectName,
        bucket,
        mimeType: file.mimetype,
        size: file.size,
        type,
    });

    await publish(
        FileEvent.UPLOADED.exchange,
        FileEvent.UPLOADED.routingKey,
        {
            fileId: createdFile.id,
            uploadedBy,
            type,
        }
    );

    return createdFile;
};

const UpdateFile = async (id, data) => {

    const file = await fileRepository.findById(id);

    const { type, originalName } = data;

    if (
        type !== undefined &&
        type !== null &&
        !Object.values(FileType).includes(type)
    ) {
        throw new Error("Invalid file type");
    }

    if (!file) {
        throw new Error("File not found");
    }

    const updatedFile = await fileRepository.update(id, {
        originalName,
        type,
    });

    await publish(
        FileEvent.UPLOADED.exchange,
        FileEvent.UPLOADED.routingKey,
        {
            fileId: updatedFile.id,
            originalName,
            type,
        }
    );

    return updatedFile;
};

const GetFile = async (id) => {
    return await fileRepository.findById(id);
};

const DownloadFile = async (id) => {
    const file = await fileRepository.findById(id);

    if (!file) {
        throw new Error("File not found");
    }

    const stream = await minioClient.getObject(
        file.bucket,
        file.objectName
    );

    return {
        stream,
        metadata: file,
    };
};

const DeleteFile = async(id) => {
    const file = await fileRepository.findById(id);

    if (!file) {
        throw new Error("File not found");
    }

    await minioClient.removeObject(
        file.bucket,
        file.objectName
    );

    const res = await fileRepository.remove(id);

    await publish(
        FileEvent.DELETED.exchange,
        FileEvent.DELETED.routingKey,
        {
            fileId:id,
            uploadedBy:file.uploadedBy,
        }
    );

    return res;
};

const CheckFileExists = async (fileId) => {

    const file = await fileRepository.findById(fileId);

    return !!file;
};

const getFilesByIds = async (fileIds) => {
    return fileRepository.findManyByIds(fileIds);
};

module.exports = {
    UploadFile,
    UpdateFile,
    GetFile,
    DownloadFile,
    DeleteFile,
    CheckFileExists,
    getFilesByIds,
}