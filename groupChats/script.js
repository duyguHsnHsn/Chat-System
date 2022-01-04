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
const createGroup = document.getElementById("createGroup");
const searchForGroup =document.getElementById("seachForGroups")
const exitSearching = document.getElementById("exitSearching");
const exitCreating = document.getElementById("exitCreating");
const findGroupWreapper = document.getElementById("searching");
const createGroupWreapper = document.getElementById("newGroup");
const submitCreatedGroup = document.getElementById("submitCreatedGroup");

createGroup.addEventListener("click", (event) =>{
    event.preventDefault();
    createGroupWreapper.classList.remove("hidden");
});
searchForGroup.addEventListener("click", (event)=>{
    event.preventDefault();
    findGroupWreapper.classList.remove("hidden");
});
exitSearching.addEventListener("click",(event)=>{
    event.preventDefault();
    findGroupWreapper.classList.add("hidden");
});
exitCreating.addEventListener("click",(event)=>{
    event.preventDefault();
    createGroupWreapper.classList.add("hidden");
});
submitCreatedGroup.addEventListener("click",(event)=>{
    event.preventDefault();
    var groupName = document.getElementById("newGroupName").value;
    const newGroupRef = push(groupsDataRef);
    set(newUserRef, {
        "groupName": groupName
    });
    alert("The new group was created!");
    document.getElementById("newGroupName").value = null;
});



