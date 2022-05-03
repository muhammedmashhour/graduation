const mongoose = require("mongoose");

const RolesSchema = mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  name: {
    type: String,
  },
  permissions: {
    type: Array
  }
});


const Roles = mongoose.model('roles', RolesSchema);

module.exports = Roles