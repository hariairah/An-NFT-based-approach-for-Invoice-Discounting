


const express =require('express');
const mysql=require('mysql')
const bcrypt = require('bcrypt');
const bodyparser=require('body-parser')
const saltRounds = 10;
const cors=require('cors');
let username=''
let wallet=''
let flag=false


const app=express()
const port=3001
app.use(
  cors({
      origin:'*',
      methods:'*',
      methodsallowHeader:'Content-Type,Authorization',
      credentials:true,
      optionsSuccessStatus:200
  })
)
app.use(bodyparser.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '!Wonder569',
    database: 'login',
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
  });





  app.post('/storeData/',(req,res) =>{
    const {data}=req.body;
    const sql='INSERT INTO verify (username,password,wallet) VALUES(?,?,?)';
    let password=data.password
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.error('Error generating salt:', err);
        res.status(500).send(err.message);
        return;
      }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        res.status(500).send(err.message);
        return;
      }
  
    console.log('Hashed Password:', hash)
    const values=[data.username,hash,data.wallet]
    db.query(sql,values,(err,result) =>{
        if(err)
        {
        console.error('Error storing data: ' + err.message);
        res.status(500).send(err.message);
        return;
        }

    console.log('Data stored successfully');
    res.status(200).send('Data stored successfully');
    })
})
    })
  })


  app.post('/retriveData/',(req,res)=>{
    const {data}=req.body
    let sql='SELECT * FROM verify where username=?';
    db.query(sql,[data.username],(err,result) =>{
      if(err)
      {
        console.log("Error in retriving data"+err.message);
        res.status(500).send(err.message);
        return;
      }
      else{
        console.log("row",result)
        if(result.length===0)
        res.status(500).send("no entry found")
        else
        {
          bcrypt.compare(data.password, result[0].password, function(err, r) {
            if(err)
            {
              console.log(err)
              res.status(500).send("Error in comparing hashes")
              return;
            }
            if (r) {

                res.status(200).send(result[0].wallet)
            }
            else
            {
              res.status(500).send('Wrong password')
            }
        });
        }
      }
    })
  })

app.post('/setCredentials/',(req,res)=>{
  username=req.body.data.username
  flag=true
  res.status(200).send("Username Set")
  console.log(username)
})

app.post('/getCredentials/',(req,res)=>{
  if(flag)
  {
  let sql="select * from verify where username=?";
  db.query(sql,username,(err,result) =>{
    if(err)
    {
      console.log("Error in retriving data"+err.message);
      res.status(500).send(err.message);
      return;
    }
    else{
      console.log(result[0].wallet)
      wallet=result[0].wallet
    }
    res.status(200).send({username:username,wallet:wallet,flag:flag})
  })
}
  else
  res.status(200).send({flag:flag})
})

app.post('/changeusername/',(req,res)=>{
  flag=false
  let u=req.body.data.username
  console.log(u)
  let sql='UPDATE verify set username=? where username=?';
  db.query(sql,[u,username],(err,result)=>{
    if(err)
    {
      console.log("Error in retriving data"+err.message);
      res.status(500).send(err.message);
      return;
    }
    else
    {
      username=u
    res.status(200).send("Username Changed")
    }
  })
})


app.post('/changewallet/',(req,res)=>{
  flag=false
  let u=req.body.data.wallet
  console.log(u)
  let sql='UPDATE verify set wallet=? where username=?';
  db.query(sql,[u,username],(err,result)=>{
    if(err)
    {
      console.log("Error in retriving data"+err.message);
      res.status(500).send(err.message);
      return;
    }
    else
    {
      wallet=u
    res.status(200).send("Wallet address  Changed")
    }
  })
})

app.post('/changepassword/',(req,res)=>{
  flag=false
  let password=req.body.data.password
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      res.status(500).send(err.message);
      return;
    }
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send(err.message);
      return;
    }
  let sql='UPDATE verify set password=? where username=?';
  db.query(sql,[hash,username],(err,result)=>{
    if(err)
    {
      console.log("Error in retriving data"+err.message);
      res.status(500).send(err.message);
      return;
    }
    else
    {
    res.status(200).send("Password Changed")
    }
  })
})
  })
})

app.post('/logout/',(req,res)=>{
  console.log("hi")
  flag=false
  username=''
  wallet=''
  res.status(200).send({flag:flag})
})
app.listen(port,() =>{
    console.log("Server is running at",{port});
})
