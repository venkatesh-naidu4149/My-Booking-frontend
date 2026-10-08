import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
export default function UserDashboard(){
 const nav=useNavigate(); const [name,setName]=useState(""); const [details,setDetails]=useState(null); const [all,setAll]=useState([]);
 const logout=()=>{localStorage.clear();nav("/")};
 const get=async()=>{try{const r=await axios.get(`http://localhost:8080/getdata?username=${name}`);setDetails(r.data)}catch(e){alert(e.response?.data||"Unable to fetch details")}};
 const getAll=async()=>{try{const r=await axios.get("http://localhost:8080/getalldata");setAll(r.data)}catch(e){alert(e.response?.data||"Unable to fetch data")}};
 return <div className="account-page"><header className="account-head"><Link className="brand" to="/"><span className="brand-mark">MB</span>My Booking</Link><button onClick={logout}>Logout</button></header><main className="account-main"><div className="profile-card"><div className="avatar">{(localStorage.getItem("uname")||"U")[0].toUpperCase()}</div><div><h1>Welcome, {localStorage.getItem("uname")||"User"}</h1><p>Manage your My Booking account</p></div></div><div className="account-actions"><Link to="/update">Update Password</Link><Link to="/del">Delete Account</Link></div><section className="admin-box"><h2>Account / Data</h2><div className="inline-form"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter username"/><button onClick={get}>Get Details</button><button onClick={getAll}>Get All Data</button></div>{details&&<div className="result"><b>{details.username}</b><span>{details.email}</span></div>}{all.map((u,i)=><div className="result" key={i}><b>{u.username}</b><span>{u.email}</span></div>)}</section></main></div>
}
