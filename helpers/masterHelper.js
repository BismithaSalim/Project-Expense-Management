const Master = require("../models/master");
const mongoose = require("mongoose");

async function addMaster(req) {
  try {
    const { name,type } = req.body;
    if (!name || !type) {
      throw new Error("Please fill out all required fields");
    }

    const lastType = await Master.findOne({}, {}, { sort: { typeId: -1 } });

    let newId;
    if (!lastType) {
      newId = 10000;
    } else {
      const lastIdNumber = parseInt(lastType.typeId.replace(/type-/i, ""), 10);
      newId = lastIdNumber + 1;
    }

    const data = {
      ...req.body,
      organisationRefId: req.user.organisationId,
      typeId: `type-${newId}`,
    };

    const newType = new Master(data);
    const savedData = await newType.save();

    return { status: 100, message: "success", result: savedData };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}


async function updateMaster(req) {
  try {
    const { id } = req.query;
    const updatedMaster = await Master.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedMaster) {
      return { status: 105, result: null, errorDetails: "Master not found" };
    }

    return { status: 100, message: "Client updated successfully", result: updatedMaster };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}


async function getAllMasters(req) {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);


    const filter = {
      organisationRefId: req.user.organisationId,
      isActive: true
    };

    if (search && search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } }
      ];
    }
    // if(showDeleted=="false"){
    const totalCount = await Master.countDocuments(filter);
      const masters = await Master.find(filter)
        .sort({ typeId: 1 })          
        .skip((page - 1) * limit)
        .limit(limit);
// console.log("masters",masters)
      return {
        status: 100,
        message: "success",
        result: masters,
        totalCount
      };
    // }else{
    //   const masters = await Master.find({organisationRefId: req.user.organisationId,isActive:false})
    //     .sort({ typeId: 1 })          
    //     .skip((page - 1) * limit)
    //     .limit(limit);

    //   return {
    //     status: 100,
    //     message: "success",
    //     result: masters
    //   };
    // }
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function getMasterById(req) {
  try {
    let { id } = req.query;
    const masters = await Master.find({_id:id})
    return {
      status: 100,
      message: "success",
      result: masters
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function deleteMaster(req) {
  try {
    const typeId = req.params.id;

    const master = await Master.findById(typeId);
    if (!master) {
      throw new Error("Master not found");
    }

    master.isActive = !master.isActive;
    const result = await master.save();

    return {
      status: 100,
      message: "success",
      result: result
    };
  } catch (error) {
    return { status: 105, result: null, errorDetails: error.message };
  }
}

async function getMasterByCategory(req) {
  try {
    const masters = await Master.find({type:"Category",isActive:true})
    return {
      status: 100,
      message: "success",
      result: masters
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
    addMaster,
    getAllMasters,
    updateMaster,
    getMasterById,
    deleteMaster,
    getMasterByCategory
}