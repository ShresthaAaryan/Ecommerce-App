const express = require("express")
const dotenv = require("dotenv")
const gatewayRoutes = require("./src/routes/gatewayRoutes")
const config = require("./src/config/config")

dotenv.config()

const app = express()

app.use(express.json())

app.use('/api', gatewayRoutes)

app.listen(config.port, ()=>{
    console.log(`API Gateway is running on port ${config.port}`)
})