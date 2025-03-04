const express = require("express")
const router = express.Router()
const controller = require('../controller/user.controller')
const multer = require("multer")

const diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
                cb(null, '/uploads');
        },
        filename: function (req, file, cb) {
                const ext = file.mimetype.split('/')[1];  // Extract file extension
                const filename = `user-${Date.now()}.${ext}`;
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


router.post('/register',upload.single('image'),controller.registerUser)
router.post('/login',controller.login)
router.patch('/profile/:id',controller.updateuser)
router.delete('/profile/:id',controller.deleteuser)

router.route('/phoneOtp')
        .post(controller.otpLoginPhone);
router.route('/phoneVierfyOtp')
        .post(controller.virefyOtpPhone);

router.get('/all',controller.allUsers)
router.patch('/addImage', upload.single('image'), controller.addImageToUser)


module.exports = router