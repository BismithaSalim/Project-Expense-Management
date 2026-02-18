const Client = require("../models/client");
const mongoose = require("mongoose");

async function addClient(req) {
  try {
    console.log("req",req.body)
    const { clientName } = req.body;
    if (!clientName) {
      throw new Error("Please fill out all required fields");
    }

    const isExist =await Client.findOne({clientName:clientName})
    if(isExist){
      // throw new Error("Client Already exist");
      return { status: 102, message: "Client Already exist", result: null };
    }
    const lastClient = await Client.findOne({}, {}, { sort: { clientId: -1 } });

    let newId;
    if (!lastClient) {
      newId = 10000; // starting ID
    } else {
      const lastIdNumber = parseInt(lastClient.clientId.replace(/client-/i, ""), 10);
      newId = lastIdNumber + 1;
    }

    const clientData = {
      ...req.body,
      organisationRefId: req.user.organisationId,
      clientId: `client-${newId}`,
    };

    const newClient = new Client(clientData);
    const savedClient = await newClient.save();

    return { status: 100, message: "success", result: savedClient };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}


async function updateClient(req) {
  try {
    const { id } = req.query;
    const updatedClient = await Client.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedClient) {
      return { status: 105, result: null, errorDetails: "Client not found" };
    }

    return { status: 100, message: "Client updated successfully", result: updatedClient };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}


// async function getAllClients(req) {
//   try {
//     let { page = 1, limit = 10,showDeleted } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     if(showDeleted=="false"){
//       const clients = await Client.find({organisationRefId: req.user.organisationId,isActive:true})
//         .sort({ clientId: 1 })          
//         .skip((page - 1) * limit)
//         .limit(limit);

//       return {
//         status: 100,
//         message: "success",
//         result: clients
//       };
//     }else{
//       const clients = await Client.find({organisationRefId: req.user.organisationId,isActive:false})
//         .sort({ clientId: 1 })          
//         .skip((page - 1) * limit)
//         .limit(limit);

//       return {
//         status: 100,
//         message: "success",
//         result: clients
//       };
//     }
//   } catch (err) {
//     return {
//       status: 105,
//       result: null,
//       errorDetails: err.message,
//     };
//   }
// }

async function getAllClients(req) {
  try {
    let { page = 1, limit = 10, showDeleted, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {
      organisationRefId: req.user.organisationId,
      isActive: showDeleted == "false" ? true : false,
    };

    if (search && search.trim() !== "") {
      filter.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } }
      ];
    }

    const totalCount = await Client.countDocuments(filter);

    const clients = await Client.find(filter)
      .sort({ clientId: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      status: 100,
      message: "success",
      result: clients,
      totalCount: totalCount,
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function getClientById(req) {
  try {
    let { clientId } = req.query;

    const clients = await Client.find({_id:clientId})
      .sort({ clientId: 1 })

    return {
      status: 100,
      message: "success",
      result: clients
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function deleteClient(req) {
  try {
    const clientId = req.params.id;

    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    client.isActive = !client.isActive;
    const result = await client.save();

    return {
      status: 100,
      message: "success",
      result: result
    };
  } catch (error) {
    return { status: 105, result: null, errorDetails: error.message };
  }
}

module.exports={
    addClient,
    getAllClients,
    updateClient,
    getClientById,
    deleteClient
}