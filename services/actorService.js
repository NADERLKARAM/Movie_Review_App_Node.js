const path = require("path")
const fs = require("fs");

const asyncHandler = require("express-async-handler");
const ApiFeatures = require('../utils/ApiFeatures')


const ApiError = require("../utils/apiError");
const {Actor,validateCreateActor} =require('../models/Actor');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");


// @desc    Create New Actor
// @route   /api/actorRouter
// @method  POST
exports.createActor = asyncHandler(async(req, res, next)=>{

      // 1. Validation for image
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  // 2. Validation for data
  const { error } = validateCreateActor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
 // 1. Upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
 
  //2-create new actor and save it to DB
  const actor = await Actor.create({
    name:req.body.name,
    about: req.body.about,
    gender: req.body.gender,
    image:{
        url: result.secure_url,
        publicId: result.public_id,
    }
});

  // 5. Send response to the client
  res.status(201).json(actor);

  // 6. Remove image from the server
  fs.unlinkSync(imagePath)
})


// @desc    get one actor
// @route   /api/actorRouter
// @method  get
exports.getActor = asyncHandler(async(req, res, next)=>{
   const {id} = req.params;

   const actor = await Actor.findById(id);

   if(!actor){
    return next(new ApiError(`No actor for this id ${id}`, 404))
   }

   res.status(201).json({data: actor});
})



// @desc    get all actors
// @route   /api/actorRouter
// @method  get
exports.getActors = asyncHandler(async (req, res) => {


  const countDocuments = await Actor.countDocuments();
  const apiFeatures = new ApiFeatures(Actor.find(),req.query)
  .paginate(countDocuments)
  .filter()
  .search()
  .limitFields()
  .sort();

  const {mongooseQuery, paginationResult} = apiFeatures
  const actor = await mongooseQuery;

  res.status(201).json({result: actor.length , paginationResult,data: actor});
  });


  
  // @desc   find one actor by id and update
// @route   /api/actorRouter
// @method  put
exports.UpdateActor = asyncHandler(async(req, res, next)=>{

  //find by id
  const actor = await Actor.findById(req.params.id)
  if(!actor){
    return next(new ApiError(`No actor for this id ${req.params.id}`));
}

  //delete the old photo
  await cloudinaryRemoveImage(actor.image.publicId)

  //upload new photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
  const result = await cloudinaryUploadImage(imagePath);

  //update actor and add to db
    const updateActor = await Actor.findByIdAndUpdate(req.params.id,{

        $set: {
        name: req.body.name,
        about: req.body.about,
        gender: req.body.gender,
        image: {
            url: result.secure_url,
            publicId: result.public_id
        }}
        
    });

    res.status(201).json(updateActor);

     // 8. Remvoe image from the server
  fs.unlinkSync(imagePath);
})
  



  // @desc  find one actor by id and delete
// @route   /api/actorRouter
// @method  delete
exports.deleteActor= asyncHandler(async(req, res, next)=>{
    const actor = await Actor.findById(req.params.id);
    if (!actor) {
      return res.status(404).json({ message: "post not found" });
    }
  
      await Actor.findByIdAndDelete(req.params.id);
      await cloudinaryRemoveImage(actor.image.publicId);
  
  
      res.status(200).json({
        message: "post has been deleted successfully",

      });
})