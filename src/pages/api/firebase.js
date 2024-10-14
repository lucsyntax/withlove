import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importação do Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyDOm0evroDR2m1Hgt41l8X13DIzcu4knOE",
  authDomain: "loveu-a59b4.firebaseapp.com",
  projectId: "loveu-a59b4",
  storageBucket: "loveu-a59b4.appspot.com", // Certifique-se de que o Storage está configurado corretamente
  messagingSenderId: "488357447903",
  appId: "1:488357447903:web:9ec9a661ee3288015d816a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app); // Exportando o Storage
