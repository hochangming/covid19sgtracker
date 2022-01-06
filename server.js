const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
 

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    user: "b3fe13c64285ba",
    host: "us-cdbr-east-05.cleardb.net",
    password: "244bfd54",  
    database:"heroku_b4fd74cd2e14ae5"
}) 
//mysql://b3fe13c64285ba:244bfd54@us-cdbr-east-05.cleardb.net/heroku_b4fd74cd2e14ae5?reconnect=true

//mysql://b3fe13c64285ba:244bfd54@us-cdbr-east-05.cleardb.net/heroku_b4fd74cd2e14ae5?reconnect=true
app.post('/create',(req,res)=>{
  const pr_date = req.body.pr_date;
  const age_group = req.body.age_group;
  const count_of_case = req.body.count_of_case;

    db.query("INSERT INTO covtracker (pr_date,age_group,count_of_case,temp) VALUES (?,?,?,?)",[pr_date,age_group,count_of_case,JSON.stringify(pr_date + age_group)],
    (err,result)=>{
        if(err)
            console.log(err);
        else
            res.send("values inserted")
    }
    ) 
      
}) 
app.delete('/create', (req,res)=>{ 
    db.query("DELETE FROM covtracker",
    (err,result)=>{
        if(err)
            console.log(err);
        else
            res.send("values deleted")
    }
    ) 
})
app.get('/archive/:id',(req,res)=>{
    const id = req.params.id;
    // console.log(id);
    db.query("SELECT pr_date, count_of_case FROM covtracker WHERE pr_date = ?", id, (err,result)=>{
        if(err)
            console.log(err);
        else{
            console.log(result);
            res.send(result);
        }
    })
}) 
app.listen(process.env.PORT || 3001,()=>{
    console.log("server running on port 3001");
})
// app.listen(3001,()=>{
//     console.log("server running on port 3001");
// }) 