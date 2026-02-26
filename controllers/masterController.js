const masterHelper = require("../helpers/masterHelper");

async function addMaster(req, res) {
    masterHelper.addMaster(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function updateMaster(req, res) {
    masterHelper.updateMaster(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function getAllMasters(req, res) {
    masterHelper.getAllMasters(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
            totalCount:output.totalCount
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function getMasterById(req, res) {
    masterHelper.getMasterById(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function deleteMaster(req, res) {
    masterHelper.deleteMaster(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function getMasterByCategory(req, res) {
    masterHelper.getMasterByCategory(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

////////////////////////////////////RATE MASTER/////////////////////////////////////
async function addRateMaster(req, res) {
    masterHelper.addRateMaster(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: output.message || "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function updateRateMaster(req, res) {
    masterHelper.updateRateMaster(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function getRateMasters(req, res) {
    masterHelper.getRateMasters(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result.data,
            totalCount:output.result.totalCount,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function getRateMasterById(req, res) {
    masterHelper.getRateMasterById(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function deleteRateMaster(req, res) {
    masterHelper.deleteRateMaster(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function createCostCalculation(req, res) {
    masterHelper.createCostCalculation(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}


async function getCostCalculation(req, res) {
    masterHelper.getCostCalculation(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function updateCostCalculation(req, res) {
    masterHelper.updateCostCalculation(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
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
    updateCostCalculation
  }