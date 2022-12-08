import React, { useEffect, useState } from 'react';
// ------------------------ Firebase AUTH ATTEMPT ------------------------ \\
//------------------------ VIDEO 1 IMPORTS AND BASICS ------------------------ \\
//Import the needed functions from Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getAuth, onAuthStateChanged, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updatePassword, updateProfile, setCustomUserClaims } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
//import { hideLoginError, showApp, showLoginError, showLoginForm, showLoginState } from '../ui.js';
import { useNavigate } from "react-router-dom";
import { AuthErrorCodes } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';

const SignIn = () => {
    //Initialize the firebase app with the repository's values
    const firebaseApp = initializeApp({
        apiKey: "AIzaSyDuh3g6xopDh9FOhrM4W0LjIjw_NOvu_ic",
        authDomain: "se3316-pparlato-jjohn483-lab4.firebaseapp.com",
        projectId: "se3316-pparlato-jjohn483-lab4",
        storageBucket: "se3316-pparlato-jjohn483-lab4.appspot.com",
        messagingSenderId: "393530132117",
        appId: "1:393530132117:web:9c1bc00dae89a62244fd9c",
        measurementId: "G-YY9YP5YCVM"
    });

    //Set up needed constants
    const [txtEmail, setTxtEmail] = useState("");
    const [txtPassword, setTxtPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [newPassword, setNewPassword] = useState("");


    //Create a variable to hold onto the authorization value of the firebase app
    const auth = getAuth(firebaseApp);
    //connectAuthEmulator(auth, "http://localhost:9099");

    //Select the value to be updated with the password
    const newPas = document.querySelector('#newPas');

    //Function to allow users to login with an email and a password
    const useLoginEmailPassword = async () => {
        //Get the email and password values from the html page
        const loginEmail = txtEmail;
        const loginPassword = txtPassword;
        const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage');
    
        //Try to log the user in with the passed values
        try{
            //Attempt to authorize the user with the passed username and password
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            lblLoginErrorMessage.innerHTML = "Logged In";
            lblLoginErrorMessage.removeAttribute("hidden");

        }
        catch(error){
            //If it doesn.t work, log and show the user the appropreate error
            console.log(error);
            if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
                    lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`;
                } else if (txtEmail == ""){
                    lblLoginErrorMessage.innerHTML = "Please enter an email";
                } else {
                    lblLoginErrorMessage.innerHTML = `Error: ${error.message}`;    
                }

            lblLoginErrorMessage.removeAttribute("hidden");
        }
    }

    //Create a function to allow users to create a new account
    const createAccount = async () => {
        //Get the email and password values from the html page
        const loginEmail = txtEmail;
        const loginPassword = txtPassword;
        const usersName = userName;
        const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage');

        //Try to sign the user up with the given email and password
        try{
        await createUserWithEmailAndPassword(auth, loginEmail, loginPassword)
        //Then add the name to the user's profile
        .then(function () {
            var user = auth.currentUser;
            updateProfile(user, {displayName: usersName});
            })
        .then(function (){
            window.location.reload();
        })    
        }
        catch(error){
            //If it doesn't work log the error and tell the user why
            console.log(error);
            if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
                lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`;
            } else if (txtEmail == ""){
                lblLoginErrorMessage.innerHTML = "Please enter an email";
            } else {
                lblLoginErrorMessage.innerHTML = `Error: ${error.message}`;    
            }

        lblLoginErrorMessage.removeAttribute("hidden");
        }
    }

    //Function to detect the Auth State
    onAuthStateChanged(auth, user => {
        if(user != null){
            console.log('logged in!');
        } else {
            console.log('No user');
        }
    });

    //Function to logout the user
    const logout = async () => {
        //Sign out the user when called
        await signOut(auth);
    }

    //Function to update the password of a logged-in user
    const newPasswordFunc = async () => {
        //Assign the new password's value to a variable
        const newPasswordvalue = newPassword;
        //Call the update password function and pass it the new password
        updatePassword(auth.currentUser, newPasswordvalue).then(() => {
            //Show the new password to the user
            newPas.innerHTML("Password Updated to: " + newPasswordvalue);
            newPas.removeAttribute("hidden");
        //Catch any errors
        }).catch((error) => {
            newPas.innerHTML(error);
            newPas.removeAttribute("hidden");
        });
    }
    //Change the password to the text-fields value when the appropreate button is clicked
    //btnChangePassword.addEventListener("click", newPassword);
    const adminTest = document.querySelector('#adminTest')
    
    return (
        <div>
            <div className="SignIn">
                <h1>Sign-In</h1>
            </div>

            <div id="login">
            <div class="header">
            </div>
            <form>
              <div class="group">
                <input id="txtEmail" type="email" onChange={(e) => setTxtEmail(e.target.value)}></input>
                <label>Email</label>
              </div>
              <div class="group">
                <input id="txtPassword" type="password" onChange={(e) => setTxtPassword(e.target.value)}></input>
                <label>Password</label>
              </div>
              <div class="group">
                <input id="userName" onChange={(e) => setUserName(e.target.value)}></input>
                <label>Name [Only needed for signup (Optional)]</label>
              </div>
              <div id="divLoginError" class="group">
                <div id="lblLoginErrorMessage" class="errorlabel" hidden >Error message</div>
              </div>
              <button id="btnLogin" type="button" class="button buttonBlue" onClick={useLoginEmailPassword}>Log in</button>
              <button id="btnSignup" type="button" class="button buttonBlue" onClick={createAccount}>Sign up</button>
            </form>
          </div>

          <div>

            <h1>Change Password</h1>
            <input id="newPassword" type="password" onChange={(e) => setNewPassword(e.target.value)}></input>
            <div id="divLoginError" class="group">
                <div id="newPas" class="errorlabel" hidden>Changed Password</div>
            </div>
            <button id="changePasBtn" type="button" class="button buttonBlue" onClick={newPasswordFunc}>Change Password</button>
          </div>

        </div>
    );

}

export default SignIn;