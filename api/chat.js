export default async function handler(req, res) {

  try {

    const message = req.body.message;

    const fileId = "1x9qsBEjlCF-5VUObYa5ksWPg13dRL2ConexR-uBdQ9c";

    // 📄 récupérer Google Docs en texte
    const docResponse = await fetch(
      `https://docs.google.com/document/d/${fileId}/export?format=txt`
    );

    const text = await docResponse.text();

    const documentText = text.slice(0, 8000);

    // 🤖 IA
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
              content: "Tu réponds uniquement avec le document fourni."
            },
            {
              role: "user",
              content: `DOCUMENT:\n${documentText}\n\nQUESTION:\n${message}`
            }
          ],
          max_tokens: 400
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
      reply: "Erreur serveur Docs"
    });
  }
}
