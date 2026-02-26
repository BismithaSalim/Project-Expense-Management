const { model, Schema } = require("mongoose");

const costCalculationSchema = new Schema(
  {
    projectId: { 
        type: Schema.Types.ObjectId,
        ref:"project",
        required: true,
        default: null
    },
    serviceTitle:{ type: String },
    locationType:{ type: String },
    city:{ type: String },
    status : { type: String },
    isActive:{ type: Boolean,default:true },
    services:[{
        type : { type: String },
        rate : { type: Number },
        unit : { type: String },
        quantity : { type: Number },
        margin : { type: Number },
        amount : { type: Number },
    }],
    totalAmount: { type: Number },
    organisationRefId: { 
                type: Schema.Types.ObjectId,
                ref:"organisation",
                default: null
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null
    }
  },
  { timestamps: true }
);

module.exports = model("costCalculation", costCalculationSchema);






// {
//   projectId,
//   locationType: "Muscat" | "Outside",
//   city,
//   items: [
//     {
//       type,
//       rate,
//       unit,
//       qty,
//       margin,
//       amount
//     }
//   ],
//   totalAmount,
//   createdBy,
//   status
// }