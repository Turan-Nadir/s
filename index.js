const mongoose = require("mongoose");
const express = require("express");
const main = require("./routes/main.js")
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use("/", main);
mongoose.connect(process.env.DB)
  .then(()=>console.log("db connected"))
  .catch(err=>console.log('error happened while connecting db: ', err));

app.listen(process.env.PORT || 3000, ()=> console.log("running!"));