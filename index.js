const connectToMongo=require('./db');
const express = require('express');
const Url = require("./data");
var cors = require('cors')
const shortid = require('shortid')


connectToMongo();

const app = express();
const port = 4000
app.use(cors());
app.use(express.json());;

app.post("/",(req,res)=>{
   
    async function saveurl() {

// generate a short id (hash for url)
const hash = shortid.generate()

// save the url and hash in db in given format
        const url = new Url({
            name : req.body.name,
            hash : hash,
            
        });
        try {
            const Url = await url.save();
            const out = "/littleone/"+url.hash;
            const data = ({ url: out});
            res.json({ data });
        }
        catch (err) {
            res.status(500).json({error: "Internal server error occured"});
        }
    }
    saveurl();


});

app.get("/littleone/:hash",(req,res)=>{
   
    async function redirect() {

    // to verify url needed exist or not
    const url = await Url.findOne({ hash: req.params.hash });
    if (!url) { return res.status(404).send("NOT FOUND") };

    const data = ({ url});
    
            try {
                res.redirect(302, url.name);
              } catch (err) {
                console.error('Error occurred:', err);
              }
    
    }
    redirect();

});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })