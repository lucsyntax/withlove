import { db } from "@/pages/api/firebase";
import { FaThumbtack } from "react-icons/fa";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  onSnapshot,
  arrayRemove,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";

const TextInput = ({ hash }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const colors = [
    "bg-yellow-200",
    "bg-pink-200",
    "bg-green-200",
    "bg-blue-200",
  ];

  useEffect(() => {
    if (hash) {
      // Query para encontrar o documento com o uniqueHash fornecido
      const coupleCollection = collection(db, "couples");
      const q = query(coupleCollection, where("uniqueHash", "==", hash));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const coupleDoc = snapshot.docs[0]; // Assume que só há um documento com esse hash
          const coupleData = coupleDoc.data();
          setMessages(coupleData.messages || []);
        } else {
          console.error("Documento não encontrado com o uniqueHash fornecido.");
        }
      });

      return () => unsubscribe();
    }
  }, [hash]);

  const handleSend = async () => {
    if (message.trim() === "" || !hash) {
      console.log("Mensagem vazia ou hash inválido.");
      return;
    }

    setLoading(true);

    try {
      // Query para encontrar o documento com o uniqueHash fornecido
      const coupleCollection = collection(db, "couples");
      const q = query(coupleCollection, where("uniqueHash", "==", hash));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const coupleDoc = querySnapshot.docs[0].ref; // Refere-se ao documento correto
        const currentMessages = querySnapshot.docs[0].data().messages || [];
        const updatedMessages = [...currentMessages, message];

        await updateDoc(coupleDoc, { messages: updatedMessages });
        setMessage("");
        textareaRef.current.style.height = "auto";
      } else {
        console.error("Documento não encontrado com o uniqueHash fornecido.");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleRemoveMessage = async (index) => {
    try {
      // Query para encontrar o documento com o uniqueHash fornecido
      const coupleCollection = collection(db, "couples");
      const q = query(coupleCollection, where("uniqueHash", "==", hash));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const coupleDoc = querySnapshot.docs[0].ref; // Refere-se ao documento correto
        const coupleSnapshot = await getDoc(coupleDoc);
        const currentMessages = coupleSnapshot.data().messages || [];
        const updatedMessages = currentMessages.filter(
          (_, msgIndex) => msgIndex !== index
        );

        console.log("Atualizando mensagens:", updatedMessages); // Verifique aqui se as mensagens estão corretas

        // Atualiza o documento do casal com as mensagens restantes
        await updateDoc(coupleDoc, { messages: updatedMessages });
        setMessages(updatedMessages); // Atualiza o estado local
      } else {
        console.error("Documento não encontrado para remoção de mensagem.");
      }
    } catch (error) {
      console.error("Erro ao remover mensagem: ", error);
    }
  };

  return (
    <div className="flex flex-col justify-end h-full p-4">
      <div className="flex-1 mb-4 overflow-visible">
        {messages.map((msg, index) => (
          <div key={index} className="relative text-black">
            <div
              className={`${
                colors[index % colors.length]
              } p-3 rounded-lg my-1 break-words shadow-md ${
                index % 2 === 0 ? "transform rotate-2" : "transform -rotate-2"
              }`}
              style={{
                wordBreak: "break-word",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                border: "1px solid #f6e58d",
                fontFamily: "'Shadows Into Light', cursive",
              }}
            >
              <FaThumbtack
                className={`absolute w-5 h-5 text-red-600 ${
                  index % 2 === 0
                    ? "top-[-12px] left-10"
                    : "top-[-12px] right-10"
                } transition-transform duration-200 hover:scale-150 cursor-pointer`} // Adicionando hover
                onClick={() => handleRemoveMessage(index)} // Função para remover a mensagem
              />

              {msg}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center bg-white rounded-full shadow-lg p-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          placeholder="Deixe um recado para seu amor..."
          rows={1}
          className="flex-1 bg-transparent outline-none p-2 text-gray-700 placeholder-pink-300 resize-none overflow-hidden rounded-full placeholder:text-xs"
          style={{ minHeight: "40px", maxHeight: "120px" }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
          } text-white font-bold py-2 px-4 rounded-full transition-all`}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default TextInput;
