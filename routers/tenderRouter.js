const router = require("express").Router();
const tenderController = require("../controllers/tenderController");
var fun = require("../config/commonFunction.js");

router.post("/addSettings",fun.verifyToken,fun.checkRole(["admin"]),tenderController.addSettings);
router.get("/getSettings",fun.verifyToken,fun.checkRole(["admin"]),tenderController.getSettings);
router.post("/addTender",tenderController.addTender);
router.put("/updateTender/:id",tenderController.updateTender);
router.get("/getTenders",tenderController.getTenders);
router.get("/getTenderById/:id",tenderController.getTenderById);
router.patch("/deleteTender/:id",tenderController.deleteTender);

module.exports = router;