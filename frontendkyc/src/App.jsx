import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Start from './pages/Start'
import Home from './pages/Home'
import KYCPage from './pages/KYCPage'
import Details from './pages/Details'
import ImageCheck from './pages/ImageCheck'

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
        <Route path='/details' element={
          <Details />
        }
        />
        <Route path='/kyc-details/:id' element={
          <KYCPage />
        }
        />
        <Route path='/kyc-image/:id' element={
          <ImageCheck />
        }
        />
      </Routes>
    </div>
  )
}

export default App
