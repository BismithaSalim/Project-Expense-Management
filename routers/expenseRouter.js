const router = require("express").Router();
const expenseController = require("../controllers/expenseController");
var fun = require("../config/commonFunction.js");

router.post("/addExpense",fun.verifyToken,fun.checkRole(["admin"]),expenseController.addExpense);
router.post("/updateExpense",fun.verifyToken,fun.checkRole(["admin","expenseEditor"]),expenseController.updateExpense);
router.get("/getAllExpenses",fun.verifyToken,fun.checkRole(["admin","viewer","expenseEditor"]),expenseController.getAllExpenses);
router.post("/profitAndLossAnalysis",fun.verifyToken,fun.checkRole(["admin","viewer","expenseEditor"]),expenseController.profitAndLossAnalysis);
router.get("/getProjectExpenses",fun.verifyToken,fun.checkRole(["admin","viewer","expenseEditor"]),expenseController.getProjectExpenses);
router.get("/projectSummary",fun.verifyToken,fun.checkRole(["admin","viewer","expenseEditor"]),expenseController.projectSummary);
router.get("/projectFinancials",fun.verifyToken,fun.checkRole(["admin","viewer","expenseEditor"]),expenseController.projectFinancials);
router.get("/getExpenseById",fun.verifyToken,fun.checkRole(["admin","expenseEditor"]),expenseController.getExpenseById);
router.patch("/deleteExpense/:id",fun.verifyToken,fun.checkRole(['admin']),expenseController.deleteExpense);

module.exports = router;