const { model, Schema } = require("mongoose");

const expenseClaimSchema = new Schema(
{
  userId: { 
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
  },
  employeeName: { type: String, required: true },
  date: { type: Date},
  expenseCategory: [{ type: String }],
  projectDetails: {
    clientName: String,
    projectName: String,
  },
  expenseDetails: [
    {
      description: String,
      amount: Number,
      receiptAttached: Boolean,
      remarks: String,
    },
  ],
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  approvedById: { 
        type: Schema.Types.ObjectId,
        ref: "user",
        default:null 
    },
  approvedBy:{type: String},
  approvedAt:{type: Date},
}, 
{ timestamps: true }
);


module.exports = model("expenseClaim", expenseClaimSchema);