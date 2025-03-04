const express = require('express')
const router = express.Router()
const controller = require('../controller/Qustions.Controller')




router.route('/')
        .post(controller.createQst)
        .get(controller.getAllQst)

router.route('/:id')
        .delete(controller.deleteQst)
        .get(controller.getOneQst)
        .patch(controller.updateQst);



module.exports=router