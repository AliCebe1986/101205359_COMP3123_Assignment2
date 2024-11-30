const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      console.error('Hashing error:', err);
      return next(err);
    }
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);
