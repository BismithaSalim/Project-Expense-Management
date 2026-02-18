const clientHelper = require("../helpers/clientHelper");

async function addClient(req, res) {
    clientHelper.addClient(req).then((output) => {
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

// async function addClient(req, res) {
//   clientHelper.addClient(req).then((output) => {
//     if (output.status === 100) {
//       return res.status(200).json({
//         message: output.message,
//         data: output.result,
//         status: output.status,
//       });
//     }
//     // duplicate or validation error
//     return res.status(output.status || 400).json({
//       message: output.message,
//       status: output.status,
//     });
//   });
// }


async function updateClient(req, res) {
    clientHelper.updateClient(req).then((output) => {
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

async function getAllClients(req, res) {
    clientHelper.getAllClients(req).then((output) => {
      output.result
        ? res.status(200).json({
            message: output.message,
            data: output.result,
            status: output.status,
            totalCount: output.totalCount
          })
        : res.status(400).json({
            message: "Error",
            errorDetails: output.errorDetails,
            status: output.status,
          });
    });
}

async function getClientById(req, res) {
    clientHelper.getClientById(req).then((output) => {
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

async function deleteClient(req, res) {
    clientHelper.deleteClient(req).then((output) => {
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
    addClient,
    getAllClients,
    updateClient,
    getClientById,
    deleteClient
  }