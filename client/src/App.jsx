import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Emailverify from './Pages/Emailverify'
import Resetpassword from './Pages/Resetpassword'
import { ToastContainer} from 'react-toastify';
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/emailverify' element={<Emailverify/>}/>
        <Route path='/resetpassword' element={<Resetpassword/>}/>
      </Routes>
    </div>
  )
}

export default App