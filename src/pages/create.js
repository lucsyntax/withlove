import { useState } from "react";
import { useRouter } from "next/router";
import { db } from "./api/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./api/firebase";
import Background from "@/components/Background";
import CouplePreview from "../components/CouplePreview";
import Link from "next/link";
import CoupleForm from "../components/CoupleForm";
import Image from "next/image";
import Head from "next/head";

export default function Create() {
  const [previewData, setPreviewData] = useState({
    coupleName: "",
    relationshipDate: "",
    customMessage: "",
    imageUrls: [],
  });
  const [plan, setPlan] = useState("basic");
  const router = useRouter();
  const [coupleName, setCoupleName] = useState("");
  const [relationshipDate, setRelationshipDate] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // Para armazenar os previews

  const generateUniqueHash = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleSubmit = async (coupleData) => {
    const { coupleName, relationshipDate, customMessage, photos, plan } =
      coupleData;

    try {
      // Gerar hash único
      const uniqueHash = generateUniqueHash();

      // Fazer o upload das fotos para o Firebase Storage e obter as URLs
      const photoURLs = await Promise.all(
        photos.map(async (photo) => {
          const storageRef = ref(
            storage,
            `couples/${uniqueHash}/${photo.name}`
          );
          await uploadBytes(storageRef, photo); // Faz upload da foto
          return await getDownloadURL(storageRef); // Obtém a URL da foto
        })
      );

      // Salvar os dados no Firestore
      await addDoc(collection(db, "couples"), {
        coupleName,
        relationshipDate,
        customMessage,
        photos: photoURLs, // Armazena as URLs das fotos
        plan,
        uniqueHash,
      });
    } catch (e) {
      console.error("Erro ao salvar os dados: ", e);
      alert("Erro ao salvar os dados, tente novamente.");
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center">
      <div className="rounded-lg p-8 max-w-2xl w-full bg-800">
        <CoupleForm
          coupleName={coupleName}
          setCoupleName={setCoupleName}
          relationshipDate={relationshipDate}
          setRelationshipDate={setRelationshipDate}
          customMessage={customMessage}
          setCustomMessage={setCustomMessage}
          photos={photos}
          setPhotos={setPhotos}
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
          plan={plan}
          setPlan={setPlan}
          onSubmit={handleSubmit}
          setPreviewData={setPreviewData}
        />
      </div>
      <div>
        <h1>Preencha os campos acima e veja como vai ficar 👇</h1>
      </div>

      <div>
        <CouplePreview
          coupleName={previewData.coupleName}
          relationshipDate={previewData.relationshipDate}
          customMessage={previewData.customMessage}
          imageUrls={previewData.imageUrls}
        />
      </div>
    </div>
  );
}
