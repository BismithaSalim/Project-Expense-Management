const router = require("express").Router();
const userController = require("../controllers/userController");
var fun = require("../config/commonFunction.js");

router.post("/addUser",fun.verifyToken,userController.addUser);
router.post("/login",userController.login);
router.post("/logout",userController.logOut);
router.post("/addAdminUser/:id",fun.verifyToken,fun.checkRole(["superAdmin"]),userController.addAdminUser);
router.get("/:id/getAdminByOrganisation",fun.verifyToken,fun.checkRole(["superAdmin"]),userController.getAdminByOrganisation);
router.patch("/deleteUser/:id",fun.verifyToken,fun.checkRole(['superAdmin',"admin"]),userController.deleteUser);
router.post("/updateUser",fun.verifyToken,userController.updateUser);
router.get("/getAllUsers",fun.verifyToken,userController.getAllUsers);
router.get("/getUserById",fun.verifyToken,userController.getUserById);

module.exports = router;