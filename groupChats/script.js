import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  push,
  set,
  child,
  get,
  onValue,
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
const database = getDatabase(app);
const dataRef = ref(database);
const groupsDataRef = ref(database, "groups");
const addGroupsButton = document.getElementById("plusButton");
const exitAddingNewGroup = document.getElementById("exitNewGroup");
const inboxButton = document.getElementById("inboxButton");
const exitInbox = document.getElementById("exitGroupList");
const messageScreen = document.getElementById("messageWindow");

messageScreen.scrollTop = messageScreen.scrollHeight;

addGroupsButton.addEventListener("click",(event)=>{
  event.preventDefault();
  document.getElementById("newGroup").classList.remove("hidden");
})

exitAddingNewGroup.addEventListener("click",(event) =>{
  event.preventDefault();
  document.getElementById("newGroup").classList.add("hidden");
})

inboxButton.addEventListener("click",(event) =>{
  event.preventDefault();
  document.getElementById("listWrapper").classList.remove("hidden");
});

exitInbox.addEventListener("click",(event)=>{
  event.preventDefault();
  document.getElementById("listWrapper").classList.add("hidden");
});



