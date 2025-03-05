const express = require("express");
const router = express.Router();
const raportController = require("../controller/raport.controller");
const upload = require("../middlewares/uoload");

router.route("/")
    .post(upload, raportController.createRaport)
    .get(raportController.getAllRaports);

router.route("/:id")
    .patch(upload, raportController.updateRaport)
    .get(raportController.getRaportById)
    .delete(raportController.deleteRaport);


module.exports = router;
