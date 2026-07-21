const express = require("express");
const fileController = require("../controllers/file.controller");
const authenticate = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"), fileController.UploadFile);

router.get("/:id/download", authenticate, fileController.DownloadFile);

router.get("/:id", authenticate, fileController.GetFile);

router.put("/:id", authenticate, fileController.UpdateFile);

router.delete("/:id", authenticate, fileController.DeleteFile);

module.exports = router;