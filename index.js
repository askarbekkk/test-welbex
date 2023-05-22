const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT ||  5000;
const mongoose = require("mongoose")
const authRouter = require("./routes/authRoutes")
const swaggerDocs = require("./swagger")
const {Express, Request, Response} = require("express")
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const {version} = require("./package.json")





const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version
        },
        // servers: ["https://test-welbex.herokuapp.com"],
        servers: ["http://localhost:5000"],

    },

    apis: ["./routes/*.js", "./models/*.js"]
}
const swaggerSpec = swaggerJsDoc(options)

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


// Routes
/**
 * @swagger
 * /posts:
 * get:
 *    describe: Used to request all posts of a certain user
 *    responses:
 *      "200":
 *        description:  A successfull response
 *
 *
 * **/


app.use("/post_smth", authRouter)

const start  = async () => {
    try{
        await mongoose.connect(`mongodb+srv://askarbekk:12345@cluster0.llpikth.mongodb.net/?retryWrites=true&w=majority`)

        swaggerDocs(app, PORT)
        app.listen(PORT,  () => {
            console.log(`Server is on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()