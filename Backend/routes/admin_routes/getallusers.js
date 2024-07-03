const express = require('express');
const User = require('../../models/user');
const Room = require('../../models/room')
const Admin = require('../../models/admins');
const Attendance = require('../../models/attend');
const Complain = require('../../models/complains_model');
const Feedback = require('../../models/feedback')
const Token = require("../../models/stoken");
const router = express.Router()
const fetchadmin = require('../../middleware/fetchadmin')

router.get('/getallusers', fetchadmin,  async (req, res) => {
    let userId = req.user;
    const admin = await Admin.findById(userId)
    if(admin.role!='admin'){
        return res.status(401).json({message:"Access denied",response:false})
    }else{
        const rooms=await Room.find()
        rooms.sort((a, b) => a.room_no - b.room_no);
        const data=[]
        for(let i=0;i<rooms.length;i++){
            let admin = await User.findById(rooms[i].user)
            const oneDay = 24 * 60 * 60 * 1000; // Hours * Minutes * Seconds * Milliseconds
            const firstDate = new Date(admin.date);
            const secondDate = new Date();
            const diffInMillis = Math.abs(secondDate - firstDate);
            const totalDays = Math.ceil(diffInMillis / oneDay);
            const attendance = await Attendance.find({ user: `${admin._id.toString()}`})
            const percent = (attendance.length/totalDays)*100;
         
            data.push({room_no:rooms[i].room_no,name:rooms[i].name,email:admin.email,mobile:admin.mobile,percent:percent})
        }
        
        
        // const users=await User.find().select("-password")
        // console.log(users)
        res.json({response:true,data:data})
    }

  })

router.get('/allcomplains', fetchadmin,  async (req, res) => {
    let userId = req.user;
    const admin = await Admin.findById(userId)
    if(admin.role!='admin'){
        return res.status(401).json({message:"Access denied",response:false})
    }else{
        try {
            const allcomps = await Complain.find({status:"Pending"})
            res.json({allcomps:allcomps,complains_length:allcomps.length,response:true})
        } catch (error) {
          console.log(error)
            res.status(500).json({ message:'server error',response:false})
        }
    }

  })
router.get('/getallpasses', fetchadmin,  async (req, res) => {
  
        try {
            const allpasses = await Token.find()
            
            res.json({allpasses:allpasses,allpasses_length:allpasses.length,response:true})
        } catch (error) {
          console.log(error)
            res.status(500).json({ message:'server error',response:false})
        }
    

  })

  router.get('/allfeedback', fetchadmin,  async (req, res) => {
    let userId = req.user;
    const admin = await Admin.findById(userId)
    if(admin.role!='admin'){
        return res.status(401).json({message:"Access denied",response:false})
    }else{
        try {
            const allfeedback = await Feedback.find()
            res.json({allfeedback:allfeedback,feedback_length:allfeedback.length,response:true})
        } catch (error) {
          console.log(error)
            res.status(500).json({ message:'server error',response:false})
        }
    }

  })

  router.get('/allanalytics', fetchadmin,  async (req, res) => {
    let userId = req.user;
    const admin = await Admin.findById(userId)
    if(admin.role!='admin'){
        return res.status(401).json({message:"Access denied",response:false})
    }else{
        try {
          const allcomps = await Complain.find({status:"Pending"})
          let start = new Date();
          start.setHours(0, 0, 0, 0);
          let end = new Date(start);
          end.setDate(start.getDate() + 1);
          const allpasses = await Token.find({
            date: {
              $gte: start,
              $lt: end
            }
          })
          const pendingAttendance = [];
          const rooms=await Room.find();
          for(let i=0;i<rooms.length;i++){
            const attendance = await Attendance.find({ room_no: rooms[i].room_no })
            if (attendance.length === 0) pendingAttendance.push(rooms[i])
          }
          res.json({allcomps:allcomps.length,
            allpasses:allpasses.length,
            rooms:60-rooms.length,
            attendance:pendingAttendance.length,
            response:true})
        } catch (error) {
          console.log(error)
            res.status(500).json({ message:'server error',response:false})
        }
    }

  })


module.exports=router