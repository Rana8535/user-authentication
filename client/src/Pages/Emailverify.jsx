import React, { useContext, useEffect } from 'react'

import { assets } from '../assets/assets'
import { AppContext } from '../Context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Emailverify = () => {
  axios.defaults.withCredentials=true;
  const {backendurl,isloggedin,userdata,getuserdata}= useContext(AppContext);
  const navigate=useNavigate();

  const inputrefs=React.useRef([]);
  const handleinput=(e,index)=>{
    if(e.target.value.length>0 && index<inputrefs.current.length-1){
      inputrefs.current[index+1].focus();
    }
  }
  const handlekeydown=(e,index)=>{
    if(e.key==='Backspace' && e.target.value==='' && index>0){
      inputrefs.current[index-1].focus();
    }
  }
  const handlepaste=(e)=>{
    const paste=e.clipboardData.getData('text');
    const pastearray=paste.split("");
    pastearray.forEach((char,index) => {
      if(inputrefs.current[index]){
        inputrefs.current[index].value=char;
      }
    });
  }

  const onsubmithandler= async (e)=>{
    try {
      e.preventDefault();
      const otparray=inputrefs.current.map(e=>e.value);
      const otp=otparray.join('');
      const {data}=await axios.post(backendurl+'/api/auth/verifyaccount',{otp});
      if(data.success){
        toast.success(data.message);
        getuserdata();
        navigate('/');
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(()=>{
    isloggedin && userdata && userdata.isaccountverified && navigate('/');
  },[isloggedin,userdata])

  return (
    <div className='flex  items-center justify-center min-h-screen 
    bg-gradient-to-br from-blue-200 to bg-purple-400'>
      <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 
      sm:w-32 cursor-pointer' />
      <form onSubmit={onsubmithandler} className='bg-slate-900 p-8 rounded-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify Otp</h1>
        <p  className='text-center mb-6 text-indigo-300'>Enter The 6-digit code sent to your mail</p>
        <div className='flex justify-between mb-8' onPaste={handlepaste}>
          {
            Array(6).fill(0).map((_,index)=>(
              <input type="text" maxLength='1' key={index} required 
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
              ref={e=>inputrefs.current[index]=e}
              onInput={(e)=>handleinput(e,index)}
              onKeyDown={(e)=>handlekeydown(e,index)}
              />
              
            ))
          }
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900
        text-white rounded-full'>Verify Email</button>
      </form>
      
    </div>
  )
}

export default Emailverify