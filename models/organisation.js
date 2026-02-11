const { model, Schema } = require("mongoose");

const organisationSchema = new Schema(
  {
    organisationName: { 
        type: String,
        required: true,
        unique: true
    },
    organisationId: { type: String},
    address:{ type: String },
    email:{ type: String },
    mobileNo: { type: String },
    isActive:{ type: Boolean,default:true }
  },
  { timestamps: true }
);

module.exports = model("organisation", organisationSchema);
