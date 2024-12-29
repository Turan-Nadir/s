const express = require("express");
const router = express.Router();
const Word = require("../models/Word");
const jwt = require("jsonwebtoken");
require('dotenv').config();

router.get('/', async (req,res)=>{
    res.send("Wassup boy!");
});

router.post('/signin', async (req,res)=>{
    const {password, username} = req.body;
    try {
        if(password!==process.env.pass || username!==process.env.user) return res.status(403).json({message:"wrong credentials"});
        const user = jwt.sign({id:username}, process.env.SAUCE, {expiresIn:'5h'});
        const words = await Word.find();
        res.status(201).json({token:user, words}); 
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"error happened while signin in"});
    }
});

router.post('/word', async (req,res)=>{
    const {word, translation, definition, type, category, examples, image, timestamp, token} = req.body;
    try {
        const check = jwt.verify(token, process.env.SAUCE);
        let date;
        if(timestamp) date = timestamp;
        if(!check.id) return res.status(403).json({message:"missing token"});
        if(!word || !translation ||!definition || !examples || !type ) return res.status(403).json({message:'important credential is missing'});
        const newWord = new Word({
            word,
            translation,
            definition,
            type,
            examples,
            category,
            image,
            date
        });
        await newWord.save();
        res.status(201).json(newWord);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Something happened while saving word'});
    }
})
router.delete('/word', async(req,res)=>{
    const {id, token} = req.body;
    try {
        const check = jwt.verify(token, process.env.SAUCE);
        if(!check.id) return res.status(403).json({message:"missing token"});
        if(!id) return res.status(403).json({message:"word id is missing"});
        await Word.findByIdAndDelete(id);
        res.status(201).json({message:"delete success"});
    } catch (error) {
       console.error(error);
       res.status(500).json({message:"error happened while deleting word"}); 
    }
});

module.exports = router;