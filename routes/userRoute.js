const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator

} = require('../utils/validators/userValidator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser
} = require('../services/userService');

const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect);

// Admin
router.use(authService.allowedTo('admin'));

router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route('/')
  .get(getUsers)
  .post( createUserValidator ,createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put( updateUserValidator  , updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;