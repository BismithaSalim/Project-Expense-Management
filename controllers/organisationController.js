const organisationHelper = require("../helpers/organisationHelper");

async function addOrganisation(req, res) {
    organisationHelper.addOrganisation(req).then((output) => {
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

async function updateOrganisation(req, res) {
    organisationHelper.updateOrganisation(req).then((output) => {
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

async function organisationList(req, res) {
    organisationHelper.organisationList(req).then((output) => {
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

async function deleteOrganisation(req, res){
    organisationHelper.deleteOrganisation(req).then((output) => {
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

async function getOrganisationById(req,res){
    organisationHelper.getOrganisationById(req).then((output) => {
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
    addOrganisation,
    updateOrganisation,
    organisationList,
    deleteOrganisation,
    getOrganisationById
}