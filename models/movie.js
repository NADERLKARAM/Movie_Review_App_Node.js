 const mongoose = require("mongoose");
const Joi = require("joi");
const genres = require("../utils/genres");

const movieSchema = mongoose.Schema(
  {
    title:{
        type: String,
        trim: true,
        required: true,
    },

    storyLine: {
      type: String,
      trim: true,
      required: true,
    },
    Actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
    // type: {
    //   type: String,
    //   required: true,
    // },
    genres: {
      type: [String],
      required: true,
      enum: genres,
    },
    // tags: {
    //   type: [String],
    //   required: true,
    // },
   
    poster: {
        type: Object,
        default: {
          url: "",
          publicId: null,
        },
    },

    likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      video: {
        type: Object,
        default: {
          url: "",
          publicId: null,
        },
      },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

// Validate Create movie
function validateCreateMovie(obj) {
    const schema = Joi.object({
    title: Joi.string().min(2).max(200).required(),
    storyLine: Joi.string().required(),
    genres: Joi.string().required(),
    });
    return schema.validate(obj);
  }

  // // Validate update movie
function validateUpdateMovie(obj) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(200).required(),
        storyLine: Joi.string().min(10).max(200).required(),
        genres: Joi.string().required(),
    });
    return schema.validate(obj);
  }

module.exports ={ Movie, validateCreateMovie, validateUpdateMovie};
