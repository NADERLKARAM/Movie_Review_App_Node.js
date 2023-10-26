const Joi = require("joi");

const mongoose = require('mongoose');



const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,"name is required"],
    },
    
    about: {
      type: String,
      trim: true,
      required: [true, 'Disc is required'],
    },

    gender:{
        type: String,
        enum: ['male', 'female'],
        required:[true, "gender is required"]
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },

  
   
  },
  { timestamps: true }
);

const Actor = mongoose.model('Actor', actorSchema);

// Validate Create Post
function validateCreateActor(obj) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(10).max(200).required(),
    gender: Joi.string().required(),
  });
  return schema.validate(obj);
}

// Validate Create Post
function validateUpdateActor(obj) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(10).max(200).optional(),
    gender: Joi.string().optional(),
  });
  return schema.validate(obj);
}

module.exports = {Actor,validateCreateActor,validateUpdateActor};