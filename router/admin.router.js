const express = require('express')
const router = express.Router()
const controller = require('../controller/admin.controller')
const multer = require('multer')

const diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
                cb(null, 'uploads');
        },
        filename: function (req, file, cb) {
                const ext = file.mimetype.split('/')[1];  // Extract file extension
                const filename = `admin-${Date.now()}.${ext}`;
                cb(null, filename);
        }
});
const fileFilter = (req, file, cb) => {
        const filetype = file.mimetype.split('/')[0];
        if (filetype === "image") {
                return cb(null, true);
        } else {
                return cb(new Error('File must be an image'), false); 
        }
};

const upload = multer({ 
        storage: diskStorage,
        fileFilter: fileFilter
});


router.route('/')
        .post(upload.single('avater'),controller.createAdmin)

router.route('/login')
        .post(controller.login)

router.route('/AllAdmin')
        .get(controller.getAllAdmin)

router.route('/:id')
        .patch(controller.updateAdmin)
        .delete(controller.deleteAdmin)

module.exports = router