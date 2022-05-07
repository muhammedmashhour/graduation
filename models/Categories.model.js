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
  description: {
    type: String
  }
});


const Roles = mongoose.model('categories', RolesSchema);

module.exports = Roles