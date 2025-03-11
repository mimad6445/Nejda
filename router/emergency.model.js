const express = require("express");
const router = express.Router();
const controller = require("../controller/emergencies.controller");

router.route("/") 
        .get(controller.getAllEmergencies);

router.route("/police")
        .get(controller.getAllPoliceEmergency);

router.route("/gendarmerie")
        .get(controller.getAllGendarmerieEmergency);

router.route("/ambulance")
        .get(controller.getAllAmbulanceEmergency);


module.exports = router;
