const Organisation = require("../models/organisation");
const Tender = require("../models/tender");

const mongoose = require("mongoose");

async function addSettings(req) {
  try {

    const { emailPassword ,port,smtpServer,username } = req.body;

    if (!emailPassword || !port || !smtpServer || !username) {
      throw new Error("Please fill all required fields");
    }

    const organisation = await Organisation.findOne({
      _id: req.user.organisationId,
      isActive: true
    });

    if (!organisation) {
      return {
        status: 102,
        result: null,
        message: "Organisation not found"
      };
    }

    const botEmail={}
    const updatedData = await Organisation.findByIdAndUpdate(
      req.user.organisationId,
      {
        botEmail: {
          smtpServer:smtpServer,
          port: port,
          username: username,
          password: emailPassword
        }
      },
      { new: true }
    );

    return {
      status: 100,
      message: "Bot email settings updated successfully",
      result: updatedData
    };

  } catch (err) {
    console.log("Error updating bot email credentials", err);
    return {
      status: 105,
      result: null,
      errorDetails: err.message
    };
  }
}

async function getSettings(req) {
  try {
    const organisation = await Organisation.findOne({
      _id: req.user.organisationId,
      isActive: true
    });

    return {
      status: 100,
      message: "Success",
      result: organisation.botEmail || {}
    };

  } catch (err) {
    console.log("Error fetching bot email credentials", err);
    return {
      status: 105,
      result: null,
      errorDetails: err.message
    };
  }
}

async function addTender(req) {
  try {
    const {
      portal,
      tenderTitle,
      tenderNo,
      entity,
      tenderSalesEndDate,
      prebidClarificationEndDate,
      bidClosingDate,
      tenderFee,
      category,
      action,
      actionSrc,
      actionUrl,
      docsFolder,
      bidOpened,
      tenderAction
    } = req.body;

    // Simple validation
    if (!tenderTitle || !tenderNo) {
      return { status: 102, message: "Tender Title and Tender No are required", result: null };
    }

    const newTender = new Tender({
      portal,
      tenderTitle,
      tenderNo,
      entity,
      tenderSalesEndDate,
      prebidClarificationEndDate,
      bidClosingDate,
      tenderFee,
      category,
      action,
      actionSrc,
      actionUrl,
      docsFolder,
      bidOpened,
      tenderAction,
      // organisationRefId: req.user.organisationId // attach to logged-in org
    });

    const savedTender = await newTender.save();

    return {
      status: 100,
      message: "Tender added successfully",
      result: savedTender
    };

  } catch (err) {
    console.error("Error adding tender:", err);
    return {
      status: 105,
      result: null,
      errorDetails: err.message
    };
  }
}

async function updateTender(req) {
  try {
    const { id } = req.params; // tender ID
    const updateData = req.body;

    // Ensure tender belongs to the organisation
    const updatedTender = await Tender.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true } // return updated doc
    );

    if (!updatedTender) {
      return { status: 102, message: "Tender not found or not authorized", result: null };
    }

    return {
      status: 100,
      message: "Tender updated successfully",
      result: updatedTender
    };

  } catch (err) {
    console.error("Error updating tender:", err);
    return {
      status: 105,
      result: null,
      errorDetails: err.message
    };
  }
}

async function getTenders(req) {
  try {
    const {search = "",showDeleted } = req.query;
     const query = {
      // organisationRefId: req.user.organisationId,
      isActive: showDeleted == "false" ? true : false,
    };

     if (search) {
      query.tenderTitle = { $regex: search, $options: "i" };
    }
    const tenders = await Tender.find(query).sort({ createdAt: -1 });
    
    return {
      status: 100,
      message: "Success",
      result: tenders
    };

  } catch (err) {
    console.error("Error fetching tenders:", err);
    return {
      status: 105,
      result: null,
      errorDetails: err.message
    };
  }
}

async function getTenderById(req) {
  try {
    const { id } = req.params;
    const tender = await Tender.findOne({ _id: id });

    if (!tender) {
      return { status: 102, message: "Tender not found", result: null };
    }

    return {
      status: 100,
      message: "Success",
      result: tender
    };

  } catch (err) {
    console.error("Error fetching tender:", err);
    return {
      status: 105,
      result: null,
      errorDetails: err.message
    };
  }
}

async function deleteTender(req) {
  try {
    const { id } = req.params;

    const data = await Tender.findOne({
       _id: id,
      //  organisationRefId: req.user.organisationId
     });
 
     if (!data) throw new Error("Tender not found");

    data.isActive = !data.isActive;
    await data.save();
    return {
      status: 100,
      message: "Tender updated successfully",
      result: data
    };

  } catch (err) {
    console.error("Error updating tender:", err);
    return {
      status: 105,
      result: null,
      errorDetails: err.message
    };
  }
}

module.exports={
    addSettings,
    getSettings,
    addTender,
    updateTender,
    getTenders,
    deleteTender,
    getTenderById
}