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
     servers: [{
            api: "https://test-welbex.herokuapp.com"
     }]
    },

    apis: ["index.js", "./models/*.js"]
}

const swaggerSpec = swaggerJsDoc(options)

function swaggerDocs(app, port){
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get("docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json")
        res.send(swaggerSpec)

        console.log(`Docs are available on  http://localhost:${port}/post_smth/docs`)
    })
}


module.exports = swaggerDocs