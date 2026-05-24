import pdf from "pdf-parse";

export default async function handler(req, res) {

  try {

    const message = req.body.message;

    const fileId = process.env.DRIVE_FILE_ID;

    // 📥 Télécharger PDF depuis Google Drive (public simple)
    const pdfResponse = await fetch(
      `https://docs.google.com/document/d/1x9qsBEjlCF-5VUObYa5ksWPg13dRL2ConexR-uBdQ9c/edit?usp=sharing{fileId}`
    );

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 📖 extraire texte PDF
    const dataPdf = await pdf(buffer);
    const text = dataPdf.text.slice(0, 8000);

    // 🤖 envoyer à l’IA
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [
            {
              role: "system",
              content: "Tu es un assistant qui répond uniquement à partir du document fourni."
            },
            {
              role: "user",
              content: `DOCUMENT:\n${text}\n\nQUESTION:\n${message}`
            }
          ],
          max_tokens: 400,
          temperature: 0.3
        })
      }
    );

    const ai = await response.json();

    let reply =
      ai?.choices?.[0]?.message?.content ||
      ai?.generated_text ||
      "Erreur IA";

    res.status(200).json({ reply });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "Erreur serveur PDF"
    });
  }
}
