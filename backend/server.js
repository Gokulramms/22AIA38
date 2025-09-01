const express=require("express");
const {save,get,exists}=require("./urlstore.js");
const {generateShortcode,isExpired,isoExpiry}=require("./util.js");
const logging=require("./LoggingMeddleware.js");
const app=express();
app.use(express.json());
app.use(logging);

app.post("/shorturls",(req,res)=>{
  try{
    const {url,validity=30,shortcode}=req.body;
    if(!url||typeof url!=="string") {
      return res.status(400).json({error:"Invalid or missing 'url' field"});
    }
    let code=shortcode||generateShortcode();
    if(exists(code)) {
      return res.status(409).json({error:"Shortcode already exists"});
    }
    const expiry=isoExpiry(validity);
    save(code,url,expiry);
    return res.status(201).json({shortLink:`http://localhost:3000/${code}`,expiry});
  }catch(err){
    return res.status(500).json({error:"Server error"});
  }
});

app.get("/:code",(req,res)=>{
  const code=req.params.code;
  const entry=get(code);
  if(!entry){

   return res.status(404).json({error:"Shortcode not found"});
  }
  if(isExpired(entry)) {
    return res.status(410).json({error:"Short link has expired"});
  }
  entry.clicks++;
  entry.stats.push({timestamp:new Date(),referrer:req.get("Referer")||"direct",ip:req.ip||"unknown"});
  return res.redirect(entry.url);
});

app.get("/shorturls/:code",(req,res)=>{
  const code=req.params.code;
  const entry=get(code);
  if(!entry){
   return res.status(404).json({error:"Shortcode not found"});
  }
  return res.json({originalUrl:entry.url,createdAt:entry.createdAt,expiry:entry.expiry,totalClicks:entry.clicks,clickDetails:entry.stats});
});

app.listen(3000,()=>console.log("Server running at http://localhost:3000"));
