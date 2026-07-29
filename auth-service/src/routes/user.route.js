const express = require("express");

const userController = require("../controllers/user.controller")
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

// Protected APIs
router.get("/me", authenticate, userController.GetMyInfo);

router.get("/:id", authenticate, userController.GetUserInfo);

router.put("/me", authenticate, userController.EditInformation);

router.put("/myavatar", authenticate, userController.UpdateAvatar);

router.delete("/myaccount", authenticate, userController.DeleteUser);

module.exports = router;