const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },


    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },


    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    active: {
      type: Boolean,
      default: true,
    },
   
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;