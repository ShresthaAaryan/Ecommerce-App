const express = require("express")
const gatewayRoutes = require("./routes/gatewayRoutes")
const config = require("./config/config")
const dotenv = require("dotenv")
dotenv.config()
const app = express()

app.use(express.json())

app.use('/api', gatewayRoutes)

app.listen(config.port, ()=>{
    console.log(`API Gateway is running on port ${config.port}`)
})