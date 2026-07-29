const { consume } = require("./consumer");

const taskService = require("../services/task.service");

const startConsumer = async () => {
    await consume(
        "project.events",
        "project-service.project.removed",
        "project.project.removed",
        async(data)=>{
            await taskService.DeleteTasksByProject(data.projectId);
        }
    );
};


module.exports = startConsumer;