const router = require("express").Router();

const clientRouter=require('./clientRouter')
const projectRouter=require('./projectRouter')
const expenseRouter= require('./expenseRouter')
const userRouter = require ('./userRouter')
const organisationRouter =  require ('./organisationRouter')
const masterRouter =  require ('./masterRouter')

router.use('/client',clientRouter)
router.use('/project',projectRouter)
router.use('/expense',expenseRouter)
router.use('/user',userRouter)
router.use('/org',organisationRouter)
router.use("/master",masterRouter)

module.exports = router;