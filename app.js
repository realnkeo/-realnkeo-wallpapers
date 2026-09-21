const products=[
{id:1,name:"Pink Coastal Dream",cat:"mobile",price:29,tag:"Mobile • Vertical",image:"IMG_3979.JPG",c1:"#f6a7d5",c2:"#6b86c9"},
{id:2,name:"Cyber Warrior",cat:"gaming",price:49,tag:"4K • PC / Mobile",c1:"#bd7cff",c2:"#21103a"},
{id:3,name:"Purple Dream",cat:"mobile",price:39,tag:"4K • Mobile",c1:"#e4a4ff",c2:"#32165b"},
{id:4,name:"Anime Night",cat:"anime",price:49,tag:"4K • PC / Mobile",c1:"#7bd6ff",c2:"#101d3a"},
{id:5,name:"Moon Forest",cat:"nature",price:29,tag:"4K • Mobile",c1:"#8cffd0",c2:"#102f2a"},
{id:6,name:"Neon Battle",cat:"gaming",price:59,tag:"8K • PC",c1:"#ff5bd8",c2:"#36102e"},
{id:7,name:"Sakura Sky",cat:"anime",price:39,tag:"4K • Mobile",c1:"#ffb5e6",c2:"#3d1738"},
{id:8,name:"Cosmic Earth",cat:"nature",price:49,tag:"4K • PC / Mobile",c1:"#70a7ff",c2:"#111b3c"},
{id:9,name:"Dark Gaming Pack",cat:"gaming",price:99,tag:"10 Wallpapers",c1:"#ff6b6b",c2:"#331314"}];
let cart=[];
function render(){let f=document.querySelector("#filter").value;let list=f==="all"?products:products.filter(p=>p.cat===f);document.querySelector("#products").innerHTML=list.map(p=>`<article class="product"><div class="visual" style="--c1:${p.c1};--c2:${p.c2};${p.image?`background-image:url('${p.image}');background-size:cover;background-position:center;`:''}"><b>${p.name}</b></div><div class="info"><h3>${p.name}</h3><div class="meta">${p.tag}</div><div class="row"><span class="price">₹${p.price}</span><button class="add" onclick="add(${p.id})">Add</button></div></div></article>`).join("")}
function pick(v){document.querySelector("#filter").value=v;render();document.querySelector("#shop").scrollIntoView({behavior:"smooth"})}
function add(id){if(!cart.find(x=>x.id===id))cart.push(products.find(x=>x.id===id));update();openCart()}
function update(){document.querySelector("#count").textContent=cart.length;document.querySelector("#items").innerHTML=cart.length?cart.map(p=>`<div class="line"><span>${p.name}</span><b>₹${p.price}</b></div>`).join(""):"<p style='color:#888'>Cart is empty.</p>";document.querySelector("#total").textContent="₹"+cart.reduce((a,p)=>a+p.price,0)}
function openCart(){document.querySelector("#modal").classList.remove("hidden");update()}
function closeCart(){document.querySelector("#modal").classList.add("hidden")}
async function pay(){
 const email=document.querySelector("#email").value.trim();
 if(!email||!email.includes("@")) return alert("Please enter a valid email.");
 if(!cart.length) return alert("Your cart is empty.");
 try{
  const res=await fetch("/api/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart.map(p=>p.id),email})});
  const order=await res.json(); if(!res.ok) throw new Error(order.error||"Order creation failed");
  const rzp=new Razorpay({key:order.key,amount:order.amount,currency:"INR",name:"REALNKEO",description:"Wallpaper purchase",order_id:order.id,prefill:{email},handler:async function(resp){
    const v=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(resp)});
    const out=await v.json(); if(out.success) window.location.href=out.downloadUrl; else alert("Payment verification failed.");
  }});
  rzp.open();
 }catch(e){alert("Payment setup is not connected yet. Add Razorpay keys to the server.");}
}
render();
