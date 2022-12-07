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


    //Create a variable to hold onto the authorization value of the firebase app
    const auth = getAuth(firebaseApp);
    //connectAuthEmulator(auth, "http://localhost:9099");

    //Function to allow users to login with an email and a password
    const useLoginEmailPassword = async () => {
        //Get the email and password values from the html page
        const loginEmail = txtEmail;
        const loginPassword = txtPassword;
        const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage')

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
            // TODO
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
            //TODO
            //showLoginError(error);
        }
    }

    const makeAdmin = () => {
        var admin = auth.currentUser;
        auth.setCustomUserClaims(admin, { admin: true }).then(() =>{
            console.log(admin);
        });
    }

    //Funtion to monitor the login state of the user
    const monitorAuthState = async () => {
        onAuthStateChanged(auth, user => {
            //If the user is logged in
            if(user){
                //Display the login state and some information to the user
                console.log(user);
                //TODO
                //showApp();
                //TODO
                //showLoginState(user);

                //TODO
                //hideLoginError();
            }
            //If the user isn't logged in
            else {
                //Tell the user that they aren't logged in
                //TODO
                //showLoginForm();
                // TODO
                //lblAuthState.innerHTML = "You're not logged in.";
            }
        });
    } 

    //Monitor the authorization state of the user
    monitorAuthState();

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
    const newPassword = async () => {
        //Assign the new password's value to a variable
        // TODO
        //const newPasswordvalue = changePassword.value;
        //Call the update password function and pass it the new password
        //updatePassword(auth.currentUser, newPasswordvalue).then(() => {
            //Log the new password to the console
            //console.log("Password Updated to: " + newPasswordvalue)
        //Catch any errors
        //}).catch((error) => {
            //console.log(error);
        //});
    }
    //Change the password to the text-fields value when the appropreate button is clicked
    //btnChangePassword.addEventListener("click", newPassword);

    return (
        <div>
            <div className="SignIn">
                <h1>Sign-In</h1>
            </div>

            <div id="login">
            <div class="header">
              <h1>Getting Started with Firebase Auth</h1>
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

        </div>
    );

}

export default SignIn;