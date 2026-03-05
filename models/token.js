
const { model,Schema } = require("mongoose");

const tokenSchema = new Schema({
  userName: {
    type:String,
  },
  email: {
    type:String,
  },
  token: { type: String},
  
},{ timestamps: true });

module.exports = model("token",tokenSchema);
