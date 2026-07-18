const express = require("express");

const projectController = require("../controllers/project.controller");
const projectMemberController = require("../controllers/project-member.controller");
const projectSettingController = require("../controllers/project-setting.controller");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", authenticate, projectController.CreateProject);

router.put("/:id", authenticate, projectController.UpdateProject);

router.get("/:id", authenticate, projectController.GetProjectDetail);

router.get("/list", authenticate, projectController.GetUserProject);

router.delete("/:id", authenticate, projectController.GetUserProject);

router.post("/:id/members", authenticate, projectMemberController.AddMember);

router.delete("/:id/members/:userId", authenticate, projectMemberController.RemoveMember);

router.get("/:id/members", authenticate, projectMemberController.GetProjectMember);

router.patch("/:id/members/:userId", authenticate, projectMemberController.UpdateMember);

router.get("/shared/:userId", authenticate, projectMemberController.GetCollabProject);

route.get("/:id/settings", authenticate, projectSettingController.GetProjectSetting);

route.patch("/:id/settings", authenticate, projectSettingController.UpdateProjectSetting);

module.exports = router;