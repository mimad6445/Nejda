const express = require("express");
const router = express.Router();
const fastCallController = require("../controller/fastcall.controller");
const upload = require("../middlewares/upload");

router.route('/')
        .get(fastCallController.createFastCall)
        .post(upload, fastCallController.createFastCall);

router.route('/:id')
        .patch(upload,fastCallController.updateFastCall)
        .get(fastCallController.getFastCallById)
        .delete(fastCallController.deleteFastCall);


router.post("/", upload, fastCallController.createFastCall);
router.get("/", fastCallController.getAllFastCalls);
router.get("/:id", fastCallController.getFastCallById);
router.put("/:id", upload, fastCallController.updateFastCall);
router.delete("/:id", fastCallController.deleteFastCall);

module.exports = router;
