const express = require('express');
const fs= require('fs');
const PORT = process.env.PORT || 3000;
const path = require('path');
const app = express();
const notes = require('./db/db.json');
const uuid= require('uuid');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
//Request to get the notes
app.get('/api/notes',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"error",
            })
        } else {
            res.status(200).json(notes);
        }
    })
})
//Creates a request to save the note
app.post('/api/notes',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"error",
            })
        } else {  
            const dataArr = require('./db/db.json');
            req.body.id =uuid.v4();
            dataArr.push(req.body);
            fs.writeFile("./db/db.json",JSON.stringify(dataArr,null,4),(err)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        msg:"error"
                    });
                }else {
                    res.json({
                      msg: "note added",
                    });
                }
            });
        }
    });
});
//port location for the sever
app.listen(PORT, () => {
    console.log(`Hosted on PORT: ${PORT}!`);
});