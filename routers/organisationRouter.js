const router = require("express").Router();
const organisationController = require("../controllers/organisationController");
var fun = require("../config/commonFunction.js");

router.post("/addOrganisation",fun.verifyToken,fun.checkRole(["superAdmin"]),organisationController.addOrganisation);
router.get("/organisationList",fun.verifyToken,fun.checkRole(["superAdmin"]),organisationController.organisationList);
router.put("/updateOrganisation",fun.verifyToken,fun.checkRole(["superAdmin"]),organisationController.updateOrganisation);
router.patch("/deleteOrganisation/:id",fun.verifyToken,fun.checkRole(['superAdmin']),organisationController.deleteOrganisation);
router.get("/getOrganisationById",fun.verifyToken,fun.checkRole(['superAdmin']),organisationController.getOrganisationById)
module.exports = router;