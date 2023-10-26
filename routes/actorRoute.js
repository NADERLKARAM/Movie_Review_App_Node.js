const express =require("express");

const {createActor, getActor, getActors, UpdateActor, deleteActor} = require('../services/actorService');
const photoUpload = require("../middlewares/photoUpload");
const authService = require('../services/authService');

const Router = express.Router()


Router.use(authService.protect);

// Admin
Router.use(authService.allowedTo('admin'));

Router.route('/')
.post(photoUpload.single("image") ,createActor)
.get(getActors);

Router.route('/:id')
.get(getActor)
.put(photoUpload.single("image"),UpdateActor)
.delete(deleteActor);





module.exports =Router;