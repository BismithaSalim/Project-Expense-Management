const User = require("../models/user");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
var fun = require("../config/commonFunction.js");
const { result } = require("lodash");
const Organisation = require("../models/organisation.js");

async function addUser(req) {
  try {
    const {firstName,lastName,userName,mobileNo,email,password } = req.body;
    if (!firstName || !userName || !mobileNo || !email || !password ) {
      throw new Error("Please fill out all required fields");
    }

    const lastUser = await User.findOne({}, {}, { sort: { userId: -1 } });

    let newId;
    if (!lastUser) {
      newId = 10000;
    } else {
      const lastIdNumber = parseInt(lastUser.userId.replace(/user-/i, ""), 10);
      newId = lastIdNumber + 1;
    }

    if (password) {
            var encryptedPassword = await bcrypt.hash(password, 10);
            req.body.password = encryptedPassword;
        }

    const userData = {
      ...req.body,
      organisationRefId: req.user.organisationId,
      userId: `user-${newId}`,
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    return { status: 100, message: "success", result: savedUser };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function login(req) {
  try {
      const { userName, password } = req.body;
      if (!(userName && password)) {
         throw new Error("UserName or Password required");
      }

      const userData = await User.findOne({
        $and: [{ userName },{ isActive: true }],
      })
      if (!userData) {
        return {
          status: 105,
          result: null,
          message: "user not exist"
        };
      }else{
      //   var dates = new Date();
      //   const res = await Token.find({$and:[{userName:userName,createdAt :{"$gte": dates.setHours(0,0,0,0),
      //  "$lte":dates.setHours(23, 59, 59, 999)}}]})

            // if(res.length!=0){
            //     return {
            //     status: 102,
            //     message:"Already logged in" ,
            //     token:res[0].token,
            //     result:res[0].userName
            //     };
            // }else{
                // console.log("userData",userData)
            if (userData && (await bcrypt.compare(password, userData.password))) {

                var roles=userData.role
                var organisationId=userData.organisationRefId
                const token = await fun.jwtTokenGenerator({
                    userName,
                    roles,
                    organisationId
                });

                req.body.userName=userName
                req.body.token=token
                const obj = new Token(req.body);
                const saveData = await obj.save();
                
                return {
                    message: "Successfully login",
                    result: userData,
                    token: token,
                    status: 100
                };

            }else {
                return {
                result: null,
                message: "Incorrect userName or password",
                status: 105,
                };
            }
        // }
  }
} catch (err) {
    console.log(err)
    return { status: 105, result: null, errorDetails: err.message  };
  }
}

async function logOut(req) {  
  try{
    var token = req.headers.authorization;
    const decoded = jwt.decode(token);

    token = req.headers.authorization.substring(
      7,
      req.headers.authorization.length
    );

    var dates=new Date()
    const res = await Token.findOne({ token: token });

    if(res.length==0){
      return {
        status: 102,
        result:"Invalid token" 
      };
    }else{
      const result = await Token.deleteOne(
        { _id: res._id },
        { returnOriginal: false }
      );

          return {
            status: 100,
            message:"Logout Successfully",
            result:result
        };
      }
  }catch(error){
    // console.log("Error",error);
      return {status: 105,result: null, errorDetails: error.message };
  }
}


async function addAdminUser(req, res) {
  try {
    const orgId = req.params.id;
    const { firstName, lastName, userName, mobileNo, email, password } = req.body;

    // Validate required fields
    if (!firstName || !userName || !mobileNo || !email || !password) {
      throw new Error( "Please fill out all required fields");
    }

    // Check if organisation exists
    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      throw new Error("Organisation not found");
    }

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error( "User with this email already exists" );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      mobileNo,
      email,
      password: hashedPassword,
      role: "admin",
      organisationRefId: orgId
    });

    return{
      status: 100,
      message: "Admin user added successfully",
      result: newUser
    };
  } catch (err) {
    console.error(err);
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function getAdminByOrganisation(req, res) {
  try {
    const { id } = req.params;

    const result = await Organisation.aggregate([
      {
        $match: {
          _id: new ObjectId(id)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "organisationRefId",
          as: "admins"
        }
      },
      {
        $addFields: {
          admin: {
            $first: {
              $filter: {
                input: "$admins",
                as: "a",
                cond: {
                  $and: [
                    { $eq: ["$$a.role", "admin"] },
                    { $eq: ["$$a.isActive", true] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          admins: 0
        }
      }
    ]);

    if (!result.length || !result[0].admin) {
      return {
        status: 100,
        hasAdmin: false,
        result: null
      };
    }

    return {
      status: 100,
      hasAdmin: true,
      result: result[0].admin
    };

  } catch (err) {
    console.error(err);
    return {
      status: 105,
      message: err.message
    };
  }
}

async function deleteUser(req){
  try {
    const  userId= req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
        throw new Error("User not found");
    }

    user.isActive = !user.isActive;
    let result = await user.save();

    return { status: 100, message: "success", result: result };
    } catch (error) {
      return { status: 105, result: null, errorDetails: err.message };
    }
}

async function updateUser(req) {
  try {
    const { id } = req.query;
    if(req.body.password){
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword
    }
    const updatedUser= await User.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return { status: 105, result: null, errorDetails: "User not found" };
    }

    return { status: 100, message: "User updated successfully", result: updatedUser };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function getAllUsers(req) {
  try {
    // console.log("req.user.organisationId",req.user.organisationId)
    let { page = 1, limit = 10,showDeleted } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if(showDeleted=="false"){
      const users = await User.find({organisationRefId: req.user.organisationId,isActive:true})
        .sort({ userId: 1 })          
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        status: 100,
        message: "success",
        result: users
      };
    }else{
      const users = await User.find({organisationRefId: req.user.organisationId,isActive:false})
        .sort({ userId: 1 })          
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        status: 100,
        message: "success",
        result: users
      };
    }
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}
 
async function getUserById(req) {
  try {
    let { userId } = req.query;

    const user = await User.find({_id:userId})

    return {
      status: 100,
      message: "success",
      result: user
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

module.exports={
    addUser,
    login,
    logOut,
    addAdminUser,
    getAdminByOrganisation,
    deleteUser,
    updateUser,
    getAllUsers,
    getUserById
}