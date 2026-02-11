const { model, Schema } = require("mongoose");

const clientSchema = new Schema(
  {
    clientName: { type: String },
    clientId:{ type: String },
    type:{ type: String },
    status: { type: String },
    organisationRefId: { 
            type: Schema.Types.ObjectId,
            ref:"organisation",
            default: null
    },
    isActive:{ type: Boolean,default:true }
  },
  { timestamps: true }
);

module.exports = model("client", clientSchema);
