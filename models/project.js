const { model, Schema } = require("mongoose");

const projectSchema = new Schema(
  {
    projectName:{type: String},
    projectId:{type: String},
    clientRefId: { 
        type: Schema.Types.ObjectId,
        ref:"client",
        required: true
    },
    organisationRefId: { 
            type: Schema.Types.ObjectId,
            ref:"organisation",
            default:null
        },
    location:{ type: String },
    description:{ type: String },
    projectValue: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    totalProjectAmount: { type: Number, default: 0 },
    projectStatus:{ type: String },
    isActive:{ type: Boolean,default:true },
    lpoDate:{type: Date},
    projectStartDate:{type: Date},
    projectEndDate:{type: Date},
    acceptanceDate:{type: Date}
  },
  { timestamps: true }
);

projectSchema.pre("save", async function() {
  const value = this.projectValue || 0;
  const vat = this.vatAmount || 0;
  const ded = this.deductions || 0;
  this.totalProjectAmount = value + vat - ded;
});


module.exports = model("project", projectSchema);
