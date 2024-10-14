// pages/api/deleteOldDocuments.js
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export default async function handler(req, res) {
  try {
    const now = new Date();
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000); // 5 minutos atrás

    const q = query(
      collection(db, "couples"),
      where("payment", "==", false),
      where("createdAt", "<=", fiveHoursAgo)
    );

    const querySnapshot = await getDocs(q);
    const deletedDocs = [];

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref); // Exclui o documento
      deletedDocs.push(doc.id); // Guarda os ids dos documentos excluídos
    });

    res.status(200).json({ success: true, deletedDocs });
  } catch (error) {
    console.error("Erro ao deletar documentos: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
