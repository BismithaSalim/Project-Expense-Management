const { model, Schema } = require("mongoose");

const expenseSchema = new Schema(
  {
    projectRefId:{
        type: Schema.Types.ObjectId,
        ref:"project",
        required: true
    },
    clientRefId: { 
        type: Schema.Types.ObjectId,
        ref:"client",
        required: true
    },
    organisationRefId: { 
        type: Schema.Types.ObjectId,
        ref:"organisation",
        default: null,
    },
    date:{type: Date},
    category: { type: String},
    model: { type: String},
    amount: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paidTo: { type: String },
    paidBy: { type: String },
    isActive:{ type: Boolean,default:true },
    paymentType: { type: String, enum: [
        "Cash", 
        "Transfer - Company", 
        "Transfer - Personal", 
        "Cheque - Personal", 
        "Cheque - Company"
    ], 
    default: "Cash" }
  },
  { timestamps: true }
);

module.exports = model("expense", expenseSchema);
