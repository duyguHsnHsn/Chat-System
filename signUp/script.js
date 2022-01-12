import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import {
  getDatabase,
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6i5_YsQ7r_LoHhAfzTBBqADOISO6bjgY",
  authDomain: "chat-system-f5832.firebaseapp.com",
  databaseURL:
    "https://chat-system-f5832-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-system-f5832",
  storageBucket: "chat-system-f5832.appspot.com",
  messagingSenderId: "783006918118",
  appId: "1:783006918118:web:cedd6c2443a74a05322227",
  measurementId: "G-M45K3V7XVZ",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const submit = document.getElementById("submitSignIn");

submit.addEventListener("click", (event) => {
  event.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var reentered = document.getElementById("reenteredPassword").value;
  if(reentered !== password){
    alert("The reentered password is not correct! Please, try again!");
    setAllToNull();
  }
  else{
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
    });
    setAllToNull();
  }
});
function setAllToNull(){
  document.getElementById("email").value = null;
  document.getElementById("password").value = null;
  document.getElementById("reenteredPassword").value = null;
};
