const router = require("express").Router();
const masterController = require("../controllers/masterController");
var fun = require("../config/commonFunction.js");

router.post("/addMaster",fun.verifyToken,fun.checkRole(["admin"]),masterController.addMaster);
router.put("/updateMaster",fun.verifyToken,fun.checkRole(["admin"]),masterController.updateMaster);
router.get("/getAllMasters",fun.verifyToken,fun.checkRole(["admin"]),masterController.getAllMasters);
router.get("/getMasterById",fun.verifyToken,fun.checkRole(["admin"]),masterController.getMasterById);
router.patch("/deleteMaster/:id",fun.verifyToken,fun.checkRole(['admin']),masterController.deleteMaster);
router.get("/getMasterByCategory",fun.verifyToken,fun.checkRole(['admin']),masterController.getMasterByCategory);

router.post("/addRateMaster",fun.verifyToken,fun.checkRole(["admin"]),masterController.addRateMaster);
router.put("/updateRateMaster/:id",fun.verifyToken,fun.checkRole(["admin"]),masterController.updateRateMaster);
router.get("/getRateMasters",fun.verifyToken,fun.checkRole(["admin","executive"]),masterController.getRateMasters);
router.get("/getRateMasterById/:id",fun.verifyToken,fun.checkRole(["admin"]),masterController.getRateMasterById);
router.patch("/deleteRateMaster/:id",fun.verifyToken,fun.checkRole(['admin']),masterController.deleteRateMaster);
router.post("/createCostCalculation",fun.verifyToken,masterController.createCostCalculation);
router.post("/getCostCalculation",fun.verifyToken,masterController.getCostCalculation);
router.put("/updateCostCalculation",fun.verifyToken,masterController.updateCostCalculation);

module.exports = router;