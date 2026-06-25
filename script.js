import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase Config এখানে বসাও
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXXXX",
  appId: "XXXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentRoom = "";

// Create Room
window.createRoom = () => {
  const roomId = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  set(ref(db, "rooms/" + roomId), {
    created: Date.now()
  });

  document.getElementById("roomId").value = roomId;

  joinRoom(roomId);
};

// Join Room Button
window.joinRoomBtn = () => {
  const roomId = document
    .getElementById("roomId")
    .value
    .trim()
    .toUpperCase();

  if (!roomId) {
    alert("Room ID লিখুন");
    return;
  }

  joinRoom(roomId);
};

// Join Room Function
function joinRoom(roomId) {
  currentRoom = roomId;

  document.querySelector(".home").style.display = "none";
  document.querySelector(".chat").style.display = "flex";

  document.getElementById("showRoom").innerText =
    "Room: " + roomId;

  const messagesBox =
    document.getElementById("messages");

  messagesBox.innerHTML = "";

  const chatRef = ref(db, "messages/" + roomId);

  onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();

    const div = document.createElement("div");
    div.className = "message";

    div.innerHTML = `
      <strong>${data.sender}</strong><br>
      ${data.text}
    `;

    messagesBox.appendChild(div);

    messagesBox.scrollTop =
      messagesBox.scrollHeight;
  });
}

// Send Message
window.sendMessage = () => {
  const input =
    document.getElementById("messageInput");

  const text = input.value.trim();

  if (!text) return;

  push(ref(db, "messages/" + currentRoom), {
    sender: "User",
    text: text,
    time: Date.now()
  });

  input.value = "";
};

// Enter চাপলে Send
document.addEventListener("DOMContentLoaded", () => {
  const input =
    document.getElementById("messageInput");

  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
});
