import { buffer } from "micro";
import crypto from "crypto";
import { db, storage } from "./firebase"; // Importando corretamente o db e storage
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, getStorage, listAll, deleteObject } from "firebase/storage";
import axios from "axios";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const config = {
  api: {
    bodyParser: false, // Precisamos do corpo da requisição em formato bruto
  },
};

const getPaymentStatus = async (paymentId) => {
  const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`, // Use o token de acesso do Mercado Pago
      },
      timeout: 5000, // Defina um tempo limite de 5 segundos para evitar longos timeouts
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar status do pagamento:", error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Obter os cabeçalhos x-signature e x-request-id
      const xSignature = req.headers["x-signature"];
      const xRequestId = req.headers["x-request-id"];
      if (!xSignature || !xRequestId) {
        return res
          .status(400)
          .json({ error: "Cabeçalhos necessários ausentes" });
      }

      // Separar o x-signature em partes
      const parts = xSignature.split(",");
      let ts;
      let hash;

      parts.forEach((part) => {
        const [key, value] = part.split("=");
        if (key && value) {
          if (key.trim() === "ts") {
            ts = value.trim();
          } else if (key.trim() === "v1") {
            hash = value.trim();
          }
        }
      });

      // Validar se os parâmetros estão presentes
      if (!ts || !hash) {
        return res.status(400).json({ error: "Assinatura incompleta" });
      }

      // Obter o corpo da requisição como buffer
      const buf = await buffer(req);

      // Processar o evento do webhook
      const event = JSON.parse(buf.toString());
      const paymentId = event.data.id; // Obtenha o `paymentId` do corpo do evento
      if (!paymentId) {
        return res
          .status(400)
          .json({ error: "data.id ausente no corpo do evento" });
      }

      // Verificar a assinatura HMAC (mantendo sua lógica de segurança)
      const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
      const secret = process.env.MP_ASSINATURA;
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(manifest);
      const sha = hmac.digest("hex");

      if (sha !== hash) {
        return res.status(400).json({ error: "Falha na verificação do HMAC" });
      }

      // Buscar o status do pagamento
      const paymentDetails = await getPaymentStatus(paymentId);
      if (!paymentDetails) {
        return res
          .status(500)
          .json({ error: "Falha ao obter status do pagamento" });
      }

      const paymentStatus = paymentDetails.status;
      const parsedReference = JSON.parse(paymentDetails.external_reference);
      const { uniqueHash, formattedCoupleName, userEmail, payment } =
        parsedReference;

      function formatCoupleName(formattedCoupleName) {
        return formattedCoupleName
          .split("-")
          .map((word) =>
            word === "e" ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join(" ");
      }

      const formattedName = formatCoupleName(formattedCoupleName);

      console.log("referencia:", paymentDetails.external_reference);
      console.log(
        `email: ${userEmail} hash: ${uniqueHash} name: ${formattedName}`
      );

      const updatePaymentStatus = async (querySnapshot) => {
        const updatePromises = querySnapshot.docs.map((doc) =>
          updateDoc(doc.ref, { payment: true })
        );
        await Promise.all(updatePromises);
      };

      if (paymentStatus === "cancelled" || paymentStatus === "expired") {
        // Se o pagamento cancelar ou expirar, deletamos o documento
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
          console.log("Todos os arquivos na pasta foram deletados do Storage");
        } else {
          console.log(
            "Nenhum arquivo encontrado na pasta do usuário para deletar"
          );
        }
      }

      if (paymentStatus === "approved") {
        const siteUrl = `https://www.with-lov.com/${formattedCoupleName}?hash=${uniqueHash}`;

        const msg = {
          to: userEmail, // Email do cliente
          from: "lucsyntaxdev@gmail.com", // Seu email verificado no SendGrid
          templateId: "d-25acbde99a594482b1e8365f157d74a9",
          dynamic_template_data: {
            name: formattedName,
            siteUrl: siteUrl,
            subject: "A surpresa para seu amor chegou!",
          },
          subject: `Um presente para ${formattedName}`,
        };

        try {
          await sgMail.send(msg);
          console.log("Email de confirmação enviado!");
        } catch (error) {
          console.error("Erro ao enviar o email de confirmação:", error);
        }

        const couplesRef = collection(db, "couples");
        const qc = query(couplesRef, where("uniqueHash", "==", uniqueHash));
        const queryCSnapshot = await getDocs(qc);
        const emailsRef = collection(db, "emails");
        const qe = query(emailsRef, where("uniqueHash", "==", uniqueHash));
        const queryESnapshot = await getDocs(qe);

        if (!queryCSnapshot.empty) {
          await updatePaymentStatus(queryCSnapshot);
          console.log("Status de pagamento atualizado para true em couples");
        } else {
          console.error(
            "Nenhum documento de couples encontrado com o uniqueHash fornecido"
          );
        }

        if (!queryESnapshot.empty) {
          await updatePaymentStatus(queryESnapshot);
          console.log("Status de pagamento atualizado para true em emails");
        } else {
          console.error(
            "Nenhum documento de emails encontrado com o uniqueHash fornecido"
          );
        }
      }

      res.status(200).json({ message: "Evento processado com sucesso" });
    } catch (error) {
      console.error("Erro ao processar o webhook:", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
