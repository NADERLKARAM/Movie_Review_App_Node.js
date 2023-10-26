const express = require('express');
const  uploadVideo = require('../middlewares/videoUoload');
const photo = require('../middlewares/photoUpload');

const { creatMovie, getMovie, updateMovie, deleteMovie, getMovies }=require('../services/movieServics')

const routee = express.Router();

routee.route('/').post(photo.single('image'),uploadVideo.single('video'),creatMovie).
get(getMovie);

routee.route('/:id')
.get(getMovies)
.put(photo.single("image"),uploadVideo.single('video'),updateMovie)
.delete(deleteMovie);


module.exports= routee;