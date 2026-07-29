const { consume } = require("./consumer");

const projectService = require("../services/project.service");

const startConsumer = async () => {
    await consume(
        "user.events",
        "user-service.user.removed",
        "user.user.removed",
        async(data)=>{
            await projectService.DeleteProjectsByOwner(data.ownerId);
        }
    );
};


module.exports = startConsumer;