const expenseHelper = require("../helpers/expenseHelper");

async function addExpense(req, res) {
    expenseHelper.addExpense(req).then((output) => {
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

async function getAllExpenses(req, res) {
    expenseHelper.getAllExpenses(req).then((output) => {
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

async function updateExpense(req, res) {
    expenseHelper.updateExpense(req).then((output) => {
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

async function profitAndLossAnalysis(req, res) {
    expenseHelper.profitAndLossAnalysis(req).then((output) => {
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

async function getProjectExpenses(req, res) {
    expenseHelper.getProjectExpenses(req).then((output) => {
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

async function projectSummary(req, res) {
    expenseHelper.projectSummary(req).then((output) => {
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

async function projectFinancials(req, res) {
    expenseHelper.projectFinancials(req).then((output) => {
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

async function getExpenseById(req, res) {
    expenseHelper.getExpenseById(req).then((output) => {
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

async function deleteExpense(req, res) {
    expenseHelper.deleteExpense(req).then((output) => {
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