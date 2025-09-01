const express=require("express");
const jwt=require("jsonwebtoken");
const logging=require("./LoggingMeddleware.js");
const auth=require("./authMiddleware");

const app=express();
app.use(express.json());
app.use(logging);


app.get("/one",(req,res)=>res.json({numbers:[1,2,3,4]}));
app.get("/two",(req, res)=>res.json({numbers:[3,4,5,6]}));
app.get("/three",(req,res)=>res.json({numbers:[6,7,8,9]}));

app.get("/numbers",async(req,res)=> {
  try{
    const urls=[].concat(req.query.url||[]);
    let nums=[];

    for(let u of urls){
      const r=await fetch(u);
      const d=await r.json();
      nums.push(...(d.numbers||[]));
    }
    res.json({numbers:[...new Set(nums)].sort((a,b)=>a-b)});
  } catch{
    res.status(500).json({error:"Failed to fetch"});
  }
});

const store={};
app.post("/shorten",(req,res)=>{
  const id=Math.random().toString(36).slice(2, 8);
  store[id] ={url:req.body.url,count:0};
  res.json({shortUrl:`http://localhost:3000/${id}`});
});
app.get("/:id",(req,res)=>{
  const item=store[req.params.id];
  if (!item) return res.status(404).json({error:"Not found"});
  item.count++;
  res.json({url: item.url,count:item.count });
});

app.post("/login",(req,res)=>{
  const token=jwt.sign({user:req.body.user},"secret",{expiresIn:"1h"});
  res.json({token});
});

app.get("/secure",auth,(req,res)=>{
  res.json({ msg:"You accessed secure data",user:req.user});
});

app.listen(3000,()=>console.log("Server running on 3000"));
