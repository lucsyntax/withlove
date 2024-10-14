import { db, storage } from "./firebase"; // Importando corretamente o db e storage
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore"; // Adicionar getDocs para buscar o documento
import { ref, getStorage, listAll, deleteObject } from "firebase/storage";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const config = {
  api: {
    bodyParser: false, // Mercado Pago também envia o body como raw
  },
};

export default async function handler(req, res) {
  console.log("Webhook received");
  if (req.method === "POST") {
    try {
      const event = req.body; // Mercado Pago envia os dados diretamente no corpo da requisição
      const { type, data } = event;

      console.log(`Received event type: ${type}`);

      // Verificar o tipo de evento
      if (type === "payment.created" || type === "payment.updated") {
        const paymentData = data;
        const status = paymentData.status;
        const uniqueHash = paymentData.metadata.uniqueHash; // O uniqueHash que você passou durante a criação da preferência
        const email = paymentData.payer.email;
        const name = paymentData.payer.first_name;
        const coupleName = paymentData.metadata.formattedCoupleName;
        const formattedCoupleName = coupleName
          .split("-")
          .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
          .join(" e "); // Juntar as partes com " e "
        const siteUrl = `with-lov.com/${coupleName}?hash=${uniqueHash}`;

        console.log(
          `Pagamento status: ${status} para uniqueHash: ${uniqueHash}`
        );

        if (status === "approved") {
          const msg = {
            to: email, // Email do cliente
            from: "lucsyntaxdev@gmail.com", // Seu email verificado no SendGrid
            templateId: "d-25acbde99a594482b1e8365f157d74a9",
            dynamic_template_data: {
              name: formattedCoupleName,
              siteUrl: siteUrl,
            },
            subject: `Um presente para ${formattedCoupleName}`,
          };

          try {
            await sgMail.send(msg);
            console.log("Email de confirmação enviado!");
          } catch (error) {
            console.error("Erro ao enviar o email de confirmação:", error);
          }

          const emailsRef = collection(db, "emails");
          const q = query(emailsRef, where("uniqueHash", "==", uniqueHash));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
              await updateDoc(doc.ref, { payment: true });
              console.log("Status de pagamento atualizado para true");
            });
          } else {
            console.error(
              "Nenhum documento encontrado com o uniqueHash fornecido"
            );
          }
        } else if (status === "rejected" || status === "cancelled") {
          // Se o pagamento falhou ou foi cancelado, deletar o documento
          const couplesRef = collection(db, "couples");
          const q = query(couplesRef, where("uniqueHash", "==", uniqueHash));
          const querySnapshot = await getDocs(q);
          const storage = getStorage();

          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log("Documento deletado no Firestore");
          });

          const folderRef = ref(storage, `${uniqueHash}/`);
          const listResult = await listAll(folderRef);

          if (listResult.items.length > 0) {
            const deletePromises = listResult.items.map((itemRef) =>
              deleteObject(itemRef)
            );
            await Promise.all(deletePromises);
            console.log(
              "Todos os arquivos na pasta foram deletados do Storage"
            );
          } else {
            console.log(
              "Nenhum arquivo encontrado na pasta do usuário para deletar"
            );
          }
        }
      }
    } catch (error) {
      console.error("Erro ao processar o webhook do Mercado Pago:", error);
      res.status(500).send("Erro ao processar o evento");
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
