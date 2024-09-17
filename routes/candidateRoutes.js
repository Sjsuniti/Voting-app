const express = require('express');
const router = express.Router();
const User = require('../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

const checkAdminRole= async(userId)=>{
    try{
        const user = await User.findById(userId);
        return user.role === 'admin';
    }catch(err){
        return false;
    }
}
//post route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) =>{
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(404).json({message: 'user has not admin role'});
        
        const data = req.body // Assuming the request body contains the person data

        // Create a new user document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');


        res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


router.put('/:candidateID',jwtAuthMiddleware, async (req, res)=>{
    
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(404).json({message: 'user has not admin role'});

        const candidateID = req.params.candidateID;
        const updateCandidateData = req.body;
        
        const reponse = await person.finallyIdAndUpdate(candidateID ,updateCandidateData,{
            new: true,
            runValidators: true,
        })
        if(!response){
            return res.status(404).json({error: 'candidate not found'});
        }
        
        console.log('Candidate data updated');
        res.status(200).json({ message: "Password Updated"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does hsve not admin role'});

        const candidateID = req.params.candidateID;
   
        const reponse = await person.findByIdAndUpdate(candidateID);
        if(!response){
            return res.status(404).json({error: 'candidate not found'});
        }
        
        console.log('Candidate deleted');
        res.status(200).json({ message: "Password Updated"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})



module.exports = router;

