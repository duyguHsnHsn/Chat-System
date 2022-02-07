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
  update,
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
const notificationsButton = document.getElementById("notificationsButton");
const notificationListUl = document.getElementById("notificationListUl");
const exitNotifications = document.getElementById("exitNotificationList");

var dataRef = ref(
  database,
  "groups/" + window.localStorage.getItem("currentChat")
);  

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
        get(child(dbRef, "groups-users/" + "General"))
          .then((snapshot2) => {
            if (snapshot2.exists()) {
              get(
                child(
                  dbRef,
                  "groups-users/" +
                    "General/" +
                    window.localStorage.getItem("username")
                )
              )
                .then((snapshot3) => {
                  if (!snapshot3.exists()) {
                    const newRef = ref(database, "groups-users/" + "General");
                    const createdRef = push(newRef);
                    set(createdRef, {
                      username: window.localStorage.getItem("username"),
                    });
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

if ((database, "notifications/" + window.localStorage.getItem("username"))) {
  notificationsButton.classList.add("red");
}
if ((database, "requests/" + window.localStorage.getItem("username"))) {
  openRequests.classList.add("red");
}

messageInput.addEventListener("change", (event) => { 
  const messageRef = push(dataRef);
  set(messageRef, {
    username: window.localStorage.getItem("username"),
    date: Date.now(),
    text: event.target.value,
    likes: 0,
  });
  sendNotifications(window.localStorage.getItem("currentChat"));
  messageInput.value = null;
});

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
  addTheUserToChatsUserList(name);
  document.getElementById("newGroupName").value = null;
});

findNewGroup.addEventListener("click", (event) => {
  event.preventDefault();
  var name = document.getElementById("searchedGroupName").value;
  joinTheGroup(name);
  addTheUserToChatsUserList(name);
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

notificationsButton.addEventListener("click", (event) => {
  event.preventDefault();
  get(child(dbRef, "notifications/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          for (var [innerKey, innerValue] of Object.entries(value)) {
            const listItem = document.createElement("li");
            const externalHTML = `
            <p class="chatName">${innerValue}</p>
            `;
            listItem.innerHTML = externalHTML;
            notificationListUl.appendChild(listItem);
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  document.getElementById("notificationWrapper").classList.remove("hidden");
});

exitNotifications.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("notificationWrapper").classList.add("hidden");
  notificationListUl.innerHTML = null;
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

function requestAnswerYes(name) {
  joinTheGroup(name);
  addTheUserToChatsUserList(name);
  removeChosenRequest(name);
  updateRequestsUl();
}

function requestAnswerNo(name) {
  removeChosenRequest(name);
  updateRequestsUl();
}

function joinTheGroup(name) {
  get(child(dbRef, "groups/" + name))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        get(child(dbRef, "users/" + window.localStorage.getItem("username")))
          .then((snapshot2) => {
            if (snapshot2.exists()) {
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
          if (checkTheKeysAndValuesOfMessage(myArr, value) === 4) {
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
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          if (checkTheKeysAndValuesOfMessage(myArr, value) === 4) {
            document.getElementById("changeMessage").classList.remove("hidden");
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function likeMessage() {
  const collection = this.parent.children;
  const myArr = Array.from(collection);
  get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          if (checkTheKeysAndValuesOfMessage(myArr, value) === 4) {
            const updateLikes = {
              date: myArr[0],
              likes: myArr[1] + 1,
              text: myArr[2],
              username: myArr[3],
            };
            const updates = {};
            updates[
              "groups/" + window.localStorage.getItem("currentChat") + "/" + key
            ] = updateLikes;
            update(dbRef, updates);
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function removeChosenRequest(name) {
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
}

function updateRequestsUl() {
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

function checkTheKeysAndValuesOfMessage(myArr, value) {
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
  return counter;
}

function addTheUserToChatsUserList(name) {
  get(child(dbRef, "groups-users/" + name))
    .then((snapshot2) => {
      const newRef = ref(database, "groups-users/" + name);
      const createdRef = push(newRef);
      set(createdRef, {
        username: window.localStorage.getItem("username"),
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function sendNotifications(groupName) {
  get(child(dbRef, "groups-users/" + groupName))
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (var [key, value] of Object.entries(snapshot.val())) {
          for (var [innerKey, innerValue] of Object.entries(value)) {
            get(child(dbRef, "notifications/" + innerValue))
              .then((snapshot2) => {
                const newRef = ref(database, "notifications/" + innerValue);
                const createdRef = push(newRef);
                set(createdRef, {
                  notification: "New message to " + groupName,
                });
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

messageScreen.scrollTop = messageScreen.scrollHeight;
