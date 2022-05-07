const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
  confirmed: {
    type: Boolean,
    default: false
  },
  role_id: {
    type: String,
  },
  avatar: {
    type: String,
    default: null
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  job: {
    type: String
  },
  password: {
    type: String
  },
  confirm_password: {
    type: String
  }
}, { timestamps: true });

const Users = mongoose.model("user", UsersSchema);

module.exports = Users;