const router = require("express").Router();
const projectController = require("../controllers/projectController");
var fun = require("../config/commonFunction.js");

router.post("/addProject",fun.verifyToken,fun.checkRole(["admin"]),projectController.addProject);
router.get("/getAllProjects",fun.verifyToken,fun.checkRole(["admin","viewer","expenseEditor"]),projectController.getAllProjects);
router.post("/updateProject",fun.verifyToken,fun.checkRole(["admin"]),projectController.updateProject);
router.get("/getProjectsByClient",fun.verifyToken,fun.checkRole(["admin","expenseEditor"]),projectController.getProjectsByClient);
router.get("/getProjectById",fun.verifyToken,fun.checkRole(["admin"]),projectController.getProjectById);
router.patch("/deleteProject/:id",fun.verifyToken,fun.checkRole(['admin']),projectController.deleteProject);

module.exports = router;