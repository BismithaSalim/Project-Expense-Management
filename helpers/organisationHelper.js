const Organisation = require("../models/organisation");
const User = require("../models/user");
const mongoose = require("mongoose");

async function addOrganisation(req) {
  try {
    console.log("req",req.body)
    const { organisationName,address,email,mobileNo } = req.body;
    if (!organisationName) {
      throw new Error("Please fill out all required fields");
    }

    const lastOrg = await Organisation.findOne({}, {}, { sort: { organisationId: -1 } });

    let newId;
    if (!lastOrg) {
      newId = 10000;
    } else {
      const lastIdNumber = parseInt(lastOrg.organisationId.replace(/org-/i, ""), 10);
      newId = lastIdNumber + 1;
    }

    const organisationData = {
      ...req.body,
      organisationId: `org-${newId}`,
    };

    const newOrg = new Organisation(organisationData);
    const savedOrg = await newOrg.save();

    return { status: 100, message: "success", result: savedOrg };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}


async function updateOrganisation(req) {
  try {
    const { id } = req.query

    const updatedOrg = await Organisation.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedOrg) {
      return { status: 105, result: null, errorDetails: "Organisation not found" };
    }

    return { status: 100, message: "Organisation updated successfully", result: updatedOrg };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

// async function organisationList(req) {
//   try {
//     let { page = 1, limit = 10 } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);


//     const orgs = await Organisation.find({isActive:true})  
//     .skip((page - 1) * limit)
//     .limit(limit);

//     return {
//       status: 100,
//       message: "success",
//       result: orgs
//     };
//   } catch (err) {
//     return {
//       status: 105,
//       result: null,
//       errorDetails: err.message,
//     };
//   }
// }

async function organisationList(req) {
  try {
    let { page = 1, limit = 10, showDeleted } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filter={}

    if(showDeleted=="true"){
             filter = {
                isActive: false
            };
    }else{
          filter = {
                isActive: true
            };
    }

    const totalRecords = await Organisation.countDocuments(filter);

    const orgs = await Organisation.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      status: 100,
      message: "success",
      result: orgs,
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        limit
      }
    };

  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}



async function deleteOrganisation(req) {
  try {
    const orgId = req.params.id;

    const org = await Organisation.findById(orgId);
    if (!org) {
      throw new Error("Organisation not found");
    }

    const newStatus = !org.isActive;
    org.isActive = newStatus;
    const result = await org.save();

    // Update all users belonging to this organisation
    await User.updateMany(
      { organisationRefId: orgId },
      { $set: { isActive: newStatus } }
    );

    return {
      status: 100,
      message: `Organisation and its users have been ${newStatus ? "activated" : "deactivated"}`,
      result: result
    };
  } catch (error) {
    return { status: 105, result: null, errorDetails: error.message };
  }
}


async function getOrganisationById(req,res){
    try{
    let { id } = req.query;
    const org = await Organisation.find({_id:id})

    return {
      status: 100,
      message: "success",
      result: org
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
    addOrganisation,
    updateOrganisation,
    organisationList,
    deleteOrganisation,
    getOrganisationById
}