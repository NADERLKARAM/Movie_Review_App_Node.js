const asyncHandler = require("express-async-handler");

const bcrypt = require('bcryptjs');
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");



// @desc    Create user
// @route   POST  /users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ data: user });
});

// @desc    Get list of users
// @route   GET /users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  
  const users = await User.find();

  res.status(201).json({users})
});

// @desc    Get  user
// @route   GET /user
// @access  Private/Admin
exports.getUser = asyncHandler(async(req, res, next)=>{
  const {id} = req.params;

  const user = await User.findById(id)
  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
})

// @desc    Update specific user
// @route   PUT /users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      image: req.body.image,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});


//change password
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const{id} = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});



// @desc    Delete specific user
// @route   DELETE /users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async(req, res, next)=>{
  const {id} =req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ message: "deleted" });
})

