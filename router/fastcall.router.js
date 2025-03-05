const express = require("express");
const router = express.Router();
const fastCallController = require("../controller/fastcall.controller");
const upload = require("../middlewares/uoload");

router.route('/')
        .get(fastCallController.createFastCall)


router.route('/:userid')
        .post(upload, fastCallController.createFastCall)
        .get(fastCallController.getFastCallByUser);

router.route('/:id')
        .patch(upload,fastCallController.updateFastCall)
        .get(fastCallController.getFastCallById)
        .delete(fastCallController.deleteFastCall);



module.exports = router;
