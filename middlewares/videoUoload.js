const path = require("path");
const multer = require("multer");

//video storage
const videoUpload = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "../images"));

    },

    filename: function(req, file,cb){
        if(file){
            cb(null, new Date().toISOString().replace(/:/g,"-")+ file.originalname)

        }else{
            cb(null, false);
        }
    }
})

//photo Upload middleware
const uploadVideo = multer({
    storage:videoUpload,
    fileFilter: function(req, file, cb){
        if(file.mimetype.startsWith("video")){
            cb(null, true);
        }else{
            cb({ message: "Unsupported file format" }, false);
        }
    },
    limits: { fileSize: 1024 * 1024 }, // 1 megabyte
})

module.exports = uploadVideo;