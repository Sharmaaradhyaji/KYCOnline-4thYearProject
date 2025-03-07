import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Start from './pages/Start'
import Home from './pages/Home'
import TakeSelfie from './pages/TakeSelfie'
import AdditionalDetails from './pages/AdditionalDetails'
import KYCPage from './pages/KYCPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/register" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path='/home' element={
          <Home />
        } />
        <Route path='/selfie-upload' element={
          <TakeSelfie />
        } />
        <Route path='/additional-details' element={
          <AdditionalDetails />
        }
        />
        <Route path='/kyc-details' element={
          <KYCPage />
        }
        />
      </Routes>
    </div>
  )
}

export default App
