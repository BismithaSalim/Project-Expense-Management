const Expense = require("../models/expense");
const Client = require("../models/client");  
const Project = require("../models/project");
const APIFeature = require("../utility/APIFeature.js");
const { ObjectId } = require("mongodb");

async function addExpense(req) {
  try {
    const {
      date,
      clientRefId,
      projectRefId,
      category,
      model,
      amount,
      vat,
      paidTo,
      paidBy,
      paymentType,
      totalAmount
    } = req.body;

    if (!clientRefId || !projectRefId || !category || amount === undefined || !paymentType) {
      throw new Error("Please fill out all required fields");
    }

    const clientExists = await Client.findById(clientRefId);
    if (!clientExists) throw new Error("Client not found");

    const projectExists = await Project.findById(projectRefId);
    if (!projectExists) throw new Error("Project not found");

    const expenseData = {
      date: date ? new Date(date) : new Date(),
      organisationRefId: req.user.organisationId,
      clientRefId,
      projectRefId,
      category,
      model,
      amount,
      vat: vat || 0,
      totalAmount,
      paidTo,
      paidBy,
      paymentType
    };

    const newExpense = new Expense(expenseData);
    const savedExpense = await newExpense.save();

    return { status: 100, message: "Expense added successfully", result: savedExpense };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function updateExpense(req) {
  try {
    const { id } = req.query

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      return { status: 105, result: null, errorDetails: "Expense not found" };
    }

    return { status: 100, message: "Expense updated successfully", result: updatedExpense };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}


// async function getAllExpenses(req) {
//   try {
//     let { page = 1, limit = 10, showDeleted} = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//   if(showDeleted=="false"){
//     const expenses = await Expense.find({organisationRefId: req.user.organisationId,isActive:true})
//     .populate({
//       path: "clientRefId",
//       select: "clientName",
//     })
//     .populate({
//       path: "projectRefId",
//       select: "projectName",
//     })    
//     .skip((page - 1) * limit)
//     .limit(limit);

//     return {
//       status: 100,
//       message: "success",
//       result: expenses
//     };
//   }else{
//     const expenses = await Expense.find({organisationRefId: req.user.organisationId,isActive:false})
//     .populate({
//       path: "clientRefId",
//       select: "clientName",
//     })
//     .populate({
//       path: "projectRefId",
//       select: "projectName",
//     })    
//     .skip((page - 1) * limit)
//     .limit(limit);

//     return {
//       status: 100,
//       message: "success",
//       result: expenses
//     };
//   }
//   } catch (err) {
//     return {
//       status: 105,
//       result: null,
//       errorDetails: err.message,
//     };
//   }
// }

async function getAllExpenses(req) {
  try {
    let { page = 1, limit = 10, showDeleted } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {
      organisationRefId: req.user.organisationId,
      isActive: showDeleted == "false" ? true : false,
    };

    const totalCount = await Expense.countDocuments(filter);

    const expenses = await Expense.find(filter)
      .populate({
        path: "clientRefId",
        select: "clientName",
      })
      .populate({
        path: "projectRefId",
        select: "projectName",
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      status: 100,
      message: "success",
      result: expenses,
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

async function profitAndLossAnalysis(req) {
    try{
        const result = await Project.aggregate([
        { $match: { _id: new ObjectId(req.body.projectId) } },
        // {
        //     $lookup: {
        //     from: "clients",
        //     localField: "clientRefId",
        //     foreignField: "_id",
        //     as: "client"
        //     }
        // },
        // { $unwind: "$client" },
        // {
        //     $lookup: {
        //     from: "expenses",
        //     localField: "_id",
        //     foreignField: "projectRefId",
        //     as: "expenses"
        //     }
        // },
        {
                $lookup: {
                    from: "clients",
                    let: { clientId: "$clientRefId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$clientId"] },
                                        { $eq: ["$isActive", true] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "client"
                }
            },
            { $unwind: "$client" },

            // Lookup only active expenses
            {
                $lookup: {
                    from: "expenses",
                    let: { projectId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$projectRefId", "$$projectId"] },
                                        { $eq: ["$isActive", true] } // Only active expenses
                                    ]
                                }
                            }
                        }
                    ],
                    as: "expenses"
                }
            },

        {
            $addFields: {
            totalCost: { $sum: "$expenses.amount" },
            totalVatPaid: { $sum: "$expenses.vat" }
            }
        },
        {
            $addFields: {
            profitAndLoss: {
                $subtract: [
                { $add: ["$projectValue", "$vatAmount"] },
                { $add: ["$totalCost", "$totalVatPaid"] }
                ]
            },
            vatToBePaid: {
                $subtract: ["$vatAmount", "$totalVatPaid"]
            }
            }
        },
        {
          $project: {
                projectName: 1,
                projectValue: 1,
                vatReceived: "$vatAmount",
                location: 1,
                description: 1,
                lpoDate: 1,
                projectStartDate: 1,
                projectEndDate: 1,
                acceptanceDate: 1,
                projectStatus: 1,

                clientName: "$client.clientName",
                clientType: "$client.type",
                clientStatus: "$client.status",

                totalCost: 1,
                totalVatPaid: 1,
                profitAndLoss: 1,
                vatToBePaid: 1
            }
        }
    ]);

      return {
        status: 100,
        message: "success",
        result: result
     };
    }catch(error){
       return {
            status: 105,
            result: null,
            errorDetails: error.message,
        }; 
    }
}

async function getProjectExpenses(req) {
  try {
    const filter = {organisationRefId: req.user.organisationId,isActive:true};
    if (req.query.projectId) {
      filter.projectRefId = req.query.projectId;
    }

    if (req.query.category) filter.category = req.query.category;
    if (req.query.paidTo) filter.paidTo = req.query.paidTo;
    if (req.query.paidBy) filter.paidBy = req.query.paidBy;
    if (req.query.paymentType) filter.paymentType = req.query.paymentType;

    let sortOptions = {};

    if (req.query.sortAmount) {
      const order = req.query.sortAmount.toLowerCase() === "asc" ? 1 : -1;
      sortOptions.totalAmount = order;
    }else {
      sortOptions.date = -1;
    }

    const expenses = await Expense.find(filter)
      .sort(sortOptions)
    //   .select("date category amount vat totalAmount paidTo paidBy paymentType");

    return {
      status: 100,
      message: "success",
      result: expenses
    };

  } catch (error) {
    return {
      status: 105,
      result: null,
      errorDetails: error.message
    };
  }
}

async function projectSummary(req) {
  try {
    // Decode query parameters to handle spaces like "Not Started"
    const status = req.query.status ? decodeURIComponent(req.query.status) : undefined;
    const sortBy = req.query.sortBy;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Base match
    let match = { organisationRefId: new ObjectId(req.user.organisationId), isActive: true };
    if (status) match.projectStatus = status;
// console.log("status1",req.user.organisationId)
    // Sorting
    let sortOption = {};
    switch (status) {
      case "Ongoing":
        sortOption = { projectStartDate: 1 };
        break;
      case "Not Started":
        sortOption = { lpoDate: 1 };
        break;
      case "Completed":
        sortOption = { projectEndDate: -1 };
        break;
      case "Accepted":
        sortOption = { acceptanceDate: -1 };
        break;
      default:
        sortOption = sortBy ? { [sortBy]: 1 } : { createdAt: -1 };
    }

    const projects = await Project.aggregate([
      { $match: match },

      // Lookup only active clients
      {
        $lookup: {
          from: "clients",
          let: { clientId: "$clientRefId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$clientId"] },
                    { $eq: ["$isActive", true] } // Only active clients
                  ]
                }
              }
            }
          ],
          as: "client"
        }
      },
      { $unwind: "$client" },

      // Lookup only active expenses
      {
        $lookup: {
          from: "expenses",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$projectRefId", "$$projectId"] },
                    { $eq: ["$isActive", true] } // Only active expenses
                  ]
                }
              }
            }
          ],
          as: "expenses"
        }
      },

      // Calculate projectValueWithVAT, projectCost
      // {
      //   $addFields: {
      //     projectValueWithVAT: { $add: [{ $ifNull: ["$projectValue", 0] }, { $ifNull: ["$vatAmount", 0] }] },
      //     projectCost: {
      //       $sum: {
      //         $map: {
      //           input: "$expenses",
      //           as: "e",
      //           in: { $add: [{ $ifNull: ["$$e.amount", 0] }, { $ifNull: ["$$e.vat", 0] }] }
      //         }
      //       }
      //     },
      //     deductions: { $ifNull: ["$deductions", 0] }
      //   }
      // },
        {
          $addFields: {
          projectValueWithVAT: {
            $round: [
              {
                $add: [
                  { $ifNull: ["$projectValue", 0] },
                  { $ifNull: ["$vatAmount", 0] }
                ]
              },
              2
            ]
          },

          projectCost: {
            $round: [
              {
                $sum: {
                  $map: {
                    input: "$expenses",
                    as: "e",
                    in: {
                      $add: [
                        { $ifNull: ["$$e.amount", 0] },
                        { $ifNull: ["$$e.vat", 0] }
                      ]
                    }
                  }
                }
              },
              2
            ]
          },

          deductions: { $ifNull: ["$deductions", 0] }
        },
      },
      // Calculate marginPercent
      {
        $addFields: {
          marginPercent: {
            $cond: [
              { $eq: [{ $subtract: ["$projectValueWithVAT", "$deductions"] }, 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ["$projectValueWithVAT", "$projectCost"] },
                          { $subtract: ["$projectValueWithVAT", "$deductions"] }
                        ]
                      },
                      100
                    ]
                  },
                  2
                ]
              }
            ]
          },
          earnings: { $subtract: ["$projectValueWithVAT", "$projectCost"] },
          projectDuration: {
            $cond: [
              {
                $and: [
                  { $ifNull: ["$projectStartDate", false] },
                  { $ifNull: ["$projectEndDate", false] }
                ]
              },
              { $round: [{ $divide: [{ $subtract: ["$projectEndDate", "$projectStartDate"] }, 1000 * 60 * 60 * 24] }, 0] },
              null
            ]
          }
        }
      },

      { $sort: sortOption },
      { $skip: (page - 1) * limit },
      { $limit: limit },

      {
        $project: {
          _id: 1,
          date: "$projectEndDate",
          status: "$projectStatus",
          projectName: 1,
          clientName: "$client.clientName",
          location: 1,
          projectValue: "$projectValueWithVAT",
          projectCost: 1,
          earnings: 1,
          marginPercent: 1,
          projectDuration: 1
        }
      }
    ]);

    return {
      status: 100,
      message: "success",
      result: projects
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message
    };
  }
}

// async function projectSummary(req) {
//     try {
//         const { status, sortBy, page = 1, limit = 20 } = req.query;

//         let match = {};
//         if (status) match.projectStatus = status;

//         let sortOption = {};
//         switch (status) {
//             case 'Ongoing':
//                 sortOption = { projectStartDate: 1 };
//                 break;
//             case 'Not Started':
//                 sortOption = { lpoDate: 1 };
//                 break;
//             case 'Completed':
//                 sortOption = { projectEndDate: -1 };
//                 break;
//             case 'Accepted':
//                 sortOption = { acceptanceDate: -1 };
//                 break;
//             default:
//                 if (sortBy) sortOption[sortBy] = 1;
//         }

//         const projects = await Project.aggregate([
//             { $match: match },
//             {
//                 $lookup: {
//                     from: 'clients',
//                     localField: 'clientRefId',
//                     foreignField: '_id',
//                     as: 'client'
//                 }
//             },
//             { $unwind: '$client' },
//             {
//                 $lookup: {
//                     from: 'expenses',
//                     localField: '_id',
//                     foreignField: 'projectRefId',
//                     as: 'expenses'
//                 }
//             },
//             {
//                 $addFields: {
//                     projectValueWithVAT: { $add: ['$projectValue', '$vatAmount'] },
//                     projectCost: {
//                         $sum: {
//                             $map: {
//                                 input: '$expenses',
//                                 as: 'e',
//                                 in: { $add: ['$$e.amount', '$$e.vat'] }
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 $addFields: {
//                     earnings: { $subtract: ['$projectValueWithVAT', '$projectCost'] },
//                     marginPercent: {
//                         $cond: [
//                             { $eq: ['$projectValueWithVAT', 0] },
//                             0,
//                             { $multiply: [{ $divide: ['$earnings', '$projectValueWithVAT'] }, 100] }
//                         ]
//                     },
//                     projectDuration: {
//                         $cond: [
//                             { $and: ['$projectStartDate', '$projectEndDate'] },
//                             { $divide: [{ $subtract: ['$projectEndDate', '$projectStartDate'] }, 1000 * 60 * 60 * 24] },
//                             null
//                         ]
//                     }
//                 }
//             },
//             { $sort: sortOption },
//             { $skip: (parseInt(page) - 1) * parseInt(limit) },
//             { $limit: parseInt(limit) },
//             {
//                 $project: {
//                     _id: 1,
//                     date: '$projectEndDate',
//                     status: '$projectStatus',
//                     projectName: 1,
//                     clientName: '$client.clientName',
//                     location: 1,
//                     projectValue: '$projectValueWithVAT',
//                     projectCost: 1,
//                     earnings: 1,
//                     marginPercent: 1,
//                     projectDuration: 1
//                 }
//             }
//         ]);

//         return{
//             status: 100,
//             message: "success",
//             result: projects
//         }
//     } catch (err) {
//        return {
//             status: 105,
//             result: null,
//             errorDetails: err.message,
//         }; 
//     }
// };

///////////NEW////////////////////////////////
// async function projectSummary(req) {
//   try {
//     const { status, sortBy, page = 1, limit = 20 } = req.query;

//     /* ---------------------------
//        MATCH
//     ---------------------------- */
//     let match = {};
//     if (status) match.projectStatus = status;

//     /* ---------------------------
//        SORT (Sheet-3 rule)
//     ---------------------------- */
//     let sortOption = {};
//     switch (status) {
//       case "Ongoing":
//         sortOption = { projectStartDate: 1 };
//         break;
//       case "Not Started":
//         sortOption = { lpoDate: 1 };
//         break;
//       case "Completed":
//         sortOption = { projectEndDate: -1 };
//         break;
//       case "Accepted":
//         sortOption = { acceptanceDate: -1 };
//         break;
//       default:
//         sortOption = sortBy ? { [sortBy]: 1 } : { createdAt: -1 };
//     }

//     const projects = await Project.aggregate([
//       { $match: match },
//       {
//         $lookup: {
//           from: "clients",
//           localField: "clientRefId",
//           foreignField: "_id",
//           as: "client"
//         }
//       },
//       { $unwind: "$client" },
//       {
//         $lookup: {
//           from: "expenses",
//           localField: "_id",
//           foreignField: "projectRefId",
//           as: "expenses"
//         }
//       },
//       {
//         $addFields: {
//           projectValueWithVAT: {
//             $add: [
//               { $ifNull: ["$projectValue", 0] },
//               { $ifNull: ["$vatAmount", 0] }
//             ]
//           },
//           projectCost: {
//             $sum: {
//               $map: {
//                 input: "$expenses",
//                 as: "e",
//                 in: {
//                   $add: [
//                     { $ifNull: ["$$e.amount", 0] },
//                     { $ifNull: ["$$e.vat", 0] }
//                   ]
//                 }
//               }
//             }
//           }
//         }
//       },
//       {
//         $addFields: {
//           earnings: {
//             $subtract: ["$projectValueWithVAT", "$projectCost"]
//           },
//           marginPercent: {
//             $cond: [
//               { $eq: ["$projectValueWithVAT", 0] },
//               0,
//               {
//                 $round: [
//                   {
//                     $multiply: [
//                       {
//                         $divide: [
//                           { $subtract: ["$projectValueWithVAT", "$projectCost"] },
//                           "$projectValueWithVAT"
//                         ]
//                       },
//                       100
//                     ]
//                   },
//                   2
//                 ]
//               }
//             ]
//           },
//           projectDuration: {
//             $cond: [
//               {
//                 $and: [
//                   { $ifNull: ["$projectStartDate", false] },
//                   { $ifNull: ["$projectEndDate", false] }
//                 ]
//               },
//               {
//                 $round: [
//                   {
//                     $divide: [
//                       { $subtract: ["$projectEndDate", "$projectStartDate"] },
//                       1000 * 60 * 60 * 24
//                     ]
//                   },
//                   0
//                 ]
//               },
//               null
//             ]
//           }
//         }
//       },

//       /* ---------------------------
//          SORT
//       ---------------------------- */
//       { $sort: sortOption },

//       /* ---------------------------
//          PAGINATION
//       ---------------------------- */
//       { $skip: (parseInt(page) - 1) * parseInt(limit) },
//       { $limit: parseInt(limit) },

//       /* ---------------------------
//          FINAL SHAPE
//       ---------------------------- */
//       {
//         $project: {
//           _id: 1,
//           date: "$projectEndDate",
//           status: "$projectStatus",
//           projectName: 1,
//           clientName: "$client.clientName",
//           location: 1,
//           projectValue: "$projectValueWithVAT",
//           projectCost: 1,
//           earnings: 1,
//           marginPercent: 1,
//           projectDuration: 1
//         }
//       }
//     ]);

//     return {
//       status: 100,
//       message: "success",
//       result: projects
//     };

//   } catch (err) {
//     return {
//       status: 105,
//       result: null,
//       errorDetails: err.message
//     };
//   }
// }

// async function projectSummary(req) {
//   try {
//     const { status, sortBy, page = 1, limit = 20 } = req.query;

//     let match = {organisationRefId: req.user.organisationId,isActive:true};
//     if (status) match.projectStatus = status;

//     let sortOption = {};
//     switch (status) {
//       case "Ongoing":
//         sortOption = { projectStartDate: 1 };
//         break;
//       case "Not Started":
//         sortOption = { lpoDate: 1 };
//         break;
//       case "Completed":
//         sortOption = { projectEndDate: -1 };
//         break;
//       case "Accepted":
//         sortOption = { acceptanceDate: -1 };
//         break;
//       default:
//         sortOption = sortBy ? { [sortBy]: 1 } : { createdAt: -1 };
//     }

//     const projects = await Project.aggregate([
//       { $match: match },

//       // Lookup client
//       // {
//       //   $lookup: {
//       //     from: "clients",
//       //     localField: "clientRefId",
//       //     foreignField: "_id",
//       //     as: "client"
//       //   }
//       // },
//       // { $unwind: "$client" },
//       // Lookup only active clients
//         {
//           $lookup: {
//             from: "clients",
//             let: { clientId: "$clientRefId" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ["$_id", "$$clientId"] },
//                       { $eq: ["$isActive", true] } // Only active clients
//                     ]
//                   }
//                 }
//               }
//             ],
//             as: "client"
//           }
//         },
//         { $unwind: "$client" }, // Unwind the active client


//       // Lookup expenses
//       // {
//       //   $lookup: {
//       //     from: "expenses",
//       //     localField: "_id",
//       //     foreignField: "projectRefId",
//       //     as: "expenses"
//       //   }
//       // },

//       // Lookup expenses (only active)
//         {
//           $lookup: {
//             from: "expenses",
//             let: { projectId: "$_id" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ["$projectRefId", "$$projectId"] },
//                       { $eq: ["$isActive", true] } // Only active expenses
//                     ]
//                   }
//                 }
//               }
//             ],
//             as: "expenses"
//           }
//         },

//       // Calculate projectValueWithVAT, projectCost
//       {
//         $addFields: {
//           projectValueWithVAT: { $add: [{ $ifNull: ["$projectValue", 0] }, { $ifNull: ["$vatAmount", 0] }] },
//           projectCost: {
//             $sum: {
//               $map: {
//                 input: "$expenses",
//                 as: "e",
//                 in: { $add: [{ $ifNull: ["$$e.amount", 0] }, { $ifNull: ["$$e.vat", 0] }] }
//               }
//             }
//           },
//           deductions: { $ifNull: ["$deductions", 0] } // default 0 if not present
//         }
//       },

//       // Calculate marginPercent based on projectValueWithVAT - deductions
//       {
//         $addFields: {
//           marginPercent: {
//             $cond: [
//               { $eq: [{ $subtract: ["$projectValueWithVAT", "$deductions"] }, 0] },
//               0,
//               {
//                 $round: [
//                   {
//                     $multiply: [
//                       {
//                         $divide: [
//                           { $subtract: ["$projectValueWithVAT", "$projectCost"] },
//                           { $subtract: ["$projectValueWithVAT", "$deductions"] }
//                         ]
//                       },
//                       100
//                     ]
//                   },
//                   2
//                 ]
//               }
//             ]
//           },
//           earnings: { $subtract: ["$projectValueWithVAT", "$projectCost"] },
//           projectDuration: {
//             $cond: [
//               {
//                 $and: [
//                   { $ifNull: ["$projectStartDate", false] },
//                   { $ifNull: ["$projectEndDate", false] }
//                 ]
//               },
//               { $round: [{ $divide: [{ $subtract: ["$projectEndDate", "$projectStartDate"] }, 1000 * 60 * 60 * 24] }, 0] },
//               null
//             ]
//           }
//         }
//       },

//       { $sort: sortOption },
//       { $skip: (parseInt(page) - 1) * parseInt(limit) },
//       { $limit: parseInt(limit) },

//       {
//         $project: {
//           _id: 1,
//           date: "$projectEndDate",
//           status: "$projectStatus",
//           projectName: 1,
//           clientName: "$client.clientName",
//           location: 1,
//           projectValue: "$projectValueWithVAT",
//           projectCost: 1,
//           earnings: 1,
//           marginPercent: 1,
//           projectDuration: 1
//         }
//       }
//     ]);

//     return {
//       status: 100,
//       message: "success",
//       result: projects
//     };
//   } catch (err) {
//     return {
//       status: 105,
//       result: null,
//       errorDetails: err.message
//     };
//   }
// }

// async function projectFinancials(req) {
//     try {
//         // Filter for Completed projects only
//         const statusFilter = 'Completed';

//         const totals = await Project.aggregate([
//             { $match: { organizationId: req.user.organizationId,projectStatus: statusFilter,isActive:true } },
//             {
//                 $lookup: {
//                     from: 'expenses',
//                     localField: '_id',
//                     foreignField: 'projectRefId',
//                     as: 'expenses'
//                 }
//             },

//             // Calculate projectValueWithVAT and projectCost
//             {
//                 $addFields: {
//                     projectValueWithVAT: { $add: ['$projectValue', '$vatAmount'] },
//                     projectCost: {
//                         $sum: {
//                             $map: {
//                                 input: '$expenses',
//                                 as: 'e',
//                                 in: { $add: ['$$e.amount', '$$e.vat'] }
//                             }
//                         }
//                     }
//                 }
//             },

//             {
//                 $group: {
//                     _id: null,
//                     noOfProjects: { $sum: 1 },
//                     totalProjectValue: { $sum: '$projectValueWithVAT' },
//                     totalProjectCost: { $sum: '$projectCost' },
//                     totalEarnings: { $sum: { $subtract: ['$projectValueWithVAT', '$projectCost'] } }
//                 }
//             },
//             // Calculate average margin
//             {
//                 $addFields: {
//                     averageMargin: {
//                         $cond: [
//                             { $eq: ['$totalProjectValue', 0] },
//                             0,
//                             { $multiply: [{ $divide: ['$totalEarnings', '$totalProjectValue'] }, 100] }
//                         ]
//                     }
//                 }
//             }
//         ]);

//         return {
//             status: 100,
//             message: 'success',
//             result: totals[0] || {
//                 noOfProjects: 0,
//                 totalProjectValue: 0,
//                 totalProjectCost: 0,
//                 totalEarnings: 0,
//                 averageMargin: 0
//             }
//         };

//     } catch (err) {
//         return {
//             status: 105,
//             result: null,
//             errorDetails: err.message
//         };
//     }
// }

async function projectFinancials(req) {
  try {
    const statusFilter = "Completed";

    const totals = await Project.aggregate([
      {
        $match: {
          organisationRefId:new ObjectId(req.user.organisationId),
          projectStatus: statusFilter,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "expenses",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$projectRefId", "$$projectId"] },
                    { $eq: ["$isActive", true] }, // Only active expenses
                  ],
                },
              },
            },
          ],
          as: "expenses",
        },
      },
      {
        $addFields: {
          projectValueWithVAT: {
            $add: [
              "$projectValue",
              { $ifNull: ["$vatAmount", 0] }
            ]
          },
          projectCost: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: "$expenses",
                    as: "e",
                    in: { $add: ["$$e.amount", "$$e.vat"] },
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          noOfProjects: { $sum: 1 },
          totalProjectValue: { $sum: "$projectValueWithVAT" },
          totalProjectCost: { $sum: "$projectCost" },
          totalEarnings: { $sum: { $subtract: ["$projectValueWithVAT", "$projectCost"] } },
        },
      },
      {
        $addFields: {
          averageMargin: {
              $cond: [
                { $eq: ["$totalProjectValue", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$totalEarnings", "$totalProjectValue"] },
                        100
                      ]
                    },
                    2
                  ]
                }
              ]
            },
          // averageMargin: {
          //   $cond: [
          //     { $eq: ["$totalProjectValue", 0] },
          //     0,
          //     { $multiply: [{ $divide: ["$totalEarnings", "$totalProjectValue"] }, 100] },
          //   ],
          // },
        },
      },
    ]);

    return {
      status: 100,
      message: "success",
      result:
        totals[0] || {
          noOfProjects: 0,
          totalProjectValue: 0,
          totalProjectCost: 0,
          totalEarnings: 0,
          averageMargin: 0,
        },
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function getExpenseById(req) {
  try {
    let { expenseId } = req.query;

    const expenses = await Expense.find({_id:expenseId})
    .populate({
      path: "clientRefId",
      select: "clientName",
    })
    .populate({
      path: "projectRefId",
      select: "projectName",
    })

    return {
      status: 100,
      message: "success",
      result: expenses
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function deleteExpense(req) {
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      throw new Error("Expense not found");
    }

    expense.isActive = !expense.isActive;
    const result = await expense.save();

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
    addExpense,
    getAllExpenses,
    updateExpense,
    profitAndLossAnalysis,
    getProjectExpenses,
    projectSummary,
    projectFinancials,
    getExpenseById,
    deleteExpense
}