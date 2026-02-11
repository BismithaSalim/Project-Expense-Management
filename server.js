const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cors = require("cors");

/**Internal Imports*/
dotenv.config();
const config = require("./config/config.js");
const { connectDatabase } = require("./config/dbConnection.js");

const app = express();
app.use(cors());
const port = config["port"] || 3001;
connectDatabase();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/* Error handler middleware */
// app.use(async (req, res, next) => {
//   console.log("inside not found");
//   next(createError.NotFound());
// });

// app.use((err, req, res, next) => {
//   console.log("inside error", err.status);
//   res.status(err.status || 500);
//   res.send({
//     error: {
//       status: err.status || 500,
//       message: err.message,
//     },
//   });
// });

app.use("/api", require("./routers"));

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
module.exports = app;
