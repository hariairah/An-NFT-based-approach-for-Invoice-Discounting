import './Authentication.css';
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
function Authentication() {
const[array,setArray]=useState({username:"",password:"",cpassword:"",wallet:""})
const[flag,setFlag]=useState(false)
const[flag1,setFlag1]=useState(false)
const[flag2,setFlag2]=useState(false)
const[flag3,setFlag3]=useState(false)
const [p1,setP1]=useState({top:200,left:400})
const [p2,setP2]=useState({top:200,left:791})
const[t1,setT1]=useState(true)
const[t2,setT2]=useState(true)
const[array1,setArray1]=useState({username:"",password:""})
const[flag0,setFlag0]=useState(false)
const[flag11,setFlag11]=useState(false)
const[flag22,setFlag22]=useState(false)
const[flag33,setFlag33]=useState(false)
const[flag44,setFlag44]=useState(false)
const[t3,setT3]=useState(false)
const[t4,setT4]=useState(false)
const navigate=useNavigate()

const handleChange1=(e) =>{
  setArray1({...array1,[e.target.name]:e.target.value})
}
const consent=() =>{
  setFlag0(false)
}
const send_credentials=async(user) =>{
  try{
  const response=await axios.post('http://localhost:3001/setCredentials/',{data:{username:user}})
  console.log(response.data)
  }
  catch(error){
    console.log(error)
  }
}
const call=async(wal) =>{
  if(window.ethereum)
  {
      window.ethereum.request({method:"eth_requestAccounts"})
      .then(result =>{
          let wallet=result[0].toUpperCase();
          console.log("metamsk",wallet)
          console.log("entered",wal)
          if(wallet===wal)
          {
            send_credentials(array1.username)
          setFlag44(true)
          }
          else
          setFlag33(true)
      })
  }
  else{
      setFlag22(true)
  }
}
const submit=async(e) =>{
  e.preventDefault();
  console.log(array1)
  try{
      const response=await axios.post('http://localhost:3001/retriveData/',{data:array1});
      console.log(response.data)
      let wal=response.data
      call(wal.toUpperCase())
  }
  catch(error){
      console.log(error.response.data)
      if(error.response.data==="no entry found")
          setFlag0(true)
      else if(error.response.data==="Wrong password")
      setFlag11(true)
  }
}

    const handleChange=(e) =>{
        setArray({...array,[e.target.name]:e.target.value})
    }
    const click=() =>{
        setFlag(false)
    }
    const store=async(e) =>{
        e.preventDefault();
        console.log("hi")
        if(array.password!==array.cpassword)
        {
        setFlag3(true)
        }
    else
    {
        try{
            console.log("fff")
            const response=await axios.post('http://localhost:3001/storeData/',{data:{username:array.username,password:array.password,wallet:array.wallet}});
            console.log(response)
            if(response.status===200)
            {
            console.log("Sign Up completed Successfully")
            setFlag(true)
            }
                
        }catch(error){
            const e=error.response.data.substring(0,12)
            console.error("error",e)
            if(e==="ER_DUP_ENTRY")
            {
            console.log("This username is already in use ,Kindly use a different username")
            setFlag1(true)
            }
            else
            {
            console.log("Internal Server Error")
            setFlag2(true)
            }
        }
    }
    }
  const change1=() =>{
    setP1({top:200,left:791})
    setP2({top:200,left:400})
    setT1(false)
    setT2(false)
    setT3(true)
    setT4(true)
  }
  const change2=() =>{
    setP1({top:200,left:400})
    setP2({top:200,left:791})
    setT1(true)
    setT2(true)
    setT3(false)
    setT4(false)
  }
  return (
    <div>
      <div className="box" id="white"  style={{position:"absolute",top:`${p1.top}px`,left:`${p1.left}px`}}>
        {t1 && <div className="div1">
          <h2>Sign Up</h2><br/>
          <form onSubmit={store}>
            <table>
            <tr>
            <td><input type="text" name="username" placeholder="username" onChange={handleChange}/><br/></td>
            </tr>
            <tr>
            <td><input type="password" name="password" onChange={handleChange} placeholder='password'/><br/></td>
            </tr>
            <tr>
            <td><input type="password" name="cpassword" onChange={handleChange} placeholder='confirm password'/><br/></td>
            </tr>
            <tr>
            <td><input type="text" name="wallet" onChange={handleChange} placeholder='Wallet'/></td>
            </tr>
            <button type="submit" className='yes1'>Sign Up</button>
            </table>
            </form>
            </div>}
        {t3 &&<div className='div1'>
          <h2>Log In</h2>
          <form onSubmit={submit}>
            <table>
              <tr>
            <td><input type="text" name="username" onChange={handleChange1} placeholder='username'/><br/></td>
            </tr>
            <tr>
            <td><input type="password" name="password"  onChange={handleChange1} placeholder='password'/><br/></td>
            </tr>
            </table>
            <button type="submit" className='yes1'>Login</button>
        </form>
        </div>}
        </div>
        <div className="box" id="purple" style={{position:"absolute",top:`${p2.top}px`,left:`${p2.left}px`}}>
        {t2 && <div className='div2'>
          <h2>Hello,</h2><br/>
          <h3>Already have an account?</h3><br/>
          <h3>Log In to start this journey</h3><br/>
          <button className='yes2' onClick={change1}>Log In</button>
          </div>}
          {t4 && <div className='div2'>
            <h2>Welcome,</h2><br/>
            <h3>Don't have an account?</h3><br/>
            <h3>Sign Up to continue</h3><br/>
            <button className='yes2' onClick={change2}>Sign Up</button>
          </div>}
      </div>
        {flag && <div className="pop1">
                <div className="pop_inner1">
                <h2>Sign In Successful</h2>
                <h2>Now Kindly Login using the same credentials</h2>
                <button className="yes2" onClick={click}>Ok</button>
                </div>
                </div>}
            {flag1 && <div className="pop1">
                <div className="pop_inner1">
            <h2>This username is already in use ,Kindly use a different username</h2>
            <button className="yes2" onClick={()=>{setFlag1(false)}}>Ok</button>
            </div>
            </div>}
            {flag2 && <div className="pop1">
                <div className="pop_inner1">
            <h2>Internal Server Error</h2>
            <button className="yes2" onClick={()=>{setFlag2(false)}}>Ok</button>
            </div>
            </div>}
            {flag3 && <div className="pop1">
                <div className="pop_inner1">
            <h2>Password and Confirm Password are not the same</h2>
            <button className="yes2" onClick={()=>{setFlag3(false)}}>Ok</button>
            </div>
            </div>}
        {flag0 && <div className="pop1">
            <div className="pop_inner1">
            <h2>No such username exists.Please Signup before Logging In</h2>
            <button onClick={consent} className='yes2'>Ok</button>
            </div>
            </div>}
        {flag11 && <div className="pop1">
            <div className="pop_inner1">
            <h2>Wrong Password</h2>
            <button onClick={() =>{setFlag11(false)}} className='yes2'>Ok</button>
            </div>
            </div>}
        {flag22 && <div className="pop1">
            <div className="pop_inner1">
            <h2>Please Install Metamask to proceed further</h2>
            <button onClick={() =>{setFlag22(false)}} className='yes2'>Ok</button>
            </div>
            </div>}
        {flag33 && <div className="pop1">
            <div className="pop_inner1">
            <h2>Wallet address is not found on Metamask</h2>
            <button onClick={() =>{setFlag33(false)}} className='yes2'>Ok</button>
            </div>
            </div>}
        {flag44 && <div className="pop1">
            <div className="pop_inner1">
            <h2>Login Successful</h2>
            <button onClick={() =>{setFlag44(false);navigate('/main-app/')}} className='yes2'>Ok</button>
            </div>
            </div>}
    </div>
  );
}

export default Authentication;
