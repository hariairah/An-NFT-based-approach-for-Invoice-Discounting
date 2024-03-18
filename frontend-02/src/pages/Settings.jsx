import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import './Settings.css'
import {useNavigate} from 'react-router-dom'
function Settings() {
const[user,setUser]=useState('User')
const[flag111,setFlag111]=useState(true)
const[flag222,setFlag222]=useState(false)
const[flag333,setFlag333]=useState(false)
const[flag444,setFlag444]=useState(false)
const[wallet,setWallet]=useState()
const[newuser,setNewuser]=useState()
const[newwal,setNewwal]=useState()
const[newp,setNewp]=useState()
const[p,setP]=useState(false)
const[p1,setP1]=useState(false)
const[p2,setP2]=useState(false)
const[p3,setP3]=useState(false)
const[p4,setP4]=useState(false)
const navigate=useNavigate()
const call=async() =>{
  setFlag111(false)
  const response=await axios.post('http://localhost:3001/getCredentials/')
  console.log(typeof response.data.flag)
  if(!response.data.flag)
  navigate('/home')
  setWallet(response.data.wallet)
  setUser(response.data.username)
}
const handle=async(event) =>{
setNewwal(event.target.value)
}
const handle1=async(event) =>{
setNewuser(event.target.value)
}
const handle2=async(event) =>{
setNewp(event.target.value)
}
const cwal=async()=>{
  console.log(newwal)
  try{
    const response=await axios.post('http://localhost:3001/changewallet/',{data:{wallet:newwal}})
    console.log(response.data)
    setP2(true)
    }
    catch(error)
    {
      console.log(error)
  
    }
  setFlag222(false)
}
const cuser=async()=>{
  console.log(newuser)
  try{
  const response=await axios.post('http://localhost:3001/changeusername/',{data:{username:newuser}})
  console.log(response.data)
  setP(true)
  }
  catch(error)
  {
    console.log(error)
    const e=error.response.data.substring(0,12)
    console.error("error",e)
    if(e==="ER_DUP_ENTRY")
    {
    console.log("This username is already in use ,Kindly use a different username")
    setP1(true)
    }

  }
  setFlag333(false)
}
const cp=async()=>{
  console.log(newp)
  try{
    const response=await axios.post('http://localhost:3001/changepassword/',{data:{password:newp}})
    console.log(response.data)
    setP3(true)
    }
    catch(error)
    {
      console.log(error)
  
    }
  setFlag444(false)
}
const redirect=async() =>{
  setP(false)
  navigate('/home')
}
const redirect1=async() =>{
  setP1(false)
}
const redirect2=async() =>{
  setP2(false)
  navigate('/home')
}
const redirect3=async() =>{
  setP3(false)
  navigate('/home')
}
const logout=() =>{
  setP4(true)
}
const clogout=async()=>{
  try{
    const r=await axios.post('http://localhost:3001/logout/')
    console.log("flag",r.data.flag)
    navigate('/home')
  }
  catch(error)
  {
    console.log(error)
  }

}
if(flag111)
call()
  return (
    <div>
    <h1 className='hd' id="hdd">SETTINGS</h1>
    <button className='hd' id="bt" onClick={logout}>Logout</button>
    <div className='setting'>
      <h1 className='hd1'>Hi,{user}</h1>
    <table>
      <tr className='rw'>
        <td>Username</td>
        <td>:{user}</td>
        <td><button onClick={()=>{setFlag333(true)}} className='yes'>Edit Username</button></td>
      </tr>
      <tr className='rw'>
    <td>Wallet</td>
    <td>:{wallet}</td>
    <td><button onClick={()=>{setFlag222(true)}} className='yes'>Edit Wallet Address</button></td>
    </tr>
    </table>
    <button onClick={()=>{setFlag444(true)}} className='yes33'>Change Password</button>
    {flag222 && <div className='pop'>
      <div className='pop_inner'>
      <h3>Enter the new Wallet Address</h3>
      <input type='text' onChange={handle}/>
      <button onClick={cwal} className='yes'>Submit</button>
      </div>
      </div>}
      {flag333 && <div className='pop'>
      <div className='pop_inner'>
      <h3>Enter the new Username</h3>
      <input type='text' onChange={handle1}/>
      <button onClick={cuser} className='yes'>Submit</button>
      </div>
      </div>}
      {flag444 && <div className='pop'>
      <div className='pop_inner'>
      <h3>Enter the new Password</h3>
      <input type='text' onChange={handle2}/>
      <button onClick={cp} className='yes'>Submit</button>
      </div>
      </div>}
      {p && <div className='pop'>
      <div className='pop_inner'>
      <h3>Changed Username Successfully</h3>
      <h3>You will be redirected to the home Page</h3>
      <h3>Kindly Re-Login to use the website</h3>
      <button onClick={redirect} className='yes'>Ok</button>
      </div>
      </div>}
      {p1 && <div className='pop'>
      <div className='pop_inner'>
      <h3>This username is already in Use kindly use a different name</h3>
      <button onClick={redirect1} className='yes'>Ok</button>
      </div>
      </div>}
      {p2 && <div className='pop'>
      <div className='pop_inner'>
      <h3>Changed Wallet Address Successfully</h3>
      <h3>You will be redirected to the home Page</h3>
      <h3>Kindly Re-Login to use the website</h3>
      <button onClick={redirect2} className='yes'>Ok</button>
      </div>
      </div>}
      {p3 && <div className='pop'>
      <div className='pop_inner'>
      <h3>Changed Password Successfully</h3>
      <h3>You will be redirected to the home Page</h3>
      <h3>Kindly Re-Login to use the website</h3>
      <button onClick={redirect3} className='yes'>Ok</button>
      </div>
      </div>}
      {p4 && <div className='pop'>
      <div className='pop_inner'>
      <h3>Are you sure you want to logout?</h3>
      <button onClick={clogout} className='yes'>Yes</button>
      <button onClick={()=>{setP4(false)}} className='yes'>No</button>
      </div>
      </div>}
    </div>
    </div>
  )
}

export default Settings
