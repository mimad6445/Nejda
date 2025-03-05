const express = require("express");
const router = express.Router();
const raportController = require("../controller/raport.controller");

router.route("/")
    .get(raportController.getAllRaports);

router.route('/:userid')
        .post(raportController.createRaport)
        .get(raportController.getRaportByUser);

router.route("/:id")
    .patch(raportController.updateRaport)
    .get(raportController.getRaportById)
    .delete(raportController.deleteRaport);


module.exports = router;
