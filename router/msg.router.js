const express = require("express");
const router = express.Router();
const msgController = require("../controller/msg.controller");

router.route("/") 
        .get(msgController.getAllMsgs);

router.route("/:userid")
        .post(msgController.createMsg)
        .get(msgController.getMsgByUser);

router.route("/:id")    
        .get(msgController.getMsgById)
        .patch(msgController.updateMsg)
        .delete(msgController.deleteMsg);

module.exports = router;
