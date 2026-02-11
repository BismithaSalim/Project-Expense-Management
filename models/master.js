const { model, Schema } = require("mongoose");

const masterSchema = new Schema(
  {
    name: { type: String },
    typeId:{ type: String },
    type:{ type: String },
    isActive:{ type: Boolean,default:true }
  },
  { timestamps: true }
);

module.exports = model("master", masterSchema);
