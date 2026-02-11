const router = require("express").Router();
const clientController = require("../controllers/clientController");
var fun = require("../config/commonFunction.js");

router.post("/addClient",fun.verifyToken,fun.checkRole(["admin"]),clientController.addClient);
router.get("/getAllClients",fun.verifyToken,fun.checkRole(["admin"]),clientController.getAllClients);
router.post("/updateClient",fun.verifyToken,fun.checkRole(["admin"]),clientController.updateClient);
router.get("/getClientById",fun.verifyToken,fun.checkRole(["admin"]),clientController.getClientById);
router.patch("/deleteClient/:id",fun.verifyToken,fun.checkRole(['admin']),clientController.deleteClient);

module.exports = router;