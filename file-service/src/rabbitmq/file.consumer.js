const { consume } = require("./consumer");

const fileService = require("../services/file.service");

const startConsumer = async () => {
    await consume(
        "user.events",
        "file-service.avatar.removed",
        "user.avatar.removed",
        async(data)=>{
            await fileService.deleteFile(data.fileId);
        }
    );

    await consume(
        "user.events",
        "file-service.avatar.deleted",
        "user.deleted",

        async(data)=>{
            if(data.avatarId){

                await fileService.DeleteFile(
                    data.avatarId
                );
            }
        }
    );

    await consume(
        "task.events",
        "file-service.attachment.removed",
        "task.attachment.removed",
        async(data)=>{
            await fileService.deleteFile(data.fileId);
        }
    );
};


module.exports = startConsumer;