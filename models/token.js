
const { model,Schema } = require("mongoose");

const tokenSchema = new Schema({
  userName: {
    type:String,
  },
  token: { type: String},
  
},{ timestamps: true });

module.exports = model("token",tokenSchema);
