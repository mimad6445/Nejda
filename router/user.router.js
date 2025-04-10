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
        fileFilter: fileFilter
});

// Define routes
router.post('/register', upload.single('image'), controller.registerUser);
router.post('/login', controller.login);
router.get('/all', controller.allUsers);

// Route for adding an image to user
router.patch('/addImage', upload.single('image'), (req, res) => {
        // Check if file was uploaded successfully
        if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
        }
        // Assuming you are passing it to the controller
        controller.addImageToUser(req, res);  // Call your controller method
});

router.patch('/:id', controller.updateuser);
router.delete('/:id', controller.deleteuser);



// Route for getting all users


module.exports = router;
