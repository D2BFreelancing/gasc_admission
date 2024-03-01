const express = require('express');
const bp = require('body-parser');
const app = express();
const db = require('../database/database');
require('../models/models')
const {dept_schema} = require('../models/models');
 const {setCourse} = require('../models/models');

const login_data=require('../models/login');
const mongoose = require('mongoose');


// First Page Login Page
exports.login=async(req,res)=>{
    res.render('login',{layout:false,ch:''})
}



// Main Page But not the first page
exports.home=async(req,res)=>{
    res.render('home');
}

// SignUp PageFor Use of Admin
exports.sign_form=async(req,res)=>{
    res.render('singup',{layout:false});
}


// New Admission Page
exports.new = async(req,res)=>{
    const fitchdata= await setCourse.find({});
    console.log(fitchdata);  
   
   res.render('new-admission', { uid:"nodata",fitchdata});
}
  
// Opening Transfer  Page 
exports.transfer = async(req,res)=>{
    const fitchdata= await setCourse.find({});
    res.render('transfer-admission',{data:null,options:fitchdata});
 }


 // Opening Cancel Page
 exports.cancel = async(req,res)=>{
    res.render('cancel')
 }
 

 // Opening Reports Page
exports.report = async (req, res) => {
    const fitchdata= await setCourse.find({});
    res.render('reports',{options:fitchdata});
}
 

// Opening Powered_By Page
exports.Powered_by = async (req, res) => {
    res.render('Powered_by');
}
