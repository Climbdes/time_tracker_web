// firebase-config.js

// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-ShXHPE_U3eE8VYOJxPMKtENvbePiSKo",
  authDomain: "time-tracker-2eef6.firebaseapp.com",
  projectId: "time-tracker-2eef6",
  storageBucket: "time-tracker-2eef6.appspot.com",
  messagingSenderId: "880767781936",
  appId: "1:880767781936:web:4ec3136fd200b5818f31f5"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


  