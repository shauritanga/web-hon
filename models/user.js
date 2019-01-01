const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

//user authentication
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({email: email})
      .exec(function(error, user) {
        if(error) {
          return callback(error)
        } else if(!user) {
          const err = new Error('User not found');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function(error, result) {
          if(result === true) {
            return callback(null, user);
          } else {
            return callback()
          }
        });
      });
}
//hashing password
UserSchema.pre('save', function(next) {
  const user = this;
   bcrypt.hash(user.password, 10, function(err, hash){
     if(err) {
       return next(err);
     }
     user.password = hash;
     next();
   });
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
