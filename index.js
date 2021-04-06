const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const gamersRouter = require("./routes/gamers.js");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");


const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({gamers: [] }).write();

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title: "Gamers API",
            version: "1.0.0",
            description: "A simple gamers ranking"
        },
        servers:[
            {
                url: "http://localhost:4000"
            }
        ],
        
    },
    apis:["./routes/*.js"]
   
};
const specs = swaggerJsDoc(options);


const app = express();

app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));



app.use("/gamers",gamersRouter);

app.listen(PORT, () => console.log('The server is running on port ${PORT}'));