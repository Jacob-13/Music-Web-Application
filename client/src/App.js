// react and navbar dependencies
import React from 'react';
import NavBar from './Navigation/Navbar.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Imported pages
import Home from './Navigation/Home.js';
import SignIn from './Navigation/SignIn.js';
import User from './Navigation/User.js';

function App() {

  return (

    <Router>

      <NavBar />

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signIn' element={<SignIn/>} />
        <Route path='/user' element={<User/>} />
      </Routes>

    </Router>

  );
}

export default App;
