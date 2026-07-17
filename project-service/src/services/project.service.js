const projectRepository = require("../repositories/project.repository");
const projectSettingRepository = require("../repositories/project-setting.repository");
const projectMemberRepository = require("../repositories/project-member.repository");

const CreateProject = async (id, data) => {
    const {name, description, visibility} = data;

    if (!name){
        throw new Error("Project's name must not be null.");
    }

    const validVisibility = ["PRIVATE", "PUBLIC"];

    if (
        visibility &&
        !validVisibility.includes(visibility)
    ) {
        throw new Error("Invalid visibility");
    }

    try {
        return await projectRepository.createProject({
            name,
            description,
            ownerId: id,
            visibility,
        });
    } catch (error) {
        throw error;
    }
}

const UpdateProject = async (id, data) => {
    const {name, description, visibility} = data;

    if (!name){
        throw new Error("Project's name must not be null.");
    }


}

module.exports = {

}