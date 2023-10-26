const path = require('path')
const fs = require('fs');


const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/ApiFeatures')
const ApiError = require('../utils/apiError');
const  {Movie, validateCreateMovie }= require('../models/movie');
const { cloudinaryUploadImage, cloudinaryRemoveImage,cloudinaryUploadVideo } = require('../utils/cloudinary');


// @desc    Create New Movie
// @route   /api/MovieRouter
// @method  POST
exports.creatMovie = asyncHandler(async(req, res, next)=>{

          // 1. Validation for image
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }



//   2. Validation for data
  const { error } = validateCreateMovie(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

// upload photo
const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
const result = await cloudinaryUploadImage(imagePath);  

// //upload video
const videoPath = path.join(__dirname,`../videos/${req.file.filename}`)
const videoResult = await cloudinaryUploadVideo(videoPath); 

//create new movie and save it to DB
const movie = await Movie.create({
        title: req.body.title,
        storyLine: req.body.storyLine,
        Actor: req.body.Actor,
        genres: req.body.genres,
        // tags: req.body.tags,
        poster:{
            url: result.secure_url,
            publicId: result.public_id,
        },
        video:{
            url: videoResult.secure_url,
            public_id: videoResult.public_id, 
        }

    });

    // send res to client
    res.status(201).json(movie);

    //remove image from server
    fs.utimesSync(imagePath);
})



// @desc    get one movie
// @route   /api/movieRouter
// @method  get
exports.getMovie = asyncHandler(async(req, res, next)=>{
  const {id} = req.params;

  const movie = await Movie.findById(id);

  if(!movie){
   return next(new ApiError(`No movie for this id ${id}`, 404))
  }

  res.status(201).json({data: movie});
})



// @desc    get all movies
// @route   /api/movieRouter
// @method  get
exports.getMovies = asyncHandler(async (req, res) => {


 const countDocuments = await Movie.countDocuments();
 const apiFeatures = new ApiFeatures(Movie.find(),req.query)
 .paginate(countDocuments)
 .filter()
 .search()
 .limitFields()
 .sort();

 const {mongooseQuery, paginationResult} = apiFeatures
 const actor = await mongooseQuery;

 res.status(201).json({result: actor.length , paginationResult,data: actor});
 });


 
  // @desc   find one Movie by id and update
// @route   /api/MovieRouter
// @method  put
exports.updateMovie = asyncHandler(async(req, res, next)=>{

  //find by id
  const movie = await Movie.findById(req.params.id)
  if(!movie){
    return next(new ApiError(`No movie for this id ${req.params.id}`));
}

// upload photo
const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
const result = await cloudinaryUploadImage(imagePath);  

// //upload video
const videoPath = path.join(__dirname,`../videos/${req.file.filename}`)
const videoResult = await cloudinaryUploadVideo(videoPath); 

  //update actor and add to db
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id,{

        $set: {
          title: req.body.title,
          storyLine: req.body.storyLine,
          Actor: req.body.Actor,
          genres: req.body.genres,
          // tags: req.body.tags,
          poster:{
              url: result.secure_url,
              publicId: result.public_id,
          },
          video:{
              url: videoResult.secure_url,
              public_id: videoResult.public_id, 
          }}
        
    });

    res.status(201).json(updateMovie);

     // 8. Remvoe image from the server
  fs.unlinkSync(imagePath);
})



   // @desc  find one Movie by id and delete
// @route   /api/movieRouter
// @method  delete
exports.deleteMovie= asyncHandler(async(req, res, next)=>{
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ message: "movie not found" });
  }

    await Movie.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(movie.poster.publicId);


    res.status(200).json({
      message: "post has been deleted successfully",

    });
})