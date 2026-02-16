const jwt = require("jsonwebtoken");
require("dotenv").config();
const Token = require("../models/token");

async function jwtTokenGenerator(data) {
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    // expiresIn: "24h",
  });
  return token;
}

const generateUniqueId = function () {
  const uniqueId = v4().substring(0, 5);
  return uniqueId;
};


const verifyToken = async (req, res, next) => {
  var token = req.headers.authorization;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.substring(
        7,
        req.headers.authorization.length
      );
    }

    var dates = new Date();
    const res = await Token.find({
      $and: [
        {
          token: token,
          createdAt: {
            $gte: dates.setHours(0, 0, 0, 0),
            $lte: dates.setHours(23, 59, 59, 999),
          },
        },
      ],
    });

    if (res.length == 0) {
      res.status(200).send({
        status: 702,
        message: "Error",
        errorDetails: "Time Expired,Invalid Token",
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        //console.log(err)

        if (err)
          res.status(200).send({
            status: 702,
            message: "Error",
            errorDetails: "Time Expired,Invalid Token",
          });
        else {
          req.user = user;
          next();
        }
      });
    }
  } catch (err) {
    return res.status(200).send({
      status: 702,
      message: "Error",
      errorDetails: "Time Expired,Invalid Token",
    });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.roles)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
  
module.exports = {
  jwtTokenGenerator: jwtTokenGenerator,
  verifyToken: verifyToken,
  generateUniqueId: generateUniqueId,
  checkRole:checkRole

};