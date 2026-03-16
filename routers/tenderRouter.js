const router = require("express").Router();
const tenderController = require("../controllers/tenderController");
var fun = require("../config/commonFunction.js");

router.post("/addSettings",fun.verifyToken,fun.checkRole(["admin"]),tenderController.addSettings);
router.get("/getSettings",fun.verifyToken,fun.checkRole(["admin"]),tenderController.getSettings);
router.post("/addTender",fun.verifyToken,fun.checkRole(["admin","bot"]),tenderController.addTender);
router.put("/updateTender/:id",fun.verifyToken,fun.checkRole(["admin","editor","bot"]),tenderController.updateTender);
router.get("/getTenders",fun.verifyToken,fun.checkRole(["admin","viewer","editor","bot"]),tenderController.getTenders);
router.get("/getTenderById/:id",fun.verifyToken,fun.checkRole(["admin","viewer","editor","bot"]),tenderController.getTenderById);
router.patch("/deleteTender/:id",fun.verifyToken,fun.checkRole(["admin","editor","bot"]),tenderController.deleteTender);

module.exports = router;