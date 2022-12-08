// react and navbar dependencies
import React from 'react';
import NavBar from './Navigation/Navbar.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Imported pages
import Home from './Navigation/Home.js';
import SignIn from './Navigation/SignIn.js';
import User from './Navigation/User.js';
import SecurityAndPrivatePolicy from './Navigation/SecurityAndPrivatePolicy.js';
import DCMANoticeAndTakedownPolicy from './Navigation/DCMANoticeAndTakedownPolicy.js';
import AcceptableUsePolicy from './Navigation/AcceptableUsePolicy.js';

function App() {

  return (

    <Router>

      <NavBar />

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signIn' element={<SignIn/>} />
        <Route path='/user' element={<User/>} />
        <Route path='/securityAndPrivatePolicy' element={<SecurityAndPrivatePolicy/>}/>
        <Route path='/dcmaNoticeAndTakedownPolicy' element={<DCMANoticeAndTakedownPolicy/>}/>
        <Route path='/acceptableUsePolicy' element={<AcceptableUsePolicy/>}/>
      </Routes>

    </Router>

  );
}

export default App;
