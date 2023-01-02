const express = require('express')
const app = express()
const mongoose = require('mongoose');
const config = require('./config/dataBase');
const passport=require('passport')
require('./passport/passport')
const bodyParser = require('body-parser')


const connection = mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
if (connection) {
    console.log("database connected");
} else {
    console.log("database connection error");
}
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// // app.use(express.bodyParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

var userRouter = require('./routes/user');


app.use('/', userRouter);



app.listen(3000)