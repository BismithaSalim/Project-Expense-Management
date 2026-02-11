const router = require("express").Router();
const userController = require("../controllers/userController");
var fun = require("../config/commonFunction.js");

router.post("/addUser",userController.addUser);
router.post("/login",userController.login);
router.post("/logout",userController.logOut);
router.post("/addAdminUser/:id",fun.verifyToken,fun.checkRole(["superAdmin"]),userController.addAdminUser);
router.get("/:id/getAdminByOrganisation",fun.verifyToken,fun.checkRole(["superAdmin"]),userController.getAdminByOrganisation);
router.patch("/deleteUser/:id",fun.verifyToken,fun.checkRole(['superAdmin']),userController.deleteUser);
router.post("/updateUser",userController.updateUser);
module.exports = router;