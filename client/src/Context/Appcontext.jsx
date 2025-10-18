import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext=createContext();

export const AppContextProvider=(props)=>{
    axios.defaults.withCredentials=true;
    // const backendurl=import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const backendurl='http://localhost:4000';
    const [isloggedin,setisloggedin]=useState(false);
    const [userdata,setuserdata]=useState(false);

    const getauthstate=async()=>{
        try {
            const {data}=await axios.get(backendurl+'/api/auth/isauthenticated');
            if(data.success){
                setisloggedin(true);
                getuserdata();
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const getuserdata=async ()=>{
        try{
            const {data}=await axios.get(backendurl+'/api/user/data');
            data.success ? setuserdata(data.userdata) : toast.error(data.message);
        }catch(error){
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        getauthstate();
    },[]);
    //this-> [] is showing the dependency array
    const value={
        backendurl,
        isloggedin,setisloggedin,
        userdata,setuserdata,
        getuserdata
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}