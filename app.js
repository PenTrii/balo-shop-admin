const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const session = require('express-session');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const admin = require("firebase-admin");
const cookieParser = require('cookie-parser');

var url = config.get("mongodb_uri");//mongodb uri in default.json

var host = config.get("server.host");
var port = process.env.PORT || config.get("server.port");

var app = express();

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

//connect mongosse
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//firebase-admin
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://storedecor-4f086.firebaseio.com",
    messagingSenderId: config.get("sender_id"),
});

//setup session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  key: config.get("key"),
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 600000
    }
}));

//set Storage
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename(req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname))
    }
});

app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");

//static folder
app.use("/static", express.static(__dirname + "/public"));

const upload = multer({
    storage: storage
}).any('img');

app.use(upload);

//sendfile image by router
app.get("/uploads/:urlimg", async (req, res) => {
    res.sendFile(path.join(__dirname, '/public/uploads', req.params.urlimg));
});

//middleware
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie(config.get("key"));        
    }
    next();
});

//already routes
const routes = require(__dirname + '/routes');
app.use(routes);

//swaggerUi
const  swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'Api',
        version: '1.0.0',
        description: 'Api project Store Decor',
    },
    host: 'localhost:' + port,
    schemes: ['http', 'https'],
    basePath: '/api/str1/',
};

const options = {
    swaggerDefinition,
    apis: ['./routes/api.js']
};

const specs = swaggerJSDoc(options);

//docs in page
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//listen config
app.listen(port, host, function() {
    console.log("Sever is running on port: " , port); 
});
