import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
  child,
  get,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
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
const auth = getAuth();
const addGroupsButton = document.getElementById("plusButton");
const exitAddingNewGroup = document.getElementById("exitNewGroup");
const inboxButton = document.getElementById("inboxButton");
const exitInbox = document.getElementById("exitGroupList");
const messageScreen = document.getElementById("messageWindow");
const messageInput = document.getElementById("messageInput");
const userNameInput = document.getElementById("username");
const messageUl = document.getElementById("messageUl");
const createNewGroup = document.getElementById("submitCreatedGroup");
const findNewGroup = document.getElementById("searchForNewGroup");

userNameInput.addEventListener("change", (event) => {
  const username = event.target.value;
  window.localStorage.setItem("username", username);
  userNameInput.classList.add("hidden");
});

if (window.localStorage.getItem("username")) {
  userNameInput.classList.add("hidden");
}

const dataRef = ref(database, "General");

messageInput.addEventListener("change", (event) => {
  const messageRef = push(dataRef);
  set(messageRef, {
    username: window.localStorage.getItem("username"),
    date: Date.now(),
    text: event.target.value,
    likes: 0,
  });
  messageInput.value = null;
});

onChildAdded(dataRef, (data) => {
  const message = data.val();
  const listItem = document.createElement("li");
  const externalHTML = `<li class="message">
<p class="username">${message.username}</p>
<p>${ new Date(message.date).toLocaleString()}</p>
<p class="text">${message.text}</p>
<p class="likes"><i class="fas fa-heart"></i> ${message.likes}</p>
</li>`;
  listItem.innerHTML = externalHTML;
  messageUl.appendChild(listItem);
});

addGroupsButton.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("newGroup").classList.remove("hidden");
});

exitAddingNewGroup.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("newGroup").classList.add("hidden");
});

inboxButton.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("listWrapper").classList.remove("hidden");
});

exitInbox.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("listWrapper").classList.add("hidden");
});

createNewGroup.addEventListener("click", (event)=>{
  event.preventDefault();
  var name = document.getElementById("newGroupName").value;
  const newRef = ref(database, name);
  const createdRef = push(newRef);
  set(createdRef, {
    username: "System",
    date: Date.now(),
    text: "This group was created!",
    likes: 0,
  });
  document.getElementById("newGroupName").value = null;
});

findNewGroup.addEventListener("click",(event)=>{
  var dbRef = ref(database);
  event.preventDefault();
  var name = document.getElementById("searchedGroupName").value;
  get(child(dbRef, name)).then((snapshot) => {
    if (snapshot.exists()) {
      alert("Found!");
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
    document.getElementById("searchedGroupName").value = null;
});

messageScreen.scrollTop = messageScreen.scrollHeight;