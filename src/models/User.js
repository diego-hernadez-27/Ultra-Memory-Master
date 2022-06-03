const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  name: {type: String},
  appe: {type: String},
  email: {type: String, required: [true, 'El email es necesario'], unique: true},
  username: {type: String, required: [true, 'El nombre de usuario es necesario'], unique: true},
  password: {type: String, required: [true, 'El password es necesario']},
  score: {type: Number},
  level: {type: Number},
  roles: [{
    ref: "Role",
    type: Schema.Types.ObjectId,
  },],
}, {
  timestamps: true,
  versionKey: false,
});

UserSchema.methods.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = model('User', UserSchema);