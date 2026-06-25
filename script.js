import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.sendMessage = function () {
    const room = document.getElementById("room").value;
    const msg = document.getElementById("message").value;

    set(ref(db, "rooms/" + room), {
        text: msg,
        time: Date.now()
    });
};

document.getElementById("room").addEventListener("input", () => {
    const room = document.getElementById("room").value;

    if(room){
        onValue(ref(db, "rooms/" + room), (snapshot) => {
            const data = snapshot.val();
            if(data){
                document.getElementById("received").innerText = data.text;
            }
        });
    }
});
