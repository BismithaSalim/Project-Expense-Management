const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    firstName:{ type: String },
    lastName:{ type: String },
    userId:{ type: String },
    password:{ type: String },
    userName: { type: String,unique:true },
    mobileNo:{ type: String,unique:true },
    email:{ type: String,unique:true },
    password:{ type: String },
    role: { type: String },
    organisationRefId: { 
        type: Schema.Types.ObjectId,
        ref:"organisation",
        default: null
    },
    isActive:{ type: Boolean,default:true }
  },
  { timestamps: true }
);

module.exports = model("user", userSchema);
