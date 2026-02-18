const router = require("express").Router();
const masterController = require("../controllers/masterController");
var fun = require("../config/commonFunction.js");

router.post("/addMaster",fun.verifyToken,fun.checkRole(["admin"]),masterController.addMaster);
router.put("/updateMaster",fun.verifyToken,fun.checkRole(["admin"]),masterController.updateMaster);
router.get("/getAllMasters",fun.verifyToken,fun.checkRole(["admin"]),masterController.getAllMasters);
router.get("/getMasterById",fun.verifyToken,fun.checkRole(["admin"]),masterController.getMasterById);
router.patch("/deleteMaster/:id",fun.verifyToken,fun.checkRole(['admin']),masterController.deleteMaster);
router.get("/getMasterByCategory",fun.verifyToken,fun.checkRole(['admin']),masterController.getMasterByCategory);

module.exports = router;