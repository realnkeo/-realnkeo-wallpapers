// REALNKEO payment server (Node.js + Express)
// 1) npm install
// 2) copy .env.example to .env and add your Razorpay keys
// 3) npm start

const express=require("express"),path=require("path"),crypto=require("crypto"),Razorpay=require("razorpay");
require("dotenv").config();

const app=express();
app.use(express.json());
app.use(express.static(__dirname));

const catalog={1:{name:"Pink Coastal Dream",price:29},2:{name:"Cyber Warrior",price:49},3:{name:"Purple Dream",price:39},4:{name:"Anime Night",price:49},5:{name:"Moon Forest",price:29},6:{name:"Neon Battle",price:59},7:{name:"Sakura Sky",price:39},8:{name:"Cosmic Earth",price:49},9:{name:"Dark Gaming Pack",price:99}};

const razorpay=process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET?new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET}):null;

app.post("/api/create-order",async(req,res)=>{
  try{
    if(!razorpay)return res.status(503).json({error:"Razorpay keys are not configured"});
    const ids=req.body.items||[];
    const amount=ids.reduce((s,id)=>s+(catalog[id]?.price||0),0)*100;
    if(!amount)return res.status(400).json({error:"Invalid cart"});
    const order=await razorpay.orders.create({amount,currency:"INR",receipt:"rn_"+Date.now(),notes:{email:req.body.email||""}});
    res.json({id:order.id,amount:order.amount,key:process.env.RAZORPAY_KEY_ID});
  }catch(e){res.status(500).json({error:e.message})}
});

app.post("/api/verify-payment",(req,res)=>{
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
  const body=razorpay_order_id+"|"+razorpay_payment_id;
  const expected=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
  if(expected!==razorpay_signature)return res.status(400).json({success:false});
  res.json({success:true,downloadUrl:"/thank-you.html"});
});

app.listen(process.env.PORT||3000,()=>console.log("REALNKEO store running"));
