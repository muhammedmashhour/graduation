const mongoose = require("mongoose");

const RolesSchema = mongoose.Schema({
  name: {
    type: String,
  },
  permissions: {
    type: Array
  }
}, { timestamps: true });


const Roles = mongoose.model('roles', RolesSchema);

module.exports = Roles