const costCalculation = require("../models/costCalculation");
const Master = require("../models/master");
const rateMaster = require("../models/rateMaster");
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


/////////////////////////Rate Master//////////////////////////////////////////////

async function addRateMaster(req) {
  try {
    const {
      serviceName,
      muscatRate,
      outsideRate,
      unit
    } = req.body;

    if (!serviceName || muscatRate == null || outsideRate == null || !unit) {
      throw new Error("Please fill all required fields");
    }

    const exists = await rateMaster.findOne({
      serviceName,
      organisationRefId: req.user.organisationId
    });

    if (exists) {
      return { status: 102, result: null, message: "Service already exists" };
    }

    const lastService = await rateMaster
      .findOne({ organisationRefId: req.user.organisationId })
      .sort({ createdAt: -1 });

    let newId = 10000;

    if (lastService && lastService.serviceId) {
      const lastIdNumber = parseInt(
        lastService.serviceId.replace(/service-/i, ""),
        10
      );
      newId = lastIdNumber + 1;
    }

    const data = {
      serviceName,
      muscatRate,
      outsideRate,
      unit,
      organisationRefId: req.user.organisationId,
      serviceId: `service-${newId}`
    };

    const savedData = await rateMaster.create(data);

    return { status: 100, message: "success", result: savedData };

  } catch (err) {
    console.log("err",err)
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function getRateMasters(req) {
  try {
    const { page = 1, limit = 10, search = "", isActive, showDeleted } = req.query;

    const query = {
      organisationRefId: req.user.organisationId,
      isActive: showDeleted == "false" ? true : false,
    };

    if (search) {
      query.serviceName = { $regex: search, $options: "i" };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const data = await rateMaster
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await rateMaster.countDocuments(query);

    return {
      status: 100,
      result: {
        data,
        totalCount
      }
    };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function getRateMasterById(req) {
  try {
    const { id } = req.params;

    const data = await rateMaster.findOne({
      _id: id,
      organisationRefId: req.user.organisationId
    });

    if (!data) throw new Error("Rate Master not found");

    return { status: 100, result: data };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function updateRateMaster(req) {
  try {
    const { id } = req.params;
    const { serviceName} = req.body;

    if (!serviceName) {
      throw new Error("Name is required");
    }

    const existing = await rateMaster.findOne({
      serviceName,
      organisationRefId: req.user.organisationId,
      _id: { $ne: id }
    });

    if (existing) {
      throw new Error("Service name already exists");
    }

    const updated = await rateMaster.findOneAndUpdate(
      {
        _id: id,
        organisationRefId: req.user.organisationId
      },
      req.body,
      { new: true }
    );

    if (!updated) throw new Error("Rate Master not found");

    return { status: 100, result: updated };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function deleteRateMaster(req) {
  try {
    const { id } = req.params;

    const data = await rateMaster.findOne({
      _id: id,
      organisationRefId: req.user.organisationId
    });

    if (!data) throw new Error("Rate Master not found");

    data.isActive = !data.isActive;
    await data.save();

    return { status: 100, result: data };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function createCostCalculation(req,res){
  try{
    const {
      projectId,
      serviceTitle,
      locationType,
      city,
      services,
      totalAmount
    } = req.body;

    req.body.organisationRefId = req.user.organisationId
    req.body.createdBy = req.user.userRefId
    req.body.serviceTitle = serviceTitle.toUpperCase()

  const savedData = await costCalculation.create(req.body);

    return { status: 100, message: "success", result: savedData };

  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function getCostCalculation(req,res){
  try{
    // console.log("req.headers.authorization",req.headers.authorization)
    let filter = {};
    if(req.headers.authorization==undefined){

    }else{
     filter = {
        projectId: req.body.projectId,
        locationType: req.body.locationType,
        organisationRefId: req.user.organisationId,
        serviceTitle: req.body.serviceTitle.toUpperCase(),
      };
  }

    const getData = await costCalculation.find(filter);
    return { status: 100, message: "success", result: getData };

  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function updateCostCalculation(req,res){
  try{
   const getData = await costCalculation.findOne({_id:req.body._id})
    if(!getData){
      throw new Error("Cost not found");
    }

    const updated = await costCalculation.findOneAndUpdate(
      {
        _id: req.body._id,
        organisationRefId: req.user.organisationId
      },
      {$set:{
        services:req.body.services,
        totalAmount:req.body.totalAmount
      }},
      { new: true }
    );
    return { status: 100, message: "success", result: updated };

  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function getRateMaster(req) {
  try {
    const {search = "", isActive, showDeleted } = req.query;

    const query = {
      // organisationRefId: req.user.organisationId,
      isActive: showDeleted == "false" ? true : false,
    };

    if (search) {
      query.serviceName = { $regex: search, $options: "i" };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const data = await rateMaster
      .find(query)
      .sort({ createdAt: -1 })

    const totalCount = await rateMaster.countDocuments(query);

    return {
      status: 100,
      result: {
        data,
        totalCount
      }
    };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

module.exports={
    addMaster,
    getAllMasters,
    updateMaster,
    getMasterById,
    deleteMaster,
    getMasterByCategory,
    addRateMaster,
    updateRateMaster,
    getRateMasters,
    getRateMasterById,
    deleteRateMaster,
    createCostCalculation,
    getCostCalculation,
    updateCostCalculation,
    getRateMaster
}