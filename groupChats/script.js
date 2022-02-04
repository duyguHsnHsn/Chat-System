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
const dbRef = ref(database);
const addGroupsButton = document.getElementById("plusButton");
const exitAddingNewGroup = document.getElementById("exitNewGroup");
const inboxButton = document.getElementById("inboxButton");
const exitInbox = document.getElementById("exitGroupList");
const messageScreen = document.getElementById("messageWindow");
const messageInput = document.getElementById("messageInput");
const messageUl = document.getElementById("messageUl");
const createNewGroup = document.getElementById("submitCreatedGroup");
const findNewGroup = document.getElementById("searchForNewGroup");
const groupsListUl = document.getElementById("groupListUl");
const leaveChat = document.getElementById("leaveChat");
const addPeople = document.getElementById("addPeople");
const exitAddingPeople = document.getElementById("exitNewPerson");
const newPersonToChatButton = document.getElementById("submitPerson");

if (database,'users/' + window.localStorage.getItem("username")) {
  get(child(dbRef,'users/' + window.localStorage.getItem("username"))).then((snapshot) => {
    if (!snapshot.exists()) {
      const newRef = ref(database,'users/' + window.localStorage.getItem("username"));
      const createdRef = push(newRef);
      set(createdRef, {
        groupName: "General"
      });
    }
  }).catch((error) => {
    console.error(error);
  });
};
const dataRef = ref(database,'groups/' + window.localStorage.getItem("currentChat"));

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
  listItem.classList.add("message");
  const externalHTML = `
    <p class="username">${message.username}</p>
    <p>${ new Date(message.date).toLocaleString()}</p>
    <p class="text">${message.text}</p>
    <p class="likes"><i class="fas fa-heart"></i> ${message.likes}</p>
    `;
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
  const userRef = ref(database,'users/' + window.localStorage.getItem("username"));
  onChildAdded(userRef, (data) => {
    const groupName = data.val();
    const listItem = document.createElement("li");
    const externalHTML = `
    <p class="chatName" id="${groupName.groupName}" >${groupName.groupName}</p>
  `;
    listItem.innerHTML = externalHTML;
    groupsListUl.appendChild(listItem);
  });
  document.getElementById("listWrapper").classList.remove("hidden");
});

groupsListUl.addEventListener("click",(event)=>{
  window.localStorage.removeItem("currentChat");
  window.localStorage.setItem("currentChat",event.target.id);
  document.getElementById("chatName").innerText = window.localStorage.getItem("currentChat");
  messageUl.innerHTML = null;
  get(child(dbRef,'groups/' + window.localStorage.getItem("currentChat"))).then((snapshot) => {
    if (snapshot.exists()) {
      for(var [key,value] of Object.entries(snapshot.val())){
        var date = "";
        var text = "";
        var usern = "";
        var likes = "";
          for(var [innerKey,innerValue] of Object.entries(value)){
            if(innerKey === "date"){
              date = innerValue;
            }
            if(innerKey === "text"){
              text = innerValue;
            }
            if(innerKey === "username"){
              usern = innerValue;
            }
            if(innerKey === "likes"){
              likes = innerValue;
            }
          }
          const listItem = document.createElement("li");
           listItem.classList.add("message");
          const externalHTML = `
          <p class="username">${usern}</p>
          <p>${ new Date(date).toLocaleString()}</p>
          <p class="text">${text}</p>
          <p class="likes"><i class="fas fa-heart"></i> ${likes}</p>
          `;
        listItem.innerHTML = externalHTML;
        messageUl.appendChild(listItem);
      }
      
    }
  }).catch((error) => {
    console.error(error);
  });
  document.getElementById("listWrapper").classList.add("hidden");
  groupsListUl.innerHTML = null;
});

leaveChat.addEventListener("click",(event)=>{
});

exitInbox.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("listWrapper").classList.add("hidden");
  groupsListUl.innerHTML = null;
});

createNewGroup.addEventListener("click", (event)=>{
  event.preventDefault();
  var name = document.getElementById("newGroupName").value;
  const newRef = ref(database,'groups/' + name);
  const createdRef = push(newRef);
  set(createdRef, {
    username: "System",
    date: Date.now(),
    text: "This group was created!",
    likes: 0,
  });
  get(child(dbRef,'users/' + window.localStorage.getItem("username"))).then((snapshot) => {
    if (snapshot.exists()) {
      const newRef = ref(database,'users/' + window.localStorage.getItem("username"));
      const createdRef = push(newRef);
      set(createdRef, {
        groupName: name
      });
    }
  }).catch((error) => {
    console.error(error);
  });
  document.getElementById("newGroupName").value = null;
});

findNewGroup.addEventListener("click",(event)=>{
  event.preventDefault();
  var name = document.getElementById("searchedGroupName").value;
  get(child(dbRef, name)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      get(child(dbRef, 'users/' + window.localStorage.getItem("username"))).then((snapshot) => {
        if (snapshot.exists()) {
          const newRef = ref(database,'users/' + window.localStorage.getItem("username"));
          const createdRef = push(newRef);
          set(createdRef, {
            groupName: name
          });
        }
      }).catch((error) => {
        console.error(error);
      });
    } else {
      alert("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
    document.getElementById("searchedGroupName").value = null;
});

addPeople.addEventListener("click",(event)=>{
   event.preventDefault();
   document.getElementById("newPerson").classList.remove("hidden");
});
exitAddingPeople.addEventListener("click",(event)=>{
  event.preventDefault();
  document.getElementById("newPerson").classList.add("hidden");
});

newPersonToChatButton.addEventListener("click",(event)=>{
  event.preventDefault();
  var name = document.getElementById("newPersonName").value;
  var chat = window.localStorage.getItem("currentChat");
  const personsRequestsRef = ref(database,'requests/' + name);
  const newRequestRef = push(personsRequestsRef);
  set(newRequestRef, {
    chatToJoin: chat
  }); 
  document.getElementById("newPersonName").value = null;
});

messageScreen.scrollTop = messageScreen.scrollHeight;