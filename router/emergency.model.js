const express = require("express");
const router = express.Router();
const controller = require("../controller/emergencies.controller");

router.route("/") 
        .get(controller.getAllEmergencies);


module.exports = router;
