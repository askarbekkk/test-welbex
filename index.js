const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT ||  5000;
const mongoose = require("mongoose")
const authRouter = require("./routes/authRoutes")
const swaggerDocs = require("./swagger")
app.use(express.json());

app.use("/post_smth", authRouter)

//mongodb+srv://askarbekk:<password>@cluster0.llpikth.mongodb.net/?retryWrites=true&w=majority
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