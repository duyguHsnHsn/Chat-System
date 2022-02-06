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
  remove,
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
const openSectionForAddingNewGroups = document.getElementById("plusButton");
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
const openSectionForAddingPeople = document.getElementById("addPeople");
const exitAddingPeople = document.getElementById("exitNewPerson");
const addNewPerson = document.getElementById("submitPerson");
const exitRequestSection = document.getElementById("exitNewRequests");
const openRequests = document.getElementById("requestsButton");
const requestsUl = document.getElementById("requestsUl");

if ((database, "users/" + window.localStorage.getItem("username"))) {
  get(child(dbRef, "users/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        const newRef = ref(
          database,
          "users/" + window.localStorage.getItem("username")
        );
        const createdRef = push(newRef);
        set(createdRef, {
          groupName: "General",
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
const dataRef = ref(
  database,
  "groups/" + window.localStorage.getItem("currentChat")
);

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

function updateAllMessages(data) {
  const message = data.val();
  const listItem = document.createElement("li");
  listItem.classList.add("message");
  if (message.username === window.localStorage.getItem("username")) {
    const externalHTML = `
    <button id="updateMessage" class="updateMessage" onclick="updateMessage()"><i class="fas fa-pencil-alt"></i></i></button>
    <button id="deleteMessage" class="deleteMessage" onclick="deleteMessage()"><i class="fas fa-trash-alt"></i></button>
    <p class="username">${message.username}</p>
    <p>${new Date(message.date).toLocaleString()}</p>
    <p class="text">${message.text}</p>
    <button class="likes"><i class="fas fa-heart"></i> ${message.likes}</button>
    `;
    listItem.innerHTML = externalHTML;
  } else {
    const externalHTML = `
    <p class="username">${message.username}</p>
    <p>${new Date(message.date).toLocaleString()}</p>
    <p class="text">${message.text}</p>
    <button  class="likes"><i class="fas fa-heart"></i> ${
      message.likes
    }</button >
    `;
    listItem.innerHTML = externalHTML;
  }
  messageUl.appendChild(listItem);
}

onChildAdded(dataRef, (data) => {
  updateAllMessages(data);
});

onChildRemoved(dataRef, (data) => {
  updateAllMessages(data);
});

onChildChanged(dataRef, (data) => {
  updateAllMessages(data);
});

openSectionForAddingNewGroups.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("newGroup").classList.remove("hidden");
});

exitAddingNewGroup.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("newGroup").classList.add("hidden");
});

inboxButton.addEventListener("click", (event) => {
  event.preventDefault();
  const userRef = ref(
    database,
    "users/" + window.localStorage.getItem("username")
  );
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

groupsListUl.addEventListener("click", (event) => {
  window.localStorage.removeItem("currentChat");
  window.localStorage.setItem("currentChat", event.target.id);
  document.getElementById("chatName").innerText =
    window.localStorage.getItem("currentChat");
  messageUl.innerHTML = null;
  get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          var date = "";
          var text = "";
          var usern = "";
          var likes = "";
          for (var [innerKey, innerValue] of Object.entries(value)) {
            if (innerKey === "date") {
              date = innerValue;
            }
            if (innerKey === "text") {
              text = innerValue;
            }
            if (innerKey === "username") {
              usern = innerValue;
            }
            if (innerKey === "likes") {
              likes = innerValue;
            }
          }
          const listItem = document.createElement("li");
          listItem.classList.add("message");
          if (usern === window.localStorage.getItem("username")) {
            const externalHTML = `
              <button id="updateMessage" class="updateMessage" onclick="updateMessage()"><i class="fas fa-pencil-alt"></i></i></button>
              <button id="deleteMessage" class="deleteMessage" onclick="deleteMessage()"><i class="fas fa-trash-alt"></i></button>
              <p class="username">${usern}</p>
              <p>${new Date(date).toLocaleString()}</p>
              <p class="text">${text}</p>
              <button class="likes"><i class="fas fa-heart"></i> ${likes}</button>
              `;
            listItem.innerHTML = externalHTML;
          } else {
            const externalHTML = `
              <p class="username">${usern}</p>
              <p>${new Date(date).toLocaleString()}</p>
              <p class="text">${text}</p>
              <button class="likes"><i class="fas fa-heart"></i> ${likes}</button>
              `;
            listItem.innerHTML = externalHTML;
          }
          messageUl.appendChild(listItem);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  document.getElementById("listWrapper").classList.add("hidden");
  groupsListUl.innerHTML = null;
});

leaveChat.addEventListener("click", (event) => {
  event.preventDefault();
  get(child(dbRef, "users/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          for (var [innerKey, innerValue] of Object.entries(value)) {
            if (innerValue == window.localStorage.getItem("currentChat")) {
              remove(
                child(
                  dbRef,
                  "users/" + window.localStorage.getItem("username") + "/" + key
                )
              );
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

exitInbox.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("listWrapper").classList.add("hidden");
  groupsListUl.innerHTML = null;
});

createNewGroup.addEventListener("click", (event) => {
  event.preventDefault();
  var name = document.getElementById("newGroupName").value;
  const newRef = ref(database, "groups/" + name);
  const createdRef = push(newRef);
  set(createdRef, {
    username: "System",
    date: Date.now(),
    text: "This group was created!",
    likes: 0,
  });
  get(child(dbRef, "users/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const newRef = ref(
          database,
          "users/" + window.localStorage.getItem("username")
        );
        const createdRef = push(newRef);
        set(createdRef, {
          groupName: name,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  document.getElementById("newGroupName").value = null;
});

findNewGroup.addEventListener("click", (event) => {
  event.preventDefault();
  var name = document.getElementById("searchedGroupName").value;
  joinTheGroup(name);
  document.getElementById("searchedGroupName").value = null;
});

openSectionForAddingPeople.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("newPerson").classList.remove("hidden");
});
addNewPerson.addEventListener("click", (event) => {
  event.preventDefault();
  var name = document.getElementById("newPersonName").value;
  var chat = window.localStorage.getItem("currentChat");
  const personsRequestsRef = ref(database, "requests/" + name);
  const newRequestRef = push(personsRequestsRef);
  set(newRequestRef, {
    chatToJoin: chat,
  });
  document.getElementById("newPersonName").value = null;
});

exitAddingPeople.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("newPerson").classList.add("hidden");
});

openRequests.addEventListener("click", (event) => {
  event.preventDefault();
  get(child(dbRef, "requests/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          var groupName = "";
          for (var [innerKey, innerValue] of Object.entries(value)) {
            if (innerKey === "chatToJoin") {
              groupName = innerValue;
            }
          }
          const listItem = document.createElement("li");
          const externalHTML = `
          <p id="groupFromRequest" class="chatName">${groupName}</p>
              <div>
              <button id="yesButton" onclick="requestAnswerYes(${groupName})">Yes</button>
              <button id="noButton" onclick="removeTheRequest(${groupName})">No</button>
            </div>
          `;
          listItem.innerHTML = externalHTML;
          requestsUl.appendChild(listItem);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  document.getElementById("requestSection").classList.remove("hidden");
});

exitRequestSection.addEventListener("click", (event) => {
  event.preventDefault();
  requestsUl.innerHTML = null;
  document.getElementById("requestSection").classList.add("hidden");
});

function requestAnswerYes(name) {
  joinTheGroup(name);
  get(child(dbRef, "requests/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          for (var [innerKey, innerValue] of Object.entries(value)) {
            if (innerValue == name) {
              remove(
                child(
                  dbRef,
                  "requests/" +
                    window.localStorage.getItem("username") +
                    "/" +
                    key
                )
              );
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  requestsUl.innerHTML = null;
  get(child(dbRef, "requests/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          var groupName = "";
          for (var [innerKey, innerValue] of Object.entries(value)) {
            if (innerKey === "chatToJoin") {
              groupName = innerValue;
            }
          }
          const listItem = document.createElement("li");
          const externalHTML = `
          <p id="groupFromRequest" class="chatName">${groupName}</p>
              <div>
              <button id="yesButton" onclick="requestAnswerYes(${groupName})">Yes</button>
              <button id="noButton" onclick="removeTheRequest(${groupName})">No</button>
            </div>
          `;
          listItem.innerHTML = externalHTML;
          requestsUl.appendChild(listItem);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
function joinTheGroup(name) {
  get(child(dbRef, "groups/" + name))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        get(child(dbRef, "users/" + window.localStorage.getItem("username")))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const newRef = ref(
                database,
                "users/" + window.localStorage.getItem("username")
              );
              const createdRef = push(newRef);
              set(createdRef, {
                groupName: name,
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        alert("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function deleteMessage() {
  const collection = this.parent.children;
  const myArr = Array.from(collection);
  get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          var counter = 0;
          for (var [innerKey, innerValue] of Object.entries(value)) {
            if (
              innerValue == myArr[0] ||
              innerValue == myArr[1] ||
              innerValue == myArr[2] ||
              innerValue == myArr[3]
            ) {
              counter++;
            }
          }
          if (counter === 4) {
            remove(
              child(
                dbRef,
                "groups/" +
                  window.localStorage.getItem("currentChat") +
                  "/" +
                  key
              )
            );
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
function updateMessage() {
  const collection = this.parent.children;
  const myArr = Array.from(collection);
  get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
    .then((snapshot) => {})
    .catch((error) => {
      console.error(error);
    });
}

messageScreen.scrollTop = messageScreen.scrollHeight;
