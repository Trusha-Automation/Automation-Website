 // Import Firebase SDK
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
 import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";

 // Firebase configuration
 const firebaseConfig = {
     apiKey: "AIzaSyCHM3IfWaxLpTg5-VgmMo9LY8jjqNhlPw0",
     authDomain: "automation-5ffdc.firebaseapp.com",
     databaseURL: "https://automation-5ffdc-default-rtdb.firebaseio.com",
     projectId: "automation-5ffdc",
     storageBucket: "automation-5ffdc.firebasestorage.app",
     messagingSenderId: "350917787775",
     appId: "1:350917787775:web:4f5a38de0197d6b803bf4a",
     measurementId: "G-LMMWVWR9B8"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getDatabase(app);
 const analytics = getAnalytics(app);

 // Function to update toggle state in Firebase
 function updateToggle(switchId, value) {
     console.log(`Attempting to update ${switchId} to`, value);
     set(ref(db, 'switches/' + switchId), value)
         .then(() => console.log(`✅ Data successfully saved to Firebase for ${switchId}`))
         .catch((error) => console.error(`❌ Firebase write error: ${error.message}`));
 }

 // Function to sync switch states from Firebase
 function syncSwitches() {
     for (let i = 1; i <= 4; i++) {
         const switchRef = ref(db, 'switches/switch' + i);
         const switchElement = document.getElementById('switch' + i);
         onValue(switchRef, (snapshot) => {
             if (snapshot.exists()) {
                 console.log(`Fetched switch${i}:`, snapshot.val());
                 switchElement.checked = snapshot.val();
             } else {
                 console.warn(`switch${i} does not exist in database.`);
             }
         });
     }
 }

 document.addEventListener("DOMContentLoaded", () => {
     console.log("Page Loaded - Syncing Switches");
     syncSwitches();
     document.querySelectorAll('input[type="checkbox"]').forEach((toggle) => {
         console.log(`Attaching event listener to: ${toggle.id}`);
         toggle.addEventListener('change', (event) => {
             console.log(`Switch toggled: ${event.target.id}, New State: ${event.target.checked}`);
             updateToggle(event.target.id, event.target.checked);
         });
     });
 });