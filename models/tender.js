const { model, Schema } = require("mongoose");

const tenderSchema = new Schema({
  portal: {type:String},
  tenderTitle: {type:String},
  tenderNo:  {type:String},
  entity:  {type:String},
  tenderSalesEndDate:  {type:Date},
  prebidClarificationEndDate: {type:Date},
  bidClosingDate: {type:Date},
  tenderFee: {type:Number},
  category: {type:String},
  action: {type:String},
  actionSrc: {type:String},
  actionUrl: {type:String},
  docsFolder: {type:String},
  bidOpened: {type:Boolean},
  isActive: {type:Boolean , default:true},
  organisationRefId: { 
              type: Schema.Types.ObjectId,
              ref:"organisation",
              default: null
      },
  tenderAction: {
    type: String,
    enum: ["Bid", "No Bid"]
  }
}, { timestamps: true });

module.exports = model("tender", tenderSchema);