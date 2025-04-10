const express = require("express");
const router = express.Router();
const controller = require('../controller/user.controller');
const multer = require("multer");
const path = require('path');

// Define the storage strategy for multer
const diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
                // Ensure the path is relative to your server's directory
                cb(null, path.join(__dirname, '../uploads'));
        },
        filename: function (req, file, cb) {
                const ext = file.mimetype.split('/')[1];  // Extract file extension
                const filename = `user-${Date.now()}.${ext}`;
                cb(null, filename);
        }
});

// File type filter (only allow images)
const fileFilter = (req, file, cb) => {
        const filetype = file.mimetype.split('/')[0];
        if (filetype === "image") {
                return cb(null, true);
        } else {
                return cb(new Error('File must be an image'), false); 
        }
};

// Initialize multer with storage and fileFilter
const upload = multer({ 
        storage: diskStorage,
        // fileFilter: fileFilter
});

const uploadSingleImage = (req, res, next) => {
        const uploader = upload.single("image");
        uploader(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                        return res.status(400).json({ message: "Multer error", error: err.message });
                } else if (err) {
                        return res.status(500).json({ message: "Unknown upload error", error: err.message });
                }
                next();
        });
};

// Define routes
router.post('/register', uploadSingleImage, controller.registerUser);
router.post('/login', controller.login);
router.get('/all', controller.allUsers);

// Route for adding an image to user
router.patch('/addImage', uploadSingleImage, (req, res) => {
        console.log("File uploaded successfully:", req.file.filename);
        controller.addImageToUser(req, res);
});

router.patch('/:id', controller.updateuser);
router.delete('/:id', controller.deleteuser);



// Route for getting all users


module.exports = router;
