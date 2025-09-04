import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // specify your upload directory, e.g. 'uploads/'
        cb(null, "./public/temp");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);

    }
});

const upload = multer({ 
    storage: storage,
});

export default upload;

