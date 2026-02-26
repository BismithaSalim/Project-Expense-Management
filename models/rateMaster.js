const { model, Schema } = require("mongoose");

const rateMasterSchema = new Schema({
  serviceName: { type: String, required: true },
  serviceId: { type: String },
  muscatRate: { type: Number },
  outsideRate: { type: Number },
  unit: { type: String },
  isActive: { type: Boolean, default: true },
  organisationRefId: { 
    type: Schema.Types.ObjectId,
    ref:"organisation",
    default: null
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
}, { timestamps: true });

module.exports = model("rateMaster", rateMasterSchema);