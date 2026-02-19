const userHelper = require("../helpers/userHelper");

async function addUser(req, res) {
    userHelper.addUser(req).then((output) => {
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

async function login(req, res) {
    userHelper.login(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            token:output.token,
            status: output.status,
          })
        : res.status(400).json({
            message: output.message || "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function logOut(req, res) {
    userHelper.logOut(req).then((output) => {
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

async function addAdminUser(req, res) {
    userHelper.addAdminUser(req).then((output) => {
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

async function getAdminByOrganisation(req, res) {
    userHelper.getAdminByOrganisation(req).then((output) => {
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

async function deleteUser(req, res) {
    userHelper.deleteUser(req).then((output) => {
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

async function updateUser(req, res) {
    userHelper.updateUser(req).then((output) => {
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

async function getAllUsers(req, res) {
    userHelper.getAllUsers(req).then((output) => {
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

async function getUserById(req, res) {
    userHelper.getUserById(req).then((output) => {
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