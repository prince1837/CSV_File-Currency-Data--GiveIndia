const express=require('express')
const fs=require('fs')
const axios=require('axios')
const Json2csv = require('json2csv').parse;
const csvtojson = require('csvtojson')
const dotenv=require('dotenv').config()
const port = process.env.port

const app=express()
app.use(express.json())


var donate_data=express.Router()
app.use('/',donate_data)
require('./Donation_data/donate_data')(donate_data,Json2csv,fs,csvtojson)

var convert=express.Router()
app.use('/',convert)
require('./Convert_Base/Convert')(convert,axios,csvtojson)

var Total_donation=express.Router()
app.use('/',Total_donation)
require('./Total_Data/total_donation')(Total_donation,axios,csvtojson,Json2csv,fs)




app.listen(port,function(){
    console.log('your server is working on port no.. ',port)
})