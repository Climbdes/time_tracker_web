// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

  